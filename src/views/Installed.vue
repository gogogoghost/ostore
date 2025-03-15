<template>
    <div class="flex-center full" v-if="!installed.loaded">
        <Loading></Loading>
    </div>
    <div class="app-list full" v-else>
        <div class="items">
            <AppItem v-for="item,index in installed.appList" 
            :img="item.iconSrc" 
            :name="item.name" 
            :desc="item.manifestObj.description"
            :selected="selected==index"
            :version="item.manifestObj.b2g_features.version"
            ref="items"
            />
        </div>
        <!-- <SoftKey left="Left" center="Ok" right="Right"></SoftKey> -->
    </div>
</template>

<script setup>
import { getList,proxyBaseUrl } from '@/api/api';
import Loading from '@/components/Loading.vue';
import {ref,onMounted,onBeforeUnmount,watch} from 'vue'
import AppItem from '@/components/AppItem.vue';
import { useInstalledState } from '@/stores/installed';

const installed=useInstalledState();

const selected=ref(0)

const items=ref([])

watch(selected,(newVal)=>{
    items.value[newVal].$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

const onKeyDown=(evt)=>{
    if(!installed.loaded||installed.appList.length==1){
        return
    }
    if(evt.key=="ArrowUp"){
        if(selected.value==0){
            selected.value=installed.appList.length-1
        }else{
            selected.value--
        }
        evt.preventDefault();
    }else if(evt.key=="ArrowDown"){
        if(selected.value==installed.appList.length-1){
            selected.value=0
        }else{
            selected.value++
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

<style scoped>
.app-list{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.items{
    flex:1;
    overflow-y: scroll;
}
</style>