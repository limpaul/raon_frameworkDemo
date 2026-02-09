import axios from "axios";
import LinkComponent from "../LinkComponent";

function BizComponent(){
    return (
        <>
            <div>
                <LinkComponent/>
                <h1>PKI Biz Sample</h1>
                <div>
                    <button onClick={()=>{KeySharpBiz.isInstall(false, (result)=>{
                        	if(result){
                                alert("[컨트롤 설치확인] 설치");
                            }else{
                                alert("[컨트롤 설치확인] 미설치");
                            }	
                    })}}>PKI 솔루션 key#biz 설치체크</button>
                </div>
                <div>
                    <input type="text" id="plainText" placeholder="서명원문 입력 없을시 '가나다라마사 대처' " style={{width:'300px'}}/><br/>
                    <input type="text" id="idn" placeholder="인증서 주민번호 또는 사업자 번호 -없이 입력" style={{width:'300px'}}/>
{/*                     
                    <button onClick={()=>{
                        var plainData = document.getElementById('plainText');
                        if(plainData.value == ''){
                            plainData.value = '가나다라마바사';
                        }
                        window.KeySharpBiz.sign(plainData.value, (res)=>{
                            document.getElementById('certVerifyText').value = res.vidRandom;
                            document.getElementById('certSignVerifyResultArea').value = res.data;
                        })
                    }}>전자서명</button> */}
                    
                    <button onClick={()=>{
                        KSBizConfig.nonceUrl = '/api/ksbiz/nonce.jsp'
                        const usernum = document.getElementById('idn').value;
                        if(usernum == ''){
                            alert('인증서 사업자 번호 또는 주민번호를 입력해주세요')
                            return;
                        }
                        KeySharpBiz.sign(document.getElementById('idn').value, (res)=>{
                            document.getElementById('certVerifyText').value = res.vidRandom;
                            document.getElementById('certSignVerifyResultArea').value = res.data;
                        }, {addNonce:true});

                    }}>전자서명 본인확인</button>
                    
                    <button onClick={()=>{
                        KSBizConfig.nonceUrl = '/api/ksbiz/nonce.jsp'
                        var plainData = document.getElementById('plainText');
                        if(plainData.value == ''){
                            plainData.value = '가나다라마사';
                        }
                        KeySharpBiz.login(plainData.value, (res)=>{
                            document.getElementById('certVerifyText').value = res.vidRandom;
                            document.getElementById('certSignVerifyResultArea').value = res.data;
                        })
                    }}>전자서명 로그인(nonce 난수 값 재사용방지 지원)</button>

                    <button onClick={()=>{
                        KSBizConfig.lineServerURL = '/api/ksbiz/line.jsp';
                        var plainData = document.getElementById('plainText');
                        if(plainData.value == ''){
                            plainData.value = '가나다라마사';
                        }
                        KeySharpBiz.lineEncrypt({"data" : plainData.value}, (res)=>{
                            document.getElementById('certSignVerifyResultArea').value = res.data;
                        });
                    }}>구간암호화 값 생성</button>
                </div>
                <div>
                    <input type="text" id="certVerifyText" style={{width:'500px'}} placeholder="인증서의 주민번호 또는 사업자 번호에대한 R값이 표시됩니다" readOnly/>
                </div>
                <div>
                    <textarea id="certSignVerifyResultArea" rows={10} cols={120} style={{overflow: scroll}} placeholder="인증서 전자서명 결과값이 여기 표시됩니다" readOnly></textarea>
                </div>
                <button onClick={()=>{
                    axios.post('/api/ksbiz/signAction.jsp',{
                        'idn':document.getElementById('idn').value,
                        'ksbizVidRandom':document.getElementById('certVerifyText').value,
                        'ksbizSig':document.getElementById('certSignVerifyResultArea').value,
                    }, {
                        headers : 'application/json'
                    }).then(res=>{
                        document.getElementById('certSignVerifyResultArea').value = JSON.stringify(res.data);
                        const data = res.data;
                        if(data.vidCheck != undefined && data.vidCheck!=0){
                            alert('인증서와 주민번호 또는 사업자 번호가 일치하지 않거나 올바르지 않은 값 입니다')
                        }
                    })
                }}>서버로 전자서명 값 전송</button>
                <button onClick={()=>{
                    // 구간암호화 데이터 가져온다
                    axios.post('/api/ksbiz/lineEncryptAction.jsp', {
                        'msg': document.getElementById('certSignVerifyResultArea').value
                    },{
                        headers : {
                            'Content-Type':'application/json'
                        }
                    }).then(res =>{
                        if(res.data.status == 0){
                            var decData = KeySharpBiz.lineDecryptAsync(res.data.serverEncData, function(plain){
                                if(plain.status == 1){
                                    res.data['clientDecode'] = plain.data;
                                } else {
                                    alert("복호화 실패: " + plain.message + ":" + plain.status);
                                }
                                document.getElementById('certSignVerifyResultArea').value = JSON.stringify(res.data);
                            });
                            
                        }
                        
                    })


                }}>서버로 구간 암호화 값 전송</button>
            </div>
        </>
    )   
}
export default BizComponent;