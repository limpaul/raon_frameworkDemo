package com.example.demo.controller;

import com.raonsecure.ksbiz.KSBizException;
import com.raonsecure.ksbiz.KSBiz_v2;
import com.raonsecure.ksbiz.crypto.KSBizCertInfo;
import com.raonsecure.ksbiz.log.KSBizLogger;
import com.raonsecure.ksbiz.util.KSBizStringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
public class BizController {

    /*
    * 전자서명 재 사용방지를 위하여 nonce값을 반환한다
    * */
    @RequestMapping("/api/ksbiz/nonce.jsp")
    public String nonce(HttpServletRequest request){
        KSBiz_v2 ksobj = new KSBiz_v2();
        String nonce = "";
        try
        {
            ksobj.libInit();
            KSBizLogger.log("lib init success");

            nonce = ksobj.genNonce();
            if(ksobj.getErrorCode() < 0)
                throw new KSBizException(ksobj.getErrorMsg(), ksobj.getErrorCode());
            request.getSession().setAttribute("KSBIZ_NONCE", nonce);
        }
        catch(KSBizException e)
        {
            KSBizLogger.log("KSBException occured : " + e.getMessage());
        }
        return nonce;
    }


    /*
    * 전자서명 유효성 검증
    * 클라이언트가 전달한 idn파라미터 값의 유무에 따라 인증서 본인 확인을 할지 않할지 결정하며 이에 따른 api기능을 반환한다
    * */
    @PostMapping("/api/ksbiz/signAction.jsp")
    public Map<String, Object> loginAction(@RequestBody Map<String, Object> param, HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        KSBiz_v2 ksobj = new KSBiz_v2();
        String orgData = "";
        String signData = (String)param.get("ksbizSig");
        String version = "";
        String serialNum = "";
        String signaturealg = "";
        String datebefore = "";
        String dateafter = "";
        String issureDN = "";
        String subjectDN = "";
        String oid = "";
        String vidmsg = "";
        String crldp = "";
        String subjectidentifier = "";
        String subjectkey = "";
        String signedCertPem = "";
        String errorMsg = "";
        String errorMsg2 = "";
        int errorCode=-1;

        try
        {
            ksobj.libInit();
            System.out.println("lib init success");
            System.out.println("signData: " + signData);

            // 1. 전자서명 검증
            ksobj.verify(signData);
            errorCode = ksobj.getErrorCode();

            if(errorCode != 0)
            {
                errorMsg = ksobj.getErrorMsg();
            }
            else
            {
                orgData = ksobj.getVerifiedPlainText();
                version = ksobj.getCertInfo(KSBizCertInfo.VERSION);
                serialNum = ksobj.getCertInfo(KSBizCertInfo.SERIALNUM);
                signaturealg = ksobj.getCertInfo(KSBizCertInfo.SIGNATUREALG);
                datebefore = ksobj.getCertInfo(KSBizCertInfo.DATEBEFORE);
                dateafter = ksobj.getCertInfo(KSBizCertInfo.DATEAFTER);
                issureDN = ksobj.getCertInfo(KSBizCertInfo.ISSUERDN);
                subjectDN = ksobj.getCertInfo(KSBizCertInfo.SUBJECTDN);
                oid = ksobj.getCertInfo(KSBizCertInfo.OID);
                vidmsg = ksobj.getCertInfo(KSBizCertInfo.VIDMSG);
                crldp = ksobj.getCertInfo(KSBizCertInfo.CRLDP);
                subjectidentifier = ksobj.getCertInfo(KSBizCertInfo.SUBJECTIDENTIFIER);
                subjectkey = ksobj.getCertInfo(KSBizCertInfo.SUBJECTKEY);
                signedCertPem = ksobj.getSignedPemCert();

                resultMap.put("orgData", orgData);
                resultMap.put("version",version);
                resultMap.put("serialNum",serialNum);
                resultMap.put("signaturealg",signaturealg);
                resultMap.put("datebefore",datebefore);
                resultMap.put("dateafter",dateafter);
                resultMap.put("issureDN",issureDN);
                resultMap.put("subjectDN",subjectDN);
                resultMap.put("oid",oid);
                resultMap.put("vidmsg",vidmsg);
                resultMap.put("crldp",crldp);
                resultMap.put("subjectidentifier",subjectidentifier);
                resultMap.put("subjectkey",subjectkey);
                resultMap.put("signedCertPem",signedCertPem);


                String temp = KSBizStringUtil.getSplitData(orgData, "ksbizNonce");
                // 2. ReplayAttack확인을 위해 서명원문에 있는 ksbizNonce값과 nonce 생성시 세션에 등록된 KSBIZ_NONCE값을 비교한다.
                if(request.getSession().getAttribute("KSBIZ_NONCE") == null || !request.getSession().getAttribute("KSBIZ_NONCE").equals(temp))
                {
                    errorMsg2 = "nonce검증오류!!! 서명문이 재사용되었습니다.";
                    resultMap.put("status",ksobj.getErrorCode());
                    resultMap.put("msg",errorMsg2);
                }

                String idn = (String)param.get("idn");
                String vidRandom = (String)param.get("ksbizVidRandom");
                if(!idn.isEmpty()){
                    ksobj.verifyIdv(vidmsg, vidRandom, idn);
                    if(ksobj.getErrorCode()!=0){
                        System.out.println("vidmsg: "+vidmsg);
                        System.out.println("vidRandom: "+vidRandom);
                        resultMap.put("status",ksobj.getErrorCode());
                        resultMap.put("msg",ksobj.getErrorMsg());
                        return resultMap;
                    }
                    resultMap.put("vidCheck", ksobj.getErrorCode());
                }else {
                    resultMap.put("vidCheck", ksobj.getErrorCode());
                    return resultMap;
                }
            }
        }
        catch ( Exception e )
        {
            resultMap.put("status", -9999);
            resultMap.put("msg", e.toString());
        }
        return resultMap;
    }

    @RequestMapping("/api/ksbiz/line.jsp")
    public Map<String, Object> line(HttpServletRequest request){
        HashMap<String, Object> resultMap = new HashMap<>();
        KSBiz_v2 ksobj = new KSBiz_v2();
        String certPem = "";
        String sid = "";
        try
        {
            ksobj.libInit();
            KSBizLogger.log("lib init success");
            sid = ksobj.genSid(request.getSession().getId());
            certPem = ksobj.getPemServerCert();
            resultMap.put("sid", sid);
            resultMap.put("serverCert", certPem);
            if(ksobj.getErrorCode() != 0)
                throw new KSBizException(ksobj.getErrorMsg(), ksobj.getErrorCode());
            request.getSession().setAttribute("KSBIZ_SID", sid);
            System.out.println("======================================================");
            System.out.println("line.jsp SID:: "+sid);
            System.out.println("line.jsp SID:: "+request.getSession().getAttribute("KSBIZ_SID"));
            System.out.println("======================================================");
        }
        catch(KSBizException e)
        {
            //프로젝트 환경에 맞게 에러처리 필요.
            KSBizLogger.setLog(true);
            KSBizLogger.log("KSBException occured : " + e.getMessage());
            KSBizLogger.setLog(false);
        }
        return resultMap;
    }

    @PostMapping("/api/ksbiz/lineEncryptAction.jsp")
    public Map<String, Object> lineEncryptAction(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        String sid = (String)request.getSession().getAttribute("KSBIZ_SID");
        KSBiz_v2 ksobj = new KSBiz_v2();

        String decryptData="";
        String serverEncData="";
        String serverEncData1="";
        String encryptedData="";
        int errorCode = -1;
        String errMsg = "";

        try
        {
            ksobj.libInit();
            System.out.println("lib init success");

            encryptedData = (String)paramMap.get("msg");
            System.out.println("클라이언트가 보낸 구간암호화 값: "+encryptedData);
            System.out.println("클라이언트의 SID: "+sid);
            System.out.println("클라이언트의 JSESSIONID: "+request.getHeader("Cookie"));
            decryptData = ksobj.decodeEnv(encryptedData, sid);
            System.out.println("decryptData: "+decryptData);
            errorCode = ksobj.getErrorCode();
            resultMap.put("status", errorCode);
            if(errorCode != 0){
                resultMap.put("msg", ksobj.getErrorMsg());
            }
            resultMap.put("decryptData", decryptData);
            KSBizLogger.logWithTime("[encryptedData]: " + encryptedData);
            KSBizLogger.logWithTime("[decryptData]: " + decryptData);
            KSBizLogger.logWithTime("[errorCode]: " + errorCode);

            System.out.println("이 데이터는 서버에서 암호화한 데이터입니다. : " + decryptData);
            if(errorCode != 0)
            {
                throw new KSBizException("DecodeEnv Failed", errorCode);
            }
            // 이 데이터는 서버에서 암호화한 데이터입니다.
            serverEncData = ksobj.encodeRes("decryptData: "+decryptData);
            resultMap.put("serverEncData", serverEncData);
            System.out.println("serverEncData: "+serverEncData);

            errorCode = ksobj.getErrorCode();

            if(errorCode != 0)
            {
                throw new KSBizException("EncodeResScript Failed", errorCode);
            }
            resultMap.put("status", ksobj.getErrorCode());
            resultMap.put("serverEncData", serverEncData);
            return resultMap;
        }
        catch(KSBizException e)
        {
            serverEncData = Integer.toString(errorCode);
            errMsg = e.getMessage();
            System.out.println("KSBException occured : " + e.getMessage() + "("+ e.getErrorCode() + ")");
            if(e.getErrorCode() == -114){
                System.out.println("server sid: "+sid);
            }
            ksobj.close();
        }

        return paramMap;
    }
}
