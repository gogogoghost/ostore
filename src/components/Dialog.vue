<template>
    <div class="modal">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup>

import {onMounted,onBeforeUnmount} from 'vue'
import { useKeyEventState } from '@/stores/dialog'

const keyEventState=useKeyEventState();

const onKeyDown=(evt)=>{
    if(keyEventState.dialogShow){
        return
    }
    console.log(evt.key)
}

onMounted(()=>{
    keyEventState.updateDialogShow(true)
    document.addEventListener("keydown",onKeyDown)
})
onBeforeUnmount(()=>{
    keyEventState.updateDialogShow(false)
    document.removeEventListener("keydown",onKeyDown)
})
</script>

<style lang="scss" scoped>
.modal{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    background-color: #00000055;
}
.content{
    background-color: white;
    position:absolute;
    left:0;
    bottom:0;
    width:100%;
}
</style>