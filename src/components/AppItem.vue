<template>
    <div class="app-content" :class="{'selected':props.selected}">
        <img :src="props.img" v-if="!iconError" @error="iconError=true"/>
        <img src="/kaios_56.png" v-else/>
        <div>
            <div class="app-title">
                {{ props.name }}
                <span class="version">{{ props.version }}</span>
            </div>
            <div v-if="props.installedVersion" class="installed-version">
                <span>Installed: {{ props.installedVersion }}</span>
            </div>
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
    selected:Boolean,
    version:String,
    installedVersion:String
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
        line-height: 18px;
    }
    .version{
        font-size:12px;
        line-height: 10px;
        color:#009688;
        margin-left: 6px;
    }
    .installed-version{
        display: flex;
        flex-direction: row;
        &>span{
            background-color: #009688;
            color:white;
            display: block;
            width: auto;
            font-size: 12px;
            line-height: 10px;
            padding:2px 4px;
            margin:1px 0;
            border-radius: 6px;
        }
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