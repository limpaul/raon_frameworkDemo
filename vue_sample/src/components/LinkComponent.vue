<template>
    <nav>
        <ul>
            <li><router-link to="/">메인페이지</router-link></li>
            <li><router-link to="/transkey">웹 가상키패드 샘플</router-link></li>
            <li><router-link to="/mtranskey">모바일 웹 가상키패드 샘플</router-link></li>
            <li><router-link to="/nxkey">키보드보안 샘플</router-link></li>
            <li><router-link to="/nxkey/e2e">키보드보안 구간암호화 샘플</router-link></li>
        </ul>
    </nav>
    <router-view/> 
</template>
<script>
export default ({
    name: 'LinkCompnent'
})
</script>
