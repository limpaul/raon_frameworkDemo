package com.example.demo.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPublicKey;
import java.util.Arrays;

@Configuration
public class SampleBootConfig {
    @Autowired
    private ResourceLoader resourceLoader;
    @Value("${rsa.key.base}")
    private String nxkeyKeyFolderPath;
    @Value("${rsa.key.private}")
    private String privateKeyPath; // 개인키 절대 경로
    @Value("${rsa.key.public}")
    private String publicKeyPath; // 공개키 절대 경로
    private static final int SEQUENCE = 0x30; // RSA Key SEQUECNE 고정 값
    private static final int INTEGER = 0x20; // RSA Key Modulus 고정 값

    @Bean
    public void sampleBootCheck(){
        // 시스템 파일 체크
        systemFileCheck();

        // 개인키의 modulus 값을 추출한다
        byte[] privateKeyModulus = getPrivateKeymodulus();

        // 공개키의 modulus 값을 추출한다
        byte[] publicKeyModulus = getPublicKeyModulus();

        if(Arrays.equals(privateKeyModulus, publicKeyModulus)){
            System.out.println("RSA 키쌍이 서로 일치합니다 ");
        }else{
            System.out.println("키쌍이 서로 일치하지 않습니다 ");
        }
    }
    public void systemFileCheck(){
        try{
            // 윈도우 운영체제인가?
            Boolean isWin = System.getProperty("os.name").toLowerCase().contains("windows");
            if(isWin){
                // 실제 운영체제의 rsa키 파일 위치 유무를 체크한다
                if(!Files.exists(Paths.get(nxkeyKeyFolderPath))){
                    Files.createDirectory(Paths.get(nxkeyKeyFolderPath));
                    copyResourceFile("classpath:raon_cert/Server2048.pem", publicKeyPath); // 공개키 파일 없으면 resources 폴더로 부터 생성한다
                    copyResourceFile("classpath:raon_cert/Private2048.key.der", privateKeyPath); // 개인키 파일 없으면 resources 폴더로 부터 생성한다
                }else{
                    System.out.println("이미 raon_cert폴더가 존재합니다");
                }
            }

        }catch (IOException e){
            e.printStackTrace();
        }
    }
    private void copyResourceFile(String resourcePah, String targetFilePath){
        try{
            Resource resource = resourceLoader.getResource(resourcePah);
            File targetFile = new File(targetFilePath);
            if(!targetFile.exists()){
                try(InputStream inputStream = resource.getInputStream()){
                    Files.copy(inputStream, targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    System.out.println("File 복사 완료");
                }
            }
        }catch (IOException e){
            e.printStackTrace();
        }
    }
    public byte[] getPublicKeyModulus(){
        try{
            byte[] bytePublicKeyData = Files.readAllBytes(Paths.get(publicKeyPath));

            CertificateFactory cf = CertificateFactory.getInstance("X.509"); // 공개키가 인증서 타입이어서 X.509로 인스턴스를 생성
            X509Certificate cert = (X509Certificate) cf.generateCertificate(new ByteArrayInputStream(bytePublicKeyData));
            RSAPublicKey rsaPublicKey = (RSAPublicKey) cert.getPublicKey();

            MessageDigest md = MessageDigest.getInstance("SHA1");
            return md.digest(rsaPublicKey.getModulus().toByteArray());
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
    public byte[] getPrivateKeymodulus(){
        // PKCS1 der 파일을 읽는다
        try{
            byte[] der =  Files.readAllBytes(Paths.get(privateKeyPath));
            return readPkcs1File(der);
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }
    public byte[] readPkcs1File(byte[] der) throws NoSuchAlgorithmException {
        int offset = 2;
        // SEQUENCE
        if(der[0] != SEQUENCE) new IOException("SEQUENCE 형식이 아닙니다");
        // LongForm 형식일 경우 뒤에 데이터가 있으니 LongForm이 가르킨 값은 스킵한다
        if((der[1] & 0x80) != 0){
            offset += (der[1] & 0xFF) & 0x7F; // 실제 데이터만큼
        }
        // offset이 가르키는 값이 INTEGER값 인가
        if((der[offset])!=INTEGER && (der[offset+1] & 0x80) != 0) new IOException("INTEGER 형식이 아닙니다");
        offset += 3; // INTEGER + 데이터 크기 + 데이터는 스킵한다

        if(der[offset] != INTEGER) new IOException("Integer 형식이 아닙니다");
        offset++;

        // modulus 길이 확인
        int len = der[offset] & 0xFF; // 양수 변경
        offset++;
        if((len & 0x80) != 0){ // longform 값일때
            int lenBytes = len & 0x7F; // 실제 데이터의 길이를 구한다
            len = 0;
            for(int i = 0 ; i < lenBytes ; i++){
                len = (len << 8) | (der[offset] & 0xFF);
                offset++;
            }
        }
        byte[] modulusArray = Arrays.copyOfRange(der, offset, offset+len);
        StringBuilder sb = new StringBuilder();
        for(int i = 0 ; i < modulusArray.length ; i++){
            sb.append(String.format("%02x", modulusArray[i]));
        }

        MessageDigest md = MessageDigest.getInstance("SHA1");
        return md.digest(modulusArray); // sha1으로 반환한다
    }
}
