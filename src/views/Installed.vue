<template>
    <div class="flex-center full" v-if="!loaded">
        <Loading></Loading>
    </div>
    <div class="app-list full" v-else>
        <div class="items">
            <AppItem v-for="item,index in appList" 
            :img="item.iconSrc" 
            :name="item.name" 
            :desc="item.manifestObj.description"
            :selected="selected==index"
            ref="items"
            />
        </div>
        <SoftKey left="Left" center="Ok" right="Right"></SoftKey>
    </div>
</template>

<script setup>
import { getList,proxyBaseUrl } from '@/api/api';
import Loading from '@/components/Loading.vue';
import {ref,onMounted,onBeforeUnmount,watch} from 'vue'
import SoftKey from '@/components/SoftKey.vue';
import AppItem from '@/components/AppItem.vue';

const loaded=ref(false)

const appList=ref([])

const selected=ref(0)

const items=ref([])

watch(selected,(newVal)=>{
    items.value[newVal].$el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})

const onKeyDown=(evt)=>{
    if(!loaded.value||appList.value.length==1){
        return
    }
    evt.preventDefault();
    if(evt.key=="ArrowUp"){
        if(selected.value==0){
            selected.value=appList.value.length-1
        }else{
            selected.value--
        }
    }else if(evt.key=="ArrowDown"){
        if(selected.value==appList.value.length-1){
            selected.value=0
        }else{
            selected.value++
        }
    }
}

onMounted(()=>{
    document.addEventListener("keydown",onKeyDown)
})
onBeforeUnmount(()=>{
    document.removeEventListener("keydown",onKeyDown)
})
onMounted(async()=>{
    try{
        const res=await getList()
        if(res.code!=0){
            throw new Error(res.msg)
        }
        appList.value=res.data
        // get manifest
        for(const item of res.data){
            item.baseUrl=proxyBaseUrl+item.origin.replace('http://','')
            const obj=await (await fetch(proxyBaseUrl+item.manifest_url.replace('http://',''))).json()
            item.manifestObj=obj
            // console.log(item)
            try{
                let iconSrc=obj.icons[0].src
                if(iconSrc.startsWith('http')){
                    item.iconSrc=proxyBaseUrl+iconSrc.replace('http://','')
                }else{
                    if(!iconSrc.startsWith('/')){
                        iconSrc='/'+iconSrc;
                    }
                    item.iconSrc=item.baseUrl+iconSrc
                }
            }catch(e){
                item.iconSrc="/kaios_56.png"
            }
        }
    }catch(e){
        alert(e.message||"Unkown Error")
    }finally{
        loaded.value=true;
    }
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