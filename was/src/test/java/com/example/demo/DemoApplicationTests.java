package com.example.demo;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.context.WebApplicationContext;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) // 실제 서블릿 환경 구동
class DemoApplicationTests{
	@Autowired
	private TestRestTemplate restTemplate; // 실제 포트로 요청을 보내는 도구


	@Test
	public void test1() throws Exception {
		ResponseEntity<String> response = restTemplate.getForEntity("/transkeyServlet?op=getInitTime", String.class);


		Map<String, Object> dataMap = new HashMap<>();
		// useSession 추출 및 검증
		if(response.getBody().contains("useSession")){
			//var initTime='186091135304065437719625626458277747111';var limitTime=0;var useSession=false;var useSpace=true;var useGenKey=false;var useTalkBack=true;
			dataMap = dataSplit(response.getBody());
			Assertions.assertEquals("false", (String)dataMap.get("useSession"),"가상키패드 세션 사용으로 설정 config.ini 설정값이 true로 설정 되어있습니다");
			Assertions.assertEquals("0", (String)dataMap.get("limitTime"), "재사용 방지 기능이 적용되어 있지 않습니다");

			// 키보드 값 잘 일었는지 확인
			response = restTemplate.getForEntity("/transkeyServlet?op=getKeyboardHash", String.class);
			if(response.getStatusCode() == HttpStatus.OK){
				dataMap.putAll(dataSplit(response.getBody()));
				if((!((String)dataMap.get("qwertyHash")).equals("null")) && (!((String)dataMap.get("numberHash")).equals("null"))
				&& (!((String)dataMap.get("qwertyMobileHash")).equals("null")) && (!((String)dataMap.get("numberMobileHash")).equals("null"))){
					Assertions.assertEquals(true, true);
				}else{
					Assertions.fail("키보드 이미지 경로가 올바르지 않습니다");
				}

			}


			// 공개키 서버로부터 정상적으로 읽어오는지 테스트

			// Http Header dataType 설정
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

			// Http Body 설정
			MultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
			bodyMap.add("op", "getPublicKey");
			bodyMap.add("TK_requestToken", 0);
			HttpEntity<MultiValueMap<String, Object>> requestPost = new HttpEntity<>(bodyMap, headers);

			response = restTemplate.postForEntity("/transkeyServlet", requestPost, String.class);
			if(response.getBody().contains("public key read fail")){
				Assertions.fail("가상키패드 공개키 읽기 실패");
			}
			// 복호화 테스트 코드
			// useSession이 false이고 limitTime값이 0일 경우 ( 재사용 방지 x 인 경우 )
			if(dataMap.get("useSession").equals(true) && dataMap.get("limitTime").equals("0")){

			}

		}else{
			// 응답 바디 내용과 상태 코드를 포함하여 테스트 실패 처리
			String errorMessage = String.format(
					"응답에 'useSession'이 포함되어 있지 않습니다. (Status: %d, Body: %s)",
					response.getStatusCodeValue(),
					response.getBody()
			);
			Assertions.fail(errorMessage);
		}

	}
	public Map<String, Object> dataSplit(String str){
		Map<String, Object> resultMap = new HashMap<>();
		String[] items = str.replaceAll("var ", "").replaceAll("'","").replaceAll("\"","").split(";");
		for(String item : items){
			if(item.contains("=")){
				String[] itemSplit = item.split("=");
				resultMap.put(itemSplit[0], itemSplit[1]);
			}
		}
		return resultMap;
	}
	// 키패드 복호화 테스트
	@Test
	public void test2(){
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> bodyMap = new HashMap<>();
		bodyMap.put("id","numberkeypad");
		bodyMap.put("initTime","5041100770319187076969619454691853073");
		bodyMap.put("keyboardType","number");
		bodyMap.put("keyIndex","af30b3ceace90e5c9be9885d090327dec960a42fbf15627f2245fd1ad8c6b5912d3e50b604844f461c0d7565cab669ff1b9ffb60f65681ee79da17142f163f4654a0a8de6290bb29f393d104c6867075ae52ce0e496c2fcbe63987ee337274cc87a6b3dc6a7d623f270de373b22190c4af054705fe86c157450fc34789130f4830ff279f009848dd11aec4af8c0d050bf781e3731ead7afa1279a5f0647bf6ae97eb49f8a4d9cf0f8317e7bee38b1365bde4e5bce1ebf7146fffe6c112538ca1f56dfd15917c149cfc5ae8e64000d94adb6cf1367fb488ddcb824d8c837b85434176dc2f273045cc1723daf7278342966941168181e241dd8191a6708b40299d");
		bodyMap.put("fieldType","password");
		bodyMap.put("seedKey","494b14620e46f8f0f234b1701f863cb2f339fa7c72af239e19b6dfbfc20cb8a490864b0a60792be876d1fce721a33633f0e4c24847f074dab02739cab8aaca0d36ce15045b84ec6eba778473861bf5e93800a59bc184756ec88e4bec6c29bd327d9f2b6a437d349b2dfd38c4f870a50c121cff139c1339e7c48833eb6547aa72059b58af57c30712a8cf7ab995237785ac3538586c6ba733e67a2bf9d19a46805c30a23cd4450e714854ed33686a884e517b851bc3837b15b6b3a3956b65d12226b8d3c570baf86ec694ebf20c39f4c20334f4209b5957ae30d4262e58b32f766c3f4a86050d9c9c4bee8b26e04611acb1a54e514feaf553e1e5c28f8a701447");
		bodyMap.put("encoded","$aa,4a,a8,74,8c,4,52,b5,9,f2,67,3b,93,ea,bb,f0,c7,75,a4,bc,60,43,f2,14,46,a,8c,68,41,8b,dd,9,a0,f,97,b4,cc,5b,31,f5,42,8b,f4,fb,db,ef,be,98,5e,d,0,94,39,51,28,dd,c9,1e,e9,92,44,29,a,79$7a,1f,32,60,30,ea,4c,3,8a,13,8e,5,17,91,91,ef,5b,12,0,e,92,5b,73,fe,c8,fd,17,17,ca,16,a8,35,96,ff,35,4c,4,e6,b,7b,7f,b2,57,6e,4c,6e,1c,dd,12,53,58,80,14,22,ed,ea,6f,6,9a,cb,1f,23,60,39$d8,95,95,c6,4f,26,c5,1f,e5,71,9f,ab,1b,9d,3c,78,e5,a1,36,a,fa,cd,6b,b5,dd,df,1a,1e,51,62,d9,8e,85,89,7d,25,a4,7b,50,20,73,e8,5f,84,db,27,e1,32,df,44,87,91,a7,7c,f5,90,b0,fd,45,57,4c,ab,27,eb$21,d6,f7,d3,12,10,97,6f,dd,d4,78,cc,2a,f8,45,7a,df,1a,1e,92,1b,e5,ee,b6,41,7f,d4,c8,d1,6b,1b,62,bd,c0,d7,17,c2,69,3d,83,bd,35,a4,bf,33,cf,bb,49,18,8b,d7,95,f,ba,da,99,78,6e,ed,49,7,d0,de,1c$75,21,1f,3a,1f,39,ed,70,e0,22,6b,8c,f3,e0,7c,d,7a,33,a3,c1,85,f1,e6,35,6,fa,43,e7,b4,7c,8b,7f,64,4a,2a,74,23,7,d4,df,c6,4,2c,ef,20,16,49,96,4c,20,7f,2f,1a,bd,5b,70,b9,ec,6f,db,1,f9,e,a3$73,a1,20,8c,a2,49,38,3b,b2,4c,97,51,de,e4,18,3d,f1,83,27,a4,1f,40,36,c2,bf,fa,64,11,28,e9,27,c0,f2,45,59,61,93,be,68,f1,a3,c9,f7,7c,3b,51,31,81,b7,b8,53,1,d,89,21,c,8d,5a,7,e1,76,86,31,8b$69,60,1,2d,ad,1c,a8,4c,4,fb,e4,4,6,6,55,46,a7,f7,87,25,39,3d,32,42,d9,30,b7,f2,80,c7,d1,44,e3,8,2,a,f,77,b8,3f,d4,83,7f,62,11,97,c5,1,dc,9b,fa,e5,65,ff,79,f8,c3,ba,65,1b,2e,b0,49,6e$1c,aa,42,53,82,e3,d4,df,d2,1,55,55,bf,8e,de,e,43,4e,40,15,6c,c7,66,1f,8,4b,26,9,3d,60,4d,6,8b,2b,ca,ef,46,10,79,68,2e,fe,eb,bc,6c,0,25,51,85,75,ab,7c,45,b1,7f,95,d8,9,e8,9,79,5b,ef,dd");
		bodyMap.put("hmEncoded","70c8901eb33b6ab944ce8a036b894a0f84a7e8d043bc7b99dd198a0e27b6a0c0");


		HttpEntity<Map<String, Object>> requestPost = new HttpEntity<>(bodyMap, headers);
		ResponseEntity<Map> response = restTemplate.postForEntity("/api/transkey/decode", requestPost, Map.class);
		if((Integer)response.getBody().get("status") == 0){
			System.out.println("복호화 : "+response.getBody().get("data"));
		}else{
			Assertions.fail("키가 다르거나 controller 부분에서 잘못된 값이 들어옴 ");
		}

	}
	@Test
	public void test3(){

	}
	@Test
	void contextLoads() throws Exception {
		test1();
		test2();
		//test3();
	}

}
