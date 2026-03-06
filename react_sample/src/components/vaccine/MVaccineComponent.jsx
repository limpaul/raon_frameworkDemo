import LinkComponent from "../LinkComponent";
import { useEffect } from "react";
import MtranskeyEdit from "../mtranskey/MtranskeyEdit";


function MVaccineComponent(){
    useEffect(()=>{
        if( /android/i.test(navigator.userAgent) && (/(chrome|edga)/i.test(navigator.userAgent) && !/samsungbrowser|opr/i.test(navigator.userAgent)) && navigator.maxTouchPoints > 0){
            setTimeout(() => {
                window.initmTranskey();
                window.mVaccine_onload();
            }, 300);
        }else{
            alert('안드로이드 단말 또는 브라우저가 chrome, edge가 맞는지 확인 바랍니다 '+navigator.userAgent)
        }
    },[])
    return (
        <div>
            <LinkComponent/>
            <h1>MVaccine Web 샘플 </h1>
            클릭시 input으로 focus간다<input type="checkbox" onChange={()=>{
                document.getElementById('username').focus();
            }}/>
            <div>
                <input type="text" id="username" name="username" />
                <MtranskeyEdit type='text' id='qwertykeypad' name='qwertykeypad' keypadType='qwerty' placeholder='qwertykeyapd' keypadBottom={true} isDecodeBtn={true}/><br/>
            </div>
        </div>
    )
}
export default MVaccineComponent;