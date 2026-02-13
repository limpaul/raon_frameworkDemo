package com.example.demo.controller;

import com.raonsecure.mtranskey.MTranskey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class MobileAppServerDecodeController {
    @Value("${rsa.key.private}")
    private String privateKey;

    @PostMapping("/api/mtranskey/decode")
    public Map<String, Object> decode(@RequestBody Map<String, Object> param){
        Map<String, Object> resultMap = new HashMap<>();
        MTranskey mTransKey = new MTranskey();
        mTransKey.setPrivateKey(privateKey);
        mTransKey.setSessionTime(1000000);


        String encData = (String)param.get("encData");
        System.out.println("encData: "+encData);
        String plain = mTransKey.decryptRSAData(encData);
        resultMap.put("status", 0);
        resultMap.put("msg", plain);
        return resultMap;
    }
}
