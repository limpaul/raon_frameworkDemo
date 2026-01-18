<template>
    <input :type="type" :id="id" :name="name" :enc="enc" :placeholder="placeholder"/>
</template>

<script setup>
    import { defineProps } from 'vue';
    // 1. props 변수를 선언만 하고 안 써서 발생하는 에러 방지를 위해 변수 할당 생략 가능
    // 2. defineProps는 매크로이므로 import 없이 사용 가능 (ESLint 설정 필요)
    defineProps({
        type: String,
        id: String,
        name: String,
        enc: String,
        placeholder: String
    })
</script>