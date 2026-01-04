package com.example.demo.controller;

import TouchenKey_Crypto.TouchEnKey_Crypto;
import com.raonsecure.touchenkey.E2ECrypto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
public class NxKeyDecodeController {

    @Autowired
    private HttpSession session;

    @PostMapping("/api/nxkey/tnksr")
    public String sessionKey(){
        return TouchEnKey_Crypto.CreateSessionRandom(session);
    }

    @PostMapping("/api/nxkey/decode")
    public Map<String, Object> decode(@RequestBody Map<String, Object> dataMap){
        Map<String, Object> resultMap = new HashMap<>();

        String tnksr = (String)dataMap.get("tnksr");
        String hidKeyData = (String)dataMap.get("hidKeyData");
        String e2eData = (String)dataMap.get("e2eData");
        String privateKey = "C:/raon_cert/Private2048.key.der";

        if(tnksr == null){ // non session을 사용하지 않고 session을 사용할 경우
            tnksr = (String)session.getAttribute("TEKSRK");
        }
        E2ECrypto e2ECrypto = new E2ECrypto(tnksr);
        e2ECrypto.E2E_KeyExchange(hidKeyData, privateKey);
        String plainData = e2ECrypto.decryptE2EField(e2eData);

        if(e2ECrypto.getLastError() != 0){ // 키보드보안 복호화 정상적으로 되지 않았을 시
            resultMap.put("status", e2ECrypto.getLastError());
            resultMap.put("data", e2ECrypto.getLastErrorMessage());
            return resultMap;
        }
        resultMap.put("status", 0);
        resultMap.put("data", plainData);

        return resultMap;
    }
}
