<template>
    <button @click="ajaxTest">ajaxTest</button>
</template>
<script setup>
    import axios from 'axios';
import { defineProps } from 'vue';
    
    const ajaxTest = () => {
        const id = props.id;
        const hidKeyData = document.getElementById('hid_key_data').value;
        const e2eData = document.getElementById('E2E_'+id).value;
        axios.post('/api/nxkey/decode', {
            id:id,
            hidKeyData:hidKeyData,
            e2eData: e2eData
        }, {
            headers : {
                "Content-Type":'application/json'
            }
        }).then(res => {
            alert(`status: ${res.data.status} / plainData: ${res.data.data}`)
        })
    }
    
    const props = defineProps({
        id: String,
    })
</script>