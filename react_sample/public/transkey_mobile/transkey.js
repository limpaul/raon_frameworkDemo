/*
 * mTranskey
 * (C) 2013. RAONSECURE,Inc. All rights reserved.
 * Version 4.6.15.6
 * 2025-12-18
 */


var _loadScript = 0;
var _initTryCount = 0;
function addScript(src, param) {
	var exist = document.querySelector('script[src*="'+src+'"]');
	if(exist != undefined) {
		return;
	}
	
	if(param == undefined) {
		param = "";
	}
	
	var script = document.createElement("script");
    script.src = src + param;
    script.type = "text/javascript";
    script.onload = function() {
    	_loadScript++;
    }
    document.head.appendChild(script);
}

addScript(transkey_url+'/TranskeyLibPack_op.js');
addScript(transkey_url+'/rsa_oaep_files/rsa_oaep-min.js');
if(useSha2) {
	addScript(transkey_url+'/jsbn/jsbn-sha2-min.js');
} else {
	addScript(transkey_url+'/jsbn/jsbn-min.js');
}
addScript(transkey_url+'/typedarray.js')
if(transkey_apiuse){
	addScript(transkey_apiurl+'service/token?', new Date().getTime()+tk_origin);
	addScript(transkey_apiurl+'service/inittime?', tk_origin);
	addScript(transkey_apiurl+'service/getkeyboardhash?', tk_origin);
}else{
	addScript(transkey_surl+'?op=getToken&', new Date().getTime()+tk_origin);
	addScript(transkey_surl+'?op=getInitTime', tk_origin);
	addScript(transkey_surl+'?op=getKeyboardHash', tk_origin);
}

var transkey=[];

var mtk=null;

var tk_btn_arr=[];

var reset_count=0;

var patternCount = 0;

var moved;

function moveListener(event) {
    moved = true;
}

function downListener (nsEvent) {
    moved = false;
}
function upListener(event) {
    if (!moved)
    	checkTransKey(event);
}

function initmTranskey(){
	if(_loadScript<7) {
		_initTryCount++;
		
		if(_initTryCount > 20) {
			tk_alert('스크립트 로딩에 실패했습니다.');
			return;
		}
		
		setTimeout(initmTranskey, 50);
		return;
	}
	
	setMaxDigits(131);
	
	checkCookie();
	
	if(mtk!=null) {
		var inputs = document.getElementsByTagName("input");
		for(var i = 0; i < inputs.length; i++){
			var input = inputs.item(i);
			if(input.getAttribute("data-tk-kbdType")!=null&&transkey[input.id]!=null){
				mtk.remove(inputs.item(i));
			}
		}
		mtk=null;
	}
	
	if(mtk==null){
		transkey.objs= new Array();
		mtk = new mTranskey();		
		if(transkey_apiuse){
			mtk.getPublicKey(transkey_apiurl);
		}
		else{
			mtk.getPublicKey(transkey_surl);
		}
		
		if(useCheckTranskey){
			if(page_isDraggable) {
				var clickEvent, moveEvent, releaseEvent;
				
				if(mtk.isiPhone||mtk.isiPad) {
					clickEvent = "touchstart";
					moveEvent = "touchmove";
					releaseEvent = "touchend";
				} else {
					clickEvent = "mousedown";
					moveEvent = "mousemove";
					releaseEvent = "mouseup";
				}
				
				if (document.addEventListener) {
					document.addEventListener(clickEvent, downListener, false);
					document.addEventListener(moveEvent, moveListener, false);
					document.addEventListener(releaseEvent, upListener, false);
				} else {
					document.attachEvent("on"+clickEvent, downListener);
					document.attachEvent("on"+moveEvent, moveListener);
					document.attachEvent("on"+releaseEvent, upListener);
				}
			} else {
				if(mtk.isiPhone||mtk.isiPad||mtk.isAndroid) {
					if (document.addEventListener) {
					    document.addEventListener("touchstart", checkTransKey, false);
					} else if (document.attachEvent) {
					    document.attachEvent("ontouchstart", checkTransKey);
					}
				} else {				
					if (document.addEventListener) {
					    document.addEventListener("mousedown", checkTransKey, false);
					} else if (document.attachEvent) {
					    document.attachEvent("onmousedown", checkTransKey);
					}
				}
			}
		}

		
		if(window.addEventListener){
			window.addEventListener("resize", mtk.reSizeListener, false);
		}else{
			window.attachEvent("onresize", mtk.reSizeListener);
		}
	}
	
	return true;
}

function initCallback() {
	
}

if (typeof XMLHttpRequest == "undefined") {
	XMLHttpRequest = function() {
    	try { 
    		return new ActiveXObject("Msxml2.XMLHTTP.6.0"); 
		} catch(e) {
			console.log("[mTranskey Error] : Msxml2.XMLHTTP.6.0 init fail");
		};
		
    	try { 
    		return new ActiveXObject("Msxml2.XMLHTTP.3.0"); 
		} catch(e) {
			console.log("[mTranskey Error] : Msxml2.XMLHTTP.3.0 init fail");
		};
		
    	try { 
    		return new ActiveXObject("Msxml2.XMLHTTP"); 
		} catch(e) {
			console.log("[mTranskey Error] : Msxml2.XMLHTTP init fail");
		};
		
    	try { 
    		return new ActiveXObject("Microsoft.XMLHTTP"); 
		}  catch(e) {
			console.log("[mTranskey Error] : Microsoft.XMLHTTP init fail");
		};
 
    	throw new Error("This browser does not support XMLHttpRequest or XMLHTTP.");
	};
};

function mTranskeyObj(inputObj, width, div, keyType, keyboardType, dataType){
	this.ele=null;
	this.allocate=false;
	this.relocate=false;
	this.id=inputObj.id;
	this.keyboardType=keyboardType+"Mobile";
	this.width=width;
	this.height=0;
	this.div=div;
	this.numberDiv=div.children["mtk_"+this.id+"_number"];
	this.lowerDiv=div.children["mtk_"+this.id+"_lower"];
	this.upperDiv=div.children["mtk_"+this.id+"_upper"];
	this.specialDiv=div.children["mtk_"+this.id+"_special"];
	this.keyTypeIndex=""; // "l ","u ","s ",""
	this.useUpper=false;
	this.useLower=false;
	this.useCaps=false;
	this.useSpecial=false;
	this.keyType=keyType;
	this.cap=false;
	this.special=false;
	this.useTranskey=mtk_useTranskey;
	this.useButton=false;
	this.button=null;
	this.inputObj=inputObj;
	this.frmId="";
	if(use_form_id)
		this.frmId = "_"+inputObj.form.id;
	this.hidden=document.getElementById("transkey_"+inputObj.id+this.frmId);
	this.hmac=document.getElementById("transkey_HM_"+inputObj.id+this.frmId);
	this.ExE2E=document.getElementById("transkey_ExE2E_"+inputObj.id+this.frmId);
	this.exE2E=inputObj.getAttribute("data-tk-ExE2E")==null?"false":inputObj.getAttribute("data-tk-ExE2E");
	this.parentKeyboard=inputObj.getAttribute("data-tk-parentKbd")==null?"false":inputObj.getAttribute("data-tk-parentKbd");
	this.fieldType=inputObj.type;
	this.bgImgChecked=false;
	this.imgWidth="";
	this.talkBack=useTalkBack;
	this.dki=new Array();
	this.keyboard = inputObj.getAttribute("data-tk-keyboard");
	this.allocationIndex = new GenKey().tk_getrnd_int();
	this.nextFocus=null;
	this.useInput=false;
	this.useInputDiv=null;
	this.tk_Special_Mask_StartPos = inputObj.getAttribute("data-tk_hkStart_pos");
	this.tk_Special_Mask_EndPos = inputObj.getAttribute("data-tk_hkEnd_pos");
	this.tk_Special_Mask = inputObj.getAttribute("data-tk_hk_mask")==null?"*":inputObj.getAttribute("data-tk_hk_mask");
	this.tk_onKeyFlag = false; 
	if(inputObj.getAttribute("data-tk-nextFocusId")!=null)
		this.nextFocus = inputObj.getAttribute("data-tk-nextFocusId");
	if(this.keyboard==null)
		this.keyboard = this.keyboardType;
	if(!useSession) {
		this.keyIndex = document.getElementById("keyIndex_"+inputObj.id+this.frmId).value;
		document.getElementById("keyboardType_"+inputObj.id+this.frmId).value = this.keyboardType;
		document.getElementById("fieldType_"+inputObj.id+this.frmId).value = this.fieldType;
	}
	this.isdrawing = false;
	this.gridsize = false;
	this.buttons = [];
	this.lines = [];
	
	var self = this;
	
	this.initKeyType = function(){
		this.cap=false;
		this.special=false;
	};
	
	this.allocationCallback = function(){
		if (this.readyState == 4 && this.status == 200) {
			if(this.responseText.indexOf("SessionError")>-1){
				var errCodes = this.responseText.split("=");
				if(errCodes[1]=="1"){
					if(reset_count>2){
						return false;
					}
					tk_alert("세션이 만료되었습니다.");
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						self.getInitTime();
					reset_count++;
					self.allocation();
				}
			}else{
				if(useSession) {
					if(useSession) {
						 self.setKeyType(self.keyType);
						 if(transkey_divType==0)
							 self.setUrl();
					 } else {
						 self.setKeyIndex(self.inputObj);
		 			}
				} else {
					self.setKeyIndex(inputObj);
				}
				reset_count = 0;
			}

		}
	};
	
	
	this.allocation = function(){
		
		if(onKeyboard_allocate||!self.allocate) {
			self.allocate=false;
			self.allocationIndex = new GenKey().tk_getrnd_int();
		}
		
		var request = new XMLHttpRequest();
		
		if(transkey_apiuse){
			request.open("GET", getUrlRestApi("service/allocation", this, this.keyType, this.allocationIndex)+"&talkBack="+this.talkBack+tk_origin, useAsyncTranskey);
		} else{
			request.open("POST", transkey_surl, useAsyncTranskey);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
		if(useCORS)
			request.withCredentials = true; 
		request.onreadystatechange = this.allocationCallback;
		try {
			if(transkey_apiuse){
				request.send();
			}else{
				request.send(getUrlPost("allocation", this, this.keyType, this.allocationIndex)+"&talkBack="+this.talkBack+tk_origin);
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	};
	
	this.setUrl = function(){
		
		var url = null;
		
		if(this.keyboardType=="patternMobile")
			return;
		
		if(transkey_divType==0){
			if(this.keyboardType=="numberMobile"){
				var numberImg = new Image();
				numberImg.onload = function(){
					self.allocate=true;
					self.tk_onKeyFlag = false;
					if(useTalkBack)
						self.getDummy();
				};
				numberImg.onerror = function(){
					self.tk_onKeyFlag = false;
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						self.getInitTime();
//					self.allocation();
					if(useSession)
						self.setUrl();
					else
						self.setKeyIndex(self.inputObj);
				};
				if(transkey_apiuse){
					numberImg.src = getUrlRestApi("service/key", self, "single", self.allocationIndex)+"&talkBack="+self.talkBack+tk_origin;
				}
				else{
					numberImg.src = getUrl("getKey", self, "single", self.allocationIndex)+"&talkBack="+self.talkBack+tk_origin;
				}
				this.numberDiv.style.backgroundImage="url('"+checkTag(numberImg.src)+"')";
				this.numberDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+numberImg.src+"', sizingMethod='scale')";
			}else{
				var quertyImg = new Image();
				quertyImg.onload = function(){
					self.allocate=true;
					self.tk_onKeyFlag = false;
					if(transkey_apiuse){
						url = getUrlRestApi("service/key", self, "upper", self.allocationIndex)+"&talkBack="+self.talkBack+tk_origin;
					}
					else{
						url = getUrl("getKey", self, "upper", self.allocationIndex)+"&talkBack="+self.talkBack+tk_origin;
					}
					self.upperDiv.style.backgroundImage="url('"+checkTag(url)+"')";
					self.upperDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+url+"', sizingMethod='scale')";
					url = getUrl("getKey", self, "special", self.allocationIndex)+"&talkBack="+self.talkBack+tk_origin;	
					self.specialDiv.style.backgroundImage="url('"+checkTag(url)+"')";
					self.specialDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+url+"', sizingMethod='scale')";
					if(useTalkBack)
						self.getDummy();
				};
				quertyImg.onerror = function(){
					self.tk_onKeyFlag = false;
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						self.getInitTime();
//					self.allocation();
					if(useSession)
						self.setUrl();
					else
						self.setKeyIndex(self.inputObj);
				};
				if(transkey_apiuse){
					quertyImg.src = getUrlRestApi("service/key", this, "lower", this.allocationIndex)+"&talkBack="+this.talkBack+tk_origin;	
				}
				else{
					quertyImg.src = getUrl("getKey", this, "lower", this.allocationIndex)+"&talkBack="+this.talkBack+tk_origin;	
				}
				this.lowerDiv.style.backgroundImage="url('"+checkTag(quertyImg.src)+"')";
				this.lowerDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+quertyImg.src+"', sizingMethod='scale')";
			}
		}
	};
	
	this.setUrlUseBlob = function(){
		
		if(transkey_divType==0) {
		
			var request = new XMLHttpRequest();
			
			if(this.keyboardType=="numberMobile"){
			
				request.open("GET", getUrl("getKey", this, "single", this.allocationIndex)+"&talkBack="+self.talkBack, true);
				if(useCORS)
					request.withCredentials = true; 
			
				request.onreadystatechange = function(){
					if (request.readyState == 4 && request.status == 200) {
						var imageUrl = convertBinarytoFile(request.response);
						var numberImg = new Image();

						numberImg.onload = function(){
							self.allocate=true;
							self.tk_onKeyFlag = false;
							if(useTalkBack)
								self.getDummy();
						};
						numberImg.onerror = function(){
							self.tk_onKeyFlag = false;
							if(transkey_apiuse){
								mtk.resetToken(transkey_apiurl);
								mtk.resetSessionKey(transkey_apiurl);
							}else{
								mtk.resetToken(transkey_surl);
								mtk.resetSessionKey(transkey_surl);
							}
							if(!useSession&&limitTime>0)
								self.getInitTime();
		//					self.allocation();
							if(useSession)
								self.setUrl();
							else
								self.setKeyIndex(self.inputObj);
						};
						
						numberImg.src = imageUrl;
						self.numberDiv.style.backgroundImage="url('"+checkTag(numberImg.src)+"')";
						self.numberDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+numberImg.src+"', sizingMethod='scale')";
					}
				};
				
				try {
					request.send();
				} catch(e) {
					alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
					return false;
				}
			} else {
			
				request.open("GET", getUrl("getKey", this, "lower", this.allocationIndex)+"&talkBack="+self.talkBack, true);
				if(useCORS)
					request.withCredentials = true; 
				
				request.onreadystatechange = function(){
					if (request.readyState == 4 && request.status == 200) {
						var imageUrl = convertBinarytoFile(request.response);
						var quertyImg = new Image();

						quertyImg.onload = function(){
							self.allocate=true;
							self.tk_onKeyFlag = false;
							
							var upper_request = new XMLHttpRequest();
							upper_request.open("GET", getUrl("getKey", self, "upper", self.allocationIndex)+"&talkBack="+self.talkBack, true);
							if(useCORS)
								upper_request.withCredentials = true; 

							upper_request.onreadystatechange = function(){
								if (upper_request.readyState == 4 && upper_request.status == 200) {
									var upper_imageUrl = convertBinarytoFile(upper_request.response);
									self.upperDiv.style.backgroundImage="url('"+checkTag(upper_imageUrl)+"')";
									self.upperDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+upper_imageUrl+"', sizingMethod='scale')";
								}
							};
							
							try {
								upper_request.send();
							} catch(e) {
								alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
								return false;
							}
							
							
							var special_request = new XMLHttpRequest();
							special_request.open("GET", getUrl("getKey", self, "special", self.allocationIndex)+"&talkBack="+self.talkBack, true);
							if(useCORS)
								special_request.withCredentials = true; 
							
							special_request.onreadystatechange = function(){
								if (special_request.readyState == 4 && special_request.status == 200) {		
									var special_imageUrl = convertBinarytoFile(special_request.response);
									self.specialDiv.style.backgroundImage="url('"+checkTag(special_imageUrl)+"')";
									self.specialDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+special_imageUrl+"', sizingMethod='scale')";
								}
							};
							try {
								special_request.send();
							} catch(e) {
								alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
								return false;
							}
							
							if(useTalkBack)
								self.getDummy();
						};

						quertyImg.onerror = function(){
							self.tk_onKeyFlag = false;
							if(transkey_apiuse){
								mtk.resetToken(transkey_apiurl);
								mtk.resetSessionKey(transkey_apiurl);
							}else{
								mtk.resetToken(transkey_surl);
								mtk.resetSessionKey(transkey_surl);
							}
							if(!useSession&&limitTime>0)
								self.getInitTime();
		//					self.allocation();
							if(useSession)
								self.setUrl();
							else
								self.setKeyIndex(self.inputObj);
						};
						
						quertyImg.src = imageUrl;
						self.lowerDiv.style.backgroundImage="url('"+checkTag(quertyImg.src)+"')";
						self.lowerDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+quertyImg.src+"', sizingMethod='scale')";
					}
				};
				
				try {
					request.send();
				} catch(e) {
					alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
					return false;
				}
			}
		}
	};
	
	this.getDummy = function(){
		var request = new XMLHttpRequest();
		if(transkey_apiuse) {
			request.open("POST", transkey_apiurl+"service/dummy", useAsyncTranskey);
//			request.open("GET", getUrlRestApi("service/dummy", self, "")+"&talkBack="+self.talkBack+tk_origin, useAsyncTranskey);
		} else {
			request.open("POST", transkey_surl, useAsyncTranskey);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}

		if(useCORS)
			request.withCredentials = true; 
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				if(request.responseText.indexOf("SessionError")>-1){
					var errCodes = request.responseText.split("=");
					if(errCodes[1]=="1"){
						tk_alert("세션이 만료되었습니다.");
						if(transkey_apiuse){
							mtk.resetToken(transkey_apiurl);
							mtk.resetSessionKey(transkey_apiurl);
						}else{
							mtk.resetToken(transkey_surl);
							mtk.resetSessionKey(transkey_surl);
						}
						if(!useSession&&limitTime>0)
							self.getInitTime();
					}
				}else{
					self.allocate=true;
					if(self.talkBack){
						if(self.keyboardType=="numberMobile"){
							self.dki = this.responseText.split(",");
							self.dki.splice(12, 3);
						}else{
							self.dki = this.responseText.split(",");
						}
						if(transkey_divType==0)
							mtk.setTalkBackKeys(self);
						mtk.setTalkBackText(self);
					}
				}
			}
		};
		
		try {
			if(transkey_apiuse){
				request.send(getUrlRestApiPost(self, this.keyType, this.allocationIndex)+"&talkBack="+self.talkBack+tk_origin);
				//request.send();
			}else{
				request.send(getUrlPost("getDummy", self, this.keyType ,this.allocationIndex)+"&talkBack="+self.talkBack+tk_origin);
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	}
	
	this.setKeyIndex = function(inputObj) {
		if(this.keyboardType == "patternMobile")
			return;
		
		var request = new XMLHttpRequest();
		if(transkey_apiuse) {
			request.open("POST", transkey_apiurl+"service/keyindex", false);
		} else {
			request.open("POST", transkey_surl, false);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
		if(useCORS)
			request.withCredentials = true; 
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				var hidKeyIndex = document.getElementById("keyIndex_"+inputObj.id+self.frmId);
				hidKeyIndex.setAttribute("value", this.responseText);
				self.keyIndex = hidKeyIndex.value;
				self.setKeyType(self.keyType);
				if(transkey_divType==0){
					if(isNode){
						self.setUrlUseBlob();
					}else{
						self.setUrl();
					}
				}
				self.tk_onKeyFlag = false;
			}
		};
		
		try {
			if(transkey_apiuse){
				request.send(getUrlRestApiPost(self, this.keyType, this.allocationIndex)+"&talkBack="+self.talkBack+tk_origin);
			}else{
				request.send(getUrlPost("getKeyIndex", self, this.keyType ,this.allocationIndex)+"&talkBack="+self.talkBack+tk_origin);
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	}
	
	this.getInitTime = function() {
		var request = new XMLHttpRequest();
		if(transkey_apiuse){
			request.open("GET", transkey_apiurl+"service/inittime?"+new Date().getTime()+tk_origin, false);
		}else{
			request.open("GET", transkey_surl+"?op=getInitTime&"+new Date().getTime()+tk_origin, false);
		}
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				initTime = request.responseText.split(";")[0];
				initTime = initTime.split("=")[1];
				initTime = initTime.replace("'","");
				initTime = initTime.replace("'","");
			}
			
		};
		try {
			request.send();
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
		document.getElementById("initTime"+this.frmId).value = initTime;
	}
	
	
	this.setBgImageForDivType1 = function(type){
		
		var img = new Image();
		img.onload = function(){
			self.tk_onKeyFlag = false;
			if(self.allocate == false) {
				self.allocate=true;
			}
			if(useTalkBack)
				self.getDummy();
		};
		img.onerror = function() {
			self.tk_onKeyFlag = false;
			if(transkey_apiuse){
				mtk.resetToken(transkey_apiurl);
				mtk.resetSessionKey(transkey_apiurl);
			}else{
				mtk.resetToken(transkey_surl);
				mtk.resetSessionKey(transkey_surl);
			}
			if(!useSession&&limitTime>0)
				self.getInitTime();
//			self.allocation();
			if(useSession) {
				self.setKeyType(type);
			} else {
				self.setKeyIndex(self.inputObj);
			}
			
		};
		if(transkey_apiuse){
			// restapi url : /transkey/api/service/key?~~
			img.src = getUrlRestApi("service/key", this, type, this.allocationIndex);
		}
		else{
			img.src = getUrl("getKey", this, type, this.allocationIndex);
		}	
			
		if(type=="single"){
			var k = useNoDummy?3:4;
			
			for(var i=1; 5>i; i++){
				for(var j=0; k>j; j++){
					try{
						if( i==4 && j==k-1 && !useNoDummy)
							continue;
						if(useNoDummy == false && relocation == true && i == 4 && j == 1){
							this.div.childNodes[i].childNodes[j].childNodes[0].style.backgroundImage="url('"+transkey_url +"/images/re_btn.png')";
						} else{
							this.div.childNodes[i].childNodes[j].childNodes[0].style.backgroundImage="url('"+checkTag(img.src)+"')";
						}
					}catch(e){
						console.log("[mTranskey Error] : backgroundImage error , (type=single)");
					}
				}
			}
//			try{
//				this.div.childNodes[4].childNodes[0].childNodes[0].style.backgroundImage="url('"+checkTag(url)+"')";
//			}catch(e){
//				
//			}

		}else{
			for(var i=1; 5>i; i++){
				for(var j=0; 11>j; j++){
					try{
						if(i==4 && j==10)
							continue;
						this.div.childNodes[i].childNodes[j].childNodes[0].style.backgroundImage="url('"+checkTag(img.src)+"')";
					}catch(e){
						console.log("[mTranskey Error] : backgroundImage error , (type="+type+")");
					}
				}
			}
			
			var k = useSpace?4:3;
			
			for(var j=0; k>j; j++){
				try{
					if(relocation == true && j == 1){
						this.div.childNodes[5].childNodes[j].childNodes[0].style.backgroundImage="url('"+transkey_url +"/images/re_btn.png')";
					}
					else{
						this.div.childNodes[5].childNodes[j].childNodes[0].style.backgroundImage="url('"+checkTag(img.src)+"')";
					}
				}catch(e){
					console.log("[mTranskey Error] : backgroundImage(5,0) error , (type="+type+")");
				}
			}
		}
	};

	function convertBinarytoFile(value) {
	    let input = value.replace(/[^A-Fa-f0-9]/g, "");
	    if (input.length % 2) {
	        console.log("cleaned hex string length is odd.");
	        return;
	    }
	
	    let binary = new Array();
	    for (let i = 0; i < input.length / 2; i++) {
	        let h = input.substr(i * 2, 2);
	        binary[i] = parseInt(h, 16);
	    }
	
	    let byteArray = new Uint8Array(binary);
		var urlCreator = window.URL || window.webkitURL;
	
	    return urlCreator.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));
	}

	this.setBgImageForDivType1UseBlob = function(type){
			
		var request = new XMLHttpRequest();
		request.open("GET", getUrl("getKey", this, type, this.allocationIndex)+"&talkBack="+self.talkBack, true);
		if(useCORS)
			request.withCredentials = true; 
				
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {					
				var imageUrl = convertBinarytoFile(request.response);
				var img = new Image();
				
				img.onload = function(){
				self.tk_onKeyFlag = false;
				if(self.allocate == false) {
					self.allocate=true;
					if(useTalkBack)
						self.getDummy();
				}
				};
				img.onerror = function() {
					self.tk_onKeyFlag = false;
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						self.getInitTime();
		//			self.allocation();
					if(useSession)
						self.setUrl();
					else
						self.setKeyIndex(self.inputObj);
				};
				img.src = imageUrl;
						
				if(type=="single"){
					var k = useNoDummy?3:4;
					
					for(var i=1; 5>i; i++){
						for(var j=0; k>j; j++){
							try{
								if( i==4 && j==k-1 && !useNoDummy)
									continue;
								if(useNoDummy == false && relocation == true && i == 4 && j == 1){
									self.div.childNodes[i].childNodes[j].childNodes[0].style.backgroundImage="url('"+transkey_url +"/images/re_btn.png')";
								} else{
									self.div.childNodes[i].childNodes[j].childNodes[0].style.backgroundImage="url('"+checkTag(img.src)+"')";
								}
							}catch(e){
								console.log("[mTranskey Error] : backgroundImage error , (type=single)");
							}
						}
					}
		//			try{
		//				this.div.childNodes[4].childNodes[0].childNodes[0].style.backgroundImage="url('"+checkTag(url)+"')";
		//			}catch(e){
		//				
		//			}
	
				}else{
					for(var i=1; 5>i; i++){
						for(var j=0; 11>j; j++){
							try{
								if(i==4 && j==10)
									continue;
								self.div.childNodes[i].childNodes[j].childNodes[0].style.backgroundImage="url('"+checkTag(img.src)+"')";
							}catch(e){
								console.log("[mTranskey Error] : backgroundImage error , (type="+type+")");
							}
						}
					}
					
					var k = useSpace?4:3;
					
					for(var j=0; k>j; j++){
						try{
							if(relocation == true && j == 1){
								self.div.childNodes[5].childNodes[j].childNodes[0].style.backgroundImage="url('"+transkey_url +"/images/re_btn.png')";
							}
							else{
								self.div.childNodes[5].childNodes[j].childNodes[0].style.backgroundImage="url('"+checkTag(img.src)+"')";
							}
						}catch(e){
							console.log("[mTranskey Error] : backgroundImage(5,0) error , (type="+type+")");
						}
					}
				}
			}
		};
		
		try {
			request.send();
		} catch(e) {
			alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
		}
		
	};

	
	this.setDataType = function(dataType){
		if(keyboardType=="number")
			return;
		
		if(dataType==null){
			this.useCaps=true;
			this.useSpecial=true;
			this.useLower=true;
			this.useUpper=true;
		}else{
			for(var i=0; dataType.length>i; i++){

				switch(dataType.charAt(i)){
				case 'a':
					this.useLower=true;
					break;
				case 'A':
					this.useUpper=true;
					break;
				case '@' :
					this.useSpecial=true;
					break;
				}
			}
			if(this.useLower&&this.useUpper)
				this.useCaps=true;
			if(!this.useLower&&!this.useUpper)
				this.useSpecial=false;
				
		}		
	};
	
	this.setExE2E = function(ExE2E){
		this.ExE2E.value=ExE2E;
	};
	
	function getUrl(op, o, keyType, allocationIndex){
		if(!useSession){
			return transkey_surl+"?op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E
			+"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+"&keyIndex="+o.keyIndex+"&initTime="+initTime+tk_origin;
		}
		else {
			return transkey_surl+"?op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E
			+"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+tk_origin;
		}
	}
	
	function getUrlPost(op, o, keyType, allocationIndex){
		if(!useSession) {
			return "op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E+
			"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+"&keyIndex="+o.keyIndex+"&initTime="+initTime+tk_origin;
		}
		else {
			return "op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E+
			"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+tk_origin;
		}
	}
	
	function getUrlRestApi(op, o, keyType, allocationIndex){
		if(!useSession){
			//세션 미사용시
			return transkey_apiurl+op+"?name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E
			+"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+"&keyIndex="+o.keyIndex+"&initTime="+initTime+tk_origin;
		}else{
			//세션 사용시
			return transkey_apiurl+op+"?name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E+
			"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+"&keyIndex="+o.keyIndex+"&initTime="+initTime+tk_origin;
		}
	}
	
	function getUrlRestApiPost(o, keyType, allocationIndex){
		if(!useSession){
			//세션 미사용시
			return "name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E
			+"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+"&keyIndex="+o.keyIndex+"&initTime="+initTime+tk_origin;
		}else{
			//세션 사용시
			return "name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
			+o.fieldType+"&inputName="+o.inputObj.name+"&parentKeyboard="+o.parentKeyboard+"&transkeyUuid="+mtk.transkeyUuid+"&exE2E="+o.exE2E+
			"&TK_requestToken="+TK_requestToken+"&allocationIndex="+allocationIndex+"&keyIndex="+o.keyIndex+"&initTime="+initTime+tk_origin;
		}
	}
	
	function checkTag(value){
		return value.replace(/</gi,"&lt;").replace(/>/gi,"&gt;").replace(/'/gi, "&#39;").replace(/"/gi, "&#34;");
	}
		
	this.setWidth(width);
	this.setDataType(dataType);

}

mTranskeyObj.prototype.setButton = function(useB){
	this.useButton=useB;
	
	if(useB){

		this.button = document.getElementById(this.inputObj.id+"_tk_btn");
		
		if(this.button==null)
			return false;
		
		if(mtk_useTranskey){
			this.button.className = "tk_btn_";
			this.button.setAttribute("data-tk-btnValue","true");

		}else{
			this.button.className = "tk_btn";
			this.button.setAttribute("data-tk-btnValue","false");
		}
		
		tk_btn_arr[this.button.id]=this.id;
		
		if(this.button.addEventListener ){
			this.button.addEventListener("click", mtk.buttonListener, false);
		}else{
			this.button.attachEvent("onclick", mtk.buttonListener);
		}

		
	}
};

mTranskeyObj.prototype.setKeyType = function(keyT){
	this.keyType = keyT;
	if(transkey_divType==1&&this.keyboardType!="patternMobile")
		if(isNode){
			this.setBgImageForDivType1UseBlob(keyT);
		} else{
			this.setBgImageForDivType1(keyT);
		}
	if(keyT=="single"){
		this.keyTypeIndex = "";
	}else{
		if(transkey_divType==0&&this.keyboardType!="patternMobile")
			this[keyT+"Div"].style.display="block";

		this.keyTypeIndex = keyT.charAt(0)+" ";

		if(keyT=="upper"){
			this.cap=true;
		}
		else if(keyT=="special"){
			this.special=true;
		}
	}
	
	if(this.allocate&&this.talkBack)
		mtk.setTalkBackText(this);


};

mTranskeyObj.prototype.setWidth = function(width){
	if(width>=600&&this.clientHeight>=600&&!mtk.horizontal){
		if(widthRatio != 1)
			this.width = width*widthRatio;
		else
			this.width=600;
	} else if(width>=360)
		this.width=360;
	else
		this.width=320;
};

mTranskeyObj.prototype.setQwertyKey = function(key){
	if(transkey_divType==0){
		this.lowerDiv.style.display="none";			
		this.upperDiv.style.display="none";	
		this.specialDiv.style.display="none";
		this[key+"Div"].style.display="block";
	}
	
};

mTranskeyObj.prototype.setPatternButton = function(transkeyObj){
		
	for(var i=0; 4>i; i++){
		for(var j=0; j<transkeyObj.childNodes[i].childNodes.length; j++) {
			this.lines.push(transkeyObj.childNodes[i].childNodes[j]);
		}
	}
	
	for(var i=5; 8>i; i++){
		for(var j=0; 3>j; j++){
			var patternBtn = transkeyObj.childNodes[i].childNodes[j];
            var isEnd = false;
			
			patternBtn.onmousedown = function(e){
				if (e && e.preventDefault){
					e.preventDefault();
				}
				isEnd = false;
				mtk.patternTouchStart(this);
			};
			patternBtn.ontouchstart = function(e){
				if (!e) e = window.event;
				e.preventDefault();
				isEnd = false;
				mtk.patternTouchStart(this);
			};
            patternBtn.onmouseover = function(){mtk.patternTouchOver(this)};
            patternBtn.ontouchmove = mtk.patternTouchMove;

            patternBtn.onmouseup = function(){
                if(!isEnd) {
                    isEnd = true;
                    mtk.patternTouchEnd()
                }
            };
            patternBtn.ontouchend = function(){
                if(!isEnd) {
                    isEnd = true;
                    mtk.patternTouchEnd()
                }
            };
            transkeyObj.onmouseup = function(){
                if(!isEnd) {
                    isEnd = true;
                    mtk.patternTouchEnd()
                }
            };
            this.buttons.push(patternBtn);
            
            /*
            if (document.addEventListener) {
				document.addEventListener(startEvent, mtk.patternTouchStart(this), false);
				document.addEventListener(moveEvent, mtk.patternTouchMove, false);
				document.addEventListener(overEvent, mtk.patternTouchOver(this), false);
				document.addEventListener(endEvent, mtk.patternTouchEnd, false);
			} else {
				document.attachEvent("on"+startEvent, mtk.patternTouchStart(this));
				document.attachEvent("on"+moveEvent, mtk.patternTouchMove);
				document.attachEvent("on"+overEvent, mtk.patternTouchOver(this));
				document.attachEvent("on"+endEvent, mtk.patternTouchEnd);
			}
			*/
		}
	}
};

mTranskeyObj.prototype.clear = function(){
	
	this.inputObj.value = "";		
	 
	this.hidden.value = "";
	
	this.hmac.value = "";
		
	if(this.useInput) {
		for(var i=0; i<this.useInputDiv.childElementCount; i++)
			this.useInputDiv.childNodes[i].value = "";
	}
};

mTranskeyObj.prototype.getCipherDataCallback = function(aCipher){
	
}

mTranskeyObj.prototype.getCipherData = function(xecureRandomData, crtType){
	var v = mtk.inputFillEncData(this.inputObj);
	var aCipher = null;
	var aCipherArray = null;
	var aInputValue = null;
	var aInputHMValue = null;
	var encXecureRanData = null;
	var aRequest = null;
	var now = this;
//	var isAsync = false;
	
	if(!useSession)
		var seedKey = document.getElementById("seedKey"+this.frmId).value;
	
	aInputValue = v.hidden;
	
	if (aInputValue == null || aInputValue == "") {
		aCipher = "";
		return aCipher;
	}
	
	aInputHMValue = v.hmac;	
	
	var PKey = mtk.getPKey();

	encXecureRanData = mtk.phpbb_encrypt2048(xecureRandomData, PKey.k, PKey.e, PKey.n);
	
	var rsaPubKey="";
	
	var crtTypeParam = crtType;
	if(crtType=="pkc"){
		rsaPubKey = mtk.getCertPublicKey();
		crtTypeParam = "yettie";
	}
	
	var sPort = location.port;
	if(sPort.length<=0)
		sPort = '80';

	aRequest = new XMLHttpRequest();
	
	if(transkey_apiuse) {
		aRequest.open("POST", transkey_apiurl+"service/plaintext", useAsyncTranskey);
	} else {
		aRequest.open("POST", transkey_surl, useAsyncTranskey);
		aRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	
	if(useCORS)
		aRequest.withCredentials = true;
	else
		aRequest.setRequestHeader("Cache-Control", "no-cache");
	
	try{
		if(transkey_apiuse){
			if(!useSession) {				
				aRequest.send("name=" + this.id + "&value=" + aInputValue + "&hmac=" 
						+ aInputHMValue + "&crtType=" + crtTypeParam + "&encXecureRanData=" + encXecureRanData 
						+ "&sPort=" + sPort+"&pubKey=" + rsaPubKey +"&keyIndex=" + this.keyIndex+"&fieldType="
						+ this.fieldType+"&keyboardType=" + this.keyboardType + "&encSeedKey=" + seedKey+"&initTime="+initTime+tk_origin);
			} else {
				aRequest.send("name=" + this.id + "&value=" + aInputValue + "&hmac=" 
						+ aInputHMValue + "&crtType=" + crtTypeParam + "&encXecureRanData=" + encXecureRanData 
						+ "&transkeyUuid=" + mtk.transkeyUuid + "&sPort=" + sPort + "&pubKey="+ rsaPubKey +"&TK_requestToken="+TK_requestToken+tk_origin);
			}	
		}else{
			if(!useSession) {				
				aRequest.send("op=getPlainText&name=" + this.id + "&value=" + aInputValue + "&hmac=" 
						+ aInputHMValue + "&crtType=" + crtTypeParam + "&encXecureRanData=" + encXecureRanData 
						+ "&sPort=" + sPort+"&pubKey=" + rsaPubKey+"&keyIndex=" + this.keyIndex+"&fieldType="
						+ this.fieldType+"&keyboardType=" + this.keyboardType + "&encSeedKey=" + seedKey+"&initTime="+initTime+tk_origin);
			} else {
				aRequest.send("op=getPlainText&name=" + this.id + "&value=" + aInputValue + "&hmac=" 
						+ aInputHMValue + "&crtType=" + crtTypeParam + "&encXecureRanData=" + encXecureRanData 
						+ "&transkeyUuid=" + mtk.transkeyUuid + "&sPort=" + sPort + "&pubKey="+ rsaPubKey +"&TK_requestToken="+TK_requestToken+tk_origin);
			}	
		}
	}catch(e) {
		console.log("[mTranskey Error] : getCipherData fail");
	}
	
	if(useAsyncTranskey) {
		aRequest.onreadystatechange = function(){
			if (aRequest.readyState == 4 && aRequest.status == 200) {
				 if(aRequest.responseText.indexOf("LimitTimeOver")>-1){
					tk_alert("시간이 만료되었습니다.");
					mtk.now.clear();
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						mtk.now.getInitTime();
//					mtk.now.allocation();

					if(useSession) {
						mtk.now.setKeyType(mtk.now.keyType);
						if(transkey_divType==0)
							mtk.now.setUrl();
					} else {
						mtk.now.setKeyIndex(mtk.now.inputObj);
					}
				} else if(aRequest.responseText.indexOf("Integrity verification failed")>-1){
					tk_alert("데이터 무결성 검증에 실패하였습니다.");
					mtk.now.clear();
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						mtk.now.getInitTime();
//					mtk.now.allocation();

					if(useSession) {
						mtk.now.setKeyType(mtk.now.keyType);
						if(transkey_divType==0)
							mtk.now.setUrl();
					} else {
						mtk.now.setKeyIndex(mtk.now.inputObj);
					}
				} else {				
					aCipher = aRequest.responseText.replace(/\n/gi, '');
					if(crtType=="pkc"){
						now.getCipherDataCallback(aCipher);
						return aRequest.responseText;
					}
					aCipherArray = aCipher.split(',');
	
					aCipher = "";
					for ( var i = 0; i < aCipherArray.length - 1; i++) {
						if (aCipherArray[i].length == 1) {
							aCipher += '0';
						}
	
						aCipher += aCipherArray[i];
					}
	
					now.getCipherDataCallback(aCipher);
	
					return aCipher;
				}
			} else {
				aCipher = "";
				return aCipher;
			}
		}
	} else {
		if (aRequest.readyState == 4 && aRequest.status == 200) {
			 if(aRequest.responseText.indexOf("LimitTimeOver")>-1){
				tk_alert("시간이 만료되었습니다.");
				mtk.now.clear();
				if(transkey_apiuse){
					mtk.resetToken(transkey_apiurl);
					mtk.resetSessionKey(transkey_apiurl);
				}else{
					mtk.resetToken(transkey_surl);
					mtk.resetSessionKey(transkey_surl);
				}
				if(!useSession&&limitTime>0)
					mtk.now.getInitTime();
//				mtk.now.allocation();

				if(useSession) {
					mtk.now.setKeyType(mtk.now.keyType);
					if(transkey_divType==0)
						mtk.now.setUrl();
				} else {
					mtk.now.setKeyIndex(mtk.now.inputObj);
				}
			} else if(aRequest.responseText.indexOf("Integrity verification failed")>-1){
				tk_alert("데이터 무결성 검증에 실패하였습니다.");
				mtk.now.clear();
				if(transkey_apiuse){
					mtk.resetToken(transkey_apiurl);
					mtk.resetSessionKey(transkey_apiurl);
				}else{
					mtk.resetToken(transkey_surl);
					mtk.resetSessionKey(transkey_surl);
				}
				if(!useSession&&limitTime>0)
					mtk.now.getInitTime();
//				mtk.now.allocation();

				if(useSession) {
					mtk.now.setKeyType(mtk.now.keyType);
					if(transkey_divType==0)
						mtk.now.setUrl();
				} else {
					mtk.now.setKeyIndex(mtk.now.inputObj);
				}
			} else {				
				aCipher = aRequest.responseText.replace(/\n/gi, '');
				if(crtType=="pkc"){
					return aRequest.responseText;
				}
				aCipherArray = aCipher.split(',');

				aCipher = "";
				for ( var i = 0; i < aCipherArray.length - 1; i++) {
					if (aCipherArray[i].length == 1) {
						aCipher += '0';
					}

					aCipher += aCipherArray[i];
				}
				return aCipher;
			}
		} else {
			aCipher = "";
			return aCipher;
		}
	}
};

mTranskeyObj.prototype.setDiv = function(div){
	this.div=div;
	this.numberDiv=div.children["mtk_"+this.id+"_number"];
	this.lowerDiv=div.children["mtk_"+this.id+"_lower"];
	this.upperDiv=div.children["mtk_"+this.id+"_upper"];
	this.specialDiv=div.children["mtk_"+this.id+"_special"];
};

mTranskeyObj.prototype.done = function(){
	
};

function mTranskey(){
	var startEvent;
	var endEvent;
	this.isiPad = navigator.userAgent.indexOf("iPad")>-1;
	this.isiPhone = navigator.userAgent.indexOf("iPhone")>-1;
	this.isAndroid = navigator.userAgent.indexOf("Android")>-1;
	this.isSafari=false;
	this.browser = null;
	this.pcFilter = "win16|win32|win64|mac|macintel";

	if(navigator.userAgent.indexOf("Safari") > 0)
		this.isSafari=true;
	
	if (navigator.appName == 'Opera' || navigator.userAgent.indexOf("Safari") > 0 || navigator.userAgent.indexOf("Chrome") > 0 || navigator.userAgent.indexOf("Firefox") > 0)
		this.browser = 1;
	else if(this.isiPad || this.isiPhone && !this.isSafari) {
		this.browser = 3;
	} else {
		if(navigator.appName == "Microsoft Internet Explorer") this.browser = 3;
		else if(navigator.appName == "Netscape" && navigator.userAgent.toLowerCase().indexOf('trident')!=-1)  this.browser = 2;
		else this.browser = null;
	}
	
	if(transkey_divType==0){
		//divType = 0, Can't use Balloon
		useBalloon = false;
	}
	

	if(useBalloon&&this.pcFilter.indexOf(navigator.platform.toLowerCase()) < 0){
		//mobile and useBalloon
		startEvent="touchstart";
		endEvent="touchend";
	}else{
		startEvent="mousedown";
		endEvent="mouseup";
	}

	if(this.pcFilter.indexOf(navigator.platform.toLowerCase()) > 0)
		startEvent="click";
	var sessionKey = [, , , , , , , , , , , , , , , ];
	var genKey = new GenKey();
	var useCert = "true";
	var cert_pub = "";
	var cert_ca = "-----BEGIN CERTIFICATE-----MIIEHjCCAwagAwIBAgIJALcMNEp1tPYgMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTEzMDIwNzA5MDYyNVoXDTQzMDEzMTA5MDYyNVowZzELMAkGA1UEBhMCS1IxHTAbBgNVBAoTFFJhb25TZWN1cmUgQ28uLCBMdGQuMRowGAYDVQQLExFRdWFsaXR5IEFzc3VyYW5jZTEdMBsGA1UEAxMUUmFvblNlY3VyZSBDby4sIEx0ZC4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCqB0MsUuAi7pWVmRWaCS7kAactycMghmOM7RiMbmXyHmatXJbrtOlNrGH8Xl4fdkCJjyUE2829zQy+lTJ2O3Uo3Nn7zK3+3Um9nDQXN2tapambthOXs0aHjnRCtuLMOSPlAx06o0yHP1nOGaV7hfY9PyJjIVh9Lk/oFp5A+wsi0wiQ+INMDrm/6xZrooEY7/TLMnE4v+nr+cpIf3hSrvI1gGTykFtGCy2Le1huqaTKkE9K0CF/Sd8Kvebj6R+MhlieDXiMZXZD++pRmd4cAmGAmnGn4YdJMyh16TCccPjT60KkMv84uNVjXBvnar8ZlzRQSgIhwp1KkRiMErMbVWCnAgMBAAGjgcwwgckwHQYDVR0OBBYEFPzIDKwqK4PCklaP6Mq4YXdq8McyMIGZBgNVHSMEgZEwgY6AFPzIDKwqK4PCklaP6Mq4YXdq8McyoWukaTBnMQswCQYDVQQGEwJLUjEdMBsGA1UEChMUUmFvblNlY3VyZSBDby4sIEx0ZC4xGjAYBgNVBAsTEVF1YWxpdHkgQXNzdXJhbmNlMR0wGwYDVQQDExRSYW9uU2VjdXJlIENvLiwgTHRkLoIJALcMNEp1tPYgMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAHBRlEB4nu/gHwVFRzqbFOloR7aB0xIaMDykMWtovXHUQcTmmGyYQn0bMWaGVCD7SgRh1FisfciJzLP7f8OI5f7rA2tiBZD1PBtLMU7MytGIYlV/gcfWPbnqBVsKDm15AEUqH7ZahOm7np4d5Fr87r1bj2baXQPKSNd9yjh89fl6LthWLEQRYKKwhPYAA/QkeB2RE9MftmuOXJ6MnYyyx5xEZK2ofqwrRBvDmV/PjwdCSxhloiJVFHrp8lKPCsZywJ3v9IPpudjgBQ7SWqhDcPNo2diGB2dQ252g36K1H7u3aT9Xha33MFQXTTEDzVDhaXzaGk7X6T9v25dsOyOaLAo=-----END CERTIFICATE-----";
	var rng = new SecureRandom();
	var mKey = new Array();
	for(var i=0; keyboardLayouts.length>i; i++){
		mKey[keyboardLayouts[i]] = new Array();
	}
	this.now = null;
	this.fakeKey = null;
	this.fakeKeyBorderColor = '';
	this.fakeKeyBorderRightColor = '';
	this.fakeKeyBorderLeftColor = '';
	this.fakeKeyBorderBottomColor = '';
	this.pressImg = null;
	this.fakePressImg = null;
	if(useBalloon){
		this.balloonImgs = this.makeBalloonImg();
	}
	if(usePressImg) {
		this.pressImg = this.makePressImg();
		this.fakePressImg = this.makePressImg();
	}
	this.getTextEnd=false;
	this.cssText = new Array();
	this.cssText["qwertyMobile"] = new Array();
	this.cssText["numberMobile"] = new Array();
	this.transkeyUuid;
	this.clientWidth;
	this.horizontal = false;
	this.webkitTapHighlightColor="";
	this.groupObjs = [];
	this.groupBtns = [];
	this.licenseType = "";
	this.licExpiredDate = "";
	this.licClassification = "";
	var genSessionKey = "";
	this.talkBackLowerText = ['1','2','3','4','5','6','7','8','9','0','q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
	this.talkBackUpperText = ['1','2','3','4','5','6','7','8','9','0','대문자Q','대문자W','대문자E','대문자R','대문자T','대문자Y','대문자U','대문자I','대문자O','대문자P','대문자A','대문자S','대문자D','대문자F','대문자G','대문자H','대문자J','대문자K','대문자L','대문자Z','대문자X','대문자C','대문자V','대문자B','대문자N','대문자M'];
	this.talkBackSpecialText = ['어금기호','물결표시','느낌표','골뱅이','우물정','달러기호','퍼센트','꺽쇠','엠퍼샌드','별표','왼쪽괄호','오른쪽괄호','빼기','밑줄','등호','더하기','왼쪽대괄호','왼쪽중괄호','오른쪽대괄호','오른쪽중괄호','역슬래시','수직막대','세미콜론','콜론','슬래시','물음표','쉼표','왼쪽꺽쇠괄호','마침표','오른쪽꺽쇠괄호','작은따옴표','따옴표','더하기','빼기','별표','슬래시'];
	this.talkBackNumberText = ['1','2','3','4','5','6','7','8','9','0'];
	
	this.getPKey = function(){
		if(useGenKey)
			var pKey = cert_pub.split(transkey_delimiter);
		else
			var pKey = _x509_getPublicKeyHexArrayFromCertPEM(cert_pub);
		
		var PKey = new Array();

		PKey["n"] = pKey[0];
		PKey["k"] = 256; // length of n in bytes
		PKey["e"] = pKey[1];
		
		return PKey;
	};
	
	this.getCertPublicKey = function(){	
		return encodeURIComponent(this.crtPublicKey);
	};
	
	this.getPublicKey = function(url){
		var operation = "getPublicKey";
		if(transkey_apiuse){
			operation = "publickey";
		}
		var request = new XMLHttpRequest();
		
		if(transkey_apiuse){
			request.open("GET", url+"service/"+operation+"?TK_requestToken="+TK_requestToken+tk_origin, useAsyncTranskey);
		}
		else{
			request.open("POST", url, useAsyncTranskey);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
		if(useCORS)
			request.withCredentials = true; 
		
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				if (request.responseText) {
					cert_pub = request.responseText;
					if(transkey_apiuse){
						mtk.generateSessionKey(transkey_apiurl);
					}else{
						mtk.generateSessionKey(transkey_surl);
					}
				}
			}
		};
		
		try {
			if(transkey_apiuse){
				request.send();
			}else{
				request.send("op=" + operation +"&TK_requestToken="+TK_requestToken+tk_origin);
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	};
	
	this.generateSessionKey = function(url) {
		
		if(genSessionKey.length>0)
			return true;
		
		if(useGenKey){
			if(cert_pub.indexOf("Error")>-1) {
				tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
				return false;
			}
			var pKey = cert_pub.split(transkey_delimiter);
		} else {
			if( verifyCA() == false ){
				tk_alert("CA 검증이 실패 하였습니다. 프로그램이 정상작동 하지 않을 수 있습니다.");
				return false;
			}
			var pKey = _x509_getPublicKeyHexArrayFromCertPEM(cert_pub);
		}
		
		var n = pKey[0];
		var k = 256; // length of n in bytes
		var e = pKey[1];
		
		this.transkeyUuid = genKey.tk_sh1prng();
		
		
		genSessionKey = genKey.GenerateKey(128);
		
		for(var i=0; i<16; i++)	{
			sessionKey[i] = Number("0x0" + genSessionKey.charAt(i));
		}

		var encSessionKey = mtk.phpbb_encrypt2048(genSessionKey, k, e, n);	
		
		var licType = 0;
		if(!useSession){
			var operation = "getKeyInfo";
			if(transkey_apiuse == true){
				operation = "keyinfo";
			}			
		} else {
			var operation = "setSessionKey";
			if(transkey_apiuse == true){
				operation = "sessionkey";
			}
		}
		var request = new XMLHttpRequest();
		if(transkey_apiuse == true){
			request.open("GET", url+"service/"+operation+"?key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+"&TK_requestToken="+TK_requestToken+ "&mode=Mobile"+tk_origin,useAsyncTranskey);
		}
		else{
			request.open("POST", url, useAsyncTranskey);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
		if(useCORS)
			request.withCredentials = true; 

		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				if(request.responseText.indexOf("LicenseError")>-1){
					var errMessage =  request.responseText.split(",");
					var errCodes = errMessage[0].split("=");
					var classification = errMessage[1].split("=");
					if(classification[1] == "r")
						mtk.licClassification = "rsl";
					else if (classification[1] == "c")
						mtk.licClassification = "crt";
					else 
						mtk.licClassification = "undefined";
					mtk.alert(errCodes[1]);
					mtk= null;
					return false;
				}

				if (request.responseXML) {
					var result = request.responseXML.firstChild;
					var res = null;
					var returns = "return [";
					for(var i=0; keyboardLayouts.length>i; i++){
						if(i==keyboardLayouts.length-1){
							returns += keyboardLayouts[i]+",";
						}else{
							returns += keyboardLayouts[i]+",";
						}	
					}
					returns += "]";
					for ( var i = 0; i < result.childNodes.length; i++) {
						var node = result.childNodes[i];
						if (node.tagName == "script") {
							for ( var j = 0; j < node.childNodes.length; j++) {
								if(node.childNodes[j].nodeValue.length>10){									
									getKeyArray(node.childNodes[j].nodeValue);
									licType = getLicType(node.childNodes[j].nodeValue);
									mtk.licExpiredDate = getLicExpiredDate(node.childNodes[j].nodeValue);
								}
							}
						}
					}

					var year = mtk.licExpiredDate.substr(0,4);
					var month = mtk.licExpiredDate.substr(5,2);
					var day = mtk.licExpiredDate.substr(8,2);
					mtk.licExpiredDate = "만료 날짜 : " + year + "년" + month + "월" + day + "일";
					
					if(licType == 1) {
						mtk.licenseType = "임시 라이선스";
					}
					
					var inputs = document.getElementsByTagName("input");
					
					for(var i = 0; i < inputs.length; i++){
						var input = inputs.item(i);
						if(input.getAttribute("data-tk-kbdType")!=null&&transkey[input.id]==null){
							mtk.setKeyboard(inputs.item(i));
						}
					}

					for(var i = 0; i < inputs.length; i++){
						var input = inputs.item(i);
						if(input.getAttribute("data-tk-groupId")!=null&&mtk.groupObjs[input.getAttribute("data-tk-groupId")]==null) {
							mtk.setGroup(input.getAttribute("data-tk-groupId"));
						}
					}
					//mtk.checkCSS();
					//mtk.checkKeyVer();
					
					mtk.getClientWidth();
					
					initCallback();
				}
			}
		};
		try {
			if(transkey_apiuse == true){
				request.send();
			}else{
				request.send("op=" + operation + "&key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+"&TK_requestToken="+TK_requestToken+ "&mode=Mobile"+tk_origin);
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	};
	
	this.setKeyEvent = function(id){
		var index = 0;
		var keypad = document.getElementById("mtk_"+id);
		var isQwerty = document.getElementById(id).getAttribute("data-tk-kbdtype").indexOf("qwerty")>-1? true:false;
		//input preview layout_close
		if(document.getElementById(id).getAttribute("data-tk-useinput")=="true"){
			if(document.addEventListener){
				document.getElementById("input_label_close_"+id).addEventListener( "click", mtk.close );
			}else{
				document.getElementById("input_label_close_"+id).attachEvent( "onclick", mtk.close );
			}	
		}
		for(var j = 0; j < keypad.childNodes.length ; j++){
			var keypadChild = keypad.childNodes[j]; 
			(function(j, keypad, keypadChild){
				if(j == 0){
					if(keypad.childNodes[0].childNodes.length > 0){
						if (document.addEventListener) {
							keypad.childNodes[0].childNodes[keypad.childNodes[0].childNodes.length-1].addEventListener( startEvent, mtk.close );
						}else{
							keypad.childNodes[0].childNodes[keypad.childNodes[0].childNodes.length-1].attachEvent( "on"+startEvent, mtk.close );
						}
					}
				}else{
					var KeypadLength = isQwerty==true? 6 : 5;
					if(j < KeypadLength - 1){
						for(var k = 0; k < keypadChild.childNodes.length; k++){
							if( j == KeypadLength-2  && k == 0 && isQwerty){
								if (document.addEventListener) {
									keypadChild.childNodes[0].addEventListener( startEvent, function(){mtk.cap(event,  keypadChild.childNodes[0])});
									keypadChild.childNodes[0].addEventListener( endEvent, function(){balloonRemove()});
								}else{
									keypadChild.childNodes[0].attachEvent( "on"+startEvent, function(){mtk.cap(event,  keypadChild.childNodes[0])});
									keypadChild.childNodes[0].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}
								continue;
							}
							if( j == KeypadLength-2 && k == keypadChild.childNodes.length-1 && isQwerty){
								if (document.addEventListener) {
									keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( startEvent, function(){mtk.del(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
									keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( endEvent, function(){balloonRemove()});
								}else{
									keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+startEvent, function(){mtk.del(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
									keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}
								continue;
							}
							(function(k, index){
								if (document.addEventListener) {
									keypadChild.childNodes[k].addEventListener( startEvent , function(){mtk.start(event, keypadChild.childNodes[k] , index)});
									keypadChild.childNodes[k].addEventListener( endEvent , function(){balloonRemove()});
								}else{
									keypadChild.childNodes[k].attachEvent( "on"+startEvent, function(){mtk.start(event, keypadChild.childNodes[k] , index)});
									keypadChild.childNodes[k].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}
							})(k, index);
							index++;
						}
					}else/*( n == keypad.childNodes.length-1 )*/{
						if(isQwerty){
							if (keypadChild.id.indexOf("mtk_lic")>-1)
								return;
							if (document.addEventListener) {
								//특수문자
								keypadChild.childNodes[0].addEventListener( startEvent, function(){mtk.sp(event,  keypadChild.childNodes[0])});
								keypadChild.childNodes[0].addEventListener( endEvent, function(){balloonRemove()});
								if(relocation){//재배열
									keypadChild.childNodes[1].addEventListener( startEvent, function(){mtk.relocate(event,  keypadChild.childNodes[1])});
									keypadChild.childNodes[1].addEventListener( endEvent, function(){balloonRemove()});
								}else{//전체삭제
									keypadChild.childNodes[1].addEventListener( startEvent, function(){mtk.clear(event,  keypadChild.childNodes[1])});
									keypadChild.childNodes[1].addEventListener( endEvent, function(){balloonRemove()});
								}
								//스페이스
								if(useSpace){
									keypadChild.childNodes[keypadChild.childNodes.length-2].addEventListener( startEvent, function(){mtk.start(event,  keypadChild.childNodes[keypadChild.childNodes.length-2], 41)});
									keypadChild.childNodes[keypadChild.childNodes.length-2].addEventListener( endEvent, function(){balloonRemove()});
								}
								//입력완료
								keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( startEvent, function(){mtk.done(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
								keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( endEvent, function(){balloonRemove()});
							}else{
								//특수문자
								keypadChild.childNodes[0].attachEvent( "on"+startEvent, function(){mtk.sp(event,  keypadChild.childNodes[0])});
								keypadChild.childNodes[0].attachEvent( "on"+endEvent, function(){balloonRemove()});
								if(relocation){//재배열
									keypadChild.childNodes[1].attachEvent( "on"+startEvent, function(){mtk.relocate(event,  keypadChild.childNodes[1])});
									keypadChild.childNodes[1].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}else{//전체삭제
									keypadChild.childNodes[1].attachEvent( "on"+startEvent, function(){mtk.clear(event,  keypadChild.childNodes[1])});
									keypadChild.childNodes[1].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}
								//스페이스
								if(useSpace){
									keypadChild.childNodes[keypadChild.childNodes.length-2].attachEvent( "on"+startEvent, function(){mtk.start(event,  keypadChild.childNodes[keypadChild.childNodes.length-2], 41)});
									keypadChild.childNodes[keypadChild.childNodes.length-2].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}
								//입력완료
								keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+startEvent, function(){mtk.done(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
								keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+endEvent, function(){balloonRemove()});
							}
						}else{
							if (keypadChild.id.indexOf("mtk_lic")>-1)
								return;
							if(document.addEventListener){
								if(useNoDummy){
									keypadChild.childNodes[0].addEventListener( startEvent, function(){mtk.del(event,  keypadChild.childNodes[0])});
									keypadChild.childNodes[0].addEventListener( endEvent, function(){balloonRemove()});
									(function(index){
										keypadChild.childNodes[1].addEventListener( startEvent, function(){mtk.start(event, keypadChild.childNodes[1] , index)});
										keypadChild.childNodes[1].addEventListener( endEvent, function(){balloonRemove()});
									})(index);
									keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( startEvent, function(){mtk.done(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
									keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( endEvent, function(){balloonRemove()});
								}else{
									keypadChild.childNodes[0].addEventListener( startEvent, function(){mtk.del(event,  keypadChild.childNodes[0])});
									keypadChild.childNodes[0].addEventListener( endEvent, function(){balloonRemove()});
									if(relocation){//재배열
										keypadChild.childNodes[1].addEventListener( startEvent, function(){mtk.relocate(event,  keypadChild.childNodes[1])});
										keypadChild.childNodes[1].addEventListener( endEvent, function(){balloonRemove()});
									}else{//전체삭제
										keypadChild.childNodes[1].addEventListener( startEvent, function(){mtk.clear(event,  keypadChild.childNodes[1])});
										keypadChild.childNodes[1].addEventListener( endEvent, function(){balloonRemove()});
									}
									keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( startEvent, function(){mtk.done(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
									keypadChild.childNodes[keypadChild.childNodes.length-1].addEventListener( endEvent, function(){balloonRemove()});
								}
							}else{
								if(useNoDummy){
									keypadChild.childNodes[0].attachEvent( "on"+startEvent, function(){mtk.del(event,  keypadChild.childNodes[0])});
									keypadChild.childNodes[0].attachEvent( "on"+endEvent, function(){balloonRemove()});
									(function(index){
										keypadChild.childNodes[1].attachEvent( "on"+startEvent, function(){mtk.start(event,  keypadChild.childNodes[1], index)});
										keypadChild.childNodes[1].attachEvent( "on"+endEvent, function(){balloonRemove()});
									})(index);
									keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+startEvent, function(){mtk.done(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
									keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}else{
									keypadChild.childNodes[0].attachEvent( "on"+startEvent, function(){mtk.del(event,  keypadChild.childNodes[0])});
									keypadChild.childNodes[0].attachEvent( "on"+endEvent, function(){balloonRemove()});
									if(relocation){//재배열
										keypadChild.childNodes[1].attachEvent( "on"+startEvent, function(){mtk.relocate(event,  keypadChild.childNodes[1])});
										keypadChild.childNodes[1].attachEvent( "on"+endEvent, function(){balloonRemove()});
									}else{//전체삭제
										keypadChild.childNodes[1].attachEvent( "on"+startEvent, function(){mtk.clear(event,  keypadChild.childNodes[1])});
										keypadChild.childNodes[1].attachEvent( "on"+endEvent, function(){balloonRemove()});
									}
									keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+startEvent, function(){mtk.done(event,  keypadChild.childNodes[keypadChild.childNodes.length-1])});
									keypadChild.childNodes[keypadChild.childNodes.length-1].attachEvent( "on"+endEvent, function(){balloonRemove()});
								}
							}
						}
					}
				}
			})(j,keypad, keypadChild);
		}
	}
	
	function getKeyArray(func){
		var funcArr = func.split("\n");
		var key;
		
		for(var i = 0; i< funcArr.length; i++){
			if(funcArr[i].indexOf("new Key")>-1){
				key = new Key_csp;
				continue;
			}
			if(funcArr[i].indexOf(".name")>-1){
				var nameArr = funcArr[i].split("\"");
				key.name = nameArr[1];
				continue;
			}
			if(funcArr[i].indexOf(".addPoint")>-1){
				var pointArr = funcArr[i].split(",");
				var firstPoint = pointArr[0].substr(pointArr[0].indexOf("(")+1);
				var secondPoint = pointArr[1].substr(1,pointArr[1].indexOf(")")-1);
				key.addPoint(firstPoint, secondPoint);
				continue;
			}
			if(funcArr[i].indexOf(".push")>-1){
				var keyboard = funcArr[i].split(".")[0]
				if(keyboardLayouts.indexOf(keyboard) != -1) {
					mKey[keyboard].push(key);
				}
				
				continue;
			}
		}
	}
	
	function getLicType(func){
		var funcArr = func.split("\n");
		var licTypeArr = funcArr[funcArr.length-3].split("=");
		return parseInt(licTypeArr[1].replace(";",""));
	}
	
	function getLicExpiredDate(func){
		var funcArr = func.split("\n");
		var expiredDateArr = funcArr[funcArr.length-2].split("=");
		return expiredDateArr[1].replace(";","").replace(/\"/gi,"");
	}
	
	this.keyboardCheck = function(keyboard) {
		if(mKey[keyboard]!=null && mKey[keyboard].length>0) {
			return true;
		}else {
			return false;
		}
	}
	
	this.resetToken = function(url){
		if(!useSession)
			return;
			
		var request = new XMLHttpRequest();
		if(useCORS)
			request.withCredentials = true; 
		if(transkey_apiuse){
			request.open("GET", url+"service/token?"+new Date().getTime()+tk_origin, false);	
		}else{
			request.open("GET", url+"?op=getToken&"+new Date().getTime()+tk_origin, false);	
		}
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				TK_requestToken = request.responseText.split("=")[1];
				TK_requestToken = TK_requestToken.replace(";","");
				if(transkey_apiuse){
					mtk.resetSessionKey(transkey_apiurl);
				}else{
					mtk.resetSessionKey(transkey_surl);
				}
			}
			
		};
		
		try {
			request.send();
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	}
	
	this.resetSessionKey = function(url){
		
		if(useGenKey){
			var pKey = cert_pub.split(transkey_delimiter);
		} else {
			if( verifyCA() == false ){
				tk_alert("CA 검증이 실패 하였습니다. 프로그램이 정상작동 하지 않을 수 있습니다.");
				return false;
			}
			var pKey = _x509_getPublicKeyHexArrayFromCertPEM(cert_pub);
		}

		var n = pKey[0];
		var k = 256; // length of n in bytes
		var e = pKey[1];
		
		var encSessionKey = mtk.phpbb_encrypt2048(genSessionKey, k, e, n);
		
		if(!useSession){
			var operation = "getKeyInfo";
			if(transkey_apiuse == true){
				operation = "keyinfo";
			}			
		} else {
			var operation = "setSessionKey";
			if(transkey_apiuse == true){
				operation = "sessionkey";
			}
		}
		var request = new XMLHttpRequest();
		if(useCORS)
			request.withCredentials = true; 
		if(transkey_apiuse){
			request.open("GET", url+"service/"+operation+"?key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+"&TK_requestToken="+TK_requestToken+ "&mode=Mobile"+tk_origin, useAsyncTranskey);
		}else{
			request.open("POST", url, useAsyncTranskey);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		}
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				if(request.responseText.indexOf("LicenseError")>-1){
					var errMessage =  request.responseText.split(",");
					var errCodes = errMessage[0].split("=");
					var classification = errMessage[1].split("=");
					if(classification[1] == "r")
						mtk.licClassification = "rsl";
					else if (classification[1] == "c")
						mtk.licClassification = "crt";
					else 
						mtk.licClassification = "undefined";
					mtk.alert(errCodes[1]);
					mtk= null;
					return false;
				}
			}
		};
		
		try {
			if(transkey_apiuse){
				request.send();
			}else{
				request.send("op=" + operation + "&key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+"&TK_requestToken="+TK_requestToken+ "&mode=Mobile"+tk_origin);
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	};
	
	this.inputFillEncData = function(input){
		var tkObj = transkey[input.id];
		var hidden = tkObj.hidden.value;
		var hmac = "";

		var maxSize = input.value.length+genKey.tk_getrnd_int()%10;
		
		var geo = "d 0 0";
		
		for(var j=input.value.length; j<maxSize; j++)
		{	
			var encrypted = SeedEnc(geo);
			hidden += transkey_delimiter + encrypted;
		}

		hmac = CryptoJS.HmacSHA256(hidden, genSessionKey);
		
		var value = new Array();
		value["hidden"]=hidden;
		value["hmac"]=hmac;
		
		return value;
		
	};
	
	this.fillEncData = function()
	{
		for(var i=0;transkey.objs.length>i;i++){
			var tk = transkey[transkey.objs[i]];
			if(tk==null)
				continue;
			var hidden = tk.hidden;
			var HM = tk.hmac;
			var input = tk.inputObj;
			if(HM.value.length==0){
				var maxSize = input.value.length+genKey.tk_getrnd_int()%10;
				
				var geo = "d 0 0";
				

				for(var j=input.value.length; j<maxSize; j++)
				{	
					var encrypted = SeedEnc(geo);
					hidden.value += transkey_delimiter + encrypted;
				}		

				if(!useSession){
					var PKey = this.getPKey();
					var encSessionKey = this.phpbb_encrypt2048(genSessionKey, PKey.k, PKey.e, PKey.n);
					document.getElementById("seedKey"+tk.frmId).value = encSessionKey;
				}

				HM.value = CryptoJS.HmacSHA256(hidden.value, genSessionKey);
			}
		}
	};
	
	this.getEncData = function(index){
		var encrypted = "";
		var key = mKey[mtk.now.keyboard][index];
		var x = key.xpoints[0];
		var y = key.ypoints[0];		
		var geo = this.now.keyTypeIndex + x + " " + y;
		
		encrypted = SeedEnc(geo);
		
		return encrypted;
	};
	
	this.getClientWidth = function(inputObj){
		if(window.orientation==0||window.orientation==180){
			this.horizontal = false;
		}else{
			this.horizontal = true;
		}
		if(this.isiPad){
			this.horizontal = false;
		}
		
		var obj = null;
		if(inputObj == undefined){
			obj = document.body;
		} else {
			var is_sibling = inputObj.getAttribute("data-tk-nextSibling")
			if(is_sibling == undefined || is_sibling == "false"){
				obj = document.body;
			}else {
				obj = inputObj.parentNode;
			}
		}
		
		var div = document.createElement("div");
		div.setAttribute("id", "mtk");
		obj.appendChild(div);
		if(div.addEventListener)
			div.addEventListener("touchstart", function(){}, false);
		div.style.width="100%";
		this.clientWidth = div.clientWidth;
		obj.removeChild(div);
	};
	
	this.checkWidthSize = function(size){
		if(transkey_divType!=0)
			return false;
			
		var width;
		if(this.clientWidth>=600&&this.clientHeight>=600&&!mtk.horizontal){
			width=600;
		} else if(this.clientWidth>=360)
			width=360;
		else
			width=320;
		
		if(size==width)
			return true;
		else
			return false;
	};
	
	this.remove = function(inputObj){
		var div = transkey[inputObj.id].div;
		if(div==null)
			return;
		div.parentNode.removeChild(div);
		var hidden = transkey[inputObj.id].hidden;
		var hmac = transkey[inputObj.id].hmac;
		var useInputDiv = transkey[inputObj.id].useInputDiv;
		if(hidden!=null)
			hidden.parentNode.removeChild(hidden);
		if(hmac!=null)
			hmac.parentNode.removeChild(hmac);
		if(useInputDiv!=null)
			useInputDiv.parentNode.removeChild(useInputDiv);
		
		removeArray(transkey.objs, inputObj.id);
		
		transkey[inputObj.id]= null;
	};
	 
	 this.setPosition = function(){
		 var div = this.now.div;	 
		 var inputObj = this.now.inputObj;
		 var xy = inputObj.getAttribute("data-tk-kbdxy");
		 var isBottom = inputObj.getAttribute("data-tk-bottom");
		 
		var is_sibling = inputObj.getAttribute("data-tk-nextSibling")
		if(is_sibling == "true"){
			this.getClientWidth(inputObj);
		}
		 if(isBottom == undefined||isBottom=="false"){
			 if(xy == undefined){
				if (typeof jQuery == "undefined") {
					var point = getOffsetPoint(inputObj);
					div.style.top = point.y+inputObj.offsetHeight+"px";
				} else {
					div.style.top = $('#'+inputObj.id).offset().top + inputObj.offsetHeight + "px";
				}
				if(transkey_divType==0){
					var left = this.clientWidth/2 - this.now.width/2;
					if(left<0)
						left = 0;
					div.style.left = left+"px";
				}else if(transkey_divType==1){
					if(this.now.keyboardType=="patternMobile") {
						div.style.left = (window.innerWidth / 2) - (div.clientWidth / 2) + "px";
					} else if(widthRatio!=1) {
						var left = (this.clientWidth*(1-widthRatio))/2;
						if(left<0)
							left = 0;
						div.style.left = left+"px";
					} else if(max_width!=0&&max_width>=300&&this.clientWidth>max_width) {
						var left = (this.clientWidth-max_width)/2;
						div.style.left = left+"px";
					} else {
						div.style.left = -0.5+"px";
					}
		 			this.reSize(this.now);
				}
			}else{
				var point = new Array();
				point = xy.split(" ");
				div.style.top = point[1]+"px";
				div.style.left = point[0]+"px";
			}
		} else if(isBottom=="true"){
			var top = document.documentElement.clientHeight-div.clientHeight-2;
			var left = 0;
			if(transkey_divType == 0) {
				var point = getOffsetPoint(inputObj);
				var left = this.clientWidth/2 - this.now.width/2;
				if(left<0)
					left = 0;
				div.style.left = left+"px";
				div.style.bottom="0px";
			} else if(transkey_divType==1){
				if(this.now.keyboardType=="patternMobile") {
						div.style.left = (window.innerWidth / 2) - (div.clientWidth / 2) + "px";
				} else if(widthRatio!=1) {
					var left = (this.clientWidth*(1-widthRatio))/2;
					if(left<0)
						left = 0;
					div.style.left = left+"px"; 
				} else if(max_width!=0&&max_width>=300&&this.clientWidth>max_width) {
					var left = (this.clientWidth-max_width)/2;
					div.style.left = left+"px";
				} else {
					div.style.left = (left-0.5)+"px";
				}
				div.style.bottom="0px";
				this.reSize(this.now);
			}
			/*
			if(mtk.isiPhone) {
				if(parseFloat(navigator.userAgent.match(/\b[0-9]+_[0-9]+(?:_[0-9]+)?\b/)[0].replaceAll("_","."))>=11) {
					div.style.bottom = "env(safe-area-inset-bottom)";
					mtk.now.useInputDiv.style.paddingBottom = "env(safe-area-inset-bottom)";
				} else {
					div.style.bottom = "constant(safe-area-inset-bottom)";
					mtk.now.useInputDiv.style.paddingBottom = "constant(safe-area-inset-bottom)";
				}
			}
			*/
			div.style.position = "fixed";
			div.style.width = this.clientWidth;
			if(mtk.now.useInput==true){
				mtk.now.useInputDiv.style.position = "fixed";
			}
		 }
	 };
	
	 this.setHiddenField = function(inputObj, ExE2E){
		 var obj = inputObj.form;
		 if(obj==null)
			 obj = inputObj.parentNode;
		 if(obj==null)
			 obj = document.body;
		 var frmId="";
		 if(use_form_id)
			 frmId = "_"+inputObj.form.id;
				 
		if(use_form_id){
			var hidfrmId = document.getElementById("hidfrmId");
			if(hidfrmId==null) {
				hidfrmId = document.createElement("input");
				hidfrmId.setAttribute("type", "hidden");
				hidfrmId.setAttribute("id", "hidfrmId");
				hidfrmId.setAttribute("name", "hidfrmId");
				hidfrmId.setAttribute("value", frmId.replace("_",""));
				obj.appendChild(hidfrmId);
			} else {
				hidfrmId.setAttribute("value", frmId.replace("_",""));
			}
		}
		
		if(!useSession) {
			var PKey = this.getPKey();
			var encSessionKey = this.phpbb_encrypt2048(genSessionKey, PKey.k, PKey.e, PKey.n);
			
			var seedKey = document.getElementById("seedKey"+frmId);
			if(seedKey==null){
				seedKey = document.createElement("input");
				seedKey.setAttribute("type", "hidden");
				seedKey.setAttribute("id", "seedKey"+frmId);
				seedKey.setAttribute("name", "seedKey"+frmId);
				seedKey.setAttribute("value", encSessionKey);
				obj.appendChild(seedKey);
			} else {
				seedKey.setAttribute("value", encSessionKey);
			}
			
			var hidInitTime = document.getElementById("initTime"+frmId);
			if(hidInitTime==null){
				hidInitTime = document.createElement("input");
				hidInitTime.setAttribute("type", "hidden");
				hidInitTime.setAttribute("id", "initTime"+frmId);
				hidInitTime.setAttribute("name", "initTime"+frmId);
				hidInitTime.setAttribute("value", initTime);
				obj.appendChild(hidInitTime);
			} else {
				hidInitTime.setAttribute("value", initTime);
			}
			
			var sessionKey = document.getElementById("keyIndex_"+inputObj.id+frmId);
			if(sessionKey==null){
				sessionKey = document.createElement("input");
				sessionKey.setAttribute("type", "hidden");
				sessionKey.setAttribute("id", "keyIndex_"+inputObj.id+frmId);
				sessionKey.setAttribute("name", "keyIndex_"+inputObj.id+frmId);
				sessionKey.setAttribute("value", "");
				obj.appendChild(sessionKey);
			} else {
				sessionKey.setAttribute("value", "");
			}
			
			var hidkeyboardType = document.getElementById("keyboardType_"+inputObj.id+frmId);
			if(hidkeyboardType==null){
				hidkeyboardType = document.createElement("input");
				hidkeyboardType.setAttribute("type", "hidden");
				hidkeyboardType.setAttribute("id", "keyboardType_"+inputObj.id+frmId);
				hidkeyboardType.setAttribute("name", "keyboardType_"+inputObj.id+frmId);
				hidkeyboardType.setAttribute("value", "");
				obj.appendChild(hidkeyboardType);
			} else {
				hidkeyboardType.setAttribute("value", "");
			}
			
			var hidfieldType = document.getElementById("fieldType_"+inputObj.id+frmId);
			if(hidfieldType==null){
				hidfieldType = document.createElement("input");
				hidfieldType.setAttribute("type", "hidden");
				hidfieldType.setAttribute("id", "fieldType_"+inputObj.id+frmId);
				hidfieldType.setAttribute("name", "fieldType_"+inputObj.id+frmId);
				hidfieldType.setAttribute("value", "");
				obj.appendChild(hidfieldType);
			} else {
				hidfieldType.setAttribute("value", "");
			}
		}
		
		var uuid;
		if(use_form_id)
			uuid = document.getElementById("transkeyUuid"+frmId);
		else
			uuid = obj.children.transkeyUuid;
		if(uuid==null){
			uuid = document.createElement("input");
			uuid.setAttribute("type", "hidden");
			uuid.setAttribute("id", "transkeyUuid"+frmId);
			uuid.setAttribute("name", "transkeyUuid"+frmId);
			uuid.value=this.transkeyUuid;
			obj.appendChild(uuid);
		} else {
			uuid.value=this.transkeyUuid;
		}
		
		var hidden = document.getElementById("transkey_"+inputObj.id+frmId);
		if(hidden==null){
			hidden = document.createElement("input");
			hidden.setAttribute("type", "hidden");
			hidden.setAttribute("id", "transkey_"+inputObj.id+frmId);
			hidden.setAttribute("name", "transkey_"+inputObj.id+frmId);
			hidden.setAttribute("value", "");
			obj.appendChild(hidden);
		} else {
			hidden.setAttribute("value", "");
		}
		
		var hmac = document.getElementById("transkey_HM_"+inputObj.id+frmId);
		if(hmac==null){
			hmac = document.createElement("input");
			hmac.setAttribute("type", "hidden");
			hmac.setAttribute("id", "transkey_HM_"+inputObj.id+frmId);
			hmac.setAttribute("name", "transkey_HM_"+inputObj.id+frmId);
			hmac.setAttribute("value", "");
			obj.appendChild(hmac);
		} else {
			hmac.setAttribute("value", "");
		}
		
		if(ExE2E!=null){
			var e2e = document.getElementById("transkey_ExE2E_"+inputObj.id+frmId);
			if(e2e==null){
				e2e = document.createElement("input");
				e2e.setAttribute("type", "hidden");
				e2e.setAttribute("id", "transkey_ExE2E_"+inputObj.id+frmId);
				e2e.setAttribute("name", "transkey_ExE2E_"+inputObj.id+frmId);
				e2e.setAttribute("value", ExE2E);
				obj.appendChild(e2e);
			} else {
				e2e.setAttribute("value", ExE2E);
			}
		}
	};
	
	this.setKeyType = function(dataType){
		if(dataType==undefined){
			return "lower";
		}
		switch(dataType.charAt(0)){
		case 'a':
			return "lower";
		case 'A':
			return "upper";
		case '@' :
			return "special";
		}
		
	};
	
	this.getText = function(encrypted, ele){
		var request = new XMLHttpRequest();
		var isAsync = false;
		
		if(!useSession){
			var seedKey = document.getElementById("seedKey"+this.now.frmId).value;
		}
		
		if(transkey_apiuse){
			request.open("POST", transkey_apiurl + "service/letter", useAsyncTranskey);
		} else {
			request.open("POST", transkey_surl, useAsyncTranskey);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		}
		
		if(useCORS)
			request.withCredentials = true;
		else
			request.setRequestHeader("Cache-Control", "no-cache");
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				if(request.responseText.indexOf("SessionError")>-1){
					var errCodes = request.responseText.split("=");
					if(errCodes[1]=="1"){
						tk_alert("세션이 만료되었습니다.");
						mtk.now.clear();
						if(transkey_apiuse){
							mtk.resetToken(transkey_apiurl);
							mtk.resetSessionKey(transkey_apiurl);
						}else{
							mtk.resetToken(transkey_surl);
							mtk.resetSessionKey(transkey_surl);
						}
						if(!useSession&&limitTime>0)
							mtk.now.getInitTime();
//						mtk.now.allocation();

						if(useSession) {
							mtk.now.setKeyType(mtk.now.keyType);
							if(transkey_divType==0)
								mtk.now.setUrl();
						} else {
							mtk.now.setKeyIndex(mtk.now.inputObj);
						}
					}
				} else if(request.responseText.indexOf("TK-2008")>-1){
					tk_alert("세션키가 존재하지 않습니다.");
				} else if(request.responseText.indexOf("LimitTimeOver")>-1){
					tk_alert("시간이 만료되었습니다.");
					mtk.now.clear();
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						mtk.now.getInitTime();
//					mtk.now.allocation();

					if(useSession) {
						mtk.now.setKeyType(mtk.now.keyType);
						if(transkey_divType==0)
							mtk.now.setUrl();
					} else {
						mtk.now.setKeyIndex(mtk.now.inputObj);
					}
				} else if(request.responseText.indexOf("Integrity verification failed")>-1){
					tk_alert("데이터 무결성 검증에 실패하였습니다.");
					mtk.now.clear();
					if(transkey_apiuse){
						mtk.resetToken(transkey_apiurl);
						mtk.resetSessionKey(transkey_apiurl);
					}else{
						mtk.resetToken(transkey_surl);
						mtk.resetSessionKey(transkey_surl);
					}
					if(!useSession&&limitTime>0)
						mtk.now.getInitTime();
//					mtk.now.allocation();

					if(useSession) {
						mtk.now.setKeyType(mtk.now.keyType);
						if(transkey_divType==0)
							mtk.now.setUrl();
					} else {
						mtk.now.setKeyIndex(mtk.now.inputObj);
					}
				} else {
					mtk.now.inputObj.value = mtk.now.inputObj.value + request.responseText;
					if(mtk.now.useInput) {
						var value = mtk.now.inputObj.value;
						if(mtk.now.useInputDiv.childElementCount>4) {
							mtk.now.useInputDiv.childNodes[value.length*2+1].value = value[value.length-1];
						}
						else
							mtk.now.useInputDiv.childNodes[3].value = mtk.now.inputObj.value;
					}
					mtk.now.hidden.value += transkey_delimiter + encrypted;
					if(mtk.now.inputObj.maxLength>0){
						if (mtk.now.inputObj.value.length >= mtk.now.inputObj.maxLength) {
							mtk.close();
							return;
						}
					}

				}
			}
		};
		
		try {
			if(transkey_apiuse){
				if(!useSession) {
					request.send("name="+this.now.id+"&value=" +encrypted+"&keyIndex=" +this.now.keyIndex+"&fieldType=" +this.now.fieldType+"&keyboardType=" +this.now.keyboard+"&encSeedKey="+seedKey +"&initTime="+initTime+tk_origin);
				}
				else{
					request.send("transkeyUuid="+this.transkeyUuid+"&name="+this.now.id+"&value=" +encrypted+"&TK_requestToken="+TK_requestToken+tk_origin);
				}
			}else{
				if(!useSession) {
					request.send("op=letter&name="+this.now.id+"&value=" +encrypted+"&keyIndex=" +this.now.keyIndex+"&fieldType=" +this.now.fieldType+"&keyboardType=" +this.now.keyboard+"&encSeedKey="+seedKey +"&initTime="+initTime+tk_origin);
				}
				else{
					request.send("op=letter&transkeyUuid="+this.transkeyUuid+"&name="+this.now.id+"&value=" +encrypted+"&TK_requestToken="+TK_requestToken+tk_origin);
				}
			}
		} catch(e) {
			tk_alert("[mTranskey Error] : 요청 처리 중 오류가 발생하였습니다.");
			return false;
		}
	};
	
	
	this.getFakeKey = function(){
		var rnd1,rnd2;
		var k=4;
		if(useNoDummy)
			var k=3;
		
		if(transkey_divType==1){
			if(this.now.keyboardType=="numberMobile"){
				rnd1 = tk_Random.random(1, 4, mtk.browser,navigator); 
				rnd2 = tk_Random.random(0, k, mtk.browser,navigator); 
			}else{
				rnd1 = tk_Random.random(1, 5, mtk.browser,navigator);
				rnd2 = tk_Random.random(0, 11, mtk.browser,navigator);
				if(rnd1==4){
					if(rnd2==0)
						rnd2=rnd2+1;
					else if(rnd2>8)
						rnd2=rnd2-3;
				}
			}
		}else{
			if(this.now.keyboardType=="numberMobile"){
				rnd1 = getRandomValue(2)+3;
				rnd2 = getRandomValue(6);
				
			}else{
				rnd1 = getRandomValue(4)+5;
				rnd2 = getRandomValue(11);
				if(rnd1==8){
					if(rnd2==0)
						rnd2=rnd2+1;
					else if(rnd2>8)
						rnd2=rnd2-getRandomValue(6);
				}
			}
		}
		
		return mtk.now.div.children[rnd1].children[rnd2];
	};
	
    function getRandomValue(range) {
    	return new GenKey().tk_getrnd_int() % range;
    }
	
	this.setQwertyMobileCss = function(){
		var qwertyCss = "";
		
		if(this.clientWidth>=600&&this.clientHeight>=600&&!this.horizontal){
			qwertyCss = "transkey_qwerty3";
		}else if(this.clientWidth>=360){
			qwertyCss = "transkey_qwerty2";
		}else{
			qwertyCss = "transkey_qwerty1";
		}
		
		this.cssText["qwertyMobile"].div = "transkey_div "+qwertyCss+"_div";
		this.cssText["qwertyMobile"].layout = qwertyCss+"_layout";
		this.cssText["qwertyMobile"].row = qwertyCss+"_row";
		this.cssText["qwertyMobile"].key1 = qwertyCss+"_key1";
		this.cssText["qwertyMobile"].key2 = qwertyCss+"_key2";
		this.cssText["qwertyMobile"].del = qwertyCss+"_del";
		this.cssText["qwertyMobile"].sp = qwertyCss+"_sp";
		this.cssText["qwertyMobile"].clear = qwertyCss+"_clear";
		this.cssText["qwertyMobile"].done = qwertyCss+"_done";
		
	};
	
	this.setNumberMobileCss = function(){
		var numberCss="";
		if(this.clientWidth>=600&&this.clientHeight>=600&&!this.horizontal){
			numberCss = "transkey_number3";
		}else if(this.clientWidth>=360){
			numberCss = "transkey_number2";
		}else{
			numberCss = "transkey_number1";
		}
		
		this.cssText["numberMobile"].div = "transkey_div "+numberCss+"_div";
		this.cssText["numberMobile"].layout = numberCss+"_layout";
		this.cssText["numberMobile"].row = numberCss+"_row";
		this.cssText["numberMobile"].key1 = numberCss+"_key1";
		this.cssText["numberMobile"].key2 = numberCss+"_key2";
		this.cssText["numberMobile"].del = numberCss+"_del";
		this.cssText["numberMobile"].clear = numberCss+"_clear";
		this.cssText["numberMobile"].done = numberCss+"_done";
	};
	
	this.setPatternMobileCss = function(){
		var numberCss="";
		if(this.clientWidth>=600&&this.clientHeight>=600&&!this.horizontal){
			numberCss = "transkey_number3";
		}else if(this.clientWidth>=360){
			numberCss = "transkey_number2";
		}else{
			numberCss = "transkey_number1";
		}
		
		this.cssText["numberMobile"].div = "transkey_div "+numberCss+"_div";
		this.cssText["numberMobile"].layout = numberCss+"_layout";
		this.cssText["numberMobile"].row = numberCss+"_row";
		this.cssText["numberMobile"].key1 = numberCss+"_key1";
		this.cssText["numberMobile"].key2 = numberCss+"_key2";
		this.cssText["numberMobile"].del = numberCss+"_del";
		this.cssText["numberMobile"].clear = numberCss+"_clear";
		this.cssText["numberMobile"].done = numberCss+"_done";
	};
	
	this.setQwertyMobileLayout = function(id, div, cssName){
		this.setQwertyMobileCss();
		if(transkey_divType==0){
			div.className=this.cssText.qwertyMobile.div;
			qwertyMobileLayout(div, id, this.cssText.qwertyMobile);
		}else if(transkey_divType==1){
			qwertyMobileLayoutForDIV_noInline(div, id, cssName);
		}
	};
	
	this.setNumberMobileLayout = function(id, div, cssName){
		this.setNumberMobileCss();
		if(transkey_divType==0){
			div.className=this.cssText.numberMobile.div;
			numberMobileLayout(div, id, this.cssText.numberMobile);
		}else if(transkey_divType==1){
			if(useNoDummy){
				numberMobileNDLayoutForDIV_noInline(div, id, cssName);
			}else{
				numberMobileLayoutForDIV_noInline(div, id, cssName);
			}
				
		}
	};
	
	this.setPatternMobileLayout = function(id, div, cssText){
		this.setPatternMobileCss();
		
		div.appendChild(patternMobileHorizontalLine(id, cssText));
		div.appendChild(patternMobileVerticalLine(id, cssText));
		div.appendChild(patternMobileDiagonalForwardLine(id, cssText));
		div.appendChild(patternMobileDiagonalBackwardLine(id, cssText));
	
        var layout = document.createElement("div");
        layout.id = "mtk_disp";
		layout.className = "dv_transkey_pattern_disp";
		
		var layoutA1 = document.createElement("a");
		layoutA1.className = "dv_"+cssText+"_disp_b";
		if (document.addEventListener) {
			layoutA1.addEventListener( "click", function(){mtk.close();});
		}else{
			layoutA1.attachEvent( "onclick", function(){mtk.close();});
		}
		layoutA1.role = "button";
		layoutA1.tabIndex = "0";
		layoutA1.ariaLabel = "가상키보드 닫기";
		
		layout.appendChild(layoutA1);
        div.appendChild(layout);
        
        
        for(var i=0; i<3; i++) {
			var layoutDiv = document.createElement("div");
			if(i==0) {
				layoutDiv.className = "dv_"+cssText+"_div4_1";
			}else {
				layoutDiv.className = "dv_"+cssText+"_div4_2";
			}
			
			for(var j=0; j<3; j++) {
				var patternA = document.createElement("a");
				if(i==0) {
					pattenrA.className = "dv_"+cssText+"_div4_1_1";
				}else {
					pattenrA.className = "dv_"+cssText+"_div4_2_1";
					if(j==0) {
						patternA.id = i * 3 + 1;
					}
				}
				if(j==3) {
					patternA.classList.add("dv_"+cssText+"_end");
				}
				
				var patternDiv = document.createElement("div");
				pattenrDiv.className = "tk_pattern_btn";
				
				patternA.appendChild(patternDiv);
				layoutDiv.appendChild(patternA);
			}
			
			div.appendChild(layoutDiv);
		}

	};
	
	this.checkCSS = function() {
		var check_result;
	    var ss = document.styleSheets;
	    for (var i = 0, max = ss.length; i < max; i++) {
	        if (ss[i].href == (window.location.origin + transkey_url+"/transkey.css"))
	        	check_result = true;
	    }
	    
		if(typeof(document.querySelector) != "undefined") {
			var element;
			if(transkey_divType == 0)
				element = document.querySelector('.transkey_div');
			else if(transkey_divType == 1)
				element = document.querySelector('.dv_transkey_div');
			
			if(typeof(getComputedStyle) != "undefined") {
				var style = getComputedStyle(element);

				if(style == null)
		        	check_result = false;
				else {
		        	check_result = true;
		        	
					if(transkey_divType == 0) {
						if (style.zIndex != 1000) {
				        	check_result = false;
						}
					} else {
						if (style.zIndex != 9999) {
				        	check_result = false;
						}
					}
				}
			} else {
				return;
			}
		} else {
			return;
		}
		
	    if(!check_result) {
	    	tk_alert("css 로딩에 실패하였습니다");
	    	//try reload css
//		    var link = document.createElement("link");
//		    link.rel = "stylesheet";
//		    link.href = "/transkey_mobile/transkey.css"
//		    document.getElementsByTagName("head")[0].appendChild(link);
	    }
		
	};
	
	this.checkKeyVer = function() {
		if(typeof qwertyMobileHash == "undefined" || typeof numberMobileHash == "undefined") {
			tk_alert("[mTranskey Error] : 키보드 버전 체크에 실패하였습니다.");
		} else {
			if(setQwertyMobileHash != qwertyMobileHash)
				tk_alert("[mTranskey Error] : Qwerty 키보드 버전 체크에 실패하였습니다.");
			if(setNumberMobileHash != numberMobileHash)
				tk_alert("[mTranskey Error] : Number 키보드 버전 체크에 실패하였습니다.");
		}
	};
	
	function offsetPoint() {
		this.x = 0;
		this.y = 0;
	}

	function getOffsetPoint(Element) {

        var point = new offsetPoint();

        point.x = 0;
        point.y = 0;

        var is_sibling = Element.getAttribute("data-tk-nextSibling")
        if(is_sibling == undefined || is_sibling == false) {        
	        while (Element) {
	            point.x += Element.offsetLeft;
	            point.y += Element.offsetTop;
	
	            Element = Element.offsetParent;
	
	            if(Element==null)
	                break;
	        }
        } else {
            point.x = Element.offsetLeft;
            point.y = Element.offsetTop;
        }

        return point;
	}


	function SeedEnc(geo) {
		var iv = [0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x4b, 0x65, 0x79, 0x31, 0x30];
		var tsize = 64;
		var inData = new Array(tsize);		
		var outData = new Array(tsize);
		var roundKey = new Array(32);
		var isPattern = false;
		var i = 0; 
	  
		for(i=0; i<geo.length; i++)
		{			
			if(geo.charAt(i) == "l" || geo.charAt(i) == "u" || geo.charAt(i) == "s" || geo.charAt(i) == "d")
			{
				inData[i] = Number(geo.charCodeAt(i));
				continue;
			}
			else if(geo.charAt(i) == " ")
			{ 
				inData[i] = Number(geo.charCodeAt(i));
				continue;
			}
			inData[i] = Number(geo.charAt(i).toString(16));
		}
		
		if(mtk.now!=null){
			if(mtk.now.keyboardType=="patternMobile"){
				patternCount++;
				isPattern = true;
			}
		}
		
		if(!useSession&&limitTime>0&&!isPattern) {
			inData[i++] = 32;
			for(var k = 0 ; k<initTime.length; k++)
			{
				if(initTime.charAt(k) == "-")
					inData[i++] = Number(initTime.charCodeAt(k));
				else
					inData[i++] = initTime[k];
			}
		}
				
		inData[i++] = 32;
		inData[i++] = 101;	
		
		for( ;i <tsize; i++){
			var rndInt = genKey.tk_getrnd_int();		
			inData[i] = rndInt % 100;
		}
		 
		Seed.SeedSetKey(roundKey, sessionKey);		
		Seed.SeedEncryptCbc(roundKey, iv, inData, tsize, outData);
		
		var encodedData = new Array(tsize);
		var encodedDataString = "";
	
		for(var k=0; k<tsize; k++)
		{
			if(transkey_encDelimiter == null)
				encodedData[k] = Number(outData[k]).toString(16);
			else
				encodedDataString += Number(outData[k]).toString(16)+transkey_encDelimiter;
		}
			
		if(transkey_encDelimiter == null)
			return encodedData;
		else
			return encodedDataString.substring(0, encodedDataString.length-1);
	}
	
	function Key() {
		this.name = "";
		
		this.npoints = 0;
		this.xpoints = new Array();
		this.ypoints = new Array();
		
		this.addPoint = function(x, y) {
			this.npoints++;
			this.xpoints.push(x);
			this.ypoints.push(y);
		};
		
		this.contains = function(x, y) {
			var startx = this.xpoints[0];
			var starty = this.ypoints[0];
			
			var endx = this.xpoints[2];
			var endy = this.ypoints[2];
			
			if ( startx < x && starty < y )
			{
				if ( endx > x && endy > y )
				{
					return 1;
				}
			}
			
			return 0;
		};
	}
	
	function addEvent(ele, func, cnt) {
		if(func == "cap") {
			if (document.addEventListener) {
				ele.addEventListener( startEvent, function(){mtk.cap(event,  ele)});
			}else{
				ele.attachEvent( "on"+startEvent, function(){mtk.cap(event,  ele)});
			}
		}else if(func == "del") {
			if (document.addEventListener) {
				ele.addEventListener( startEvent, function(){mtk.del(event,  ele)});
			}else{
				ele.attachEvent( "on"+startEvent, function(){mtk.del(event,  ele)});
			}
		}else if(func == "sp") {
			if (document.addEventListener) {
				ele.addEventListener( startEvent, function(){mtk.sp(event,  ele)});
			}else{
				ele.attachEvent( "on"+startEvent, function(){mtk.sp(event,  ele)});
			}
		}else if(func == "clear") {
			if (document.addEventListener) {
				ele.addEventListener( startEvent, function(){mtk.clear(event,  ele)});
			}else{
				ele.attachEvent( "on"+startEvent, function(){mtk.clear(event,  ele)});
			}
		}else if(func == "done") {
			if (document.addEventListener) {
				ele.addEventListener( startEvent, function(){mtk.done(event,  ele)});
			}else{
				ele.attachEvent( "on"+startEvent, function(){mtk.done(event,  ele)});
			}
		}else {
			if (document.addEventListener) {
				ele.addEventListener( startEvent, function(){mtk.start(event,  ele, cnt)});
			}else{
				ele.attachEvent( "on"+startEvent, function(){mtk.start(event,  ele, cnt)});
			}
		}
		
	}

	function qwertyMobileLayout(div, id, cssText){
		
		var dispDiv = document.createElement("div");
		dispDiv.id = "mtk_disp";
		dispDiv.className = "dv_"+cssText+"_disp";
		dispDiv.style.cssText = "height: 1px; border:0px;";
		dispDiv.role = "button";
		dispDiv.tabIndex = "0";
		dispDiv.ariaLabel = "가상키보드 영역 입니다";
		div.appendChild(dispDiv);
		
		var warningSpan = document.createElement("span");
		warningSpan.className = "transkey_warning";
		warningSpan.textContent = tk_comments;
		div.appendChild(warningSpan);
		
		var lowerSpan = document.createElement("span");
		lowerSpan.id = "mtk_"+id+"_lower";
		lowerSpan.className = "transkey_layout "+cssText.layout;
		div.appendChild(lowerSpan);
		
		var upperSpan = document.createElement("span");
		upperSpan.id = "mtk_"+id+"_upper";
		upperSpan.className = "transkey_layout "+cssText.layout;
		div.appendChild(upperSpan);
		
		var specialSpan = document.createElement("span");
		specialSpan.id = "mtk_"+id+"_special";
		specialSpan.className = "transkey_layout "+cssText.layout;
		div.appendChild(specialSpan);
		
		var cnt = 0;
		for(var i=0; i<4; i++) {
			var rowDiv = document.createElement("div");
			rowDiv.id = "mtk_"+id+"_Row"+i;
			rowDiv.className = "transkey_row "+cssText.row;
			
			for(var j=0; j<11; j++) {
				var keyA = document.createElement("a");
				
				if(i==3 && j==0) {
					keyA.id = "mtk_cp";
					keyA.className = "transkey_key "+cssText.key1;
					addEvent(keyA, "cap", null);
				}else if(i==3 && j==9) {
					keyA.id = "mtk_del";
					keyA.className = "transkey_key "+cssText.del;
					addEvent(keyA, "del", null);
					
					j++;
				}else {
					if((i + cnt)%2 == 0) {
						keyA.className = "transkey_key "+cssText.key1;
					}else {
						keyA.className = "transkey_key "+cssText.key2;
					}
					
					addEvent(keyA, "start", cnt);
					
					cnt++;
				}
				
				rowDiv.appendChild(keyA);
				
			}
			
			div.appendChild(rowDiv);
		}
		
		var lastRowDiv = document.createElement("div");
		lastRowDiv.id = "mtk_"+id+"_Row4";
		lastRowDiv.className = "transkey_row "+cssText.row;
		
		var spA = document.createElement("a");
		spA.id = "mtk_sp";
		spA.className = "transkey_key "+cssText.sp;
		addEvent(spA, "sp", null);
		lastRowDiv.appendChild(spA);
		
		var clearA = document.createElement("a");
		clearA.id = "mtk_clear";
		clearA.className = "transkey_key "+cssText.clear;
		addEvent(clearA, "clear", null);
		lastRowDiv.appendChild(clearA);
		
		var doneA = document.createElement("a");
		doneA.id = "mtk_done";
		doneA.className = "transkey_key "+cssText.done;
		addEvent(doneA, "done", null);
		lastRowDiv.appendChild(doneA);
		
		div.appendChild(lastRowDiv);
		
	}
	
	function numberMobileLayout(div, id, cssText){
		
		var dispDiv = document.createElement("div");
		dispDiv.id = "mtk_disp";
		dispDiv.className = "dv_"+cssText+"_disp";
		dispDiv.style.cssText = "height: 1px; border:0px;";
		dispDiv.role = "button";
		dispDiv.tabIndex = "0";
		dispDiv.ariaLabel = "가상키보드 영역 입니다";
		div.appendChild(dispDiv);
		
		var warningSpan = document.createElement("span");
		warningSpan.className = "transkey_warning";
		warningSpan.textContent = tk_comments;
		div.appendChild(warningSpan);
		
		var numberSpan = document.createElement("span");
		numberSpan.id = "mtk_"+id+"_number";
		numberSpan.className = "transkey_layout "+cssText.layout;
		div.appendChild(numberSpan);
		
		var cnt = 0;
		for(var i=0; i<2; i++) {
			var rowDiv = document.createElement("div");
			rowDiv.id = "mtk_"+id+"_Row"+i;
			rowDiv.className = "transkey_row "+cssText.row;
			
			for(var j=0; j<6; j++) {
				var keyA = document.createElement("a");
				
				if(j==0 || cnt%2 == 1) {
					keyA.className = "transkey_key "+cssText.key1;
				}else {
					keyA.className = "transkey_key "+cssText.key2;
				}
				
				addEvent(keyA, "start", cnt);
				
				cnt++;
				
				rowDiv.appendChild(keyA);
				
			}
			
			div.appendChild(rowDiv);
		}
		
		var lastRowDiv = document.createElement("div");
		lastRowDiv.id = "mtk_"+id+"_Row2";
		lastRowDiv.className = "transkey_row "+cssText.row;
		
		var clearA = document.createElement("a");
		clearA.id = "mtk_clear";
		clearA.className = "transkey_key "+cssText.clear;
		addEvent(clearA, "clear", null);
		lastRowDiv.appendChild(clearA);
		
		var delA = document.createElement("a");
		delA.id = "mtk_del";
		delA.className = "transkey_key "+cssText.del;
		addEvent(delA, "del", null);
		lastRowDiv.appendChild(delA);
		
		var doneA = document.createElement("a");
		doneA.id = "mtk_done";
		doneA.className = "transkey_key "+cssText.done;
		addEvent(doneA, "done", null);
		lastRowDiv.appendChild(doneA);
		
		div.appendChild(lastRowDiv);
		
	}
	
	function qwertyMobileLayoutForDIV_noInline(div, id, cssText){

		var dispDiv = document.createElement("div");
		dispDiv.id = "mtk_disp";
		
		if(document.getElementById(id).getAttribute("data-tk-useinput")=="true") {
			dispDiv.style.cssText = "height: 1px; border:0px;";
			dispDiv.role = "button";
			dispDiv.tabIndex = "0";
			dispDiv.ariaLabel = "가상키보드 영역 입니다";
		}else {
			dispDiv.className = "dv_"+cssText+"_disp";
			
			var dispA = document.createElement("div");
			dispA.className = "dv_"+cssText+"_disp_a";
			dispA.role = "button";
			dispA.tabIndex = "0";
			dispA.ariaLabel = "가상키보드 영역 입니다";
			
			dispDiv.appendChild(dispA);
			
			var dispB = document.createElement("a");
			dispB.className = "dv_"+cssText+"_disp_b";
			dispB.role = "button";
			dispB.tabIndex = "0";
			dispB.ariaLabel = "가상키보드 닫기";
			
			dispDiv.appendChild(dispB);
		}
		
		div.appendChild(dispDiv);
		
		var bgPositionX = [-4, -39, -73, -108, -143, -178, -213, -248, -284, -319, -354];
		var bgPositionY = [-9, -60, -108, -161];
		
		for(var i=0; i<4; i++) {
			var rowDiv = document.createElement("div");
			rowDiv.className = "dv_"+cssText+"_div_2  dv_"+cssText+"_div2_Height";
			
			for(var j=0; j<11; j++) {
				var keyA = document.createElement("a");
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div2 dv_"+cssText+"_div2_Height";
				if(i<4 && j==4) {
					keyA.classList.add("dv_"+cssText+"_blank");
				}
				if(j==10) {
					keyA.classList.add("dv_"+cssText+"_end");
				}
				
				var keyDiv = document.createElement("div");
				keyDiv.className = "dv_"+cssText+"_div2_2  dv_"+cssText+"_div2_2_qTop";
				keyDiv.style.backgroundPositionX = bgPositionX[j]+"px";
				keyDiv.style.backgroundPositionY = bgPositionY[i]+"px";
				
				if(i==3) {
					if(j==0) {
						keyA.classList.add("dv_"+cssText+"_div_a");
						keyA.id = "mtk_cp";
						keyA.ariaLabel = "쉬프트";
						
						keyDiv.style.backgroundPositionX = "-2px";
						keyDiv.style.backgroundPositionY = "-157px";
					}else if(j==9) {
						keyA.classList.add("dv_"+cssText+"_div_a");
						keyA.classList.add("dv_"+cssText+"_end");
						keyA.id = "mtk_del";
						keyA.ariaLabel = "삭제";
						
						keyDiv.style.backgroundPositionX = "-338px";
						keyDiv.style.backgroundPositionY = "-157px";
						j++;
					}
				}
				
				keyA.appendChild(keyDiv);
				rowDiv.appendChild(keyA);
			}
			
			div.appendChild(rowDiv);
			
		}
		
		var lastRowDiv = document.createElement("div");
		lastRowDiv.className = "dv_"+cssText+"_div_2 dv_"+cssText+"_end dv_"+cssText+"_div2_Height";
		
		var specialKeyA = document.createElement("a");
		specialKeyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_a dv_"+cssText+"_div2_Height";
		specialKeyA.ariaLabel = "특수키";
		specialKeyA.id = "mtk_sp";
		
		var specialKeyDiv = document.createElement("div");
		specialKeyDiv.className = "dv_"+cssText+"_div3_2 dv_"+cssText+"_div3_3_qTop";
		
		if(useSpace) {
			specialKeyDiv.style.cssText = "background-position:-16px -211px;";
		} else {
			specialKeyDiv.style.cssText = "width:42px;height:27px;background-position:-31px -211px;";
		}
		
		specialKeyA.appendChild(specialKeyDiv);
		lastRowDiv.appendChild(specialKeyA);
		
		var relocationKeyA = document.createElement("a");
		relocationKeyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_a dv_"+cssText+"_div2_Height";
		
		var relocationKeyDiv = document.createElement("div");
		relocationKeyDiv.className = "dv_"+cssText+"_div3_3 dv_"+cssText+"_div3_3_qTop";
		
		if(relocation == true){
			relocationKeyA.ariaLabel = "재배열";
			relocationKeyDiv.style.cssText = "background-position:0px -9px; background-size:100%";
		}else{
			relocationKeyA.ariaLabel = "전체삭제";
			if(useSpace) {
				relocationKeyDiv.style.backgroundPosition = "-75px -211px";
			}else {
				relocationKeyDiv.style.backgroundPosition = "-130px -212px";
			}
		}
		
		relocationKeyA.appendChild(relocationKeyDiv);
		lastRowDiv.appendChild(relocationKeyA);
		
		if(useSpace) {
			var spaceKeyA = document.createElement("a");
			spaceKeyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_a dv_"+cssText+"_div2_Height";
			spaceKeyA.ariaLabel = "스페이스바";
			spaceKeyA.id = "mtk_space";
			
			var spaceKeyDiv = document.createElement("div");
			spaceKeyDiv.className = "dv_"+cssText+"_div3_3 dv_"+cssText+"_div3_3_qTop";
			spaceKeyDiv.style.backgroundPosition = "-162px -212px";
			
			spaceKeyA.appendChild(spaceKeyDiv);
			lastRowDiv.appendChild(spaceKeyA);
		}
		
		var doneKeyA = document.createElement("a");
		doneKeyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_b dv_"+cssText+"_end dv_"+cssText+"_div2_Height";
		doneKeyA.ariaLabel = "입력완료";
		
		var doneKeyDiv = document.createElement("div");
		doneKeyDiv.className = "dv_"+cssText+"_div3_5 dv_"+cssText+"_div3_3_qTop";
		
		if(useSpace) {
			doneKeyDiv.style.backgroundPosition = "-282px -211px";
		} else {
			doneKeyDiv.style.backgroundPosition = "-263px -211px";	
		}
		
		doneKeyA.appendChild(doneKeyDiv);
		lastRowDiv.appendChild(doneKeyA);
		
		div.appendChild(lastRowDiv);
		
		
		if(showLicense&&mtk.licenseType!="") {
			var licenseDiv = document.createElement("div");
			licenseDiv.id = "mtk_lic";
			licenseDiv.className = "dv_"+cssText+"_licenseType";
			licenseDiv.style.cssText = "position: absolute; margin: 5px; color: red;";
			licenseDiv.textContent = mtk.licenseType + " (" + mtk.licExpiredDate + ")";
			
			div.appendChild(licenseDiv);
		}
		
	}
	
	function numberMobileLayoutForDIV_noInline(div, id, cssText){
		var dispDiv = document.createElement("div");
		dispDiv.id = "mtk_disp";
		
		if(document.getElementById(id).getAttribute("data-tk-useinput")=="true") {
			dispDiv.style.cssText = "height: 1px; border:0px;";
			dispDiv.role = "button";
			dispDiv.tabIndex = "0";
			dispDiv.ariaLabel = "가상키보드 영역 입니다";
		}else {
			dispDiv.className = "dv_"+cssText+"_disp";
			
			var dispA = document.createElement("div");
			dispA.className = "dv_"+cssText+"_disp_a";
			dispA.role = "button";
			dispA.tabIndex = "0";
			dispA.ariaLabel = "가상키보드 영역 입니다";
			
			dispDiv.appendChild(dispA);
			
			var dispB = document.createElement("a");
			dispB.className = "dv_"+cssText+"_disp_b";
			dispB.role = "button";
			dispB.tabIndex = "0";
			dispB.ariaLabel = "가상키보드 닫기";
			
			dispDiv.appendChild(dispB);
		}
		
		div.appendChild(dispDiv);
		
		var bgPositionX = [-33, -131, -228, -327];
		var bgPositionY = [-20, -81, -142];
		
		for(var i=0; i<3; i++) {
			var rowDiv = document.createElement("div");
			rowDiv.className = "dv_"+cssText+"_div_2 dv_"+cssText+"_div2_Height";
			
			for(var j=0; j<4; j++) {
				var keyA = document.createElement("a");
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div2 dv_"+cssText+"_div2_Height";
				
				if(j==3) {
					keyA.classList.add("dv_"+cssText+"_end");
				}
				
				var keyDiv = document.createElement("div");
				keyDiv.className = "dv_"+cssText+"_div2_2 dv_"+cssText+"_div2_2_nTop";
				keyDiv.style.backgroundPositionX = bgPositionX[j]+"px";
				keyDiv.style.backgroundPositionY = bgPositionY[i]+"px";
				
				keyA.appendChild(keyDiv);
				rowDiv.appendChild(keyA);
			}
			
			div.appendChild(rowDiv);
		}
		
		var lastRowDiv = document.createElement("div");
		lastRowDiv.className = "dv_"+cssText+"_div_2 dv_"+cssText+"_end dv_"+cssText+"_div2_Height";
		
		for(var i=0; i<3; i++) {
			var keyA = document.createElement("a");
			var keyDiv = document.createElement("div");

			if(i==0) {
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_a dv_"+cssText+"_div2_Height";
				keyA.ariaLabel = "삭제";
				
				keyDiv.className = "dv_"+cssText+"_div2_2 dv_"+cssText+"_div2_2_nTop";
				keyDiv.style.cssText = "background-position:-33px -203px;";
			}else if(i==1) {
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_a dv_"+cssText+"_div2_Height";
				keyDiv.className = "dv_"+cssText+"_div3_3 dv_"+cssText+"_div3_3_nTop";
				
				if(relocation == true) {
					keyA.ariaLabel = "재배열";
					keyDiv.style.cssText = "background-position:-1px -11px; background-size:100%;";
				}else {
					keyA.ariaLabel = "전체 삭제";
					keyDiv.style.cssText = "background-position:-114px -206px;";
				}
			}else {
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3  dv_"+cssText+"_div_b dv_"+cssText+"_end dv_"+cssText+"_div2_Height";
				keyA.ariaLabel = "확인";
				
				keyDiv.className = "dv_"+cssText+"_div3_2 dv_"+cssText+"_div3_3_nTop";
				keyDiv.style.cssText = "background-position:-272px -206px;";
			}
			
			keyA.appendChild(keyDiv);
			lastRowDiv.appendChild(keyA);
		}
		
		div.appendChild(lastRowDiv);
		
		if(showLicense&&mtk.licenseType!="") {
			var licenseDiv = document.createElement("div");
			licenseDiv.id = "mtk_lic";
			licenseDiv.className = "dv_"+cssText+"_licenseType";
			licenseDiv.style.cssText = "position: absolute; margin: 5px; color: red;";
			licenseDiv.textContent = mtk.licenseType + " (" + mtk.licExpiredDate + ")";
			
			div.appendChild(licenseDiv);
		}

	}
	
	function numberMobileNDLayoutForDIV_noInline(div, id, cssText){
		
		var dispDiv = document.createElement("div");
		dispDiv.id = "mtk_disp";
		
		if(document.getElementById(id).getAttribute("data-tk-useinput")=="true") {
			dispDiv.style.cssText = "height: 1px; border:0px;";
			dispDiv.role = "button";
			dispDiv.tabIndex = "0";
			dispDiv.ariaLabel = "가상키보드 영역 입니다";
		}else {
			dispDiv.className = "dv_"+cssText+"_disp";
			
			var dispA = document.createElement("div");
			dispA.className = "dv_"+cssText+"_disp_a";
			dispA.role = "button";
			dispA.tabIndex = "0";
			dispA.ariaLabel = "가상키보드 영역 입니다";
			
			dispDiv.appendChild(dispA);
			
			var dispB = document.createElement("a");
			dispB.className = "dv_"+cssText+"_disp_b";
			dispB.role = "button";
			dispB.tabIndex = "0";
			dispB.ariaLabel = "가상키보드 닫기";
			
			dispDiv.appendChild(dispB);
		}
		
		div.appendChild(dispDiv);

		var bgPositionX = [-39, -147, -254];
		var bgPositionY = [-21, -82, -144];
		
		for(var i=0; i<3; i++) {
			var rowDiv = document.createElement("div");
			rowDiv.className = "dv_"+cssText+"_div_2 dv_"+cssText+"_div2_Height";
			
			for(var j=0; j<3; j++) {
				var keyA = document.createElement("a");
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div2 dv_"+cssText+"_div2_Height";
				
				if(j==2) {
					keyA.classList.add("dv_"+cssText+"_end");
				}
				
				var keyDiv = document.createElement("div");
				keyDiv.className = "dv_"+cssText+"_div2_3 dv_"+cssText+"_div2_2_nTop";
				keyDiv.style.backgroundPositionX = bgPositionX[j]+"px";
				keyDiv.style.backgroundPositionY = bgPositionY[i]+"px";
				
				keyA.appendChild(keyDiv);
				rowDiv.appendChild(keyA);
			}
			
			div.appendChild(rowDiv);
		}
		
		var lastRowDiv = document.createElement("div");
		lastRowDiv.className = "dv_"+cssText+"_div_2 dv_"+cssText+"_end dv_"+cssText+"_div2_Height";
		
		for(var i=0; i<3; i++) {
			var keyA = document.createElement("a");
			var keyDiv = document.createElement("div");

			if(i==0) {
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3 dv_"+cssText+"_div_a dv_"+cssText+"_div2_Height";
				keyA.ariaLabel = "삭제";
				
				keyDiv.className = "dv_"+cssText+"_div2_3 dv_"+cssText+"_div2_2_nTop";
				keyDiv.style.cssText = "background-position:-37px -203px;";
			}else if(i==1) {
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div2 dv_"+cssText+"_div2_Height";
				keyA.ariaLabel = "전체 삭제";
				
				keyDiv.className = "dv_"+cssText+"_div2_3 dv_"+cssText+"_div2_2_nTop";
				keyDiv.style.cssText = "background-position:-147px -207px;";
			}else {
				keyA.className = "dv_"+cssText+"_div_key dv_"+cssText+"_div3  dv_"+cssText+"_div_b dv_"+cssText+"_end dv_"+cssText+"_div2_Height";
				keyA.ariaLabel = "확인";
				
				keyDiv.className = "dv_"+cssText+"_div3_4 dv_"+cssText+"_div3_3_nTop";
				keyDiv.style.cssText = "background-position:-243px -206px;";
			}
			
			keyA.appendChild(keyDiv);
			lastRowDiv.appendChild(keyA);
		}
		
		div.appendChild(lastRowDiv);
		
		if(showLicense&&mtk.licenseType!="") {
			var licenseDiv = document.createElement("div");
			licenseDiv.id = "mtk_lic";
			licenseDiv.className = "dv_"+cssText+"_licenseType";
			licenseDiv.style.cssText = "position: absolute; margin: 5px; color: red;";
			licenseDiv.textContent = mtk.licenseType + " (" + mtk.licExpiredDate + ")";
			
			div.appendChild(licenseDiv);
		}
		
	}
	
	function patternMobileHorizontalLine(id, cssText){
        var linesTag = document.createElement("div");
        linesTag.className = "dv_transkey_div5 boxsizingcontentbox";
        var elid=["12","23","45","56","78","89"];
        for (var i=0;i<6;i++){
            var lineTag = document.createElement("div");
            lineTag.className = "dv_transkey_div5_1 boxsizingcontentbox";
            lineTag.id = "line" + elid[i];
            linesTag.appendChild(lineTag);
        }
		return linesTag;
	}
	
	function patternMobileVerticalLine(id, cssText){
        var linesTag = document.createElement("div");
        linesTag.className = "dv_transkey_div5 boxsizingcontentbox";
        elid=["14","25","36","47","58","69"];
        for (var i=0;i<6;i++){
            var lineTag = document.createElement("div");
            lineTag.className = "dv_transkey_div5_2 boxsizingcontentbox";
            lineTag.id = "line" + elid[i];
            linesTag.appendChild(lineTag);
        }
		return linesTag;
	}
	
	function patternMobileDiagonalForwardLine(id, cssText){
        var linesTag = document.createElement("div");
        linesTag.className = "dv_transkey_div5 boxsizingcontentbox";
        elid=["24","35","57","68"];
        for (var i=0;i<4;i++){
            var lineTag = document.createElement("div");
            lineTag.className = "dv_transkey_div5_4 boxsizingcontentbox";
            lineTag.id = "line" + elid[i];
            linesTag.appendChild(lineTag);
        }
		return linesTag;
	}
	
	function patternMobileDiagonalBackwardLine(id, cssText){
	    var linesTag = document.createElement("div");
        elid=["15","26","48","59"];
        linesTag.className = "dv_transkey_div5 boxsizingcontentbox";
        for (var i=0;i<4;i++){
            var lineTag = document.createElement("div");
            lineTag.className = "dv_transkey_div5_3 boxsizingcontentbox";
            lineTag.id = "line" + elid[i];
            linesTag.appendChild(lineTag);
        }
		return linesTag;
	}
	
	
    
	this.patternTouchStart = function(b){
		var index = 1;
		var patternDiv = document.getElementById("mtk_"+transkey.objs[6]);
	    mtk.now.isdrawing = true;
	    if (mtk.now.inputObj.value != "") mtk.patternClear();
	    b.firstElementChild.className = "tk_pattern_btn tk_pattern_btn_touched";
	    from = "";
	    outer : for(var i = 5; i < 8 ; i++){
	    	inner : for(var j = 0; j < 3 ; j++){
	    		if( patternDiv.children[i].children[j] == b){
	    			break outer;
	    		}else{
	    			index++;	
	    		}
	    	}
	    }
	    to = index.toString();
	    var encrypted = SeedEnc(to);
		mtk.now.hidden.value += transkey_delimiter + encrypted;
	    startbutton = to;
	    return false;
	};
	
	this.patternTouchOver = function(b){
		var index = 1;
		var patternDiv = document.getElementById("mtk_"+transkey.objs[6]);
	    if (mtk.now.isdrawing){
		    outer : for(var i = 5; i < 8 ; i++){
		    	inner : for(var j = 0; j < 3 ; j++){
		    		if( patternDiv.children[i].children[j] == b){
		    			break outer;
		    		}else{
						index++;	
					}
		    	}
		    }
	        var thisbutton = index.toString();
	        if(thisbutton != to){
	            var cn = b.className;
	
	
	            // display line between 2 buttons
	            var thisline = document.getElementById("line" + to + thisbutton);
	            if (thisbutton <  to){
	                thisline = document.getElementById("line" + thisbutton + to);
	            }
	            if (thisline){
	                if (b.firstElementChild.className.indexOf("tk_pattern_btn_touched") < 0) {
	                    b.firstElementChild.className = "tk_pattern_btn tk_pattern_btn_touched"
		
	                    from = to;
	                    to = thisbutton;

	                    var encrypted = SeedEnc(to);
	                    mtk.now.hidden.value += transkey_delimiter + encrypted;

	                    thisline.style.visibility = 'visible';
	                }
	            }
	        }
	    }
	    return(false)
	};
	
	this.patternTouchMove = function(e) {
	    if(e.touches.length == 1){
	        var touch = e.touches[0];
			var isBottom = mtk.now.inputObj.getAttribute("data-tk-bottom");

			if(isBottom == undefined||isBottom=="false"){
	        	mtk.processTouchMove(parseInt(touch.pageX),parseInt(touch.pageY));
			}else {
				mtk.processTouchMove(parseInt(touch.clientX),parseInt(touch.clientY));
			}
	    }
	};
	
	this.processTouchMove = function(x,y) {
	    // find position relative to first button
	    if (!mtk.now.gridsize){
	        mtk.now.buttons[0].pos = findPos(mtk.now.buttons[0]);
	        mtk.now.buttons[1].pos = findPos(mtk.now.buttons[1]);
	        mtk.now.gridsize = parseInt(mtk.now.buttons[1].pos.left) - parseInt(mtk.now.buttons[0].pos.left);
	    }
	
	    var cox = x - parseInt(mtk.now.buttons[0].pos.left);
	    var coy = y - parseInt(mtk.now.buttons[0].pos.top);
	
	    // on what button are we over now?
	    // grid 3x3 to sequential nummber
	    var buttonnr = Math.min(2,Math.max(0,Math.floor(cox/mtk.now.gridsize))) + (Math.min(2,Math.max(0,Math.floor(coy/mtk.now.gridsize)))*3) + 1;
	
	    if (buttonnr != to){
	        // only trigger if the touch is near the middle of the button
	        // otherwise diagonal moves are impossible
	        var distancex = (cox % mtk.now.gridsize);
	        var distancey = (coy % mtk.now.gridsize);
	        if ((distancex< (mtk.now.gridsize/2)) && (distancey < (mtk.now.gridsize/2))){
	            // we're over a new button
	            var newButton = mtk.now.buttons[buttonnr-1];
	            mtk.patternTouchOver(newButton);
	        }
	    }
	};
	
	this.patternTouchEnd = function(){
		if (mtk.now.isdrawing){
	        mtk.now.isdrawing = false;
	        mtk.now.gridsize = false;
	    }
		
		if(patternCount<4){
			alert("4 점 이상 이어주세요.");
			mtk.patternClear();
		}else{
		    mtk.patternEnd();
		}
		
		patternCount = 0;
		
		return(false)
	};
	
	this.transkeyInputLayout = function(inputObj){
		var id = inputObj.id;
		var type = inputObj.type;
		var maxLength = inputObj.maxLength;
		var keyboardType = transkey[inputObj.id].keyboardType;
		var inputText = inputObj.getAttribute("data-tk-inputtext")==null?"":inputObj.getAttribute("data-tk-inputtext");
		var inputImg = inputObj.getAttribute("data-tk-inputimg")==null?"":inputObj.getAttribute("data-tk-inputimg");
		var cssText = inputObj.getAttribute("data-tk-cssName");
		if(cssText==null){
			cssText = "transkey";
		}
		
		
		
		var iDiv = document.createElement("div");
		iDiv.setAttribute("id", "mtk_input_div_"+inputObj.id);
		iDiv.setAttribute("class", "transkey_input_div");
		iDiv.style.backgroundImage="url("+inputImg+")";
		
		var inputLabel = document.createElement("label");
		inputLabel.className = "transkey_input_label";
		inputLabel.textContent = inputText;
		iDiv.appendChild(inputLabel);
		
		var inputCloseA = document.createElement("a");
		inputCloseA.id = "input_label_close_"+id;
		inputCloseA.className = "dv_"+cssText+"_disp_b_not_input";
		inputCloseA.style.cssText = "position: absolute; top:5%; right:5%;";
		inputCloseA.role = "button";
		inputCloseA.tabIndex = "0";
		inputCloseA.ariaLabel = "가상키보드 닫기";
		iDiv.appendChild(inputCloseA);
		
		if(keyboardType=="numberMobile"&&maxLength>=2&& maxLength<=8) {
			if(transkey_divType==0)
				var margin = Math.floor((transkey[inputObj.id].width-37*maxLength)/(maxLength+1));
			else{
				var underlineWidth = 37;
				if(transkey[inputObj.id].div.offsetWidth < 400) {
					underlineWidth = 30;
				}
				
				if(max_width!=0&&max_width>=300&&mtk.clientWidth>max_width)
					var margin = Math.floor((max_width - underlineWidth*maxLength)/(maxLength+1));
				else
					var margin = Math.floor(((mtk.clientWidth*widthRatio) - underlineWidth*maxLength)/(maxLength+1));
			}
			for(var i=0; i<maxLength; i++) {
				var tkInputLabel = document.createElement("label");
				tkInputLabel.htmlFor = "tk_input_"+id+"_"+i;
				tkInputLabel.style.cssText = "display:none;";
				iDiv.appendChild(tkInputLabel);
				
				var tkInput = document.createElement("input");
				tkInput.id = "tk_input_"+id+"_"+i;
				tkInput.className = "transkey_input2";
				tkInput.type = type;
				tkInput.style.cssText = "margin-left:"+margin+"px;";
				tkInput.readOnly = true;
				tkInput.disabled = true;
				iDiv.appendChild(tkInput);
			}
		} else {
			var tkInputLabel = document.createElement("label");
				tkInputLabel.htmlFor = "tk_input_"+id;
				tkInputLabel.style.cssText = "display:none;";
				iDiv.appendChild(tkInputLabel);
				
				var tkInput = document.createElement("input");
				tkInput.id = "tk_input_"+id;
				tkInput.className = "transkey_input";
				tkInput.type = type;
				tkInput.readOnly = true;
				tkInput.disabled = true;
				iDiv.appendChild(tkInput);
		}
			
		var obj = null;

		var is_sibling = inputObj.getAttribute("data-tk-nextSibling")
		if(is_sibling == undefined || is_sibling == "false"){
			obj = document.body;
		}else {
			obj = transkey[inputObj.id].inputObj.parentNode;
		}
		
		obj.appendChild(iDiv);
		transkey[inputObj.id].useInput = true;
		transkey[inputObj.id].useInputDiv = iDiv;
	};
	
	function pack(source)
	{
	   var temp = "";
	   for (var i = 0; i < source.length; i+=2)
	   {
	      temp+= String.fromCharCode(parseInt(source.substring(i, i + 2), 16));
	   }
	   return temp;
	}

	function char2hex(source)
	{
	   var hex = "";
	   for (var i = 0; i < source.length; i+=1)
	   {
	      var temp = source[i].toString(16);
	      switch (temp.length)
	      {
	         case 1:
	            temp = "0" + temp;
	            break;
	         case 0:
	           temp = "00";
	      }
	      hex+= temp;
	   }
	   return hex;
	}

	function xor(a, b)
	{
	   var length = Math.min(a.length, b.length);
	   var temp = "";
	   for (var i = 0; i < length; i++)
	   {
	      temp+= String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
	   }
	   length = Math.max(a.length, b.length) - length;
	   for (var i = 0; i < length; i++)
	   {
	      temp+= "\x00";
	   }
	   return temp;
	}

	function mgf1(mgfSeed, maskLen)
	{
	   var t = "";
	   if(useSha2) {
	      var hLen = 32;
	   } else {
	      var hLen = 20;
	   }
	   var count = Math.ceil(maskLen / hLen);
	   for (var i = 0; i < count; i++)
	   {
	      var c = String.fromCharCode((i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF);
	      if(useSha2) {
			t+= pack(sha2Hash(mgfSeed + c));
		  } else {
	         t+= pack(sha1Hash(mgfSeed + c));
		  }
	   }

	   return t.substring(0, maskLen);
	}

	function xorb(a, b) {
		var length = Math.min(a.length, b.length);
		var temp = "";
		for (var i = 0; i < length; i++) {
			temp += String.fromCharCode(a[i] ^ b[i]);
		}
		length = Math.max(a.length, b.length) - length;
		for (var i = 0; i < length; i++) {
			temp += "\x00";
		}
		return temp;
	}
	
	
	function strtobin(a) {
		var ret=new Uint8Array(a.length);
		
		for (var i = 0; i < a.length; i++) 
		{
			ret[i]= a.charCodeAt(i);
		}
		
		return ret;
	}
	
	function bytecopy(input,start,end) {
		
		var k = new Array(end-start); 
		for (var i = start,j=0; i < end; i++,j++) {
			k[j]=input[i];
		}
		return k;
		
	}
	
	function clear(input) {
		for (var i = 0; i < input.length; i++) {
			input[i]=0;
		}
	}
	
	this.rsaes_oaep_decrypt_key=function(m,d,n)
	{
		var _0x281f=["\x73\x75\x62\x73\x74\x72\x69\x6E\x67","\x6C\x65\x6E\x67\x74\x68","\x72\x73\x61\x65\x73\x5F\x6F\x61\x65\x70\x5F\x64\x65\x63\x72\x79\x70\x74","","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74"];var m=b64tohex(m);encoded_rsa= m[_0x281f[0]](0,512);encoded_enc= m[_0x281f[0]](512,m[_0x281f[1]]);d= this[_0x281f[2]](encoded_rsa,d,n);var k= new Array(16);var iv= new Array(16);for(var i=0;i< 16;i++){k[i]= d[i]};for(var i=16,j=0;i< 32;i++,j++){iv[j]= d[i]};var roundKey= new Array(32);Seed.SeedSetKey(roundKey,k);encoded_byte= makeHexToArrayByte(encoded_enc);var outData= new Array(encoded_byte[_0x281f[1]]);Seed.SeedDecryptCbc(roundKey,iv,encoded_byte,encoded_byte[_0x281f[1]],outData);dec= _0x281f[3];for(var i=0;i< outData[_0x281f[1]];i++){if(outData[i]== 0){break};dec+= String[_0x281f[4]](outData[i])};decBin=  new Array(dec[_0x281f[1]]);for(var i=0;i< dec[_0x281f[1]];i++){decBin[i]= dec[_0x281f[5]](i)};base64= char2Base64(decBin);clear(k);clear(iv);clear(decBin);return base64;
		
	};
	
	this.rsaes_oaep_decrypt = function(m, d, n) {
		if(useSha2) {
			var _0x2604=["\x30\x31\x30\x30\x30\x31","\x6D\x6F\x64\x50\x6F\x77","","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x6C\x65\x6E\x67\x74\x68","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74"];var _e= new BigInteger(_0x2604[0],16);var _d= new BigInteger(d,16);var _n= new BigInteger(n,16);mb=  new BigInteger(m,16);c= mb[_0x2604[1]](_d,_n);c= c.toString(16);EM= makeHexToArrayByte(c);maskedDB= _0x2604[2];maskedSeed= _0x2604[2];for(var i=0;i< 32;i++){maskedSeed+= String[_0x2604[3]](EM[i])};for(var i=0;i< EM[_0x2604[4]]- 32;i++){maskedDB+= String[_0x2604[3]](EM[32+ i])};seedMask= mgf1(maskedDB,32);seedMask1= strtobin(seedMask);seed= xor(maskedSeed,seedMask);seed1= strtobin(seed);dbMask= mgf1(seed,maskedDB[_0x2604[4]]);dbMask1= strtobin(dbMask);DB= xor(maskedDB,dbMask);DB1= strtobin(DB);var i=0;for(i= 32;i< DB[_0x2604[4]];i++){if(DB[_0x2604[5]](i)== 0x01){break}};i++;M=  new Uint8Array(DB[_0x2604[4]]- i);for(var j=0;j< DB[_0x2604[4]]- i;j++){M[j]= DB[_0x2604[5]](i+ j)};d= _0x2604[2];n= _0x2604[2];return M;				
		}else {
			var _0x2604=["\x30\x31\x30\x30\x30\x31","\x6D\x6F\x64\x50\x6F\x77","","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x6C\x65\x6E\x67\x74\x68","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74"];var _e= new BigInteger(_0x2604[0],16);var _d= new BigInteger(d,16);var _n= new BigInteger(n,16);mb=  new BigInteger(m,16);c= mb[_0x2604[1]](_d,_n);c= c.toString(16);EM= makeHexToArrayByte(c);maskedDB= _0x2604[2];maskedSeed= _0x2604[2];for(var i=0;i< 20;i++){maskedSeed+= String[_0x2604[3]](EM[i])};for(var i=0;i< EM[_0x2604[4]]- 20;i++){maskedDB+= String[_0x2604[3]](EM[20+ i])};seedMask= mgf1(maskedDB,20);seedMask1= strtobin(seedMask);seed= xor(maskedSeed,seedMask);seed1= strtobin(seed);dbMask= mgf1(seed,maskedDB[_0x2604[4]]);dbMask1= strtobin(dbMask);DB= xor(maskedDB,dbMask);DB1= strtobin(DB);var i=0;for(i= 20;i< DB[_0x2604[4]];i++){if(DB[_0x2604[5]](i)== 0x01){break}};i++;M=  new Uint8Array(DB[_0x2604[4]]- i);for(var j=0;j< DB[_0x2604[4]]- i;j++){M[j]= DB[_0x2604[5]](i+ j)};d= _0x2604[2];n= _0x2604[2];return M;
		}
	};
		
	function rsaes_oaep_encrypt(m, n, k, e)
	{
	   if(useSha2) {
	      var hLen = 32;
	   } else {
	      var hLen = 20;
	   }


	   var mLen = m.length;
	   if (mLen > k - 2 * hLen - 2)
	   {
	   	console.log("too long");
	   }

	   if(useSha2) {
	      var lHash = "\xe3\xb0\xc4\x42\x98\xfc\x1c\x14\x9a\xfb\xf4\xc8\x99\x6f\xb9\x24\x27\xae\x41\xe4\x64\x9b\x93\x4c\xa4\x95\x99\x1b\x78\x52\xb8\x55";
	   } else {
	      var lHash = "\xda\x39\xa3\xee\x5e\x6b\x4b\x0d\x32\x55\xbf\xef\x95\x60\x18\x90\xaf\xd8\x07\x09"; // pack(sha1Hash(""))
	   }

	   var ps = "";
	   var temp = k - mLen - 2 * hLen - 2;
	   for (var i = 0; i < temp; i++)
	   {
	      ps+= "\x00";
	   }

	   var db = lHash + ps + "\x01" + m;
	   var seed = "";
	   for (var i = 0; i < hLen + 4; i+=4)
	   {
	      temp = new Array(4);
	      rng.nextBytes(temp);
	      seed+= String.fromCharCode(temp[0], temp[1], temp[2], temp[3]);
	   }
	   seed = seed.substring(4 - seed.length % 4);
	   var dbMask = mgf1(seed, k - hLen - 1);
	   
	   var maskedDB = xor(db, dbMask);
	   var seedMask = mgf1(maskedDB, hLen);
	   var maskedSeed = xor(seed, seedMask);
	   var em = "\x00" + maskedSeed + maskedDB;

	   m = new Array();
	   for (i = 0; i < em.length; i++)
	   {
	      m[i] = em.charCodeAt(i);
	   }
	   m = new BigInteger(m, 256);
	   c = m.modPow(e, n);
	   c = c.toString(16);
	   if (c.length & 1)
	   {
	      c = "0" + c;
	   }

	   return c;
	}

	function pkcs7pad(plaintext)
	{
	   var pad = 16 - (plaintext.length & 15);
	   for (var i = 0; i < pad; i++)
	   {
	      plaintext+= String.fromCharCode(pad);
	   }
	   return plaintext;
	}

	function aes_encrypt(plaintext, key, iv)
	{
	   var ciphertext = new Array();
	   plaintext = pkcs7pad(plaintext);
	   key = new keyExpansion(key);
	   for (var i = 0; i < plaintext.length; i+=16)
	   {
	      var block = new Array(16);
	      for (var j = 0; j < 16; j++)
	      {
	         block[j] = plaintext.charCodeAt(i + j) ^ iv[j];
	      }
	      block = AESencrypt(block, key);
	      for (var j = 0; j < 16; j++)
	      {
	         iv[j] = block[j];
	      }
	      ciphertext = ciphertext.concat(block);
	   }
	   return ciphertext;
	}

	function phpbb_encrypt1024(plaintext)
	{
	   var temp = new Array(32);
	   rng.nextBytes(temp);
	   var iv = temp.slice(0, 16);
	   var key = "";
	   for (var i = 16; i < 32; i++) // eg. temp.slice(16, 32)
	   {
	      key+= String.fromCharCode(temp[i]);
	   }

	   var n = new BigInteger("00a52ebc98a9583a90b14d34c009d436996b590561224dd1f41bd262f17dbb70f0fe9d289e60a3c31f1f70a193ad93f0a77e9a491e91de9f9a7f1197d1ffadf6814b3e46d77903a8f687849662528cdc3ea5c7c8f3bdf8fb8d118f01441ce317bb969d8d35119d2d28c8c07cbcfb28919387bd8ee67174fb1c0b2d6b87dfa73f35", 16);
	   var k = 128; // length of n in bytes
	   var e = new BigInteger("010001", 16);

	   frm1.key1.value = rsaes_oaep_encrypt(plaintext, n, k, e);
	   frm1.iv1.value = char2hex(iv);
	   frm1.data1.value = char2hex(aes_encrypt(plaintext, key, iv));
	}


	this.phpbb_encrypt2048 = function(plaintext, k, e, n)
	{
	   var temp = new Array(32);
	   rng.nextBytes(temp);
	   var key = "";
	   for (var i = 16; i < 32; i++) // eg. temp.slice(16, 32)
	   {
	      key+= String.fromCharCode(temp[i]);
	   }

	   var _e = new BigInteger(e, 16);
	   var _n = new BigInteger(n, 16);
	   
	   var _rsaoen = "";
	   var count = 10;
	   
	   while(_rsaoen.length<512){
			_rsaoen = rsaes_oaep_encrypt(plaintext, _n, k, _e);
			count--;
			
			if(_rsaoen.length>511)
				break;
				
			if(count <= 0)
				break;
	   }
	   
	   return _rsaoen;
	};

	function makeHexToArrayByte(hexString)
	{
		var len = hexString.length/2;
		var result = Array(len);
		for (var i = 0; i < len; i++)
			result[i] = parseInt(hexString.substring(2*i, 2*i+2),16);
		return result;
	}

	function getTodayDate(){
		 var _date  = new Date();
		 var _year  = "" + _date.getFullYear();
		 var _month = "" + (_date.getMonth() + 1);
		 var _day   = "" + _date.getDate();

		 if( _month.length == 1 ) _month = "0" + _month;
		 if( ( _day.length ) == 1 ) _day = "0" + _day;

		 var tmp = "" + _year.substring(2, 4) + _month + _day;
		 return tmp;
	}
	
	function verifyCA() 
	{
		var x509_pub = new X509();
		x509_pub.readCertPEM(cert_pub);
	  	
//		var NotBefore = x509_pub.getNotBefore();
//		var NotAfter = x509_pub.getNotAfter();
		var Signature = x509_pub.getSignature();
		var CertInfo = x509_pub.getCertInfo();
		var abCertInfo = CryptoJS.enc.Hex.parse(CertInfo);
		var abHash =  CryptoJS.SHA256(abCertInfo).toString();
		
//		var todayDate = getTodayDate();		
//		if(todayDate < NotBefore.substring(0, 6) || todayDate >= NotAfter.substring(0, 6)) {
//			tk_alert("transkey : 인증서 유효기간이 만료되었습니다.");
//			return "expired";
//		}
			
		var x509_ca = new X509();
		x509_ca.readCertPEM(cert_ca);

		var isValid = x509_ca.subjectPublicKeyRSA.verifyString(abHash, Signature);
		if (isValid) {
			return true;
		} else {
			return false;
		}
	}
}





mTranskey.prototype.setKeyboard = function(inputObj){
	if(document.getElementById("mtk_"+inputObj.id) != null) {
		return;
	}
	
	var div = document.createElement("div");
	div.setAttribute("id", "mtk_"+inputObj.id);
	var _cssName = inputObj.getAttribute("data-tk-cssName");
	var divClassName = "transkey";
	var keyboardType = inputObj.getAttribute("data-tk-kbdType");
	var useTKInput = inputObj.getAttribute("data-tk-useinput");
	if(_cssName==null){
		_cssName = "transkey";
	}
	if(transkey_divType==1){
		if(keyboardType=="qwerty") {
			if(useTKInput=="true")
				divClassName+=" dv_"+_cssName+"_div dv_transkey_div_qHeight2";
			else
				divClassName+=" dv_"+_cssName+"_div dv_transkey_div_qHeight";
		}
		else if(keyboardType=="number") {
			if(useTKInput=="true")
				divClassName+=" dv_"+_cssName+"_div dv_transkey_div_nHeight2";
			else
				divClassName+=" dv_"+_cssName+"_div dv_transkey_div_nHeight";
		} else {
			divClassName+=" dv_"+_cssName+"_div dv_transkey_div_pHeight";
		}
	}
	div.setAttribute("class", divClassName);

	var dataType = inputObj.getAttribute("data-tk-dataType");
	var ExE2E = inputObj.getAttribute("data-tk-ExE2E");
	var keyType;
	if(keyboardType=="qwerty"){
		this.setQwertyMobileLayout(inputObj.id, div, _cssName);
		keyType = this.setKeyType(dataType);
	}
	else if(keyboardType=="number"){
		this.setNumberMobileLayout(inputObj.id, div, _cssName);
		keyType="single";
	} else {
		this.setPatternMobileLayout(inputObj.id, div, _cssName);
		keyType="pattern";
	}
	
	//div.style.backgroundImage="url("+transkey_url+"/images/loading.gif)";
	
	this.setHiddenField(inputObj, ExE2E);
	
	transkey[inputObj.id] = new mTranskeyObj(inputObj, this.clientWidth, div, keyType, keyboardType, dataType);
	
//	transkey[inputObj.id].allocation();
	
	transkey[inputObj.id].setButton(mtk_useButton);
	
	if(transkey[inputObj.id].keyboardType=="patternMobile")
		transkey[inputObj.id].setPatternButton(div);
	
	transkey.objs.push(inputObj.id);
	
	var obj = null;

	var is_sibling = inputObj.getAttribute("data-tk-nextSibling")
	if(is_sibling == undefined || is_sibling == "false"){
		obj = document.body;
	}else {
		obj = transkey[inputObj.id].inputObj.parentNode;
	}
	obj.appendChild(div);
	
	if(useTKInput=="true")
		mtk.transkeyInputLayout(inputObj);
	
	if(transkey_divType==1) {
		mtk.setKeyEvent(inputObj.id);
	}
	
};

mTranskey.prototype.setTalkBackText = function(transkeyObj){
	if(!transkeyObj.talkBack)
		return false;
	
	var count=0;
	var dmyCount=0;
	var keyIndex=0;
	var textArray;
	var isNumber=false;
	if(transkeyObj.keyTypeIndex=="l ") {
		textArray = mtk.talkBackLowerText;
		transkeyObj.div.querySelector('#mtk_cp').setAttribute('aria-label', "대문자 키보드 변경");
		transkeyObj.div.querySelector('#mtk_sp').setAttribute('aria-label', "특수문자 키보드 변경");
	} else if(transkeyObj.keyTypeIndex=="u ") {
		textArray = mtk.talkBackUpperText;
		
		transkeyObj.div.querySelector('#mtk_cp').setAttribute('aria-label', "소문자 키보드 변경");
		transkeyObj.div.querySelector('#mtk_sp').setAttribute('aria-label', "특수문자 키보드 변경");
	} else if(transkeyObj.keyTypeIndex=="s ") {
		textArray = mtk.talkBackSpecialText;
		
		transkeyObj.div.querySelector('#mtk_sp').setAttribute('aria-label', "영자 키보드 변경");
	} else{
		isNumber=true;
		textArray = transkeyObj.dki;
		if(useNoDummy && textArray[10] == "b") {
			var tmp = textArray[9];
			textArray[9] = textArray[10];
			textArray[10] = tmp;
		}
	}
	
	var _cssName = transkeyObj.inputObj.getAttribute("data-tk-cssName");
	if(_cssName==null){
		_cssName = "transkey";
	}
	
	var childNodes = transkeyObj.div.childNodes;
	if(transkey_divType==1){
		for(var i=0;i<childNodes.length;i++){
			var child = childNodes[i];
			if(child.id=="mtk_disp" || child.id=="mtk_lic"){
				continue;
			}
			if(child.tagName=="DIV"||child.tagName=="div"){
				for(var k=0;k<child.childNodes.length;k++){
					var key = child.childNodes[k];
					key.setAttribute('role', "button");
					key.setAttribute('tabindex', "0");
					if(key.id==""){
						if(isNumber){
							if(useNoDummy) {
								if(keyIndex>=12)
									continue;
								if ("b"==textArray[keyIndex]) {
									keyIndex++;
									continue;
								} else if ("c"==textArray[keyIndex]) {
									keyIndex++;
									continue;
								} else {
									try{
										key.setAttribute('aria-label', textArray[keyIndex]);
										key.setAttribute('role', 'button');
        								key.setAttribute('tabindex', 0);
        								key.style.backgroundColor='';
        								key.style.borderColor='';
									}catch(e){
										console.log("[mTranskey Error] : Talkback setting fail");
									}								
								}
								keyIndex++;
							} else {
								if(keyIndex>=12)
									continue;
								if("="==textArray[keyIndex]){
									key.setAttribute('aria-label', "빈칸");
									key.removeAttribute('role');
								    key.removeAttribute('tabindex');
								    if(showDummy) {
										key.style.backgroundColor='';
        								key.style.borderColor='';
									} else {
										key.style.backgroundColor='transparent';
										if(key_margin > 0) {
											key.style.borderColor='transparent';
										} else {
											key.style.borderColor='';
											
											if(i>1 && childNodes[i-1] && childNodes[i-1].childNodes.length > k) {
												var prevKey = childNodes[i-1].childNodes[k];
												if(prevKey.getAttribute('aria-label')=='빈칸') {
													prevKey.style.borderBottomColor = 'transparent';
												}
											}
											
											if(k==0) {
												key.style.borderLeftColor = 'transparent';
											} else if(k==3) {
												key.style.borderRightColor = 'transparent';
											}
										}										
									}
								}else{
									try{
										key.setAttribute('aria-label', textArray[keyIndex]);
										key.setAttribute('role', 'button');
        								key.setAttribute('tabindex', 0);
        								key.style.backgroundColor='';
        								key.style.borderColor='';
									}catch(e){
										console.log("[mTranskey Error] : Talkback setting fail");
									}								
								}
								keyIndex++;
							}
						}else{
							if(keyIndex==36 && dmyCount==transkeyObj.dki.length)
								continue;
							
							if(count==Number(transkeyObj.dki[dmyCount])){
								key.setAttribute('aria-label', "빈칸");
								key.removeAttribute('role');
								key.removeAttribute('tabindex');
								if(showDummy) {
									key.style.backgroundColor='';
    								key.style.borderColor='';
								} else {
									key.style.backgroundColor='transparent';
									if(key_margin > 0) {
										key.style.borderColor='transparent';
									} else {
										key.style.borderColor='';
									}										
								}
								dmyCount++;
								
								if(!showDummy && key_margin<=0) {
									if(i>1 && childNodes[i-1] && childNodes[i-1].childNodes.length > k) {
										var prevKey = childNodes[i-1].childNodes[k];
										if(prevKey.getAttribute('aria-label')=='빈칸') {
											prevKey.style.borderBottomColor = 'transparent';
										}
									}
									
									if(key.previousSibling) {
										if(key.previousSibling.getAttribute('aria-label')=='빈칸') {
											key.previousSibling.style.borderRightColor = 'transparent';
										}
										
										if(key.previousSibling.classList.contains('dv_'+_cssName+'_blank') && key.getAttribute('aria-label')=='빈칸') {
											key.style.borderLeftColor = 'transparent';
										}
									}
									
									if(i == childNodes.length - 2) {
										if(key.classList.contains('dv_'+_cssName+'_blank')) {
											key.style.borderBottomColor = 'transparent';										
										} else if (key.previousSibling && key.previousSibling.classList.contains('dv_'+_cssName+'_blank')) {
											key.style.borderBottomColor = 'transparent';
										}
									}
								}
							}else{
								try{
									key.setAttribute('aria-label', textArray[keyIndex]);
									key.setAttribute('role', 'button');
        							key.setAttribute('tabindex', 0);
        							key.style.backgroundColor='';
        							key.style.borderColor='';
								}catch(e){
									console.log("[mTranskey Error] : Talkback setting fail");
								}	
								keyIndex++;
							}
							
							var elements = document.querySelectorAll('.dv_'+_cssName+'_blank');
							var keyMargin = key_margin>0 ? 0 : 1;
							elements.forEach(element => {
								if(element.getAttribute('aria-label')=='빈칸' && !showDummy) {
									element.style.borderRightColor = 'transparent';
								} else {
									element.style.borderRightColor = '';
								}
							});
							
							count++;
						}
						
					}
				}
			}
		}
	}else{
		for(var i=0;i<childNodes.length;i++){
			var child = childNodes[i];
			if(child.id=="mtk_disp"){
				continue;
			}
			if(child.tagName=="DIV"||child.tagName=="div"){
				for(var k=0;k<child.childNodes.length;k++){
					var key = child.childNodes[k];
					if(key.tagName=="A"||key.tagName=="a"){
						key.setAttribute('role', "button");
						key.setAttribute('tabindex', "0");
						if(isNumber){
							if(keyIndex==12)
								return;
							if("="==textArray[keyIndex]){
								//key.setAttribute('aria-label', "빈칸");
								key.removeAttribute('aria-label');
								key.removeAttribute('role');
								key.removeAttribute('tabindex');
								keyIndex++;
							}else{
								key.setAttribute('aria-label', textArray[keyIndex]);
								key.setAttribute('role', 'button');
        						key.setAttribute('tabindex', 0);
								keyIndex++;
							}
						}else{
							if(keyIndex==36 && dmyCount==transkeyObj.dki.length)
								return;
							if(key.id==""){
								if(count==Number(transkeyObj.dki[dmyCount])){
									//key.setAttribute('aria-label', "빈칸");
									key.removeAttribute('aria-label');
									key.removeAttribute('role');
								    key.removeAttribute('tabindex');
									dmyCount++;
								}else{
									key.setAttribute('aria-label', textArray[keyIndex]);
									key.setAttribute('role', 'button');
        							key.setAttribute('tabindex', 0);
									keyIndex++;
								}
								count++;
							}
						}
					}
				}
			}
		}
	}
};

mTranskey.prototype.setTalkBackKeys = function(transkeyObj){
	if(!transkeyObj.talkBack)
		return false;
	
	var childNodes = transkeyObj.div.childNodes;
	for(var i=0;i<childNodes.length;i++){
		var child = childNodes[i];
		if(child.tagName=="DIV"||child.tagName=="div"){
			for(var k=0;k<child.childNodes.length;k++){
				var key = child.childNodes[k];
				if(key.tagName=="A"||key.tagName=="a"){
					key.setAttribute('role', "button");
					key.setAttribute('tabindex', "0");
					if(key.id=="")
						key.setAttribute('aria-label', "");
					else if(key.id=="mtk_cp")
						key.setAttribute('aria-label', "쉬프트");
					else if(key.id=="mtk_del")
						key.setAttribute('aria-label', "삭제");
					else if(key.id=="mtk_sp")
						key.setAttribute('aria-label', "특수키");
					else if(key.id=="mtk_clear")
						key.setAttribute('aria-label', "전체삭제");
					else if(key.id=="mtk_done")
						key.setAttribute('aria-label', "입력완료");
					else if(useSpace&&key.id=="mtk_space")
						key.setAttribute('aria-label', "스페이스바");
						
				}
			}
		}
	}
};

mTranskey.prototype.setTalkBack = function(inputId){
	if(inputId==null){
		for(var i=0;i<transkey.objs.length;i++){
			var mtkObj = transkey[transkey.objs[i]];
			if(mtkObj==null)
				continue;
			if(transkey_divType==1){
				var inputObj = mtkObj.inputObj;
				mtk.remove(inputObj);			
				useTalkBack = true;
				mtk.setKeyboard(inputObj);
			}else{				
				if(mtk.now!=null)
					mtk.close();
				
				mtkObj.talkBack = true;
//				mtkObj.allocation();

				if(useSession) {
					mtkObj.setKeyType(mtkObj.keyType);
					if(transkey_divType==0)
						mtkObj.setUrl();
				} else {
					mtkObj.setKeyIndex(mtkObj.inputObj);
				}
			}
		}
	}else{
		var mtkObj = transkey[inputId];
		if(mtkObj==null)
			return false;
		if(transkey_divType==1){
			var inputObj = mtkObj.inputObj;
			mtk.remove(inputObj);
			var oriTB = useTalkBack;
			useTalkBack = true;
			mtk.setKeyboard(inputObj);
			useTalkBack = oriTB;
		}else{
			if(mtk.now!=null)
				mtk.close();
			
			mtkObj.talkBack = true;
//			mtkObj.allocation();

			if(useSession) {
				mtkObj.setKeyType(mtkObj.keyType);
				if(transkey_divType==0)
					mtkObj.setUrl();
			} else {
				mtkObj.setKeyIndex(mtkObj.inputObj);
			}
		}
	}
};

mTranskey.prototype.setGroup = function(groupId){
	
	var groupObj = [];
    var els = document.getElementsByTagName("input");
    var i = 0;

	for (i = 0; i < els.length; i++) {
	    if (els[i].getAttribute("data-tk-groupId") == groupId) {
	    	groupObj.push(transkey[els[i].id]);
	    }
	}
	mtk.groupObjs[groupId] = groupObj;
	mtk.setGroupBtn(groupId);
	
};

mTranskey.prototype.setGroupBtn = function(groupId) {
	
	var button = document.getElementById(groupId+"_tk_grpBtn");
	if(mtk_useTranskey){
		button.className = "tk_btn_";
		button.setAttribute("data-tk-btnValue","true");
	}else{
		button.className = "tk_btn";
		button.setAttribute("data-tk-btnValue","false");
	}
	mtk.groupBtns[groupId] = button;
	
	if(mtk.groupBtns[groupId].addEventListener){
		mtk.groupBtns[groupId].addEventListener("click", function() { mtk.groupBtnListener(groupId); }, false);
	}else{
		mtk.groupBtns[groupId].attachEvent("onclick", function() { mtk.groupBtnListener(groupId); });
	}
	
};

mTranskey.prototype.onKeyboard = function(inputObj){
	if(!transkey[inputObj.id].useTranskey) {
		return;
	}

	if(!this.keyboardCheck(transkey[inputObj.id].keyboard)) {
		tk_alert("키패드를 불러오지 못했습니다.");
		inputObj.blur();
		return;
	}
	
	if(!useTalkBack && !clickDummy) {
		console.log('현재 clickDummy의 상태는 false입니다. useTalkback 설정을 true로 변경해 주세요.');
	}
	
	 document.body.height="100%";
	 this.webkitTapHighlightColor=document.body.style.webkitTapHighlightColor;
	 document.body.style.webkitTapHighlightColor="rgba(0,0,0,0)";
	 
	 if(this.now!=null && !this.now.relocate)
		this.focusout();
	 
	 if(window.innerWidth<265){
		 tk_alert("현재 크기에서는 키패드를 지원하지 않습니다.\n키패드 실행이 취소되었습니다.\n더 큰 화면에서 실행해주세요.");
		 inputObj.readOnly=true;
		 inputObj.blur();
		 return;
	 }else{
		 inputObj.readOnly=false;
	 }
	 
	 this.now = transkey[inputObj.id];
	 
	 if(this.now.tk_onKeyFlag == true ){
	 }else{
			 this.now.tk_onKeyFlag = true;
			 if(onKeyboard_allocate||!this.now.allocate) {
		//		this.now.allocation();
				this.now.allocate=false;
				this.now.allocationIndex = new GenKey().tk_getrnd_int();
		
				if(useSession) {
					this.now.setKeyType(this.now.keyType);
					if(transkey_divType==0)
						this.now.setUrl();
				} else {
					this.now.setKeyIndex(this.now.inputObj);
				}
			 } else {
			 	 if(this.now!=null&&this.now.useTranskey){
				 	 this.now.setKeyType(this.now.keyType);
					 if(transkey_divType==0)
						 this.now.setUrl();
				 }
			 }
	 }

	 this.setCapStyle();
	 
	 if(this.now!=null&&this.now.useTranskey){
		 if(!this.checkWidthSize(this.now.width)){
			 this.getClientWidth();
			 this.reSize(this.now);
		 }
		
		this.now.clear();
		var div = this.now.div;	 
		inputObj.disabled=true;
		inputObj.blur();

		div.style.display="block";
		if(this.now.height == 0) {
			this.now.height = div.offsetHeight;
		}
		if(key_margin>0) {
			if(this.now.keyboardType=="numberMobile")
				div.style.height = this.now.height+key_margin*5-4+"px"
			else
				div.style.height = this.now.height+key_margin*6-5+"px"
		}
		
		this.setPosition();
		
		if(this.now.useInput){
			var inputHeight = getComputedStyle(this.now.useInputDiv).height.replace("px","")-getComputedStyle(this.now.useInputDiv).borderBottomLeftRadius.replace("px","");
			this.now.useInputDiv.style.width=div.clientWidth+"px";
			this.now.useInputDiv.style.left=div.style.left;
			if(inputObj.getAttribute("data-tk-bottom") == "true")
				mtk.now.useInputDiv.style.bottom=mtk.now.div.offsetHeight-getComputedStyle(mtk.now.useInputDiv).borderBottomLeftRadius.replace("px","")+"px";
			else
				this.now.useInputDiv.style.top=div.style.top.replace("px", "")-inputHeight+"px";
			this.now.useInputDiv.style.display="block";
		}
		
		inputObj.blur();
		this.fakeKey = null;
		
		setTimeout(function(){
			if(mtk.now!=null&&mtk.now.talkBack){
				if(transkey_divType==1){
					if(mtk.now.useInput || mtk.now.keyboardType=="patternMobile")
						mtk.now.div.firstChild.focus();
					else
						mtk.now.div.firstChild.firstChild.focus();
				} else {
					mtk.now.div.firstChild.focus();
				}
			}
		},100);
	 }
 };

mTranskey.prototype.relocate = function(e, ele){
	mtk.keyPress(e, ele, false);
	this.now.relocate = true;
	this.now.allocate=false;
	mtk.onKeyboard(mtk.now.inputObj);
	this.now.relocate = false;
}

mTranskey.prototype.start = function(e, ele, index){

		e.stopPropagation();
	
		if(useTalkBack && (!clickDummy || !showDummy)) {
			if(mtk.now.keyboardType=="numberMobile"){
				if(mtk.now.dki[index] == "=") {
					mtk.startCallBack();
					return;
				}
			} else {
				for(var i=0; i<mtk.now.dki.length; i++) {
					if(index == mtk.now.dki[i]) {
						mtk.startCallBack();
						return;
					}
				}
			}
		}
		
		mtk.keyPress(e, ele, useFakeKey);
		
		var startMask = mtk.now.tk_Special_Mask_StartPos-1;
		var endMask = mtk.now.tk_Special_Mask_EndPos-1;
		var mask = mtk.now.tk_Special_Mask;
		
		var encrypted = mtk.getEncData(index);
		
		if(mtk.now.fieldType=="text") {
			if(mtk.now.inputObj.value.length >= startMask && mtk.now.inputObj.value.length <= endMask) {
				mtk.now.inputObj.value = mtk.now.inputObj.value + mask;
				if(mtk.now.useInput) {
					var value = mtk.now.inputObj.value;
					if(mtk.now.useInputDiv.childElementCount>4) {
						mtk.now.useInputDiv.childNodes[value.length*2+1].value = value[value.length-1];
					}
					else
						mtk.now.useInputDiv.childNodes[3].value = mtk.now.inputObj.value;
				}
				mtk.now.hidden.value += transkey_delimiter + encrypted;
				if(mtk.now.inputObj.maxLength>0){
					if (mtk.now.inputObj.value.length >= mtk.now.inputObj.maxLength) {
						this.close();
						return;
					}
				}
			} else {
				mtk.getText(encrypted, ele);
			}
		} else {
			mtk.now.inputObj.value = mtk.now.inputObj.value + "*";
			if(mtk.now.useInput) {
				var value = mtk.now.inputObj.value;
				if(mtk.now.useInputDiv.childElementCount>4) {
					mtk.now.useInputDiv.childNodes[value.length*2+1].value = value[value.length-1]
				}
				else
					mtk.now.useInputDiv.childNodes[3].value = mtk.now.inputObj.value;
			}
			mtk.now.hidden.value += transkey_delimiter + encrypted;
			if(mtk.now.inputObj.maxLength>0){
				if (mtk.now.inputObj.value.length >= mtk.now.inputObj.maxLength) {
					this.close();
					return;
				}
			}
		}

		mtk.startCallBack();
};

mTranskey.prototype.del = function(e, ele){
		mtk.keyPress(e, ele, false);
		
		mtk.now.inputObj.value = mtk.now.inputObj.value.substring(0, mtk.now.inputObj.value.length - 1);
		
		if(mtk.now.useInput) {
			var value = mtk.now.inputObj.value;
			if(mtk.now.useInputDiv.childElementCount>4) {
				mtk.now.useInputDiv.childNodes[(value.length+1)*2+1].value = ""
			}
			else
				mtk.now.useInputDiv.childNodes[3].value = mtk.now.inputObj.value;
		}
		 
		var pos = mtk.now.hidden.value.lastIndexOf(transkey_delimiter);
		mtk.now.hidden.value = mtk.now.hidden.value.substring(0, pos);

		mtk.delCallBack();
};
	
mTranskey.prototype.sp = function(e, ele){
	if(mtk.now.useSpecial){
		mtk.keyPress(e, ele, false);
		if(mtk.now.special){
			if(mtk.now.cap||!mtk.now.useLower)
				mtk.now.setKeyType("upper");
			else
				mtk.now.setKeyType("lower");
			mtk.now.special=false;
		}else{
			mtk.now.setKeyType("special");
			mtk.now.special=true;
		}
		
		mtk.setCapStyle();
		mtk.now.setQwertyKey(mtk.now.keyType);

	}else{
		this.alert("sp");
	}
};

mTranskey.prototype.getFakeKey = function(){
	var rnd1,rnd2;
	if(this.now.keyboardType=="numberMobile"){
		rnd1 = getRandomValue(2);
		rnd2 = getRandomValue(6);
		
	}else{
		rnd1 = getRandomValue(4)+3;
		rnd2 = getRandomValue(11);
		if(rnd1==6){
			if(rnd2==0)
				rnd2=rnd2+1;
			else if(rnd2>8)
				rnd2=rnd2-getRandomValue(6);
		}
	}
	return mtk.now.div.children[rnd1].children[rnd2];
};

mTranskey.prototype.makePressImg = function(){
	var pressImg = document.createElement("img");
	pressImg.setAttribute("src", transkey_url + "/images/press.png");
	pressImg.setAttribute("style", transkey_divType==0?"width: 48px; position: absolute; left: 50%; margin-left: -24px;":"width: 48px; position: absolute; left: 50%; margin-left: -24px; margin-top: 5px;");
	return pressImg;
};

mTranskey.prototype.fakeKeyPress = function(fakeKey){
	try{
		if(this.fakeKey!=null){
			if(this.fakeKey.getAttribute('aria-label')=='빈칸') {
				if(showDummy) {
					this.fakeKey.style.backgroundColor="";
				} else {
					this.fakeKey.style.backgroundColor='transparent';
				}
			} else {
				this.fakeKey.style.backgroundColor="";
			}
			
			this.fakeKey.style.borderColor = this.fakeKeyBorderColor;
			this.fakeKey.style.borderRightColor = this.fakeKeyBorderRightColor;
			this.fakeKey.style.borderBottomColor = this.fakeKeyBorderLeftColor;
			this.fakeKey.style.borderLeftColor = this.fakeKeyBorderBottomColor;
		}
		
		this.fakeKey = fakeKey;
		this.fakeKeyBorderColor = fakeKey.style.borderColor;
		this.fakeKeyBorderRightColor = fakeKey.style.borderRightColor;
		this.fakeKeyBorderLeftColor = fakeKey.style.borderBottomColor;
		this.fakeKeyBorderBottomColor = fakeKey.style.borderLeftColor;

		fakeKey.style.backgroundColor="rgba(115, 115, 115, 0.63)";
		if(usePressImg)
			fakeKey.appendChild(mtk.fakePressImg);
	}catch(ee){
		console.log("[mTranskey Error] : Key setting error!");
	}

};


mTranskey.prototype.makeBalloonImg = function(){
	var BalloonImgLeft = document.createElement("div");
	BalloonImgLeft.setAttribute("id", "balloonimg");
	BalloonImgLeft.setAttribute("style", "	width: 150%;position: absolute; left:27%; margin-left: -29%; height: 165%;border-radius : 8px;background-size : 100% 100%;");
	BalloonImgLeft.style.backgroundImage="url('"+transkey_url+"/images/transkey_popup_left.png')"

	
	var BalloonImgMid = document.createElement("div");
	BalloonImgMid.setAttribute("id", "balloonimg");
	BalloonImgMid.setAttribute("style", "	width: 158%;position: absolute; left:0%; margin-left: -29%; height: 165%;border-radius : 8px;background-size : 100% 100%;");
	BalloonImgMid.style.backgroundImage="url('"+transkey_url+"/images/transkey_popup.png')"
	
	var BalloonImgRight = document.createElement("div");
	BalloonImgRight.setAttribute("id", "balloonimg");
	BalloonImgRight.setAttribute("style", "	width: 150%;position: absolute; left:-20%; margin-left: -29%; height: 165%;border-radius : 8px;background-size : 100% 100%;");
	BalloonImgRight.style.backgroundImage="url('"+transkey_url+"/images/transkey_popup_right.png')"
	
	return [BalloonImgLeft, BalloonImgMid, BalloonImgRight];
};

function balloonRemove(){
	if(document.getElementById("balloonimg")){
		document.getElementById("balloonimg").parentNode.removeChild(document.getElementById("balloonimg"));
	}
	if(document.getElementById("balloonlabel")){
		document.getElementById("balloonlabel").parentNode.removeChild(document.getElementById("balloonlabel"));
	}
}


mTranskey.prototype.keyPress = function(e, ele, useFK){

	if(document.getElementById("balloonimg")){
		document.getElementById("balloonimg").parentNode.removeChild(document.getElementById("balloonimg"));
	}
	if(document.getElementById("balloonlabel")){
		document.getElementById("balloonlabel").parentNode.removeChild(document.getElementById("balloonlabel"));
	}
	
	try{
		if(this.ele!=null){
			if(this.ele.getAttribute('aria-label')=='빈칸') {
				if(showDummy) {
					this.ele.style.backgroundColor="";
					this.ele.style.borderColor="";
				} else {
					this.ele.style.backgroundColor="transparent";
					if(key_margin > 0) {
						this.ele.style.borderColor='transparent';
					} else {
						this.ele.style.borderColor='';
					}
				}
			} else {
				this.ele.style.backgroundColor="";
				this.ele.style.borderColor="";				
			}
		}
		this.ele=ele;
		if(e.preventDefault)
			e.preventDefault();
		var fakeKey=null;
	
		
		//To use custom css 
		var _cssName = mtk.now.inputObj.getAttribute("data-tk-cssName");
		if(_cssName==null){
			_cssName = "transkey";
		}
		
		//if you use Balloon,you can't use Fakekey at qwerty. (like mTCS)
		if(useBalloon && mtk.now.keyboardType.indexOf("qwerty")>-1){
			if(ele.parentElement.className.indexOf("end")<0 && ele.id != "mtk_cp" && ele.id != "mtk_del"){
				var BalloonImageIndex = 1;
				var buttonRectX = ele.getBoundingClientRect().x;
				var keypadWidth = ele.parentElement.getBoundingClientRect().width + 1;
				if(buttonRectX == 1){//left
					BalloonImageIndex = 0;
				}else if((buttonRectX + ele.clientWidth) ==  keypadWidth){//right
					BalloonImageIndex = 2;
				}		
					
				//set BalloonLabel attribute
				var BalloonLabel = document.createElement("div");
				BalloonLabel.setAttribute("id","balloonlabel");
				BalloonLabel.setAttribute("style","position: absolute; left: 50%;");
				BalloonLabel.setAttribute("class", "dv_"+_cssName+"_div2_2");
				BalloonLabel.style.backgroundImage = ele.firstElementChild.style.backgroundImage;
				BalloonLabel.style.backgroundPositionX = ele.firstElementChild.style.backgroundPositionX;
				BalloonLabel.style.backgroundPositionY = ele.firstElementChild.style.backgroundPositionY;
								
				mtk.balloonImgs[BalloonImageIndex].style.marginTop = (-ele.offsetHeight - 10 ) + "px";
				
				//change BalloonLabel location because button's height is change by css(media)
				if(ele.clientHeight==45){
					BalloonLabel.style.marginTop =  (-ele.clientHeight + 1) + "px";
				}else if(ele.clientHeight==50){
					BalloonLabel.style.marginTop =  (-ele.clientHeight + 2) + "px";
				}else{
					BalloonLabel.style.marginTop =  (-ele.clientHeight + 8) + "px";
				}	
		
				ele.appendChild(mtk.balloonImgs[BalloonImageIndex]);
				ele.appendChild(BalloonLabel);
			}else{
				//qwerty's special key 
				//select event
				ele.style.backgroundColor="rgba(115, 115, 115, 0.63)";
			}
		}else{//not balloon or numberkeypad
				
			if(useFK){
				fakeKey = this.getFakeKey();
				mtk.fakeKeyPress(fakeKey);
			}
			
			if(usePressImg){	
				//change pressImg location because button's height is change by css(media)
				if(ele.clientHeight==45){
					mtk.pressImg.style.marginTop = "-1px";
					mtk.fakePressImg.style.marginTop = "-1px";
				}else if(ele.clientHeight==50){
					mtk.pressImg.style.marginTop = "1px";
					mtk.fakePressImg.style.marginTop = "1px";
				}
				
				ele.appendChild(mtk.pressImg);
			}
			
			//selection
			ele.style.backgroundColor="rgba(115, 115, 115, 0.63)";			
		}
		
		
		setTimeout(function(){
			if(ele != null) {
				if(ele.getAttribute('aria-label')=='빈칸') {
					if(showDummy) {
						ele.style.backgroundColor='';
						ele.style.borderColor='';
					} else {
						ele.style.backgroundColor='transparent';
						if(key_margin > 0) {
							ele.style.borderColor='transparent';
						} else {
							ele.style.borderColor='';
						}										
					}
				} else {
					ele.style.backgroundColor="";
					ele.style.borderColor="";					
				}
				if(usePressImg && ele.contains(mtk.pressImg))
					ele.removeChild(mtk.pressImg);
			}
			
			if(useFK && fakeKey!=null){
				if(fakeKey.getAttribute('aria-label')=='빈칸') {
					if(showDummy) {
						fakeKey.style.backgroundColor='';
					} else {
						fakeKey.style.backgroundColor='transparent';
					}
				} else {
					fakeKey.style.backgroundColor="";
				}
				
				fakeKey.style.borderColor = this.fakeKeyBorderColor;
				fakeKey.style.borderRightColor = this.fakeKeyBorderRightColor;
				fakeKey.style.borderBottomColor = this.fakeKeyBorderLeftColor;
				fakeKey.style.borderLeftColor = this.fakeKeyBorderBottomColor;
				
				if(usePressImg && fakeKey.contains(mtk.fakePressImg))
					fakeKey.removeChild(mtk.fakePressImg);
			}
		},100);


		
	}catch(ee){
		console.log("[mTranskey Error] : Key setting error!");
	}
	
	return false;
};

mTranskey.prototype.startCallBack = function(){
	
};

mTranskey.prototype.clearCallBack = function(){
	
};

mTranskey.prototype.closeCallBack = function(){
	
};

mTranskey.prototype.delCallBack = function(){
	
};

mTranskey.prototype.doneCallBack = function(){
	
};

mTranskey.prototype.clear = function(e, ele){
	mtk.keyPress(e, ele, false);		
	mtk.now.clear();
	mtk.clearCallBack();
};

mTranskey.prototype.cap = function(e, ele){
	if(mtk.now.keyType.indexOf("special")>-1){
		return;
	}
	if(mtk.now.useCaps){
		mtk.keyPress(e, ele, false);
		if(mtk.now.cap){
			mtk.now.setKeyType("lower");
			mtk.now.cap = false;
		}else{
			mtk.now.setKeyType("upper");
			mtk.now.cap = true;
		}					
		
		mtk.setCapStyle();
		mtk.now.setQwertyKey(mtk.now.keyType);
		mtk.now.special=false;
	}else{
		this.alert("cap");
	}
};

mTranskey.prototype.setCapStyle = function(){
	var cssName = mtk.now.inputObj.getAttribute("data-tk-cssName");
	if(cssName==null){
		cssName = "transkey";
	}
		
	if(transkey_divType==1 && mtk.now.keyboardType=="qwertyMobile") {
		if(mtk.now.keyType=="upper") {
			mtk.now.div.childNodes[4].childNodes[0].classList.remove('dv_'+cssName+'_div_a');
			mtk.now.div.childNodes[4].childNodes[0].classList.add('dv_'+cssName+'_div_c');
		}else {
			mtk.now.div.childNodes[4].childNodes[0].classList.remove('dv_'+cssName+'_div_c');
			mtk.now.div.childNodes[4].childNodes[0].classList.add('dv_'+cssName+'_div_a');
		}
	 }
};
	
mTranskey.prototype.close = function(){
	document.body.style.webkitTapHighlightColor=mtk.webkitTapHighlightColor;
	mtk.now.inputObj.disabled=false;
//	setTimeout(function(){
		if(mtk.now!=null) {
			mtk.now.div.style.display="none";
			if(mtk.now.keyboardType=="qwertyMobile"){
				mtk.now.initKeyType();
				mtk.now.setKeyType(mtk.setKeyType(mtk.now.inputObj.getAttribute("data-tk-dataType")));
				mtk.now.setQwertyKey(mtk.now.keyType);
			}
			if(mtk.now.inputObj.maxLength>0 && mtk.now.inputObj.value.length > mtk.now.inputObj.maxLength) {
				mtk.now.inputObj.value = mtk.now.inputObj.value.substr(0, mtk.now.inputObj.maxLength);
			}
			if(mtk.now.useInput)
				mtk.now.useInputDiv.style.display="none";
			mtk.now.tk_onKeyFlag = false;
			if(mtk.now.nextFocus!=null) {
				var nextFocus = mtk.now.nextFocus;
				mtk.now=null;
				if(document.body.offsetWidth>=265)
					document.getElementById(nextFocus).focus();
			} else {
				mtk.now=null;
				document.body.focus();
			}
		}
//	},100);
	
	mtk.closeCallBack();
	return false;
};

mTranskey.prototype.done = function(e, ele){
	mtk.now.done();
	mtk.keyPress(e, ele, false);
	document.body.style.webkitTapHighlightColor=mtk.webkitTapHighlightColor;
	mtk.now.inputObj.disabled=false;
	setTimeout(function(){
		if(mtk.now!=null) {
			mtk.now.div.style.display="none";
			if(mtk.now.keyboardType=="qwertyMobile"){
				mtk.now.initKeyType();
				mtk.now.setKeyType(mtk.setKeyType(mtk.now.inputObj.getAttribute("data-tk-dataType")));
				mtk.now.setQwertyKey(mtk.now.keyType);
			}
			if(mtk.now.useInput)
				mtk.now.useInputDiv.style.display="none";
			mtk.now.tk_onKeyFlag = false;
			if(mtk.now.nextFocus!=null) {
				var nextFocus = mtk.now.nextFocus;
				mtk.now=null;
				document.getElementById(nextFocus).focus();
			} else {
				mtk.now=null;
				document.body.focus();
			}
		}
	},100);
	
	mtk.doneCallBack();
	return false;
};

mTranskey.prototype.focusout = function(inputObj){
	document.body.style.webkitTapHighlightColor=mtk.webkitTapHighlightColor;
	mtk.now.inputObj.disabled=false;
	if(mtk.now!=null) {
		mtk.now.div.style.display="none";
		if(mtk.now.useInput)
			mtk.now.useInputDiv.style.display="none";
		mtk.now.tk_onKeyFlag = false;
		if(inputObj!=null){
			inputObj.focus();
		}
	}
	return false;
};

mTranskey.prototype.patternClear = function(inputObj){
    for(var i=0; i<mtk.now.buttons.length; i++) {
        mtk.now.buttons[i].firstElementChild.className = "tk_pattern_btn";
    }
    for(var i=0; i<mtk.now.lines.length; i++) {
        mtk.now.lines[i].style.visibility = 'hidden';
    }
    mtk.now.inputObj.value = "";
    mtk.now.clear();
};

mTranskey.prototype.patternEnd = function(){
    mtk.patternClear();
}

mTranskey.prototype.alert = function(cmd){
	if(cmd=="setKeyboard")
		tk_alert("transkey : qwerty키보드는 text타입을 지원하지 않습니다.");
	else if(cmd=="sp"||cmd=="cap")
		tk_alert("해당키는 사용 할 수 없습니다.");
	else if(cmd=="session")
		tk_alert("세션이 만료되었습니다.");
	else 
		tk_alert("TouchEn transkey 라이선스에 문제가 발생했습니다. \n" +
				"[code : "+cmd+" , classification : "+mtk.licClassification+"]");
};


mTranskey.prototype.buttonListener = function(e){
	var obj;
	if (e.type == "text" || e.type == "password") {
		obj = event;
	} else {
		e = e ? e : window.event;
		obj = e.target ? e.target : e.srcElement;
	}
	var id = tk_btn_arr[obj.id];
	
	var v = obj.getAttribute("data-tk-btnValue");
	if(v=="true"){
		obj.className = "tk_btn";
		transkey[id].clear();
		transkey[id].useTranskey=false;
		if(mtk.now!=null)
			mtk.close();
		obj.setAttribute("data-tk-btnValue","false");
	}else{
		obj.className = "tk_btn_";
		transkey[id].useTranskey=true;
		mtk.onKeyboard(transkey[id].inputObj);
		obj.setAttribute("data-tk-btnValue","true");

	}
	
};

mTranskey.prototype.groupBtnListener = function(groupId){

	var v = mtk.groupBtns[groupId].getAttribute("data-tk-btnValue");
	
	for(i = 0; i<mtk.groupObjs[groupId].length; i++) {

		if(v=="true"){
			mtk.groupBtns[groupId].className = "tk_btn";
			mtk.groupObjs[groupId][i].clear();
			mtk.groupObjs[groupId][i].useTranskey=false;
			if(mtk.groupObjs[groupId][i].button != null) {
				mtk.groupObjs[groupId][i].button.className = "tk_btn";
			}
			if(mtk.now!=null)
				mtk.close();
			mtk.groupBtns[groupId].setAttribute("data-tk-btnValue","false");
		}else{
			mtk.groupBtns[groupId].className = "tk_btn_";
			mtk.groupObjs[groupId][i].useTranskey=true;
			if(mtk.groupObjs[groupId][i].button != null) {
				mtk.groupObjs[groupId][i].button.className = "tk_btn_";
			}
			mtk.groupBtns[groupId].setAttribute("data-tk-btnValue","true");
		}
		
	}
};

function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return {left: curleft,top: curtop};
};

mTranskey.prototype.reSize = function(transkeyObj){
	if(transkey_divType==0){
		mtk.reSizeForType0(transkeyObj);
	}else if(transkey_divType==1){
		mtk.reSizeForType1(transkeyObj);
	}
};

mTranskey.prototype.reSizeForType0 = function(transkeyObj){
	document.body.removeChild(transkeyObj.div);
//	if(transkeyObj.useInput)
//		transkeyObj.useInputDiv.style.display="none";
	var div = document.createElement("div");
	div.setAttribute("id", "mtk_"+transkeyObj.id);
	div.setAttribute("class", "transkey");
	var _cssName = transkeyObj.inputObj.getAttribute("data-tk-cssName");
	var keyboardType = transkeyObj.inputObj.getAttribute("data-tk-kbdType");
	var dataType = transkeyObj.inputObj.getAttribute("data-tk-dataType");
	var keyType;
	if(keyboardType=="qwerty"){
		this.setQwertyMobileLayout(transkeyObj.inputObj.id, div, _cssName);
		keyType = this.setKeyType(dataType);
	}
	else{
		this.setNumberMobileLayout(transkeyObj.inputObj.id, div, _cssName);
		keyType = "single";
	}
	div.style.backgroundImage="url("+transkey_url+"/images/loading.gif)";
	document.body.appendChild(div);

	transkeyObj.setDiv(div);
	transkeyObj.setWidth(this.clientWidth);
	
    if(isNode){
        transkeyObj.setUrlUseBlob();
    } else{
        transkeyObj.setUrl();
    }

	if(transkeyObj.useInput){
		document.body.removeChild(transkeyObj.useInputDiv);
		mtk.transkeyInputLayout(transkeyObj.inputObj);
		
		if(document.addEventListener){
			document.getElementById("input_label_close_"+transkeyObj.id).addEventListener( "click", mtk.close );
		}else{
			document.getElementById("input_label_close_"+transkeyObj.id).attachEvent( "onclick", mtk.close );
		}
		
		var maxLength = transkeyObj.inputObj.maxLength;
		
		var inputHeight = getComputedStyle(transkeyObj.useInputDiv).height.replace("px","")-getComputedStyle(transkeyObj.useInputDiv).borderBottomLeftRadius.replace("px","");
		transkeyObj.useInputDiv.style.width=transkeyObj.div.clientWidth+"px";
		transkeyObj.useInputDiv.style.left=transkeyObj.div.style.left;
		if(transkeyObj.inputObj.getAttribute("data-tk-bottom") == "true")
			transkeyObj.useInputDiv.style.bottom=transkeyObj.height-getComputedStyle(transkeyObj.useInputDiv).borderBottomLeftRadius.replace("px","")+"px";
		else
			transkeyObj.useInputDiv.style.top=transkeyObj.div.style.top.replace("px", "")-inputHeight+"px";
		
		if(keyboardType=="number"&&maxLength>=2&& maxLength<=8){
			var margin = Math.floor((transkeyObj.width-37*maxLength)/(maxLength+1));
			
			for(var i=1; i<transkeyObj.useInputDiv.childElementCount; i++)
				transkeyObj.useInputDiv.childNodes[i].style.marginLeft=margin+"px";
		}
	}
	
	if(transkeyObj.talkBack){
		mtk.setTalkBackKeys(transkeyObj);
		mtk.setTalkBackText(transkeyObj);
	}
	transkeyObj.setKeyType(keyType);
};

mTranskey.prototype.reSizeForType1 = function(transkeyObj){
	if(transkeyObj.useInput){
		var maxLength = transkeyObj.inputObj.maxLength;
		
		var inputHeight = getComputedStyle(transkeyObj.useInputDiv).height.replace("px","")-getComputedStyle(transkeyObj.useInputDiv).borderBottomLeftRadius.replace("px","");
		transkeyObj.useInputDiv.style.width=transkeyObj.div.clientWidth+"px";
		transkeyObj.useInputDiv.style.left=transkeyObj.div.style.left;
		if(transkeyObj.inputObj.getAttribute("data-tk-bottom") == "true")
			transkeyObj.useInputDiv.style.bottom=transkeyObj.height-getComputedStyle(transkeyObj.useInputDiv).borderBottomLeftRadius.replace("px","")+"px";
		else
			transkeyObj.useInputDiv.style.top=transkeyObj.div.style.top.replace("px", "")-inputHeight+"px";
		
		if(transkeyObj.keyboardType=="numberMobile"&& maxLength>=2&& maxLength<=8){
			var underlineWidth = 37;
			var fontSize = "xx-large";
			if(transkeyObj.div.offsetWidth < 400) {
				underlineWidth = 30;
				fontSize = "x-large";
			}
			if(transkey_divType==0)
				var margin = Math.floor((transkeyObj.width-37*maxLength)/(maxLength+1));
			else{
				if(max_width!=0&&max_width>=300&&mtk.clientWidth>max_width)
					var margin = Math.floor((max_width - underlineWidth*maxLength)/(maxLength+1));
				else
					var margin = Math.floor(((mtk.clientWidth*widthRatio) - underlineWidth*maxLength)/(maxLength+1));
			}
			
			for(var i=1; i<transkeyObj.useInputDiv.childElementCount; i++){
				transkeyObj.useInputDiv.childNodes[i].style.marginLeft=margin+"px";
			}
			
			var childInput = transkeyObj.useInputDiv.querySelectorAll("input");
			for(var i=0; i<childInput.length; i++) {
				childInput[i].style.width = underlineWidth+"px";
				childInput[i].style.fontSize = fontSize;
			}
		}
	}
	if(navigator.userAgent.indexOf("Firefox") > 0 && this.clientWidth >= 705){
		var divNum = 0.90;
		var divKeypad = 0.85;
	} else {
		var divNum = 0;
		var divKeypad = 0;
	}
	
	var _cssName = transkeyObj.inputObj.getAttribute("data-tk-cssName");
	if(_cssName==null){
		_cssName = "transkey";
	}
	
	var marginEdge = key_margin!=0?key_margin+1:0; //margin + border : border
	
	if(transkeyObj.keyboardType=="numberMobile"){

		var k=4;
		if(useNoDummy)
			var k=3;
		
		var contentWidth = this.clientWidth;
		var totalMargin = 0;
		var leftMargin = 0;
		var rightMargin = 0;
		
		if(max_width!=0&&max_width>=300&&this.clientWidth>max_width) {
			if(splitWidth > 0 && splitWidth < max_width) {
				contentWidth = splitWidth;
				totalMargin = max_width - splitWidth;
			}else {
				contentWidth = max_width;
			}
			var ddivWidth = Math.floor((contentWidth-(k+1)-(marginEdge*(k+1)))/k)-divNum;
			var edgeSize = contentWidth-(Math.ceil(ddivWidth*k)+(k+1)+(marginEdge*(k+1)));
		}
		else {
			if(splitWidth > 0 && splitWidth < this.clientWidth) {
				contentWidth = splitWidth;
				totalMargin = this.clientWidth - splitWidth;
			}
			var ddivWidth = Math.floor(((contentWidth*widthRatio-(k+1)-(marginEdge*(k+1)))/k))-divNum;
			var edgeSize = contentWidth/widthRatio-(Math.ceil(ddivWidth*k)+(k+1)+(marginEdge*(k+1)));
		}
		
		leftMargin = Math.floor(totalMargin / 2);
		rightMargin = totalMargin - leftMargin;
		
		var edgePx = new Array(k);
		for(var i=0;i<k;i++){
			if(i<edgeSize)
				edgePx[i]=1;
			else
				edgePx[i]=0;
		}
		
		for(var i=1; 5>i; i++){
			transkeyObj.div.childNodes[i].firstElementChild.style.marginLeft="0px";
			transkeyObj.div.childNodes[i].lastElementChild.style.marginRight="0px";
			if(key_margin>0) {
				if(i==1)
					transkeyObj.div.childNodes[i].classList.remove("dv_"+_cssName+"_div_a");
				transkeyObj.div.childNodes[i].style.marginTop=key_margin+"px";
				transkeyObj.div.childNodes[i].style.marginRight=key_margin+"px";
				transkeyObj.div.childNodes[i].style.border=key_margin+"px";
				transkeyObj.div.childNodes[i].style.borderRight="0px";
			}
			if(i==4){
				transkeyObj.div.childNodes[i].childNodes[0].style.width=ddivWidth+edgePx[0]+"px";
				transkeyObj.div.childNodes[i].childNodes[1].style.width=ddivWidth+edgePx[1]+"px";
				transkeyObj.div.childNodes[i].childNodes[2].style.width=ddivWidth+ddivWidth+1+edgePx[2]+edgePx[3]+marginEdge+"px";		
				if(useNoDummy)
					transkeyObj.div.childNodes[i].childNodes[2].style.width=ddivWidth+edgePx[2]+"px";
				if(key_margin>0) {
					for(var j=0; 3>j; j++) {
						transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
						if(transkeyObj.div.childNodes[i].childNodes[j].getAttribute('aria-label')=='빈칸') {
							if(showDummy) {
								transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
							} else {
								if(key_margin > 0) {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor='transparent';
								} else {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
								}
							}
						}else {
							transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
						}
						transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
					}
					transkeyObj.div.childNodes[i].childNodes[2].classList.remove("dv_"+_cssName+"_end");
				}
				
			}else{
				for(var j=0; k>j; j++){
					transkeyObj.div.childNodes[i].childNodes[j].style.width=ddivWidth+edgePx[j]+"px";
					if(key_margin>0) {
						transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
						if(transkeyObj.div.childNodes[i].childNodes[j].getAttribute('aria-label')=='빈칸') {
							if(showDummy) {
								transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
							} else {
								if(key_margin > 0) {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor='transparent';
								} else {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
								}
							}
						}else {
							transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
						}
						transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
						if(j==k-1)
							transkeyObj.div.childNodes[i].childNodes[j].classList.remove("dv_"+_cssName+"_end");
					}
				}
			}
			
			let currentLeft = (parseFloat(getComputedStyle(transkeyObj.div.childNodes[i].firstElementChild).marginLeft) || 0) + leftMargin;
			let currentRight = (parseFloat(getComputedStyle(transkeyObj.div.childNodes[i].lastElementChild).marginRight) || 0) + rightMargin;
			let borderWidth = 0;
			
			if(key_margin<=0) {
				if(currentLeft >= 1) {
					transkeyObj.div.childNodes[i].childNodes[0].style.borderLeftWidth="1px";
					transkeyObj.div.childNodes[i].childNodes[0].style.borderLeftStyle="solid";
					borderWidth = 1;
				} else {
					transkeyObj.div.childNodes[i].childNodes[0].style.borderLeftWidth="";
					transkeyObj.div.childNodes[i].childNodes[0].style.borderLeftStyle="";
				}
				
				if(currentRight >= 1) {
					if(i==4) {
						transkeyObj.div.childNodes[i].childNodes[2].style.borderRightWidth="1px";
					} else {					
						transkeyObj.div.childNodes[i].childNodes[k-1].style.borderRightWidth="1px";
					}
					borderWidth = 1;
				} else {
					if(i==4) {
						transkeyObj.div.childNodes[i].childNodes[2].style.borderRightWidth="";
					} else {					
						transkeyObj.div.childNodes[i].childNodes[k-1].style.borderRightWidth="";
					}
				}
			}
			
			transkeyObj.div.childNodes[i].firstElementChild.style.marginLeft=currentLeft-borderWidth+"px";
			transkeyObj.div.childNodes[i].lastElementChild.style.marginRight=currentRight-borderWidth+"px";
			
			
		}
	} else if(transkeyObj.keyboardType=="qwertyMobile"){
		var width = this.clientWidth;
		var blankWidth = 0;
		
		if(max_width!=0&&max_width>=300&&this.clientWidth>max_width) {
			if(splitWidth > 0 && max_width > splitWidth) {
				blankWidth = max_width - splitWidth;
				width = splitWidth;
			}else {
				width = max_width;				
			}
			var ddivWidth = Math.floor((width-12-(marginEdge*12))/11)-divKeypad;
			var edgeSize = width-((ddivWidth*11+12+(marginEdge*12)));
		}
		else {
			if(splitWidth > 0 && width > splitWidth) {
				blankWidth = width - splitWidth;
				width = splitWidth;
			}
			var ddivWidth = Math.floor((width*widthRatio-12-(marginEdge*12))/11)-divKeypad;
			var edgeSize = width/widthRatio-((ddivWidth*11+12+(marginEdge*12)));
		}
		
		var edgePx = new Array(11);
		for(var i=0;i<11;i++){
			if(i<edgeSize)
				edgePx[i]=1;
			else
				edgePx[i]=0;
		}
		
		for(var i=1; 6>i; i++){
			if(key_margin>0) {
				if(i==1)
					transkeyObj.div.childNodes[i].classList.remove("dv_"+_cssName+"_div_a");
				transkeyObj.div.childNodes[i].style.marginTop=key_margin+"px";
				transkeyObj.div.childNodes[i].style.marginRight=key_margin+"px";
				transkeyObj.div.childNodes[i].style.border=key_margin+"px";
				transkeyObj.div.childNodes[i].style.borderRight="0px";
			}
			if(i==5){
				if(useSpace) {
					transkeyObj.div.childNodes[i].childNodes[0].style.width=ddivWidth+ddivWidth+1+edgePx[0]+edgePx[1]+marginEdge+"px";
					transkeyObj.div.childNodes[i].childNodes[1].style.width=ddivWidth+ddivWidth+1+edgePx[2]+edgePx[3]+marginEdge+"px";
					transkeyObj.div.childNodes[i].childNodes[2].style.width=ddivWidth+ddivWidth+ddivWidth+2+edgePx[4]+edgePx[5]+edgePx[6]+marginEdge+marginEdge+blankWidth+"px";
					transkeyObj.div.childNodes[i].childNodes[3].style.width=4*ddivWidth+3+edgePx[7]+edgePx[8]+edgePx[9]+edgePx[10]+marginEdge+marginEdge+marginEdge+"px";
					if(key_margin>0) {
						for(var j=0; 4>j; j++) {
							transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
							transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
							transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
							transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
							if(j==3)
								transkeyObj.div.childNodes[i].childNodes[j].classList.remove("dv_"+_cssName+"_end");
						}
					}
				}
				else {
					transkeyObj.div.childNodes[i].childNodes[0].style.width=ddivWidth+ddivWidth+ddivWidth+2+edgePx[0]+edgePx[1]+edgePx[2]+marginEdge+marginEdge+"px";
					transkeyObj.div.childNodes[i].childNodes[1].style.width=ddivWidth+ddivWidth+ddivWidth+2+edgePx[3]+edgePx[4]+edgePx[5]+marginEdge+marginEdge+"px";
					transkeyObj.div.childNodes[i].childNodes[2].style.width=5*ddivWidth+4+edgePx[6]+edgePx[7]+edgePx[8]+edgePx[9]+edgePx[10]+marginEdge+marginEdge+marginEdge+marginEdge+blankWidth+"px";
					if(key_margin>0) {
						for(var j=0; 3>j; j++) {
							transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
							transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
							transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
							transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
							if(j==2)
								transkeyObj.div.childNodes[i].childNodes[j].classList.remove("dv_"+_cssName+"_end");
						}
					}
				}
			}else if(i==4){
				for(var j=0; 9>j; j++){
					transkeyObj.div.childNodes[i].childNodes[j].style.width=ddivWidth+edgePx[j]+"px";
					if(key_margin>0) {
						transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
						if(transkeyObj.div.childNodes[i].childNodes[j].getAttribute('aria-label')=='빈칸') {
							if(showDummy) {
								transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
							} else {
								if(key_margin > 0) {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor='transparent';
								} else {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
								}
							}
						}else {
							transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
						}
						transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
					}
				}
				transkeyObj.div.childNodes[i].childNodes[9].style.width=ddivWidth+ddivWidth+1+edgePx[9]+edgePx[10]+marginEdge+"px";
				if(key_margin>0) {
					transkeyObj.div.childNodes[i].childNodes[9].style.marginLeft=key_margin+"px";
					transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
					transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
					transkeyObj.div.childNodes[i].childNodes[9].style.borderRight="0px;";
					transkeyObj.div.childNodes[i].childNodes[9].classList.remove("dv_"+_cssName+"_end");
				}
			}else{
				for(var j=0; 11>j; j++){
					transkeyObj.div.childNodes[i].childNodes[j].style.width=ddivWidth+edgePx[j]+"px";
					if(key_margin>0) {
						transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
						transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
						if(transkeyObj.div.childNodes[i].childNodes[j].getAttribute('aria-label')=='빈칸') {
							if(showDummy) {
								transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
							} else {
								if(key_margin > 0) {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor='transparent';
								} else {
									transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
								}
							}
						}else {
							transkeyObj.div.childNodes[i].childNodes[j].style.borderColor="";
						}
						transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
						if(j==10)
							transkeyObj.div.childNodes[i].childNodes[j].classList.remove("dv_"+_cssName+"_end");
//						if(i==1)
//							transkeyObj.div.childNodes[i].childNodes[j].classList.add("dv_"+_cssName+"_div_a");
					}
				}
			}
			
			var elements = document.querySelectorAll('.dv_'+_cssName+'_blank');
			var keyMargin = key_margin>0 ? 0 : 1;
			elements.forEach(element => {
				element.style.marginRight = (blankWidth-keyMargin)+'px';					
				element.nextElementSibling.style.borderLeftWidth = "1px";
				element.nextElementSibling.style.borderLeftStyle = "solid";
			});
		}
	} else {
	
		var k=3;
		
		if(max_width!=0&&max_width>=300&&this.clientWidth>max_width) {
			var ddivWidth = Math.floor((max_width-(k+1)-(marginEdge*(k+1)))/k)-divNum;
			var edgeSize = this.clientWidth-(ddivWidth*k+(k+1)+(marginEdge*(k+1)));
		}
		else {
			var ddivWidth = Math.floor(((this.clientWidth*widthRatio-(k+1)-(marginEdge*(k+1)))/k))-divNum;
			var edgeSize = this.clientWidth/widthRatio-(ddivWidth*k+(k+1)+(marginEdge*(k+1)));
		}
		var edgePx = new Array(k);
		for(var i=0;i<k;i++){
			if(i<edgeSize)
				edgePx[i]=1;
			else
				edgePx[i]=0;
		}
		for(var i=1; 4>i; i++){
			if(key_margin>0) {
				if(i==1)
					transkeyObj.div.childNodes[i].classList.remove("dv_"+_cssName+"_div_a");
				transkeyObj.div.childNodes[i].style.marginTop=key_margin+"px";
				transkeyObj.div.childNodes[i].style.marginRight=key_margin+"px";
				transkeyObj.div.childNodes[i].style.border=key_margin+"px";
				transkeyObj.div.childNodes[i].style.borderRight="0px";
			}
			for(var j=0; k>j; j++){
//				transkeyObj.div.childNodes[i].childNodes[j].style.width=ddivWidth+edgePx[j]+"px";
				if(key_margin>0) {
					transkeyObj.div.childNodes[i].childNodes[j].style.marginLeft=key_margin+"px";
					transkeyObj.div.childNodes[i].childNodes[j].style.borderWidth="1px";
					transkeyObj.div.childNodes[i].childNodes[j].style.borderStyle="solid";
					transkeyObj.div.childNodes[i].childNodes[j].style.borderRight="0px;";
					if(j==k-1)
						transkeyObj.div.childNodes[i].childNodes[j].classList.remove("dv_"+_cssName+"_end");
				}
			}
		}
	}
};

mTranskey.prototype.reSizeListener = function(){
	if(mtk.now!=null){
		if(document.body.offsetWidth<265){
			tk_alert("현재 크기에서는 키패드를 지원하지 않습니다.\n더 큰 화면에서 실행해주세요.\n현재 키패드를 종료합니다.");
		 	mtk.now.inputObj.readOnly=true;
			mtk.close();
			return;
		}else {
			if(mtk.now.inputObj.readOnly==true) mtk.now.inputObj.readOnly=false;
		}
	}
	mtk.getClientWidth();
	if(mtk.now!=null){
		if(transkey_divType==1) {
			if(!mtk.checkWidthSize(mtk.now.width)){
				mtk.reSize(mtk.now);
			}
		}
		 var div = mtk.now.div;
		 var maxLength = mtk.now.inputObj.maxLength;
		
		 
		 mtk.setPosition();
		if(mtk.now.useTranskey)
			div.style.display="block";
		
		mtk.now.div.style.height = '';
		mtk.now.height = mtk.now.div.offsetHeight;
		
		if(key_margin>0) {
			if(mtk.now.keyboardType=="numberMobile")
				mtk.now.div.style.height = mtk.now.height+key_margin*5-4+"px"
			else
				mtk.now.div.style.height = mtk.now.height+key_margin*6-5+"px"
		}
		
		if(mtk.now.useInput){
			var inputHeight = getComputedStyle(mtk.now.useInputDiv).height.replace("px","")-getComputedStyle(mtk.now.useInputDiv).borderBottomLeftRadius.replace("px","");
			mtk.now.useInputDiv.style.left=div.style.left;
			if(mtk.now.inputObj.getAttribute("data-tk-bottom") == "true")
				mtk.now.useInputDiv.style.bottom = mtk.now.div.offsetHeight-getComputedStyle(mtk.now.useInputDiv).borderBottomLeftRadius.replace("px","")+"px";
			else
				mtk.now.useInputDiv.style.top = div.style.top.replace("px", "")-inputHeight+"px";
			
//			if(transkey_divType == 1){
//				var totalWidth = key_margin;
//				for(var i=0; i<div.childNodes[1].childNodes.length; i++) {
//					console.log(div.childNodes[1].childNodes[i].offsetWidth + parseFloat(getComputedStyle(div.childNodes[1].childNodes[i]).marginRight) + parseFloat(getComputedStyle(div.childNodes[1].childNodes[i]).marginLeft));
//					totalWidth += div.childNodes[1].childNodes[i].offsetWidth + parseFloat(getComputedStyle(div.childNodes[1].childNodes[i]).marginRight) + parseFloat(getComputedStyle(div.childNodes[1].childNodes[i]).marginLeft);
//				}
//				alert(totalWidth + " / " + (div.childNodes[1].clientWidth+parseFloat(getComputedStyle(div.childNodes[1]).marginRight) + parseFloat(getComputedStyle(div.childNodes[1]).marginLeft)) + " / " + div.clientWidth)
//				mtk.now.useInputDiv.style.width = div.clientWidth+"px";
//			} else{
//				mtk.now.useInputDiv.style.width=div.clientWidth+"px";
//			}
			
			mtk.now.useInputDiv.style.width=div.clientWidth+"px";
			
			if(mtk.now.keyboardType=="numberMobile"&&maxLength>=2&& maxLength<=8){
				var underlineWidth = 37;
				var fontSize = "xx-large";
				if(mtk.now.div.offsetWidth < 400) {
					underlineWidth = 30;
					fontSize = "x-large";
				}
			
				if(transkey_divType==0)
					var margin = Math.floor((mtk.now.width-37*maxLength)/(maxLength+1));
				else{
					if(max_width!=0&&max_width>=300&&mtk.clientWidth>max_width)
						var margin = Math.floor((max_width - underlineWidth*maxLength)/(maxLength+1));
					else
						var margin = Math.floor(((mtk.clientWidth*widthRatio) - underlineWidth*maxLength)/(maxLength+1));
				}
				
				for(var i=2; i<mtk.now.useInputDiv.childElementCount; i++){
					mtk.now.useInputDiv.childNodes[i].style.marginLeft=margin+"px";
				}
				
				if(transkey_divType==1) {
					var childInput = mtk.now.useInputDiv.querySelectorAll("input");
					for(var i=0; i<childInput.length; i++) {
						childInput[i].style.width = underlineWidth+"px";
						childInput[i].style.fontSize = fontSize;
					}
				}
			}
		}
	}
};

function tk_contains(parent, child, deep) {
	if (parent == child || (mtk.now.useInputDiv != null && mtk.now.useInputDiv.contains(child))||child.id=="balloonimg")
    	return true;
    	

    var items = parent.children;
    var count = items.length;

    for ( var i = 0; i < count; i++) {
    	if (items[i] == child)
    		return true;
    	if (deep == true && tk_contains(items[i], child, deep))
    		return true;
	}
	return false;
}

function checkTransKey(nsEvent) {
    var inputObj;
	
    if (nsEvent.type == "text" || nsEvent.type == "password") {
          inputObj = event;
    } else {
          nsEvent = nsEvent ? nsEvent : window.event;
          inputObj = nsEvent.target ? nsEvent.target : nsEvent.srcElement;
    }
    
    if(mtk.now!=null){
    	if(mtk.now.div.style.display=="block") {
	        var transkeyDiv = mtk.now.div;
	        var transkeyObj = mtk.now;
	        
	        if(inputObj.tagName == "INPUT" && inputObj.id == transkeyObj.id) {
	        	mtk.focusout(inputObj);
	        } else if (tk_contains(transkeyDiv, inputObj, true) == false) {
	    		mtk.close();
	        }
        }
    }
}

function checkCookie() {
	   var cookieEnabled;
	   if (document.all)
	       cookieEnabled = navigator.cookieEnabled;
	   else {
	       var cookieName = 'checkCookie' + (new Date().getTime());
	       document.cookie = cookieName + '=cookieValue';
	       cookieEnabled = document.cookie.indexOf(cookieName) != -1;
	       document.cookie = cookieName + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
	   }
	   if (!cookieEnabled){
		     tk_alert("브라우저에서 쿠키가 차단되어있습니다. 설정에서 쿠키를 허용해주세요.");
		   cookie_check_val = false;
	   }
}

function removeArray(arr, item) {
	if(!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(arg, i) {
	        i = i || 0;
	        var len = this.length;
	        while (i < len) {
	            if(this[i] === arg) return i;
	            ++i;
	        }
	        return -1;
	    };
	}
	
    var a = arguments;
    var len = a.length;
    var index;
    
    while (len > 1 && arr.length) {
    	item = a[--len];
        while ((index= arr.indexOf(item)) !== -1) {
            arr.splice(index, 1);
        }
    }
    
    return arr;
}

//chrome92로 alert => div로 변환(popup형식)
var alertCnt=0;
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
	

function tk_alert(tk_popup_comment) {
	
	this.isiPad = navigator.userAgent.indexOf("iPad")>-1;
	this.isiPhone = navigator.userAgent.indexOf("iPhone")>-1;
	this.isAndroid = navigator.userAgent.indexOf("Android")>-1;
		
	if(this.isAndroid){
		var chromeVer = getChromeVersion();
		if(chromeVer!=null) {
			if(tkAlert.useDivAlert==true && chromeVer.split(".")[0] >= tkAlert.EngineVer)
				create_alert(tk_popup_comment);
			else
				alert(tk_popup_comment);
		} else {
			if(tkAlert.useDivAlert==true)
				create_alert(tk_popup_comment);
			else
				alert(tk_popup_comment);
		}
	}
	else{
		if(tkAlert.useDivAlert==true)
			create_alert(tk_popup_comment);
		else
			alert(tk_popup_comment);
	}
}

function create_alert(tk_popup_comment){
	alertCnt++;
	var div1 = document.getElementById("tk_alert")
	if(!div1) {
		div1 = document.createElement("DIV");
		div1.id = "tk_alert";
		div1.style.position = "absolute";
		div1.style.height = document.body.clientHeight + 100 + "px";
		div1.style.width = document.body.clientWidth + "px";
		div1.style.top = "0";
		div1.style.left = "0";
		div1.style.opacity = "0.4";
		div1.style.filter = "alpha(opacity=40)";
	}

	var div2 = document.createElement("DIV");      //글자 들어가는 부분(닫기)
	div2.id = "tk_alert_popupmessage"+alertCnt;
	div2.style.cssText = "color:grey;width: 200px;z-index: 10001;border: 1px solid gray;border-radius: 11px;background: white;font-family:monospace; position: fixed; white-space:pre-wrap; word-break:break-all;";
	
	var div3 = document.createElement("DIV");
	div3.style.cssText = "margin: 5px;margin-top: 15px;";
	var span1 = document.createElement("span");
	span1.id = "tk_LayerText1";
	span1.role = "button";
	span1.tabIndex = "0";
	span1.ariaLabel = tk_popup_comment;
	span1.textContent = tk_popup_comment;
	div3.appendChild(span1);
	div2.appendChild(div3);
	
	var div4 = document.createElement("DIV");
	div4.style.cssText = "margin: 5px;";
	var button1 = document.createElement("button");
	button1.id = "layerClose";
	if (document.addEventListener) {
		button1.addEventListener( "click", function(){tk_alertLayerClose();});
	}else{
		button1.attachEvent( "onclick", function(){tk_alertLayerClose();});
	}
	button1.style.cssText = "font-size: medium;background: #9d9d9d;border-radius: 15px;margin: 10px;height:30px;width: 80px;border: 3px solid #9d9d9d;font-family: monospace;";
	button1.role = "button";
	button1.tabIndex = "0";
	button1.ariaLabel = "닫기";
	div4.appendChild(button1);
	div2.appendChild(div4);

	var div5 = document.createElement("DIV");
	div5.id = "tk_alert_popup"+alertCnt;
	div5.style.cssText = "position:absolute;  display: table-cell;text-align: center; vertical-align: middle; color: white;z-index: 10000;";  
	div5.appendChild(div2);
	
	document.body.appendChild(div1);
	document.body.appendChild(div5);
	
	setTimeout(function(){
		div2.firstChild.firstChild.focus();
	},100);
	
	tk_alertLayerResize();
	disableScrolling();
	window.onresize = function(event) {
		tk_alertLayerResize();
	};
}

function tk_alertLayerResize() {
	var div2 = document.getElementById("tk_alert_popup"+alertCnt);
	for(var i=0; i<=alertCnt; i++) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
		var div2 = document.getElementById("tk_alert_popup"+i);
	   if (div2) {
		   div2.style.top = (window.innerHeight / 2) - (div2.children[0].clientHeight / 2) + "px";
	       div2.style.left = (window.innerWidth / 2) - (div2.children[0].clientWidth / 2) + "px";
	   }
	}
}

function tk_alertLayerClose() {
                                                                                                                                                                                                                                                                                                                                                                                                                          
	var div1 = document.getElementById("tk_alert");
	var div2 = document.getElementById("tk_alert_popup"+alertCnt);

	if(alertCnt>1){		
		document.body.removeChild(div2); 
	      }
	else{
    	document.body.removeChild(div2); 
    	document.body.removeChild(div1);
    	enableScrolling();
	    }
	alertCnt--; 
}

function disableScrolling(){
	document.body.style.overflow = "hidden";
}

function enableScrolling(){
	document.body.style.overflow = "auto";
}


function Key_csp() {
	this.name = "";
	
	this.npoints = 0;
	this.xpoints = new Array();
	this.ypoints = new Array();
	
	this.addPoint = function(x, y) {
		this.npoints++;
		this.xpoints.push(x);
		this.ypoints.push(y);
	};
	
	this.contains = function(x, y) {
		var startx = this.xpoints[0];
		var starty = this.ypoints[0];
		
		var endx = this.xpoints[2];
		var endy = this.ypoints[2];
		
		if ( startx < x && starty < y )
		{
			if ( endx > x && endy > y )
			{
				return 1;
			}
		}
		
		return 0;
	};
}

