import { useEffect } from "react";
import LinkComponent from "../LinkComponent"
import NxKeyEdit from "./NxKeyEdit"
function NxKeySample(){
    const nxkeyInstallCheck = () => {
        window.TOUCHENEX_CHECK.check([touchenexInfo], (res)=>{
            if(res.status){
                alert(`설치 완료: 키보드보안: ${res.info[0].clientVer} /  이니라인: ${res.info[0].daemonVer}`)
            }else{
                window.TK_installPage();
            }
        });
    }
    useEffect(()=>{
        if(!loadflag){// spa 환경에서 새로 고침없어서 loadflag값이 false일 경우 최초 키보드보안이 적용된 페이지를 접근했다는 의미 
            window.TK_Loading();
        }else{ // 이전에 키보드보안이 적용된 페이지를 왔었으면 새로고침이 없어 loadflag값이 true값이라 TK_Rescan()함수를 사용해야 함 
            window.TK_Rescan();
        }
        
    }, [])
    return (
        <>
            <LinkComponent/>
            <h1>NxKeySample</h1>
            <NxKeyEdit type="text" id="userid" name="userid" placeholder="사용자 아이디"/><br/>
            <NxKeyEdit type="password" id="userpw" name="userpw" placeholder="사용자 비밀번호"/><br/>
            <NxKeyEdit type="password" id="usernum" name="usernum" datatype="n" maxlength="4"  placeholder="카드번호 4자리 입력 ( 숫자만 )"/><br/>
            <NxKeyEdit type="text" id="nosecure" name="nosecure" datasecuirty="off"  placeholder="키보드보안 보안 해제"/><br/>

            <div>
                <h2>키보드보안 설치 체크</h2>
                <button onClick={nxkeyInstallCheck}>설치 체크</button>
            </div>
        </>
    )
}
export default NxKeySample;