/**
****************************************************
TouchEnNx_config.js
****************************************************
| Version     작성자        수정일        변경사항 
 ---------  -------  -----------  ----------
 | v1.0.0.13   최광민    2023.10.05
 | v1.0.0.12   강남준    2023.04.12
 | v1.0.0.11   강남준    2023.02.14
 | v1.0.0.10   강남준    2023.02.01
 | v1.0.0.9    강남준    2021.08.14
 | v1.0.0.8    강남준    2021.01.29
 | v1.0.0.7    강남준    2020.02.17
 | v1.0.0.6    강남준    2019.07.05
 | v1.0.0.5    강남준    2018.12.14
 | v1.0.0.4    백서린    2018.11.12
 | v1.0.0.3    강남준    2018.05.14
 | v1.0.0.2    허혜림    2018.01.31
 | v1.0.0.1    허혜림    2017.12.20          

****************************************************
 Copyright ⒞ RaonSecure Co., Ltd. 
****************************************************
**/

var nxKeyConfig ={};
nxKeyConfig.version = {
	
	extension :   {
		exChromeExtVer		:	"1.0.0.0",
		exFirefoxExtVer		:	"1.0.2.5",
		exFirefoxJpmExtVer	:	"1.0.1.12",
		exOperaExtVer		:	"1.0.1.14"
	},
		
	/** 키보드보안 설정 */
		tkappiver			:	"1.0.0.81",
		tkappmver			:	"1.0.0.68",
		exWinVer			:	"1.0.0.88",
		exWin64Ver			:	"1.0.0.88",
		exWinProtocolVer	:	"1.0.1.1547",
		daemonVer			:   "1.0.2.11",
		macDaemonVer		:   "1.0.1.8",
		linuxDaemonVer		:   "1.0.0.1",
		exMacVer			:	"1.0.0.17",
		exMacProtocolVer	:	"1.0.1.1547"
};


nxKeyConfig.module = {
		
		extension	:{
			//exChromeExtDownURL	: "https://chrome.google.com/webstore/detail/dncepekefegjiljlfbihljgogephdhph",
			exChromeExtDownURL	: "https://download.raonsecure.com/extension/chrome/chrome.html",
			exFirefoxExtDownURL	: TouchEnNxConfig.path.base + "/extension/touchenex_firefox.xpi",
			exFirefoxJpmExtDownURL	: TouchEnNxConfig.path.base + "/extension/jpm_touchenex_firefox.xpi",
			exOperaExtDownURL	: TouchEnNxConfig.path.base + "/extension/touchenex_opera.nex"														
		},
		
			exWinClient		            :	TouchEnNxConfig.path.base + "/nxKey/module/TouchEn_nxKey_32bit.exe",
			exWin64Client            	:	TouchEnNxConfig.path.base + "/nxKey/module/TouchEn_nxKey_64bit.exe",
			daemonDownURL				:	TouchEnNxConfig.path.base + "/nxKey/module/TouchEn_nxKey_32bit.exe",
			macDaemonDownURL			:	TouchEnNxConfig.path.base + "/nxKey/module/TouchEn_nxKey_Installer.pkg",
		//	ubuntu32DaemonDownURL		:	TouchEnNxConfig.path.base + "/nxKey/module/CrossEXService_32bit.deb",
		//	ubuntu64DaemonDownURL		:	TouchEnNxConfig.path.base + "/nxKey/module/CrossEXService_64bit.deb",
		//	fedora32DaemonDownURL		:	TouchEnNxConfig.path.base + "/nxKey/module/CrossEXService_32bit.rpm",
		//	fedora64DaemonDownURL		:	TouchEnNxConfig.path.base + "/nxKey/module/CrossEXService_64bit.rpm",
			exMacClient					:	TouchEnNxConfig.path.base + "/nxKey/module/TouchEn_nxKey_Installer.pkg",
			exMacProtocolDownURL		: 	TouchEnNxConfig.path.base + "/nxKey/module/TouchEn_nxKey_Installer.pkg"
	};

/** 키보드보안 E2E 를 사용하지 않을 경우 주석해제*/
if(typeof TNK_SR == 'undefined'){
	var TNK_SR = "";
}

/**	클라이언트 솔루션별 동작 설정*/
TouchEnNxConfig.solution={
		nxkey : {
				tekOption : {
					"pki": "TouchEnkeyEx",
				    "keyboardonly": "false",
				    "defaultenc": "false",
				    "verify": "0",
				    "defaultpaste": "true",
				    "iframename": "",
				    "usegetenc": "false",
				    "clearbufferonempty": "true",
				    "refreshsession": "true",
				    "improve": "true",
					"bstart": 0,
				    "setcallback": "false",
				    "usebspress": "false",
				    "ignoreprogress": "true",
				    "ignoreprogress2": "true",
				    "exformname": "",
				    "idbase": "true",
				    "allcrypt": "false",
					"browserinfo" : "",
					"cert" : "-----BEGIN CERTIFICATE-----MIIDXTCCAkWgAwIBAgIJAO4t+//wr+zYMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTI1MDgxMDIzNDIzNVoXDTI2MDgxMDIzNDIzNVowWTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDESMBAGA1UEAwwJVD1UJkQ9WypdMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw0EHhH8xiLv7TNPKD+bAE5yb/jpBzAmDS6Re6ZEqTMCQv6ABOms54yXGRtygrCgrM794qOPbg1GiCzAao5VOP4lski6/EvcG6d+AGM8XrF/pxHypRMg48wGMLeg2lqHrB1YVqJFEXkdvWd5JlwWfAqLYN9yqDmGnj2Evv3pVy3Lsznee2UHNd3SGPHR4QdgYykQbf2SBv57SQfHgXj39Jtg88ArDhetbKN11uwdiIBtunkkndLhLT3Yvcjns+7bsC6TAyrzpaGWlSaOfrLt4ZqGjhyvqU+b8Lp0y1QdyByZbMpLcfkibP4AGXH3nyZFpGIUGqSoue8K9EdzSpdUAbQIDAQABoxowGDAJBgNVHRMEAjAAMAsGA1UdDwQEAwIF4DANBgkqhkiG9w0BAQsFAAOCAQEAlVWxIfl/xXOedHp9uVsx2C5dqIDD0BBShyW2hRxg0FSMjt1A0KxgaeoNRx2sPWupjQRGM0CzepjivvjE1oJkHzAJZG/ftIi2KLDR2ybvqM7VduEj5MZVmM4cLJGF4gAtUI2gBuxASLuKytIZKDyFSOOkuI5ZuMDvgAx/6NTO/AAjEvu090M98ypGbjxgIfV1haYZ35CPWn5reakB3n9OsqdoXhAi3plnlE75SkVvOz8yc8yQQ/HxqrCu2rJZD0g1Z3L/O8O+B8wS6kIHBVGNq6zCPhaeR9SfH4yty1+DWP4AT6u4zt0JZBhVH5EEOqdBrE418+gEGAeK+1wDeo6vjw==-----END CERTIFICATE-----",
					"srdk": TNK_SR,
					"generate_event": "false",
					"driverexcept": "0",
					"delayedck": "false",
					"shiftbypass": "true",
					"allowdup": "false",
					"enc2": "false",
				    "searchformname":"",
					"runtype": TouchEnNxConfig.runtype,
					"tk_isRunningSecurity" : "false", 
					"isAllowIdOverlap" : "true", //히든필드 중복오류 수정시 false설정 및 서버버전 v2.0.3.3 적용필요
					"defaultsecurityid" : "true",
					"newModule" : "true",
					"useWebSquarePast" : "false",
					"cmvp15" : "false",
					"senseReader":"false"
				}
		}
};