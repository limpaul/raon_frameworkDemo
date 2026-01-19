<template>
    <div>
        <h1>TranskeySample.vue</h1>
        <div>
            <TranskeyEdit type='text' id='qwertykeypad' name='qwertykeypad' keypadType='qwerty' placeholder='qwertykeyapd' isDecodeBtn='true'/><br/>
            <TranskeyEdit type='password' id='numberkeypad' name='numberkeypad' keypadType='number' placeholder='numberkeypad' isDecodeBtn='true'/>
        </div>
        <h2>initTranskey() 함수 호출이후 동적으로 input 생성될 경우 tk.setKeyboard함수를 사용합니다</h2>
    </div>
</template>
<script setup>
import { onMounted } from 'vue';
import TranskeyEdit from './TranskeyEdit.vue';
onMounted(()=>{
    window.tk_useTranskey = true;
    setTimeout(()=>{
        window.initTranskey();
    }, 300);
})
</script>
