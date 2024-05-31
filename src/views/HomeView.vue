<template>
    <div @click="handleRouteChange('/')">首页</div>
    <div @click="handleRouteChange('/chou')">抽奖</div>
    <div @click="handleRouteChange('/chunks')">分片上传</div>
    <RouterView />
   
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const handleRouteChange = (url)=>{
    router.push(url)
}
</script>
<style scoped>

</style>