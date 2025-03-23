<template>
    <div class="container">
        <h4>Install app from zip file</h4>
        <button ref="zipBtn" @click="picker.click()">Install from .zip file</button>
        <input type="file" ref="picker" class="picker" @change="onFilePick"/>
        <h4>Install PWA from url</h4>
        <input type="text" v-model="url" ref="pwaUrl" class="url"/>
        <button ref="pwaBtn" @click="onInstallPWA">Install PWA</button>
    </div>
</template>

<script setup>
import { ref,onMounted,onBeforeUnmount,useTemplateRef } from 'vue'
import { useKeyEventState } from '@/stores/dialog'
import { saveFile } from '@/utils';
import { install,installPWA } from '@/api/api';

const keyEventState=useKeyEventState();

const url=ref("")
const picker=ref(null)
const focuable=[
    useTemplateRef('zipBtn'),
    useTemplateRef('pwaUrl'),
    useTemplateRef('pwaBtn')
]

const onInstallPWA=async()=>{
    try{
        await installPWA(url.value)
    }catch(e){
        console.error(e)
        alert(e.message)
    }
}

const onFilePick=async(evt)=>{
    const file=evt.target.files[0]
    evt.target.value=null
    try{
        const fullPath=await saveFile(file,"tmp.zip")
        await install(fullPath)
    }catch(e){
        console.error(e)
        alert(e.message)
    }
}

const onKeyDown=(evt)=>{
    if(keyEventState.dialogShow){
        return
    }
    let focusedIndex=-1;
    for(let i=0;i<focuable.length;i++){
        if(document.activeElement==focuable[i].value){
            focusedIndex=i;
            break;
        }
    }
    if(focusedIndex<0){
        focuable[0].value.focus()
        return
    }
    if(evt.key=="ArrowUp"){
        focusedIndex--
        if(focusedIndex<0){
            focusedIndex=focuable.length-1
        }
        focuable[focusedIndex].value.focus()
    }else if(evt.key=="ArrowDown"){
        focusedIndex++
        if(focusedIndex>=focuable.length){
            focusedIndex=0
        }
        focuable[focusedIndex].value.focus()
    }
}

onMounted(()=>{
    focuable[0].value.focus()
    document.addEventListener("keydown",onKeyDown)
})
onBeforeUnmount(()=>{
    document.removeEventListener("keydown",onKeyDown)
})

</script>

<style lang="scss" scoped>
.container {
    padding: 10px;

    &>h4 {
        position: relative;
        padding-left: 10px;
        font-weight: bold;
    }

    &>h4::after {
        content: '';
        position: absolute;
        left: 0;
        top: 10%;
        width: 3px;
        height: 80%;
        background-color: #E65100;
    }

    &>h4:not(:first-child) {
        margin-top: 20px;
    }
    &>.picker{
        display: none;
    }
    &>.url {
        width: 100%;
        height: 20px;
    }
}
</style>