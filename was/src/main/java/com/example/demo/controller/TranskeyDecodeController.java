package com.example.demo.controller;

import com.raonsecure.transkey.TKException;
import com.raonsecure.transkey.TransKey;
import com.raonsecure.transkey.XSSValueException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class TranskeyDecodeController {
    @PostMapping("/api/transkey/decode")
    public Map<String, Object> decode(@RequestBody HashMap<String, Object> dataMap) {
        Map<String, Object> resultMap = new HashMap<>();

        String id = (String) dataMap.get("id");
        String encInitTime = (String) dataMap.get("initTime");
        String keyboardType = (String) dataMap.get("keyboardType");
        String keyIndex = (String) dataMap.get("keyIndex");
        String fieldType = (String) dataMap.get("fieldType");
        String seedKey = (String) dataMap.get("seedKey");
        String encoded = (String) dataMap.get("encoded");
        String hmEncoded = (String) dataMap.get("hmEncoded");

        try {
            String plainData = TransKey.withoutSessionDecode(id, encInitTime, keyboardType, keyIndex, fieldType, seedKey, encoded, hmEncoded, "");
            resultMap.put("status", 0);
            resultMap.put("data", plainData);
            return resultMap;
        } catch (TKException e) {
            System.out.println(e.getCode());
            resultMap.put("status", e.getCode());
        } catch (XSSValueException e) {
            throw new RuntimeException(e);
        }

        resultMap.put("data", "복호화 실패");
        return resultMap;
    }
}
