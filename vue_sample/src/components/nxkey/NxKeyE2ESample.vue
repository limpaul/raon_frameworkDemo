<template>
    <div>
        <h1>NxKeyE2ESample.vue</h1>
        <div>
            <NxKeyEdit type="text" id="userid" name="userid" placeholder="사용자 아이디"/><br/>
            <NxKeyEdit type="password" id="userpw" name="userpw" enc="on" placeholder="사용자 비밀번호"/><NxKeyDecodeBtn id="userpw"/><br/>
            <NxKeyEdit type="password" id="usernum" name="usernum" datatype="n" maxlength="4" enc="on"  placeholder="카드번호 4자리 입력 ( 숫자만 )"/><NxKeyDecodeBtn id="usernum"/><br/>
            <NxKeyEdit type="text" id="nosecure" name="nosecure" datasecuirty="off"  placeholder="키보드보안 보안 해제"/><br/>
        </div>

        <div>
            <h2>키보드보안 설치 체크</h2>
            <button @click="nxkeyInstallCheck">설치 체크</button>
        </div>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import NxKeyEdit from './NxKeyEdit.vue';
import NxKeyDecodeBtn from './NxKeyDecodeBtn.vue';
import axios from 'axios';
 const nxkeyInstallCheck = () => {
     window.TOUCHENEX_CHECK.check([window.touchenexInfo], (res)=>{
         if(res.status){
             alert(`설치 완료: 키보드보안: ${res.info[0].clientVer} /  이니라인: ${res.info[0].daemonVer}`)
         }else{
             window.TK_installPage();
         }
     });
 }

 onMounted(()=>{
    axios.post('/api/nxkey/tnksr')
    .then(res => {
        window.TNK_SR = res.data;
        window.tekOption.srdk = res.data;
        if(!window.loadflag){// spa 환경에서 새로 고침없어서 loadflag값이 false일 경우 최초 키보드보안이 적용된 페이지를 접근했다는 의미 
            window.TK_Loading();
        }else{ // 이전에 키보드보안이 적용된 페이지를 왔었으면 새로고침이 없어 loadflag값이 true값이라 TK_Rescan()함수를 사용해야 함 
            window.TK_Rescan();
        }
    })
})


</script>
