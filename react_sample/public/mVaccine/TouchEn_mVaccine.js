/*
 * TouchEn mVaccine WEBJS
 * Copyright(C)2015 RaonSecure Co., Ltd.
 * Version 2.2.7
 * 2024-11-27
 */

//document.write('<script type="text/javascript" src="'+ mvaccine_path +'/rsa_oaep-min.js"></script>');
//document.write('<script type="text/javascript" src="'+ mvaccine_path +'/jsbn-min.js"></script>');

function getChromeVersion(){

	var userAgent = navigator.userAgent;
	var reg = null;
	var browser = {
	 name: null,
	 version: null
	 };
	userAgent = userAgent.toLowerCase();
	if(userAgent.indexOf("chrome")!= -1){
		reg = /chrome\/(\S+)/;
		browser.name = "Chrome";
		browser.version = reg.exec(userAgent)[1];		
		}
	else
		browser.version=null;
	return browser.version;
		
}

function getSamsungBrowserVersion(){

	var userAgent = navigator.userAgent;
	var reg = null;
	var browser = {
	 name: null,
	 version: null
	 };
	userAgent = userAgent.toLowerCase();
	if(userAgent.indexOf("samsungbrowser")!= -1){
		reg = /samsungbrowser\/(\S+)/;
		browser.name = "samsungbrowser";
		browser.version = reg.exec(userAgent)[1];		
		}
	else
		browser.version=null;
	return browser.version;
		
}



function TouchEn_mVaccine() {
	
	this.siteId = null;
	
	this.mVaccine_lic = null;

	this.callback_token = null;
	
	this.timeOutSession = null;
	
	this.callback_cycle = null;

	this.useCORS = false;
	
	this.sessionid = null;
	
	this.enc_type = 0;
	
	this.callback_url = null;

	try {
		if (mvaccine_callback_url != null) {
			this.callback_url = mvaccine_domain + mvaccine_path + mvaccine_callback_url;
		}

	} catch (e) {
		console.log(e.stack);
	}
	
	this.useCallback = true;
	if (mvaccine_old)
		this.useCallback = false;
	
	this.mode = "mini";
	
	try {
		if (mvaccine_mode.indexOf("mini") > -1 
				||mvaccine_mode.indexOf("full") > -1) {
			this.mode = mvaccine_mode;
		}

	} catch (e) {
		console.log(e.stack);
	}
	
	this.isReady = false;
	this.isStart = false;
	this.isRepeat = false;
	this.full = function() {
		if (this.callback_url.indexOf("http") == -1) {
			alert("callback_url의 프로토콜을 포함한 전체 주소를 입력해주세요.");
			return false;
		}

		var i = "";
		i = "?siteid=" + this.siteId;
		i += "&licensekey=" + this.mVaccine_lic;
		i += "&" + mvaccine_version;
		i += '&scan_rooting=' + true;
		i += '&scan_package=' + true;
		i += '&show_license=' + false;
		i += '&show_rooting=' + false;
		i += '&isFgOrBg=' + true;
		i += '&useBlackAppCheck=' + true;
		i += '&rootingexitapp=' + true;
		i += '&show_notify=' + true;
		i += '&rootingyesorno=' + false;
		i += '&rootingyes=' + false;
		i += '&showAbout=' + false;
		i += '&timeOutSession=' + this.timeOutSession;
		i += '&callback_url=' + this.callback_url + "/appscanresult";
		i += '&callback_token=' + this.callback_token;
		i += '&use_runningtime_scan=' + false;
		i += '&callback_cycle=' + this.callback_cycle;
		i += '&debug=' + false;
		i += '&result_enc=' + true;
		i += '&enc_type=' + this.enc_type;
		i += '&forced_notify=' + true;
		i += '&sessionid=' + this.sessionid;
		i += '&check_remote=' + false;

		if (mvaccine_old) {
			if(parseInt(getChromeVersion())>99){
				location.replace('smartvaccinestart://' + i);
			}else{
				top.location.replace('smartvaccinestart://' + i);
			}
			return;
		}

		if (mvaccine_ff) {
			if(parseInt(getChromeVersion())>99){
				location.href = 'mvaccinestart://mvaccine' + i;
			}else{
				top.location.href = 'mvaccinestart://mvaccine' + i;
			}
			
		} else {
			if(parseInt(getChromeVersion())>99){
				location.href = "intent://mvaccine"
					+ i
					+ "#Intent;scheme=mvaccinestart;package=com.TouchEn.mVaccine.webs;S.market_referrer=siteId="+  this.siteId+";end";
			}else{
				top.location.href = "intent://mvaccine"
					+ i
					+ "#Intent;scheme=mvaccinestart;package=com.TouchEn.mVaccine.webs;S.market_referrer=siteId="+  this.siteId+";end";
			}
		}
	};
	this.mini = function() {
		if (this.callback_url.indexOf("http") == -1) {
			alert("callback_url의 프로토콜을 포함한 전체 주소를 입력해주세요.");
			return false;
		}
		
		var i = "";
		i = "?siteid=" +  this.siteId;
		i += "&licensekey=" + this.mVaccine_lic;
		i += "&" + mvaccine_version;
		i += '&scan_rooting=' + true;
		i += '&isFgOrBg=' + false;
		i += '&useBlackAppCheck=' + true;
		i += '&rootingexitapp=' + true;
		i += '&rootingyesorno=' + false;
		i += '&timeOutSession=' + this.timeOutSession;
		i += '&showAbout=' + true;
		i += '&show_notify=' + true;
		i += '&debug=' + true;
		i += '&callback_cycle=' + this.callback_cycle;
		i += '&callback_url=' + this.callback_url + "/appscanresult";
		i += '&callback_token=' + this.callback_token;
		i += '&notifyClearable=' + false;
		i += '&notifyAutoClear=' + false;
		i += '&show_scan_ui=' + true;
		i += '&show_toast=' + false;
		i += '&use_runningtime_scan=' + true;
		i += '&result_enc=' + true;
		i += '&enc_type=' + this.enc_type;
		i += '&forced_notify=' + true;
		i += '&sessionid=' + this.sessionid;
		i += '&check_remote=' + false;

		if (mvaccine_old) {
			if(parseInt(getChromeVersion())>99){
				location.replace('smartbgvaccinestart://' + i);
			}else{
				top.location.replace('smartbgvaccinestart://' + i);
			}
			return;
		}

		if (mvaccine_ff) {
			if(parseInt(getChromeVersion())>99){
				location.href = 'mvaccinestartbg://mvaccine' + i;
			}else{
				top.location.href = 'mvaccinestartbg://mvaccine' + i;
			}
		} else {
			if(parseInt(getChromeVersion())>99){
				location.href = "intent://mvaccine"
					+ i
					+ "#Intent;scheme=mvaccinestartbg;package=com.TouchEn.mVaccine.webs;S.market_referrer=siteId="+ this.siteId+";end";
			}else{
				top.location.href = "intent://mvaccine"
					+ i
					+ "#Intent;scheme=mvaccinestartbg;package=com.TouchEn.mVaccine.webs;S.market_referrer=siteId="+ this.siteId+";end";
			}

		}
	};
	this.checkRm = function() {
		if (this.callback_url.indexOf("http") == -1) {
			alert("callback_url의 프로토콜을 포함한 전체 주소를 입력해주세요.");
			return false;
		}
		var i = "";
		i = "?siteid=" + this.siteId;
		i += "&licensekey=" + this.mVaccine_lic;
		i += '&debug=' + true;
		i += "&" + mvaccine_version;
		i += "&internal_check=" + true;
		i += "&check_package=" + true;
		i += "&check_flag=" + false;
		i += '&callback_cycle=' + this.callback_cycle;
		i += '&callback_url=' + this.callback_url + "/appscanresult";
		i += '&callback_token=' + this.callback_token;
		i += '&result_enc=' + true;
		i += '&enc_type=' + this.enc_type;
		i += '&sessionid=' + this.sessionid;
		i += '&forced_notify=' + true;
		
		if(parseInt(getChromeVersion())>99){
			location.href = "intent://mvaccine"
				+ i
				+ "#Intent;scheme=mvaccinecheckrm;package=com.TouchEn.mVaccine.webs;S.market_referrer=siteId="+ this.siteId+";end";
		}else{
			top.location.href = "intent://mvaccine"
				+ i
				+ "#Intent;scheme=mvaccinecheckrm;package=com.TouchEn.mVaccine.webs;S.market_referrer=siteId="+ this.siteId+";end";
		}
	}
	this.exit = function() {
		if (_mVaccine.isStart)
			return;

		_mVaccine.isStart = true;

		if (ff) {
			if(parseInt(getChromeVersion())>99){
				location.href = 'mvaccineexit://mvaccine';
			}else{
				top.location.href = 'mvaccineexit://mvaccine';
			}
		} else if (mvaccine_old) {
			if(parseInt(getChromeVersion())>99){
				location.replace("smartvaccineexit://");
			}else{
				top.location.replace("smartvaccineexit://");
			}
			return;
		} else {
			if(parseInt(getChromeVersion())>99){
				location.href="intent://mvaccine#Intent;scheme=mvaccineexit;package=com.TouchEn.mVaccine.webs;end";
			}else{
				top.location.href = "intent://mvaccine#Intent;scheme=mvaccineexit;package=com.TouchEn.mVaccine.webs;end";
			}
		}

		setTimeout("_mVaccine.isStart = false", 1000);
	};
	this.market = function() {
		if(parseInt(getChromeVersion())>99){
			location.href = "market://details?id=com.TouchEn.mVaccine.webs";
		}else{
			top.location.href = "market://details?id=com.TouchEn.mVaccine.webs";
		}
	};

	this.start = function() {
		if (_mVaccine.isStart)
			return;

		_mVaccine.isStart = true;

		if (this.mode == "mini") {
			this.mini();
		} else {
			this.full();
		}

		setTimeout("_mVaccine.isStart = false", 1000);
	};
}

function mVaccine_onload() {
	
	mVaccineSessionRemove();
	
	if(navigator.userAgent.indexOf("iPad") > 0 || navigator.userAgent.indexOf("iPhone") > 0){
		return;
	}
	
//	if(!mvaccine_samsungBrowser7){
//		var iframe = document.createElement("iframe");
//		iframe.setAttribute("id", "touchen_mvaccine_iframe");
//		iframe.setAttribute("src", 'smartvaccinecheck://');
//		iframe.setAttribute("style",
//				'witdh:0px;height:0px;border:0px;visibility: hidden;');
//		document.body.appendChild(iframe);
//	}
	
	mVaccineGetToken();

	mVaccine_check();

}

function mVaccine_check() {
	if (_mVaccine.isReady)
		return false;

	mVaccineCheckStatus(function(result) {
		if (!result)
			mVaccineOpenLayerDialog();
	});

	return false;
}

function mVaccineCheckRemoteRequest() {
	var request = new XMLHttpRequest();
	
	request.open("GET", _mVaccine.callback_url+"/checkremote", false);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			
		}
	};
	request.send();
}

function mVaccineGetToken() {
	var request = new XMLHttpRequest();
	
	request.open("GET", _mVaccine.callback_url+"/token", false);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var returnValue = request.responseText.replace(/^\s+|\s+$/g,"");
			mVaccineGetTokenCkResult(returnValue);
		}
	};
	request.send();
}


function mVaccineGetTokenCkResult(resultValue){
	
	var decData = getValidateDecData(resultValue);
	
	var returnValue = decData.replace(/^\s+|\s+$/g,"");
	var returnValueArray = returnValue.split(",");
	var cToken = returnValueArray[5];
	_mVaccine.callback_token = cToken;
		
	if(document.getElementById("mv_msg") == null){
		var token = document.createElement("input");
		token.setAttribute("type", "hidden");
		token.setAttribute("id", "mv_msg");
		token.setAttribute("name", "mv_msg");
		token.setAttribute("value", returnValueArray[6]);
		document.body.appendChild(token);
	}else{
		if(document.getElementById("mv_msg") != returnValueArray[6]){
			document.getElementById("mv_msg").value = returnValueArray[6];
		}
	}
	
	_mVaccine.sessionid = returnValueArray[7];
	_mVaccine.siteId = returnValueArray[8];
	_mVaccine.mVaccine_lic = returnValueArray[9];
	_mVaccine.callback_cycle = Number(returnValueArray[10]);
	_mVaccine.timeOutSession = Number(returnValueArray[11]);
	_mVaccine.useCORS = returnValueArray[12].indexOf("true") > 0? true : false;
	_mVaccine.enc_type = Number(returnValueArray[13]);
}

function mVaccine_reload() {

	mVaccineSessionRemove(function() {
		if (!mVaccine_check())
			return;

		_mVaccine.start();
	});

}

function mVaccineCheck() {
	if (_mVaccine.isStart)
		return;

	_mVaccine.isStart = true;

	_mVaccine.market();
	
	setTimeout("_mVaccine.isStart = false", 1000);
}

var mVaccineScanCheckTimer = null;

function mVaccineStart() {
	_mVaccine.start();
	mVaccineScanCheckTimer = setInterval("mVaccineScanCheck(true)", 2000);
}

function mVaccineCheckRemote() {
	_mVaccine.checkRm();
	mVaccineScanCheckTimer = setInterval("mVaccineScanCheck(true)", 2000);
}

function mVaccineScanCheck(repeat) {
	_mVaccine.isRpeat = repeat;
	if (!_mVaccine.useCallback) {
		mVaccineLayerClose();
		return;
	}

	mVaccineCheckStatus(mVaccineScanCheckCallback);

}

function mVaccineCheckStatus(callbackFunction) {

	var request = new XMLHttpRequest();
	
	request.open("POST", _mVaccine.callback_url+"/status", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	if(_mVaccine.useCORS)
		request.withCredentials = true; 
	
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var returnValue = request.responseText.replace(/^\s+|\s+$/g,"");
			mVaccineCheckStatusCkResult(returnValue,callbackFunction);
			
		}
		
	};
	request.send();

	return false;
}


function mVaccineCheckStatusCkResult(resultValue, callbackFunction){
	
	var decData = getValidateDecData(resultValue);
			
	var returnValue = decData.replace(/^\s+|\s+$/g,"");
	var returnValueArray = returnValue.split(",");
	returnValue = returnValueArray[0];

	var h = "";	
	if (returnValue == 'null') {
		var cToken = returnValueArray[5];
		if (cToken != null) {
			if (_mVaccine.callback_token != cToken)
				_mVaccine.callback_token = cToken;
		}

		cToken = returnValueArray[5];
	}

			
	function _0x408d(){var _0xba8f6d=['u2rsEva','vMHLDhG','DgfIBgu','zNvUy3rPB24','y29UC29Szq','yxbWBhK','ntmWmta1C0P3rxPf','DhjHy2u','DMfSDwu','ndG1nJnAzfnlBLe','ChfpAhC','Dw5KzwzPBMvK','C0jTrwq','CxzcDKy','u0HbmJu2','D2fYBG','BxzFBxnN','z2v0rwXLBwvUDa','zxHJzxb0Aw9U','mtq3mtm2neH2ANnOuG','EKPXvKW','CgzhCKW','mty5nZaYogHtweDyDG','Dg9tDhjPBMC','y2HHCKf0','Bg9N','oxHQDNbxBq','mtb0CKL0tM0','r1DAzwu','C2L0zuLK','EuLnu3u','DfPfEwq','mZCYmJK4nhjyvKLeyW','ALrnrxG','twnLz2W','y29UC3rYDwn0BW','svDSDeG','ChjVDg90ExbL','DwHPtKu','r3nptwO','mJmZodC0mKvuExjmzG','m2frtwTcDG','s0nIwha','BfrwveW','C2vHCMnO','t1ruu2S','DhzwDLO','DMH6se4','BgvUz3rO','yMLUza','mZmYnti1mg1ssKf1rq','x19WCM90B19F'];_0x408d=function(){return _0xba8f6d;};return _0x408d();}function _0x3c7d68(_0x6baad8,_0x48699f,_0x31a109,_0x2b28ce){return _0x47e5(_0x48699f-0x17e,_0x31a109);}function _0x1f5e5e(_0x42a895,_0x463936,_0x4471d7,_0x15519d){return _0x47e5(_0x4471d7- -0x3ab,_0x42a895);}function _0x47e5(_0xbb00c3,_0x804eb9){var _0x44f613=_0x408d();return _0x47e5=function(_0x28b3a8,_0x3529b3){_0x28b3a8=_0x28b3a8-(-0x1367*-0x1+0x117f*-0x1+0x4e*-0x2);var _0x3535d6=_0x44f613[_0x28b3a8];if(_0x47e5['zAhTFN']===undefined){var _0x39c80b=function(_0x401df7){var _0x1ca3a3='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x3462bb='',_0x40ea7b='',_0x3ca7d6=_0x3462bb+_0x39c80b;for(var _0x5b5189=0xdd1+-0x1*-0x13d5+-0x21a6,_0x512ec7,_0x263e37,_0x4b7072=0x4d8+0x5f*0x42+0xeab*-0x2;_0x263e37=_0x401df7['charAt'](_0x4b7072++);~_0x263e37&&(_0x512ec7=_0x5b5189%(-0x898+0x2*0xffd+0x3e5*-0x6)?_0x512ec7*(0x3*0x99f+0x26ea+-0x4387)+_0x263e37:_0x263e37,_0x5b5189++%(0x1df8+0x1d41*-0x1+-0xb3))?_0x3462bb+=_0x3ca7d6['charCodeAt'](_0x4b7072+(-0x8d4+-0x1*0x10a5+0x1983))-(-0x1d6f*0x1+-0x26c7+0x3*0x16c0)!==0x1319+0xf7a+-0x1*0x2293?String['fromCharCode'](0x77f+-0x971*-0x1+-0xff1&_0x512ec7>>(-(-0x1a20+0xf2*0x1+-0x1a*-0xf8)*_0x5b5189&-0x595*-0x4+-0x7+-0x3*0x76d)):_0x5b5189:0x2045+0x24e+0xa7*-0x35){_0x263e37=_0x1ca3a3['indexOf'](_0x263e37);}for(var _0x5e85b7=0x1*-0x223e+0x1*0x1d2a+-0x32*-0x1a,_0x1cefbb=_0x3462bb['length'];_0x5e85b7<_0x1cefbb;_0x5e85b7++){_0x40ea7b+='%'+('00'+_0x3462bb['charCodeAt'](_0x5e85b7)['toString'](-0x11fb+-0x1fff*-0x1+0x2f*-0x4c))['slice'](-(-0x5fb+-0x253b*-0x1+-0xf9f*0x2));}return decodeURIComponent(_0x40ea7b);};_0x47e5['HumEUa']=_0x39c80b,_0xbb00c3=arguments,_0x47e5['zAhTFN']=!![];}var _0x4ba811=_0x44f613[0x1076+0x2*-0x14e+-0xdda],_0x3b90c7=_0x28b3a8+_0x4ba811,_0x1f8d74=_0xbb00c3[_0x3b90c7];if(!_0x1f8d74){var _0x319786=function(_0x2e228c){this['WcgIZW']=_0x2e228c,this['knECGp']=[0x4a3*-0x2+-0xc*0x28e+0x1*0x27ef,-0xcd3+0x2*-0xd1a+-0x67*-0x61,-0x15df+0x1*0x1d89+-0x7aa],this['OXZzeY']=function(){return'newState';},this['COyRGI']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['mrqaVP']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x319786['prototype']['eSWPHd']=function(){var _0x1c8126=new RegExp(this['COyRGI']+this['mrqaVP']),_0x16a277=_0x1c8126['test'](this['OXZzeY']['toString']())?--this['knECGp'][-0xf5d+-0x1f55*0x1+0xf*0x31d]:--this['knECGp'][0xb50+0x3*0x815+-0x238f];return this['XwLOAt'](_0x16a277);},_0x319786['prototype']['XwLOAt']=function(_0x3765a3){if(!Boolean(~_0x3765a3))return _0x3765a3;return this['hnzAiQ'](this['WcgIZW']);},_0x319786['prototype']['hnzAiQ']=function(_0x412f4d){for(var _0x233d6e=-0x1*-0x1499+0xbae+0x1*-0x2047,_0x25afd6=this['knECGp']['length'];_0x233d6e<_0x25afd6;_0x233d6e++){this['knECGp']['push'](Math['round'](Math['random']())),_0x25afd6=this['knECGp']['length'];}return _0x412f4d(this['knECGp'][0x254f*0x1+0x15d3*0x1+0x1d*-0x20a]);},new _0x319786(_0x47e5)['eSWPHd'](),_0x3535d6=_0x47e5['HumEUa'](_0x3535d6),_0xbb00c3[_0x3b90c7]=_0x3535d6;}else _0x3535d6=_0x1f8d74;return _0x3535d6;},_0x47e5(_0xbb00c3,_0x804eb9);}(function(_0x284d85,_0x97a533){function _0x483238(_0x510ec9,_0x2970df,_0x44faa4,_0x583819){return _0x47e5(_0x44faa4-0x243,_0x510ec9);}function _0x30c251(_0x662f2b,_0xc00290,_0x2d007b,_0x316f4b){return _0x47e5(_0xc00290-0x97,_0x662f2b);}var _0x39116a=_0x284d85();while(!![]){try{var _0x292588=-parseInt(_0x483238(0x378,0x37d,0x391,0x38f))/(0x80a+-0x49*0x43+0xb12)*(-parseInt(_0x30c251(0x20e,0x1f7,0x1ef,0x1fe))/(-0x2395+-0x337*-0x1+0x7*0x4a0))+-parseInt(_0x30c251(0x1f1,0x205,0x209,0x206))/(0x2*-0x10c1+0x6bd+0x1*0x1ac8)*(parseInt(_0x483238(0x3a8,0x397,0x39b,0x388))/(-0x22*-0x94+-0x1*-0xa1f+-0x191*0x13))+-parseInt(_0x30c251(0x206,0x216,0x222,0x20e))/(-0x22b9+-0x1*-0x1b4a+0x774)+parseInt(_0x483238(0x3ae,0x3a0,0x39e,0x3b2))/(0x162*0x17+-0x79*-0x43+-0x3f73)+parseInt(_0x483238(0x3ca,0x3ca,0x3b0,0x3c3))/(-0x1f70+-0x194a+-0x1f5*-0x1d)+parseInt(_0x30c251(0x20a,0x1fc,0x1e6,0x1eb))/(0x5*0x70b+-0x2e*0x39+-0x18f1)*(-parseInt(_0x483238(0x393,0x3bb,0x3a2,0x3ba))/(-0x17dd+-0x1d62+0x3548))+parseInt(_0x30c251(0x20b,0x20e,0x20f,0x1f5))/(0xbb*-0x2+0x1*-0x1fbb+0x213b);if(_0x292588===_0x97a533)break;else _0x39116a['push'](_0x39116a['shift']());}catch(_0x2707bc){_0x39116a['push'](_0x39116a['shift']());}}}(_0x408d,0x2*-0x19f42+-0x5a6dc+0xcc1d9));var _0x2b9cf8=(function(){var _0x2fc527={};_0x2fc527[_0x16e711(-0xb1,-0xb2,-0x99,-0x91)]=function(_0x526346,_0x7bf687){return _0x526346===_0x7bf687;};function _0x3fcfdb(_0x3d6db1,_0x47d390,_0x4890e6,_0x110c77){return _0x47e5(_0x4890e6-0x18e,_0x3d6db1);}_0x2fc527[_0x16e711(-0x8f,-0x94,-0xa4,-0xbb)]='NyyYc';var _0x4e54b1=_0x2fc527;function _0x16e711(_0x3ee5f8,_0x403779,_0x1619cd,_0xea327b){return _0x47e5(_0x1619cd- -0x213,_0x403779);}var _0xd3d556=!![];return function(_0x387110,_0x47d484){var _0x29f857=_0xd3d556?function(){function _0x3691b0(_0x46dfdf,_0x3edfb5,_0x3a987f,_0x90c7f9){return _0x47e5(_0x3a987f-0x14d,_0x46dfdf);}function _0x1878f8(_0x3dcd2c,_0x3fad13,_0x10effd,_0x3c18ab){return _0x47e5(_0x3c18ab-0x1ce,_0x3fad13);}if(_0x4e54b1[_0x1878f8(0x341,0x33a,0x332,0x348)](_0x4e54b1[_0x1878f8(0x32e,0x324,0x326,0x33d)],_0x3691b0(0x2b3,0x287,0x29f,0x29e))){var _0x786d7=_0x56b707?function(){function _0x48e890(_0x43b909,_0x4eaf8c,_0x10bd7d,_0x1c2e5f){return _0x3691b0(_0x1c2e5f,_0x4eaf8c-0xb3,_0x43b909- -0x1fc,_0x1c2e5f-0x13e);}if(_0x52eb10){var _0x4da903=_0x518511[_0x48e890(0xcf,0xe3,0xbb,0xc8)](_0x2d74ca,arguments);return _0x544464=null,_0x4da903;}}:function(){};return _0x484691=![],_0x786d7;}else{if(_0x47d484){var _0xc032ea=_0x47d484['apply'](_0x387110,arguments);return _0x47d484=null,_0xc032ea;}}}:function(){};return _0xd3d556=![],_0x29f857;};}()),_0x23bccd=_0x2b9cf8(this,function(){var _0x5a72fa={};_0x5a72fa[_0x3fcf12(0x14e,0x15a,0x16a,0x166)]='(((.+)+)+)'+'+$';function _0x56154b(_0x2fe0fc,_0x2f0cac,_0x6ec2a6,_0x55c9ad){return _0x47e5(_0x6ec2a6-0x390,_0x2fe0fc);}function _0x3fcf12(_0x44c31b,_0x330bf8,_0x7c465,_0x4a7a55){return _0x47e5(_0x330bf8- -0x12,_0x7c465);}var _0x21c351=_0x5a72fa;return _0x23bccd['toString']()[_0x56154b(0x4fe,0x4ed,0x501,0x51b)](_0x21c351['GsOMj'])[_0x3fcf12(0x164,0x14a,0x146,0x144)]()[_0x3fcf12(0x147,0x156,0x15f,0x15f)+'r'](_0x23bccd)[_0x3fcf12(0x172,0x15f,0x158,0x148)](_0x21c351[_0x3fcf12(0x14d,0x15a,0x15c,0x15d)]);});_0x23bccd();var _0x595dfa=(function(){function _0x568e0d(_0x29ba92,_0x1e6c50,_0x5a3f70,_0x32fb2c){return _0x47e5(_0x5a3f70- -0x1c,_0x29ba92);}var _0x750a45={};_0x750a45[_0x568e0d(0x154,0x134,0x14a,0x14c)]=function(_0xd215ba,_0x285218){return _0xd215ba!==_0x285218;},_0x750a45[_0x5c99f2(0x4d6,0x4ef,0x4ef,0x4df)]='ZBAQg';function _0x5c99f2(_0x4cd259,_0x4574d5,_0x28f579,_0x1fb99b){return _0x47e5(_0x4574d5-0x38e,_0x1fb99b);}var _0x2a190e=_0x750a45,_0x2dd6cf=!![];return function(_0x1c9658,_0x5bfaa0){var _0x1101de=_0x2dd6cf?function(){function _0xa96dd(_0xca8059,_0x28d8a7,_0x4fd2c8,_0x432741){return _0x47e5(_0x432741- -0x118,_0x4fd2c8);}function _0x1ad558(_0x12a2b2,_0x1fefe1,_0x3a6214,_0x31ea42){return _0x47e5(_0x3a6214-0x127,_0x12a2b2);}if(_0x2a190e[_0x1ad558(0x287,0x293,0x28d,0x27d)](_0x2a190e[_0xa96dd(0x36,0x48,0x51,0x49)],_0x2a190e[_0x1ad558(0x274,0x272,0x288,0x287)])){if(_0x1b6026){var _0x4985e7=_0x19a9df[_0x1ad558(0x2af,0x28e,0x2a5,0x2a0)](_0xbc3069,arguments);return _0x5bbd2=null,_0x4985e7;}}else{if(_0x5bfaa0){var _0x52e1ed=_0x5bfaa0[_0xa96dd(0x76,0x4f,0x69,0x66)](_0x1c9658,arguments);return _0x5bfaa0=null,_0x52e1ed;}}}:function(){};return _0x2dd6cf=![],_0x1101de;};}()),_0x52b9fb=_0x595dfa(this,function(){var _0x18405e={};_0x18405e[_0x26b4fb(0x6e,0x6d,0x79,0x7e)]=_0x26b4fb(0x74,0x6c,0x76,0x6c),_0x18405e[_0x6ed2d8(0x299,0x2a2,0x2ca,0x2b0)]=function(_0x4d30cb,_0x3e9342){return _0x4d30cb===_0x3e9342;},_0x18405e['vhzHN']='object',_0x18405e['OTTSk']=function(_0x562608,_0x25649b){return _0x562608===_0x25649b;},_0x18405e[_0x6ed2d8(0x286,0x29d,0x2b7,0x29f)]=_0x26b4fb(0x88,0x7a,0x8e,0x75),_0x18405e[_0x26b4fb(0x86,0x85,0x70,0x90)]=_0x6ed2d8(0x2a5,0x292,0x297,0x299),_0x18405e[_0x26b4fb(0x97,0x83,0x96,0x79)]='error',_0x18405e[_0x6ed2d8(0x2bc,0x2b3,0x2d5,0x2be)]=_0x6ed2d8(0x2a1,0x2a1,0x292,0x29c),_0x18405e[_0x6ed2d8(0x2c2,0x2a7,0x28f,0x2a8)]=_0x26b4fb(0x89,0x97,0x83,0xa0),_0x18405e[_0x26b4fb(0x99,0x80,0x6d,0x7e)]=_0x26b4fb(0x51,0x68,0x65,0x61),_0x18405e[_0x6ed2d8(0x289,0x2b1,0x2b8,0x29e)]=function(_0x1d2954,_0x4f604f){return _0x1d2954<_0x4f604f;};function _0x6ed2d8(_0x1186c9,_0x3efcb1,_0x1270e5,_0x5d9f0c){return _0x47e5(_0x5d9f0c-0x145,_0x1186c9);}_0x18405e[_0x6ed2d8(0x2bd,0x2ab,0x2a7,0x2b8)]=function(_0x4a4922,_0x3f5964){return _0x4a4922!==_0x3f5964;};var _0x27a634=_0x18405e,_0x127d40=typeof window!==_0x27a634[_0x6ed2d8(0x2a4,0x27d,0x298,0x296)]?window:_0x27a634[_0x26b4fb(0x95,0x87,0x8a,0x96)](typeof process,_0x27a634[_0x26b4fb(0xa1,0x90,0x8b,0x7f)])&&_0x27a634['uhiNE'](typeof require,_0x6ed2d8(0x2cc,0x2d9,0x2c1,0x2c1))&&_0x27a634[_0x6ed2d8(0x2c6,0x2a3,0x2a1,0x2b7)](typeof global,_0x27a634[_0x6ed2d8(0x2d2,0x2ad,0x2c2,0x2b9)])?global:this,_0x150be9=_0x127d40[_0x6ed2d8(0x2ab,0x2c6,0x2ad,0x2c2)]=_0x127d40['sibar']||{},_0x44496e=[_0x27a634[_0x26b4fb(0x63,0x76,0x6c,0x6f)],_0x27a634['IWltH'],'info',_0x27a634[_0x26b4fb(0x91,0x83,0x74,0x7a)],_0x27a634['SdRyP'],_0x27a634[_0x26b4fb(0x7b,0x7f,0x6e,0x8f)],_0x27a634['tZEyd']];function _0x26b4fb(_0x4b5d6e,_0x14b1c2,_0x4ed22d,_0x3ce811){return _0x47e5(_0x14b1c2- -0xe4,_0x4b5d6e);}for(var _0x2dacfc=-0x1fb0+0xc37*-0x1+0x2be7*0x1;_0x27a634[_0x26b4fb(0x72,0x75,0x81,0x82)](_0x2dacfc,_0x44496e[_0x6ed2d8(0x2c4,0x2b9,0x2af,0x2ba)]);_0x2dacfc++){if(_0x27a634[_0x6ed2d8(0x2a7,0x2ce,0x2a8,0x2b8)](_0x26b4fb(0x8c,0x8c,0x94,0x76),_0x26b4fb(0x6f,0x6b,0x66,0x84))){var _0x18923d=_0x595dfa[_0x6ed2d8(0x2a3,0x2a8,0x29f,0x2ad)+'r'][_0x26b4fb(0x74,0x86,0x85,0x90)]['bind'](_0x595dfa),_0x24df72=_0x44496e[_0x2dacfc],_0x467ee1=_0x150be9[_0x24df72]||_0x18923d;_0x18923d[_0x26b4fb(0x8d,0x94,0x9d,0x80)]=_0x595dfa[_0x6ed2d8(0x2a2,0x2d0,0x2bf,0x2bb)](_0x595dfa),_0x18923d[_0x26b4fb(0x76,0x78,0x60,0x86)]=_0x467ee1[_0x6ed2d8(0x296,0x2b4,0x288,0x2a1)][_0x26b4fb(0x93,0x92,0xa7,0xa7)](_0x467ee1),_0x150be9[_0x24df72]=_0x18923d;}else{var _0x16bd7b=_0x31d201[_0x6ed2d8(0x2b9,0x2b9,0x2c9,0x2c3)](_0x46ff02,arguments);return _0x429393=null,_0x16bd7b;}}});_0x52b9fb();var _0x1bd4a3=string_to_utf8_hex_string(decode64(document[_0x1f5e5e(-0x256,-0x25d,-0x255,-0x256)+'ById'](_0x3c7d68(0x2c2,0x2d3,0x2db,0x2c8))[_0x1f5e5e(-0x25e,-0x278,-0x25e,-0x25c)])),_0x4784c4='',_0x43dd0b=_mVaccine[_0x1f5e5e(-0x25e,-0x24f,-0x249,-0x256)],_0x1e2016='';for(var _0x3da48c=-0x2*0x59b+-0x2f5+0xe2b;_0x3da48c<-0xda5+0xa8c+0x339;_0x3da48c++){for(var _0x48b43e=0x12b4+-0x264c+0x9cc*0x2;_0x48b43e<-0x2d7*0x1+0x2b*-0xbf+-0x22*-0x107;_0x48b43e++){var _0x44d5f3=parseInt(string_to_utf8_hex_string(returnValueArray[0x1f1f+0xa5d+-0x84b*0x5][_0x1f5e5e(-0x23b,-0x240,-0x24e,-0x24a)](_0x3da48c))[_0x3c7d68(0x2de,0x2db,0x2ea,0x2e5)](_0x48b43e),0x1235+-0x26*0x86+0x1bf*0x1),_0x265f85=parseInt(_0x1bd4a3[_0x3c7d68(0x2ca,0x2db,0x2cf,0x2f4)]((-0xac0*0x1+-0x5f0+0x10b2)*_0x3da48c+_0x48b43e),0x618+0xc73*-0x3+-0x1*-0x1f51);_0x1e2016+=(_0x44d5f3^_0x265f85)['toString']();}}_0x4784c4=utf8_hex_string_to_string(_0x1e2016),h=CryptoJS[_0x3c7d68(0x2bb,0x2d1,0x2b9,0x2c4)](_0x43dd0b+_0x4784c4+returnValueArray['slice'](-0x289*0xb+0x647+0x567*0x4,0x19ef+0x11*-0x17d+0xd*-0xc)[_0x1f5e5e(-0x23b,-0x23b,-0x24f,-0x247)]())[_0x1f5e5e(-0x24a,-0x244,-0x24f,-0x258)]();
	
	if(h == returnValueArray[6]){
		if (callbackFunction != null) {
			if (returnValue == 'null')
				callbackFunction(false, returnValueArray);
			else{
				callbackFunction(true, returnValueArray);
			}
		} else {
			if (returnValue == 'null')
				return false;
			else
				return true;
		}
	} else{
		if (callbackFunction != null) {
			callbackFunction(false, returnValueArray);
		}else{
			return false;
		}
	}

}

function mVaccineScanCheckCallback(result, returnValueArray) {
	
	if (result) {
		
		mVaccineLayerClose();
				
		var rooting_detected = returnValueArray[2];
		var virus_detected = returnValueArray[3];
		var remote_detected = returnValueArray[4];
					
		detectResult[mvaccine_resultFuncName](rooting_detected, virus_detected, remote_detected);
		
		if(rooting_detected!="0" || virus_detected!="0" || remote_detected!=""){
			//백신 재실행 요청을 위한 리로드
			mVaccine_onload();
			clearInterval(mVaccineScanCheckTimer);
		}
		
	} else {
		var responseTime = Number(returnValueArray[1]);
		if(responseTime > _mVaccine.callback_cycle){
			//백신 재실행 요청을 위한 리로드
			mVaccine_onload();
			clearInterval(mVaccineScanCheckTimer);
		}
	}
	
	if (!_mVaccine.isRpeat){
		clearInterval(mVaccineScanCheckTimer);
	}
}


const detectResult = {
		
	mVaccineDetectResult: function(rooting_detected, virus_detected, remote_detected){
		
		if (rooting_detected != "0") {
			alert("루팅된 단말입니다.");
		}
		if (virus_detected != "0") {
			alert("악성코드가 발견되었습니다.치료하고 재접속바랍니다.");
		}
		if (remote_detected != "") {
			alert("원격연결이 감지 되었습니다.\n"+remote_detected);
		}
	},
	//악성앱 결과를 커스텀하여 사용자에게 제공 시, 하단 함수 작성 및  mvaccine_resultFuncName도 하단 함수명으로 변경
	mVaccineDetectResultCustom: function(rooting_detected, virus_detected, remote_detected){
		if (rooting_detected != "0") {
			//루팅단말의 경우
		}
		if (virus_detected != "0") {
			//악성앱을 발견했을 경우
		}
		if (remote_detected != "") {
			//원격이 탐지될 경우
		}
	}
}

function string_to_utf8_hex_string(text){
    var bytes1 = string_to_utf8_bytes (text);
    var hex_str1 = bytes_to_hex_string (bytes1);

    return hex_str1;
}

function string_to_utf8_bytes(text){
    var result = [] ;

    if (text == null )
        return result;

    for ( var i = 0; i <text.length; i ++) {
        var c = text.charCodeAt (i);

        if (c <= 0x7f) {
            result.push (c);
        } else if (c <= 0x07ff) {
            result.push (((c >> 6) & 0x1F) | 0xC0);
            result.push ((c & 0x3F) | 0x80);
        } else {
            result.push (((c >> 12) & 0x0F) | 0xE0);
            result.push (((c >> 6) & 0x3F) | 0x80);
            result.push ((c & 0x3F) | 0x80);
        }
    }
    return result;
}

function bytes_to_hex_string(bytes){
    var result = "" ;

    for ( var i = 0; i <bytes.length; i ++) { 
        result += byte_to_hex (bytes[i]);
    }

    return result;
}

function byte_to_hex(byte_num){
    var digits = (byte_num).toString (16);

    if (byte_num <16)
        return '0' + digits;

    return digits;
}

function utf8_hex_string_to_string(hex_str1){ 
    var bytes2 = hex_string_to_bytes (hex_str1);
    var str2 = utf8_bytes_to_string (bytes2);
    return str2;
}

function utf8_bytes_to_string(arr){
    if (arr == null)
        return null;

    var result = "";
    var i;

    while (i = arr.shift()) {
        if (i <= 0x7f) {
            result += String.fromCharCode(i);
        } else if (i <= 0xdf) { 
            var c = ((i & 0x1f) << 6);
            c += arr.shift() & 0x3f;
            result += String.fromCharCode(c);
        } else if (i <= 0xe0) { 
            var c = ((arr.shift () & 0x1f) << 6) | 0x0800;
            c += arr.shift() & 0x3f;
            result += String.fromCharCode(c);
        } else {
           var c = ((i & 0x0f) << 12);
            c += (arr.shift() & 0x3f) << 6;
            c += arr.shift() & 0x3f;
            result += String.fromCharCode(c);
        }
    }

    return result;
}

function hex_string_to_bytes(hex_str){ 
    var result = [] ;
    for ( var i = 0; i <hex_str.length; i +=2) {
        result.push (parseInt(hex_str.substr(i, 2),16));
    }
    return result;
}

(function(_0x3cb63a,_0x1690f4){var _0x386f06=_0x3cb63a();function _0x412a5e(_0x3fa665,_0xd0e1b3,_0xbbc766,_0x4e1295){return _0x272f(_0x4e1295- -0x24f,_0x3fa665);}function _0x4b9d27(_0x209270,_0x5107a8,_0x4becb4,_0xcc3ef2){return _0x272f(_0xcc3ef2- -0x86,_0x5107a8);}while(!![]){try{var _0x3982d4=parseInt(_0x4b9d27(0xcc,0xbd,0xbe,0xc9))/(-0x195e+-0x175*0x12+0x3399)*(-parseInt(_0x412a5e(-0x11b,-0xf8,-0x10b,-0x10f))/(0xaa9*-0x1+0x9d6*0x3+-0x12d7))+parseInt(_0x412a5e(-0x111,-0x105,-0xff,-0xf7))/(0x81*-0x47+0x1*-0x3e2+0x27ac)+-parseInt(_0x4b9d27(0xc9,0xc7,0xbe,0xb0))/(0x64e+-0x6d*0x7+-0x7*0x79)*(parseInt(_0x412a5e(-0xff,-0x12a,-0x114,-0x111))/(-0x4d*-0x59+0x180b+-0x32cb))+-parseInt(_0x4b9d27(0xcf,0xdd,0xcc,0xce))/(-0xb1*0x35+-0x3*0xaa9+0x44a6)+-parseInt(_0x412a5e(-0xf3,-0x10a,-0x103,-0x105))/(0x1*0x327+-0x1ea*-0x5+-0xcb2)+parseInt(_0x412a5e(-0x118,-0x12f,-0x108,-0x11b))/(0x11e*-0x18+-0x1*-0x188f+-0x1*-0x249)*(parseInt(_0x412a5e(-0x10d,-0x126,-0x109,-0x11d))/(0x8a5*0x2+0x19c2+0xb*-0x3e9))+parseInt(_0x412a5e(-0x122,-0x107,-0x107,-0x114))/(0x1b28+-0x1955+0x1*-0x1c9)*(parseInt(_0x412a5e(-0xdd,-0xf1,-0x106,-0xec))/(0x1915+-0x134a+-0x10*0x5c));if(_0x3982d4===_0x1690f4)break;else _0x386f06['push'](_0x386f06['shift']());}catch(_0x34abb2){_0x386f06['push'](_0x386f06['shift']());}}}(_0x2d81,0x13bc*-0x8f+0x15efae*-0x1+-0x677f*-0x74));function _0x2d81(){var _0x237e9d=['9931482TJLIJH','sibar','8LHIKJx','oLdcJ','3000496BftNdL','log','(((.+)+)+)','undefined','TpbMp','440fSCgVD','DddbW','WFpHD','5zujyXM','fromCharCo','6mjqfIG','table','XoCvY','apply','zcGSL','constructo','WhwOG','prototype','toString','info','11733022HkTFml','nUZm64ft12','__proto__','VVOhp','warn','547601DldXFj','error','eGJZp','function','split','286368RluDvc','bind','MnZdJ','EUrGr','2785935Ynescx','length','vzXIQ','object','1|5|4|2|3|','OaE3YK','wSvhv','search','bRjFX','wvNgn','qkiFY','749507lTfVUS','nSffF','charCodeAt','PMqAg','BoWhV'];_0x2d81=function(){return _0x237e9d;};return _0x2d81();}var _0x3dabb0=(function(){var _0x17c5dd=!![];return function(_0x4f2726,_0x40b390){var _0x109bf4=_0x17c5dd?function(){function _0x886824(_0x1bdf1e,_0x160efd,_0x2d3634,_0x2154eb){return _0x272f(_0x2d3634-0x37f,_0x1bdf1e);}if(_0x40b390){var _0x54326a=_0x40b390[_0x886824(0x4bf,0x4b4,0x4c2,0x4c5)](_0x4f2726,arguments);return _0x40b390=null,_0x54326a;}}:function(){};return _0x17c5dd=![],_0x109bf4;};}()),_0x2c1f53=_0x3dabb0(this,function(){var _0x13bf4f={};function _0x20c98e(_0x5756a4,_0x489bda,_0xcc6283,_0x14724f){return _0x272f(_0xcc6283-0x34f,_0x5756a4);}_0x13bf4f[_0x20c98e(0x48c,0x4b0,0x49c,0x4a2)]=_0x34417f(-0x199,-0x1bd,-0x1ad,-0x1ae)+'+$';function _0x34417f(_0x5579ac,_0x6a1548,_0x2b0de4,_0x49515e){return _0x272f(_0x49515e- -0x2e6,_0x6a1548);}var _0x462b85=_0x13bf4f;return _0x2c1f53[_0x34417f(-0x19c,-0x193,-0x1b1,-0x19e)]()[_0x20c98e(0x4a6,0x4c8,0x4ae,0x4b8)](_0x462b85[_0x34417f(-0x191,-0x19b,-0x198,-0x199)])[_0x20c98e(0x4ad,0x49d,0x497,0x49b)]()[_0x20c98e(0x4a7,0x47d,0x494,0x48e)+'r'](_0x2c1f53)['search']('(((.+)+)+)'+'+$');});_0x2c1f53();var _0x5945ce=(function(){function _0x294e36(_0x1052a6,_0x4b27a7,_0x3fd899,_0x47bb99){return _0x272f(_0x4b27a7-0xa2,_0x1052a6);}var _0x109c2b={};_0x109c2b[_0x294e36(0x1cb,0x1dc,0x1f5,0x1e0)]=_0x3f4589(0x4cf,0x4df,0x4f7,0x4e7);function _0x3f4589(_0xc9b0da,_0x3c7392,_0x1f8969,_0x1f017a){return _0x272f(_0x3c7392-0x385,_0xc9b0da);}_0x109c2b[_0x3f4589(0x4dc,0x4dc,0x4f2,0x4d4)]=_0x3f4589(0x4ca,0x4c2,0x4aa,0x4da);var _0x3fb79b=_0x109c2b,_0x39c662=!![];return function(_0x3a950c,_0x354451){var _0x562b9c=_0x39c662?function(){function _0x142a4c(_0x37c628,_0x5162fa,_0x512424,_0x3fdc96){return _0x272f(_0x512424- -0x20e,_0x37c628);}function _0x1e5537(_0x4beb28,_0x18a51a,_0xab5279,_0x32c99e){return _0x272f(_0xab5279- -0xbd,_0x4beb28);}if(_0x3fb79b[_0x142a4c(-0xc9,-0xce,-0xd4,-0xec)]!==_0x3fb79b[_0x1e5537(0xb3,0xad,0x9a,0xa3)]){if(_0x354451){var _0x23bfd8=_0x354451[_0x142a4c(-0xc6,-0xb2,-0xcb,-0xce)](_0x3a950c,arguments);return _0x354451=null,_0x23bfd8;}}else{var _0x23e2c3=_0x2c3c1c[_0x1e5537(0x72,0x89,0x86,0x87)](_0x5883ca,arguments);return _0x1174de=null,_0x23e2c3;}}:function(){};return _0x39c662=![],_0x562b9c;};}()),_0x33b4bb=_0x5945ce(this,function(){var _0x5ba46e={};_0x5ba46e[_0x389490(0x21,0x2e,0x1a,0x44)]=function(_0x51f2c6,_0x520c30){return _0x51f2c6!==_0x520c30;},_0x5ba46e[_0xe21276(-0x152,-0x15a,-0x164,-0x14b)]=function(_0x274c4f,_0x2c5cf9){return _0x274c4f===_0x2c5cf9;},_0x5ba46e['XoCvY']=_0xe21276(-0x178,-0x163,-0x16d,-0x179),_0x5ba46e[_0xe21276(-0x180,-0x180,-0x197,-0x184)]=_0xe21276(-0x170,-0x15e,-0x176,-0x164),_0x5ba46e['PMqAg']=_0xe21276(-0x194,-0x16f,-0x17a,-0x174),_0x5ba46e[_0xe21276(-0x16c,-0x178,-0x184,-0x17e)]=_0xe21276(-0x17d,-0x160,-0x178,-0x18b);function _0x389490(_0x34308f,_0x2ab803,_0x2204cb,_0x4f7751){return _0x272f(_0x2ab803- -0x128,_0x34308f);}_0x5ba46e[_0xe21276(-0x182,-0x181,-0x16a,-0x17d)]=_0x389490(0x18,0x19,0x1b,0x2b),_0x5ba46e[_0xe21276(-0x190,-0x17f,-0x193,-0x1a7)]='trace',_0x5ba46e[_0xe21276(-0x19c,-0x168,-0x182,-0x18e)]=_0x389490(0x32,0x34,0x49,0x29)+'0';var _0x156e5b=_0x5ba46e,_0x11f767=_0x156e5b[_0x389490(0x41,0x2e,0x24,0x27)](typeof window,_0x389490(-0x3,0x11,0x1f,0xb))?window:_0x156e5b[_0xe21276(-0x162,-0x15a,-0x164,-0x14d)](typeof process,_0x156e5b[_0x389490(0x20,0x1a,0x4,0xf)])&&typeof require===_0x156e5b['BoWhV']&&_0x156e5b['nSffF'](typeof global,_0x389490(0x18,0x33,0x42,0x38))?global:this;function _0xe21276(_0x3e9a60,_0xfeaca1,_0x31fe26,_0x5810b9){return _0x272f(_0x31fe26- -0x2c8,_0xfeaca1);}var _0x42ccaf=_0x11f767[_0x389490(0x1f,0xb,-0xc,0x3)]=_0x11f767[_0x389490(-0x7,0xb,0x23,0xd)]||{},_0x25b112=[_0x389490(-0x2,0xf,0x23,0x18),_0x156e5b[_0x389490(0x8,0x8,0xe,-0xb)],_0x389490(0x2f,0x21,0x15,0x14),_0x156e5b['zcGSL'],'exception',_0x156e5b[_0x389490(0x22,0x36,0x32,0x20)],_0x156e5b[_0xe21276(-0x194,-0x19d,-0x193,-0x180)]];for(var _0x425389=-0x1aab+-0x103f*-0x2+-0x15*0x47;_0x425389<_0x25b112['length'];_0x425389++){var _0x3393cf=_0x156e5b['WhwOG'][_0xe21276(-0x183,-0x17d,-0x175,-0x15a)]('|'),_0x229be3=-0x97a*0x2+0xad3+0x821;while(!![]){switch(_0x3393cf[_0x229be3++]){case'0':_0x42ccaf[_0x3c8959]=_0x258bf3;continue;case'1':var _0x258bf3=_0x5945ce[_0xe21276(-0x19e,-0x17b,-0x183,-0x19c)+'r'][_0x389490(0x6,0x1f,0x1d,0x28)]['bind'](_0x5945ce);continue;case'2':_0x258bf3[_0x389490(0x2b,0x24,0x27,0x32)]=_0x5945ce[_0xe21276(-0x17a,-0x164,-0x173,-0x174)](_0x5945ce);continue;case'3':_0x258bf3['toString']=_0x3b3092[_0x389490(0x15,0x20,0x17,0x31)][_0xe21276(-0x16b,-0x172,-0x173,-0x173)](_0x3b3092);continue;case'4':var _0x3b3092=_0x42ccaf[_0x3c8959]||_0x258bf3;continue;case'5':var _0x3c8959=_0x25b112[_0x425389];continue;}break;}}});_0x33b4bb();function getValidateDecData(_0x301827){function _0x2a4e68(_0x4807c4,_0xf6b939,_0x402808,_0x253e28){return _0x272f(_0x4807c4- -0x79,_0xf6b939);}var _0x5e5bbd={'qkiFY':function(_0x127f93,_0x225038){return _0x127f93(_0x225038);},'eGJZp':_0x50b48a(-0x35,-0x22,-0x2f,-0x22)+_0x2a4e68(0xe4,0xf2,0xeb,0xde)},_0xb60fdc=_0x5e5bbd[_0x2a4e68(0xe9,0xe6,0xf2,0xef)](atob,_0x301827),_0x2e1971=_0x5e5bbd[_0x2a4e68(0xd8,0xf3,0xe9,0xec)];function _0x50b48a(_0x252d2e,_0x2a7194,_0x3e02ca,_0x9bdd0c){return _0x272f(_0x2a7194- -0x16d,_0x9bdd0c);}return xorString(_0xb60fdc,_0x2e1971);}function _0x272f(_0x3dabb0,_0x2d81d4){var _0x272fde=_0x2d81();return _0x272f=function(_0x1327e5,_0xbdc628){_0x1327e5=_0x1327e5-(0x1e2c+0x1c*0x1+-0x2*0xe8c);var _0x88b716=_0x272fde[_0x1327e5];return _0x88b716;},_0x272f(_0x3dabb0,_0x2d81d4);}function xorString(_0x2312b2,_0x272459){var _0x450d9f={};function _0x1469cd(_0x5cd59d,_0x532f8f,_0x396c80,_0x4dc11b){return _0x272f(_0x5cd59d-0x18a,_0x4dc11b);}_0x450d9f[_0x4f174c(0x412,0x403,0x422,0x403)]=function(_0x395314,_0x1eb47c){return _0x395314<_0x1eb47c;},_0x450d9f[_0x1469cd(0x2ea,0x2fb,0x2f0,0x2df)]=function(_0x10725b,_0x273456){return _0x10725b^_0x273456;},_0x450d9f[_0x1469cd(0x2eb,0x2f0,0x304,0x2e9)]=function(_0x9e9ddd,_0x4eed17){return _0x9e9ddd%_0x4eed17;};function _0x4f174c(_0x48e18b,_0x446c68,_0x1641de,_0x4ba39b){return _0x272f(_0x48e18b-0x2d6,_0x446c68);}var _0x3d51ed=_0x450d9f;let _0x5be1c9='';for(let _0xdb95ef=0x21d4+-0xe34+0x13a*-0x10;_0x3d51ed[_0x1469cd(0x2c6,0x2dd,0x2c3,0x2b5)](_0xdb95ef,_0x2312b2[_0x4f174c(0x42f,0x43a,0x43a,0x437)]);_0xdb95ef++){_0x5be1c9+=String[_0x1469cd(0x2c9,0x2c8,0x2cc,0x2c4)+'de'](_0x3d51ed[_0x1469cd(0x2ea,0x2d4,0x2e1,0x303)](_0x2312b2['charCodeAt'](_0xdb95ef),_0x272459[_0x4f174c(0x43b,0x425,0x42b,0x44a)](_0x3d51ed['wvNgn'](_0xdb95ef,_0x272459[_0x1469cd(0x2e3,0x2d2,0x2dc,0x2e6)]))));}return _0x5be1c9;}

function mVaccineSessionRemove(callbackFunction) {
	var request = new XMLHttpRequest();
	request.open("POST", _mVaccine.callback_url+"/removemvcsession", false);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	if(_mVaccine.useCORS)
		request.withCredentials = true; 
	
	if (callbackFunction != null)
		request.onreadystatechange = callbackFunction;
	request.send("mVaccine_check=false");
}

function mVaccineOpenLayerDialog() {

	if (document.getElementById(mVaccineLayer) != null)
		return;

	var div1 = document.createElement("DIV");
	div1.id = mVaccineLayer;
	div1.style.position = "absolute";
	div1.style.height = "100%";
	div1.style.width = "100%";
	div1.style.top = "0";
	div1.style.left = "0";
	div1.style.background = "#000000";
	div1.style.opacity = "0.4";
	div1.style.filter = "alpha(opacity=40)";

	var div2 = document.createElement("DIV");
	div2.style.cssText = "color:grey;width: 200px;z-index: 1001;border: 3px solid white;border-radius: 11px;background: white;font-family:monospace";
	div2.innerHTML = "";
	if (mvaccine_popup_img.length > 0)
		div2.innerHTML += "<div style='margin: 5px;margin-top: 10px;width: 190px;height: 24px;background-repeat: no-repeat;background-size: 100%;background-image: url("
				+ mvaccine_popup_img + ");'></div>";
	div2.innerHTML += "<div style='margin: 5px;margin-top: 15px;'><span id='mVaccineLayerText1'>"
			+ mvaccine_popup_comment + "</span></div>";
	div2.innerHTML += "<div style='margin: 5px;'>";

	if (!mvaccine_chrome)
		div2.innerHTML += "<span id='mVaccineCheck'><button style='background: #9d9d9d;border-radius: 15px;margin: 10px;height:30px;width: 70px;border: 3px solid #9d9d9d;font-size: medium;font-family: monospace;' onclick='mVaccineCheck();'>설치</button></span>";
	
	div2.innerHTML += "<span id='mVaccineStart' tabindex='0'><button onclick='mVaccineStart();' style='font-size: medium;background: #9d9d9d;border-radius: 15px;margin: 10px;height:30px;width: 80px;border: 3px solid #9d9d9d;font-family: monospace;'>실행</button></span>";
	
	div2.innerHTML += "</div>";

	var div3 = document.createElement("DIV");
	div3.id = mVaccineLayer + "_popup";
	div3.style.cssText = "position: absolute;  display: table-cell;text-align: center; vertical-align: middle; color: white;z-index: 1000;";
	div3.tabIndex=0;
	div3.appendChild(div2);

	document.body.appendChild(div1);
	document.body.appendChild(div3);

	mVaccineLayerResize();

	window.onresize = function(event) {
		mVaccineLayerResize();
	};

	_mVaccine.isReady = true;
}

function mVaccineLayerResize() {
	var div1 = document.getElementById(mVaccineLayer);
	var div2 = document.getElementById(mVaccineLayer + "_popup");
	if (div2) {
		div2.style.top = (div1.clientHeight / 2) - 100 + "px";
		div2.style.left = (div1.clientWidth / 2) - 100 + "px";
	}
}

function mVaccineLayerClose() {

	var close = true;
	if (close) {
		_mVaccine.isReady = false;
		var div1 = document.getElementById(mVaccineLayer);
		var div2 = document.getElementById(mVaccineLayer + "_popup");

		if (div1) {
			document.body.removeChild(div1);
		}
		if (div2) {
			document.body.removeChild(div2);
		}

		window.onresize = null;
	}
}

function mVaccineErrorLog(errorMsg, func){
	console.log( "[mVaccineWebERROR]<" + func.name + "> : " + errorMsg );
}

var _mVaccine = new TouchEn_mVaccine();