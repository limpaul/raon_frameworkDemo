package com.example.myapplication

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.raonsecure.mtranskey.MTKeyboard
import com.raonsecure.mtranskey.MTranskey
import com.raonsecure.mtranskey.listener.OnInputListener
import com.raonsecure.mtranskey.listener.OnVisibilityListener
import com.raonsecure.mtranskey.view.EffectView
import okhttp3.Call
import okhttp3.Callback
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import okhttp3.MediaType
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONObject
import java.io.IOException

class CtrlViewAcitivty : AppCompatActivity() {
    private lateinit var editText1: EditText
    private lateinit var editText2: EditText
    private lateinit var  mtkContainer: LinearLayout
    private lateinit var encryptResultText: TextView
    private lateinit var decodeResultText: TextView

    private lateinit var keypadQwertyDecodeBtn: Button // qwerty 키패드 복호화 버튼

    // netowrk settting
    val urlScheme = "http"
    val urlHost = "10.47.17.169"
    val urlPort = 8080
    val cookieURL = HttpUrl.Builder().scheme(urlScheme).host(urlHost).port(urlPort).build()
    val urlOrigin = "$urlScheme://$urlHost:$urlPort"
    val urlContextPath = "/api/mtranskey/decode"

    var okhttp = OkHttpClient.Builder().apply {
        cookieJar(object : CookieJar {
            /**
             * TODO http 클라이언트별 세션 유지를 위한 처리
             * sid 값이 세션에서 비롯되어 생성되므로, 세션이 유지되어야 함.
             *
             * 혹은 sid 미검증 암복호화 적용 필요             *
             * 단순히 다른 메소드를 사용하는 것이기에 샘플에서는 생략
             */

            val cookieMap: HashMap<String, List<Cookie>> = HashMap()

            override fun loadForRequest(url: HttpUrl): List<Cookie> {
//                if(url.encodedPath.contains("encryption_verify.jsp")){
//                    return listOf()
//                }

                return cookieMap.getOrDefault(url.host, ArrayList<Cookie>())
            }

            override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
                cookieMap.set(url.host, cookies)

                for(cookie in cookies){
                    Log.d("bwlim",cookie.name)
                    Log.d("bwlim",cookie.value)
                }
            }

        })
    }.build()

    private var mtks: Array<MTKeyboard> = Array(2){ MTKeyboard(this) }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ctrl_view_acitivty)

        mtkContainer = findViewById<LinearLayout>(R.id.mtk_container)
        editText1 = findViewById<EditText>(R.id.edit_text1)
        editText2 = findViewById<EditText>(R.id.edit_text2)
        encryptResultText = findViewById<TextView>(R.id.encryptResultText)
        decodeResultText = findViewById<TextView>(R.id.decodeResultText)
        keypadQwertyDecodeBtn = findViewById<Button>(R.id.keypadQwertyDecodeBtn)

        mtks.forEachIndexed { index, it ->
            it.apply {
                onInputListener = object : OnInputListener {
                    override fun onCancel(mtranskey: MTranskey) {

                    }

                    override fun onDone(mtranskey: MTranskey) {
                        mtranskey.hide()
                        encryptResultText.text = mtranskey.getRSACipher("server2048.der")
                    }

                    override fun onLengthChanged(
                        mtranskey: MTranskey,
                        old: Int,
                        new: Int
                    ) {

                    }

                    override fun onMaxLengthOver(mtranskey: MTranskey) {

                    }

                    override fun onMinLengthUnder(mtranskey: MTranskey) {
                        Toast.makeText(this@CtrlViewAcitivty, "${mtranskey.minLength}자리 이상 입력하세요", Toast.LENGTH_SHORT).show();
                    }

                }

                onVisibilityListener = object : OnVisibilityListener {
                    override fun onHide(mtranskey: MTranskey) {

                    }

                    override fun onShow(mtranskey: MTranskey) {

                    }

                }
                maxLength = 10
                minLength = 1
                hapticSound = "mt_click.wav"
                hapticVibrationMillis = 50
                isShowAnimation = true
                isHideAnimation = true
                // 두 개의 입력을 연속으로 진행할 경우 isHideAtDone 을 false 로 두고 onDone() 에서 이후 동작 처리 권장
                isHideAtDone = false
                isUseAccessibility = true
                autoFocusAccessibility = true
                isDraggable = true
                inputJSON = "mt-input.json"
                styleJSON = "mt-style.json"
                localizeJSON = "mt-localize.json"
                mtkContainer = findViewById<LinearLayout>(R.id.mtk_container)
                inputContainer = findViewById<ConstraintLayout>(R.id.input_container)
                effectContainer = findViewById<EffectView>(R.id.effect_container)
                if (index == 0) {
                    mtEditText = editText1
                } else if (index == 1) {
                    mtEditText = editText2
                }
                init()
            }

        }
        editText1.setOnClickListener {
            mtks[0].show("qwerty_lower")
            mtks[0].rearrange()
        }
        editText2.setOnClickListener {
            mtks[1].show("number")
            mtks[1].rearrange()
        }

        keypadQwertyDecodeBtn.setOnClickListener {
            var encData: String =""
            if(mtks[0].isShowing()){
                encData = mtks[0].getRSACipher("server2048.der")
                encryptResultText.text = encData
                mtks[0].hide()
            }
            /*
            if(mtks[1].isShowing()){
                encData = mtks[1].getRSACipher("server2048.der")
                encryptResultText.text = encData
                mtks[1].hide()
            }

             */
            verifyRequest(encryptResultText.text.toString());
        }
    }
    private fun verifyRequest(encData: String){
        val json = JSONObject().apply {
            put("encData",encData)
        }.toString()

        val mediaType: MediaType = "application/json; charset=utf-8".toMediaType()
        val requestBody: RequestBody = json.toRequestBody(contentType = mediaType)

        val request = Request.Builder()
            .url(urlOrigin+urlContextPath)
            .post(requestBody)
            .build()

        okhttp.newCall(request).enqueue(object: Callback{
            override fun onFailure(call: Call, e: IOException) {
                Log.d("bwlim", e.toString())
            }

            override fun onResponse(call: Call, response: Response) {
                Log.d("bwlim", "code: $response.code / message: $response.message")
                val code = response.code
                val message = response.message
                val bodyString = response.body?.string() ?: "Empty Body"

                Log.d("bwlim", "code: $code / message: $message")
                runOnUiThread {
                    decodeResultText.text = "bwlim, code: $response.code / message: $bodyString}"
                }
            }
        })
    }
}