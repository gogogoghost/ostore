<template>
    <div class="app-content" :class="{'selected':props.selected}">
        <img :src="props.img" v-if="!iconError" @error="iconError=true"/>
        <img src="/kaios_56.png" v-else/>
        <div>
            <div class="app-title">{{ props.name }}</div>
            <div class="app-desc">{{ props.desc }}</div>
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
const props=defineProps({
    img:String,
    name:String,
    desc:String,
    selected:Boolean
})
const iconError=ref(false)
</script>

<style lang="scss" scoped>
.app-content{
    display: flex;
    flex-direction: row;
    padding: 4px;
    &>img{
        width:40px;
        height:40px;
        margin-right: 4px;
    }
    .app-title{
        font-size:16px;
        font-weight: bold;
    }
    .app-desc{
        font-size: 12px;
        line-height: 12px;;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.selected{
    background-color: #E6510066;
}
</style>