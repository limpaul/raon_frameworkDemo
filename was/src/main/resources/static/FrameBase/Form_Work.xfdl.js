(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("Form_Work");
            this.set_titletext("Form_Work");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Div("nxkeyDiv","49","50","741","380",null,null,null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("");
            this.addChild(obj.name, obj);

            obj = new Edit("userid","64","50","245","44",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("0");
            obj.set_displaynulltext("사용자 아이디");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new Edit("userpw","66","108","245","44",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("1");
            obj.set_displaynulltext("사용자 비밀번호");
            obj.set_password("true");
            obj.getSetter("e2e").set(" { \"enc\" : \"on\", \"kbdType\" : \"qwerty\"}");
            obj.getSetter("useRaon").set("Y");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new Edit("usernum","64","168","245","44",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("2");
            obj.set_displaynulltext("사용자 주민번호");
            obj.set_password("true");
            obj.getSetter("e2e").set(" { \"enc\" : \"on\", \"maxLength\" : 8, \"kbdType\" : \"number\"}");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new CheckBox("userpwchkBtn","331","111","43","41",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("3");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new CheckBox("userNumchkBtn","331","168","43","41",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("4");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new Button("userPwDecodeBtn","362","111","104","41",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("5");
            obj.set_text("복호화");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new Button("userNumDecodeBtn","361","168","104","41",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("6");
            obj.set_text("복호화");
            this.nxkeyDiv.addChild(obj.name, obj);

            obj = new TextArea("extraDiv","69","226","632","136",null,null,null,null,null,null,this.nxkeyDiv.form);
            obj.set_taborder("7");
            obj.set_enable("false");
            this.nxkeyDiv.addChild(obj.name, obj);
            // Layout Functions
            //-- Default Layout : this.nxkeyDiv.form
            obj = new Layout("default","",0,0,this.nxkeyDiv.form,function(p){});
            this.nxkeyDiv.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","Desktop_screen",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("Form_Work.xfdl", function() {

        this.Form_Work_onload = function(obj,e)
        {
        	if(!isMobile()){ // pc환경에서만 사용한다
        		// 키보드보안 서버 랜덤키를 가져온다
        		keyboardSecurityAjaxTest('/api/nxkey/tnksr', '', function(res){
        			tekOption.srdk = res;
        			TNK_SR = res;
        			tekOption.srdk = TNK_SR;
        			TK_Loading();
        			initTranskey();
        		})
        	}else{
        		mtk_useTranskey = true; // 가상키패드 강제 사용 설정
        		initmTranskey();
        	}

        };
        // 샘플용 키 입력시 보여지기 위한 용도 ( 필요 없음 )
        TK_KeyDown_callback = function(result) {
        	const extraDivObj = document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.extraDiv:textarea');
        	const hidKeyData = document.getElementById('hid_key_data').value;
        	const e2eValue = document.getElementById('E2E_'+TouchEnKeyNXE_CurObj.id).value;
        	const data = {
        		'hidKeyData': hidKeyData,
        		'e2eValue': e2eValue
        	}
        	extraDivObj.value = JSON.stringify(data);
        }
        // 샘플용 키 입력시 보여지기 위한 용도 ( 필요 없음 )
        if(typeof tk != 'undefined'){
        	Transkey.prototype.startCallBack = () => {
        		const extraDivObj = document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.extraDiv:textarea');

        		const initTime = document.getElementById('initTime').value;
        		const keyboardType = tk.now.keyboardType;
        		const keyIndex = tk.now.keyIndex;
        		const fieldType = tk.now.fieldType;
        		const seedKey = document.getElementById('seedKey').value;
        		const encoded = tk.now.hidden.value;
        		const hmEncoded = tk.now.hmac.value;

        		const data = {
        			'initTime':initTime,
        			'keyboardType':keyboardType,
        			'keyIndex': keyIndex,
        			'fieldType': fieldType,
        			'seedKey': seedKey,
        			'encoded': encoded,
        			'hmEncoded': hmEncoded
        		}
        		extraDivObj.value = JSON.stringify(data);
        	}
        }else{
        		mTranskey.prototype.startCallBack = () => {
        		const extraDivObj = document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.extraDiv:textarea');

        		const initTime = document.getElementById('initTime').value;
        		const keyboardType = mtk.now.keyboardType;
        		const keyIndex = mtk.now.keyIndex;
        		const fieldType = mtk.now.fieldType;
        		const seedKey = document.getElementById('seedKey').value;
        		const encoded = mtk.now.hidden.value;
        		const hmEncoded = mtk.now.hmac.value;

        		const data = {
        			'initTime':initTime,
        			'keyboardType':keyboardType,
        			'keyIndex': keyIndex,
        			'fieldType': fieldType,
        			'seedKey': seedKey,
        			'encoded': encoded,
        			'hmEncoded': hmEncoded
        		}
        		extraDivObj.value = JSON.stringify(data);
        	}
        }



        // 키보드보안 데이터 전송시 사용
        function keyboardSecurityAjaxTest(url, data, callback){
        		const req = new XMLHttpRequest();
        		req.open("POST", url);
        		req.setRequestHeader("Content-Type","application/json");

        		req.onreadystatechange = function() {
        			if (req.readyState === 4) {   // DONE
        				// 성공
        				if (req.status === 200) {
        					console.log("응답:", req.responseText);
        					callback(req.responseText); // 서버 랜던 키 값을 넣어준다
        				} else {
        					console.error("에러:", req.status, req.responseText);
        				}
        			}
        		};

        		req.send(JSON.stringify(data));
        }
        // 사용자 비밀번호 구간암호화 복호화 nkey, transkey
        this.userPwDecodeBtn = function(obj,e)
        {


        	const hidKeyData = document.getElementById('hid_key_data').value;
        	const e2eValue = document.getElementById('E2E_mainframe.WorkFrame.form.nxkeyDiv.form.userpw:input').value;

        	var data = {};
        	const isChecked = this.nxkeyDiv.form.userpwchkBtn.isChecked();
        	if(!isChecked){
        		data = {
        			'tnksr':TNK_SR,
        			'hidKeyData': hidKeyData,
        			'e2eData': e2eValue
        		}
        	}else{
        			!isMobile()?tk.fillEncData():mtk.fillEncData(); // hmac 값 생성
        			const id = 'mainframe.WorkFrame.form.nxkeyDiv.form.userpw:input';
        			const initTime = document.getElementById('initTime').value;
        			const keyboardType = transkey[id].keyboardType;
        			const keyIndex = transkey[id].keyIndex;
        			const fieldType = transkey[id].fieldType;
        			const seedKey = document.getElementById('seedKey').value;
        			const encoded = transkey[id].hidden.value;
        			const hmEncoded = transkey[id].hmac.value;

        			data = {
        				'id':id,
        				'initTime':initTime,
        				'keyboardType':keyboardType,
        				'keyIndex':keyIndex,
        				'fieldType':fieldType,
        				'seedKey':seedKey,
        				'encoded':encoded,
        				'hmEncoded':hmEncoded
        			}


        	}

        	keyboardSecurityAjaxTest(!isChecked?'/api/nxkey/decode':'/api/transkey/decode',data,(res)=>{
        		const extraDivObj = document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.extraDiv:textarea');
        		trace(res);
        		extraDivObj.value = JSON.stringify(res);
        	})
        };

        // 사용자 주민번호 구간암호화 복호화 nkey, transkey
        this.nxkeyDiv_userNumDecodeBtn_onclick = function(obj,e)
        {
        	const hidKeyData = document.getElementById('hid_key_data').value;
        	const e2eValue = document.getElementById('E2E_mainframe.WorkFrame.form.nxkeyDiv.form.usernum:input').value;

        	var data = {};
        	const isChecked = this.nxkeyDiv.form.userNumchkBtn.isChecked();

        	if(!isChecked){
        		data = {
        			'tnksr':TNK_SR,
        			'hidKeyData': hidKeyData,
        			'e2eData': e2eValue
        		}
        	}else{
        		tk.fillEncData(); // hmac 값 생성
        		const id = 'mainframe.WorkFrame.form.nxkeyDiv.form.usernum:input';
        		const initTime = document.getElementById('initTime').value;
        		const keyboardType = transkey[id].keyboardType;
        		const keyIndex = transkey[id].keyIndex;
        		const fieldType = transkey[id].fieldType;
        		const seedKey = document.getElementById('seedKey').value;
        		const encoded = transkey[id].hidden.value;
        		const hmEncoded = transkey[id].hmac.value;

        		data = {
        			'id':id,
        			'initTime':initTime,
        			'keyboardType':keyboardType,
        			'keyIndex':keyIndex,
        			'fieldType':fieldType,
        			'seedKey':seedKey,
        			'encoded':encoded,
        			'hmEncoded':hmEncoded
        		}
        	}

        	keyboardSecurityAjaxTest(!isChecked?'/api/nxkey/decode':'/api/transkey/decode',data,(res)=>{
        		const extraDivObj = document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.extraDiv:textarea');
        		trace(res);
        		extraDivObj.value = JSON.stringify(res);
        	})
        };

        // 넘버키패드 가상키패드 체크 유무 확인
        this.nxkeyDiv_userpwchkBtn_onchanged = function(obj,e)
        {
        	if(obj.isChecked()){
        		tk.onKeyboard(document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.userpw:input'));
        	}else{
        		if(tk.now != null){
        			tk.close();
        			document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.userpw:input').readOnly = false;
        		}
        	}
        };


        // 숫자키패드 가상키패드 체크 유무 확인
        this.nxkeyDiv_userNumchkBtn_onchanged = function(obj,e)
        {
        	if(obj.isChecked()){
        		tk.onKeyboard(document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.usernum:input'));
        	}else{
        		if(tk.now != null){
        			tk.close();
        			document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.usernum:input').readOnly = false;
        		}
        	}
        };

        // checkbox가 눌렸을시 가상키패드를 활성화 시킬지
        this.nxkeyDiv_userpw_oneditclick = function(obj,e)
        {
        	const isChecked = this.nxkeyDiv.form.userpwchkBtn.isChecked();
        	if(isChecked){
        		tk.onKeyboard(document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.userpw:input'));
        	}else{
        		document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.userpw:input').readOnly = false;
        	}
        };

        // checkbox가 눌렸을시 가상키패드를 활성화 시킬지
        this.nxkeyDiv_usernum_oneditclick = function(obj,e)
        {
        	const isChecked = this.nxkeyDiv.form.userNumchkBtn.isChecked();
        	if(isChecked){
        		tk.onKeyboard(document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.usernum:input'));
        	}else{
        		document.getElementById('mainframe.WorkFrame.form.nxkeyDiv.form.usernum:input').readOnly = false;
        	}
        };

        function isMobile(){
        	   const ua = navigator.userAgent;

        	  // 1. 기본 UserAgent 판별 (안드로이드, 아이폰 등)
        	  const isUADataMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

        	  // 2. 터치 지원 여부 (MDN 권장 방식) - PC는 보통 0, 모바일은 1 이상
        	  const hasTouchPoints = navigator.maxTouchPoints > 0;

        	  // 3. 최신 브라우저 지원 (Client Hints API)
        	  const isUAClientMobile = navigator.userAgentData ? navigator.userAgentData.mobile : false;

        	  // 4. iPadOS 데스크탑 모드 대응 (UA에는 Macintosh로 나오지만 터치가 지원됨)
        	  const isIPadDesktopMode = (ua.includes("Macintosh") && hasTouchPoints);

        	  return isUADataMobile || isUAClientMobile || isIPadDesktopMode;
        }

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.Form_Work_onload,this);
            this.nxkeyDiv.form.userpw.addEventHandler("oneditclick",this.nxkeyDiv_userpw_oneditclick,this);
            this.nxkeyDiv.form.usernum.addEventHandler("oneditclick",this.nxkeyDiv_usernum_oneditclick,this);
            this.nxkeyDiv.form.userpwchkBtn.addEventHandler("onchanged",this.nxkeyDiv_userpwchkBtn_onchanged,this);
            this.nxkeyDiv.form.userNumchkBtn.addEventHandler("onchanged",this.nxkeyDiv_userNumchkBtn_onchanged,this);
            this.nxkeyDiv.form.userPwDecodeBtn.addEventHandler("onclick",this.userPwDecodeBtn,this);
            this.nxkeyDiv.form.userNumDecodeBtn.addEventHandler("onclick",this.nxkeyDiv_userNumDecodeBtn_onclick,this);
        };
        this.loadIncludeScript("Form_Work.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
