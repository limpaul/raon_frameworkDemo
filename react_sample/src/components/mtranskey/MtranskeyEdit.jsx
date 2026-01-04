import { useEffect, useRef } from "react";
import MtranskeyDecodeBtn from "./MtranskeyDecodeBtn";
function MtranskeyEdit({type, id, name, keypadType, keypadBottom, placeholder, isDynamic, isDecodeBtn}){
    const inputRef = useRef(null);
    const decodeTest = (id) => {
        //axios.post()
    }
    useEffect(()=>{
        if(isDynamic!=undefined && isDynamic){
           // debugger;
            mtk.setKeyboard(inputRef.current, window.transkey_isMultiCursor, window.mtk_useButton, window.mtk_useTranskey);
        }
    }, [])
    return (
        <>
            
                <input ref={inputRef} type={type} id={id} name={name} data-tk-kbdtype={keypadType} placeholder={placeholder} data-tk-bottom={keypadBottom} data-tk-nextsibling='true' onClick={
                    ()=>{
                        window.mtk.onKeyboard(inputRef.current);
                    }
                }/>
                {
                    isDecodeBtn && <MtranskeyDecodeBtn id={id}/>
                }
        </>
    )
}

export default MtranskeyEdit;