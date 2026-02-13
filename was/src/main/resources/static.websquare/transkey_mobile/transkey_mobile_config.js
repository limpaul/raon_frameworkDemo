/*Create transkey_mobile_config.js by TranskeySupporter
2024-03-11*/

var transkey_url = '/transkey_mobile';
var transkey_surl = '/transkeyServlet';
var transkey_apiurl = '/transkey/api/';
var transkey_delimiter = '$';
var transkey_encDelimiter = ',';
var keyboardLayouts = ["qwertyMobile", "numberMobile"];

//function config
var transkey_divType = 1;
var transkey_apiuse = false;
var useCheckTranskey = true;
var useAsyncTranskey = false;
var mtk_useButton = true;
var mtk_useTranskey = true;
var useFakeKey = true;
var useNoDummy = false;
var clickDummy = true;
var onKeyboard_allocate = true;
var relocation = true;
var use_form_id = false;
var page_isDraggable = false;
var useCSP = false;
var isNode = false;
var useSha2 = true;

//cors
var useCORS = false;
var tk_origin = "";

//ui
var tk_comments = "";
var widthRatio = 1;
var max_width = 0;
var splitWidth = 0;
var key_margin = 0;
var showDummy = true;
var usePressImg = false;
var useBalloon = false;
var showLicense = true;
var tkAlert = {};
tkAlert.useDivAlert = false;
tkAlert.EngineVer = 93;

//SHA-256 Hash Value for check keyboard version
var setQwertyMobileHash = "6f37d7b161d83bbc4dad98be737315c51169cd3e4264b0bdfddfe534011dce39";
var setNumberMobileHash = "34f2712e546619a2831be2e59fbd95a4e5a59ae85277b545c39332adc9240b20";
