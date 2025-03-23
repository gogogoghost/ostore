<template>
    <div class="container">
        <div v-for="item,index in props.arr" class="item" :class="{'current':modelValue==index}" ref="items" :autofocus="index==0">
            {{ item }}<div>{{ item }}</div>
        </div>
    </div>
</template>

<script setup>
import {ref,onMounted,onBeforeUnmount,defineEmits,watch,toRefs} from 'vue'
import { useKeyEventState } from '@/stores/dialog'

const keyEventState=useKeyEventState();
const props=defineProps({
    modelValue: { type: Number, default: 0 },
    arr:Array
})
const emits=defineEmits(['update:modelValue'])
const items=ref([])

const { modelValue } = toRefs(props);

watch(modelValue,(newVal)=>{
    items.value[newVal].scrollIntoView({ behavior: 'smooth', block: 'center' })
})

const onKeyDown=(evt)=>{
    if(keyEventState.dialogShow){
        return
    }
    if(evt.key=="ArrowLeft"){
        if(props.modelValue>0){
            emits('update:modelValue',props.modelValue-1)
        }else{
            emits('update:modelValue',props.arr.length-1)
        }
        evt.preventDefault();
    }else if(evt.key=="ArrowRight"){
        if(props.modelValue<props.arr.length-1){
            emits('update:modelValue',props.modelValue+1)
        }else{
            emits('update:modelValue',0)
        }
        evt.preventDefault();
    }
}

onMounted(()=>{
    document.addEventListener("keydown",onKeyDown)
})
onBeforeUnmount(()=>{
    document.removeEventListener("keydown",onKeyDown)
})
</script>

<style lang="scss" scoped>
.container{
    display: flex;
    flex-direction: row;
    width:100%;
    overflow-x: hidden;
    margin-bottom:2px;
    .item{
        text-align: center;
        padding:0 4px;
        &>div{
            visibility: hidden;
            white-space: nowrap;
            font-weight: bold;
            height: 0;
            padding:0 4px;
            overflow: hidden;
        }
    }
    .current{
        font-weight: bold;
        position:relative;
    }
    .current::after{
        content: "";
        position:absolute;
        bottom:0;
        height:3px;
        width:60%;
        left:20%;
        background-color: #E65100;
    }
}
</style>