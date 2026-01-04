import { useEffect, useRef } from "react";
import TranskeyDecodeBtn from "./TranskeyDecodeBtn";
function TranskeyEdit({type, id, name, keypadType, placeholder, isDynamic, isDecodeBtn}){
    const inputRef = useRef(null);
    const decodeTest = (id) => {
        //axios.post()
    }
    useEffect(()=>{
        if(isDynamic!=undefined && isDynamic){
           // debugger;
            tk.setKeyboard(inputRef.current, window.transkey_isMultiCursor, window.tk_useButton, window.tk_useTranskey);
        }
    }, [])
    return (
        <>
            
                <input ref={inputRef} type={type} id={id} name={name} data-tk-kbdtype={keypadType} placeholder={placeholder} data-tk-nextsibling='true' onClick={
                    ()=>{
                        window.tk.onKeyboard(inputRef.current);
                    }
                }/>
                {
                    isDecodeBtn && <TranskeyDecodeBtn id={id}/>
                }
        </>
    )
}

export default TranskeyEdit;