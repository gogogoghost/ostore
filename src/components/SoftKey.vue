<template>
    <div class="container">
        <div>{{ props.left }}</div>
        <div>{{ props.center }}</div>
        <div>{{ props.right }}</div>
    </div>
</template>

<script setup>
import {defineEmits,onMounted,onBeforeUnmount} from 'vue'
const props=defineProps({
    left:String,
    right:String,
    center:String
})
const emits=defineEmits(['leftClick','enter','rightClick'])

const onKeyDown=(evt)=>{
    if(evt.key=='SoftLeft'&&props.left){
        emits('leftClick')
        evt.preventDefault();
    }else if(evt.key=='SoftRight'&&props.right){
        emits('rightClick')
        evt.preventDefault();
    }else if(evt.key=='Enter'&&props.center){
        emits('enter')
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
    width:100%;
    display: flex;
    flex-direction: row;
    border-top:#ccc solid 1px;
    &>div{
        flex:1;
        font-weight: bold;
    }
    :first-child{
        text-align: left;

    }
    :nth-child(2){
        text-align: center;
    }
    :last-child{
        text-align: right;
    }
}
</style>