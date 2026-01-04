import { useEffect, useState } from "react";
import TranskeyEdit from "./TranskeyEdit";
import LinkComponent from "../LinkComponent"

function TranskeySample(){
    const [count, setCount] = useState(0);
    const [dynamicInputs, setDynamicInputs] = useState([]);
    useEffect(()=>{
        var isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent); // pc, mobile 분기처리는 솔루션에서 분기처리 하지 않습니다, 업무소스에서 분기처리 필요 
        if(isMobile){
            alert('웹 가상키패드는 모바일 웹 화면에서 사용 할 수 없습니다');
            window.location.href='/';  // navtigate를 사용하지 않은 이유는 index.html에서 새로 고침을 함으로서 모바일 웹 스크립트 로드가 되어야 하기 때문이다
        }else{
            window.tk_useTranskey=true;
            window.initTranskey();
        }
        
    }, [])

    const addDynamicInput = () => {
        const newId = `dynamic_${count}`
        const newNode = {
            type:'password',
            id:newId,
            name:newId,
            keypadType:'number',
            placeholder:'숫자키패드'
        }
        setDynamicInputs([...dynamicInputs, newNode]);
        setCount(count+1);
    }
    const removeDynamicInput = (id) => {
        setDynamicInputs(dynamicInputs.filter((item)=>item.id != id));
        setCount(count - 1);
        window.tk.remove(document.getElementById(id)); // 가상키패드 input 요소마다 관리 객체 제거
    }
    return (
        <>
            <LinkComponent/>
            <h1>웹 가상키패드 샘플</h1>
            <div>
                <TranskeyEdit type='text' id='qwertykeypad' name='qwertykeypad' keypadType='qwerty' placeholder='qwertykeyapd' isDecodeBtn={true}/><br/>
                <TranskeyEdit type='password' id='numberkeypad' name='numberkeypad' keypadType='number' placeholder='numberkeypad' isDecodeBtn={true}/>
            </div>

            <h2>initTranskey() 함수 호출이후 동적으로 input 생성될 경우 tk.setKeyboard함수를 사용합니다</h2>
            <div>
                <button onClick={addDynamicInput}>동적 input 요소 생성</button>
            </div>
            <div>
                {
                    dynamicInputs.map((item)=>(
                        <div key={item.id} style={{
                            margin:'10px'
                        }}>
                            <TranskeyEdit type={item.type} id={item.id} name={item.name} keypadType={item.keypadType} placeholder={item.placeholder} isDynamic={true} isDecodeBtn={true}/>
                            <button onClick={()=>{
                                removeDynamicInput(item.id);
                            }}>동적 input 요소 삭제</button>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
export default TranskeySample;