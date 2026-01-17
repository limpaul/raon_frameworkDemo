/*Create transkey_config.js by TranskeySupporter
2024-03-11*/

var transkey_url = '/transkey';
var transkey_surl = '/transkeyServlet';
var transkey_apiurl = '/transkey/api/';
var transkey_delimiter = '$';
var transkey_encDelimiter = ',';
var keyboardLayouts = ["qwerty", "number"];
var tk_blankEvent = "onmouseover";

//function config
var useCheckTranskey = true;
var useAsyncTranskey = false;
var transkey_apiuse = false;
var transkey_isMultiCursor = false;
var transkey_isDraggable = true;
var tk_useButton = true;
var tk_useTranskey = true;
var onKeyboard_allocate = true;
var use_form_id = false;
var useCSP = false;
var isNode = false;
var useRefocus = true;
var useSha2 = true;

//cors
var useCORS = false;
var tk_origin = "";

//ui
var showLicense = true;
var tkAlert = {};
tkAlert.useDivAlert = false;
tkAlert.EngineVer = 93;
var useCustomButton = false;
var customOnButton = "";
var customOffButton = "";

//SHA-256 Hash Value for check keyboard version
var setQwertyHash = "c9aca3c8dd5f45959ab7d335c42605b24515b5a2b844da6eb54b2ba6397cb7f5";
var setNumberHash = "264051901014bb0062c359efd18a4eaac869d5ab84811714f0f11c0bf476c674";
