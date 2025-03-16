<template>
    <div class="about">
        <img src="/ostore_56.png">
        <div class="name">OStore</div>
        <div class="version">{{version}}</div>
        <div class="desc">Orange app store for kaios 3.1</div>
        <!-- <button ref="check" @click="checkUpdate">Check Update</button> -->
    </div>
</template>

<script setup>
import {onMounted,ref} from 'vue'
const check=ref(null)

const version=import.meta.env.VITE_APP_VERSION

const checkUpdate=()=>{
    // alert("check")
}

onMounted(()=>{
    // check.value.focus();
})
</script>

<style lang="scss" scoped>
.about{
    display: flex;
    align-items: center;
    flex-direction: column;
    &>img{
        width:56px;
        height: 56px;
    }
    &>.name{
        font-size: 16px;
        font-weight: bold;
    }
    &>.version{
        font-size:12px;
        line-height: 10px;;
    }
    &>button{
        margin-top:10px;
        background-color: #E65100;
        border-width: 0;
        padding:6px 12px;
        border-radius: 5px;
        box-shadow: none;
        color:white;
    }
}
</style>