<template>
    <div>
        <h1>MtranskeySample.vue</h1>
        <div>
            <MtranskeyEdit type='text' id='qwertykeypad' name='qwertykeypad' keypadType='qwerty' nextSibling="true" placeholder='qwertykeyapd' isDecodeBtn='true'/>
            <MtranskeyDecodeBtn id="qwertykeypad"/>
            <br/>
            <MtranskeyEdit type='password' id='numberkeypad' name='numberkeypad' keypadType='number' nextSibling="true" placeholder='numberkeypad' isDecodeBtn='true'/>
            <MtranskeyDecodeBtn id="numberkeypad"/>
        </div>
        <h2>initTranskey() 함수 호출이후 동적으로 input 생성될 경우 tk.setKeyboard함수를 사용합니다</h2>
    </div>
    <div>
        <button @click="addComponent">추가</button>
        
        <div v-for="item in componentLists" :key="item.id"> 
            <MtranskeyEdit
                type='password' :id='item.id' :name='item.id' keypadType='number' nextSibling="true" placeholder='numberkeypad' isDecodeBtn='true'
                @vue:mounted="()=>applyTranskey(item.id)"
            />
            <MtranskeyDecodeBtn :id="item.id"/>
            <button @click="()=>removeSpecificComponent(item.id)">삭제</button>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import MtranskeyEdit from './MtranskeyEdit.vue';
import MtranskeyDecodeBtn from './MtranskeyDecodeBtn.vue';
onMounted(()=>{
    window.tk_useTranskey = true;
    setTimeout(()=>{
        window.initmTranskey();
    }, 300);
})

const componentLists = ref([]);
let nextId = 0;

const addComponent = () => {
    componentLists.value.push({
        id: `test${nextId++}` // input 요소 id속성을 test... 로 추가 
    })
}
const applyTranskey = (id) => { // input 컴포넌트가 추가 될 때마다 키패드 적용
    const inputObj = document.getElementById(id);
    window.mtk.setKeyboard(inputObj);
}
const removeSpecificComponent = (id) => {
    const inputObj = document.getElementById(id);
    window.mtk.remove(inputObj); // 가상키패드 기존 입력한 hidden필드들도 삭제해줘야 한다 아니면 계속 암호확값들 쌓인다
    // 해당 ID를 가진 항목만 제외하고 배열을 다시 구성
    componentLists.value = componentLists.value.filter(item => item.id !== id);
};
</script>
