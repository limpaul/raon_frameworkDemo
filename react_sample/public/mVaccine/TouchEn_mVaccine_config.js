String.prototype.contains = function(str) {
	return this.toLocaleLowerCase().indexOf(str) !== -1;
};

var mvaccine_version = "version=7.4.15";//앱 최소 버전 기입(설정된 버전 이하 버전 앱 사용 시 모두 업데이트 요청)
var mvaccine_domain = window.location.origin;//ex : http://127.0.0.1:8080
var mvaccine_path = "";               // Path url ex: http//127.0.0.1:8080/homepath 일 때 path="/homepath" 설정 (단,PATH가 / 일 경우 ""(공백)으로 사용한다.)
var mvaccine_callback_url = "/mvaccineforweb"; // domain + path + callback_url (mVaccineWebServelet url)
var mvaccine_mode = "mini"; //악성앱 검사 실행 방식 ("mini" : 미니 화면 검사 | "full" : 풀 화면 검사)

var mvaccine_userAgent = window.navigator.userAgent.toLowerCase();
var mvaccine_popup_comment = "안전한 접속환경 유지를 위해 모바일 백신을<br>설치/실행 합니다.";
var mvaccine_popup_img = "mvaccine_popup_logo.png";
var mvaccine_app = "com.android.browser|org.mozilla.firefox|com.opera.browser|com.opera.browser.mini.classic|com.opera.browser.mini.android|com.android.chrome|com.sec.android.app.sbrowser|net.daum.android.daum|com.nhn.android.search|mobi.mgeek.tunnybrowser|com.ucmobile.intl";
var mvaccine_ff = mvaccine_userAgent.contains('firefox');
var mvaccine_old = mvaccine_userAgent.contains('android 2.');
var mvaccine_naver = mvaccine_userAgent.contains('naver');
var mvaccine_samsungBrowser7 = mvaccine_userAgent.contains('samsungbrowser/7');
var mvaccine_chrome = false;
if (mvaccine_userAgent.contains('chrome')) {
	mvaccine_chrome = true;
}
// alert(mvaccine_userAgent);
var mVaccineLayer = "mVaccineLayer";
var mvaccine_resultFuncName = "mVaccineDetectResult";//탐지 결과 제공 함수 커스텀 필요시 detectResult에 커스텀 함수 추가 필요