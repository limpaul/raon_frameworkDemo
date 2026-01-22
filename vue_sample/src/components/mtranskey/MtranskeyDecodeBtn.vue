<template>
    <button @click="ajaxTest">ajaxTest</button>
</template>
<script setup>
    import axios from 'axios';
import { defineProps } from 'vue';

    const props = defineProps({
        id:String
    })

    const ajaxTest = () => {
        const id = props.id;
        window.mtk.fillEncData();
        const initTime = document.getElementById('initTime').value;
        const keyboardType = document.getElementById('keyboardType_'+id).value;
        const keyIndex = document.getElementById('keyIndex_'+id).value;
        const fieldType = document.getElementById('fieldType_'+id).value;
        const seedKey = document.getElementById('seedKey').value;
        const encoded = document.getElementById('transkey_'+id).value;
        const hmEncoded = document.getElementById('transkey_HM_'+id).value;

        axios.post('/api/transkey/decode', {
            id:id,
            initTime: initTime,
            keyboardType: keyboardType,
            keyIndex: keyIndex,
            fieldType: fieldType,
            seedKey: seedKey,
            encoded: encoded,
            hmEncoded: hmEncoded
        },{
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res => {
            alert(res.data.status + "/ " + res.data.data);
        })  
    }
</script>