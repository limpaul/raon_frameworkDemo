<template>
    <input :type="type" :id="id" :name="name" :data-tk-kbdtype="keypadType" :placeholder="placeholder" @click="showKeyboard($event.target)"/>
</template>

<script setup>
import {defineProps} from 'vue';

const showKeyboard = (inputObj) => {
    window.tk.onKeyboard(inputObj);
}
defineProps({
    type:String,
    id:String,
    name: String,
    keypadType: String,
    placeholder: String
})
</script>