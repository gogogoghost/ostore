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
        <SoftKey left="Launch" @leftClick="handleLaunch" :right="uninstallBtnText" @rightClick="handleUninstall"></SoftKey>

        <Dialog v-if="showDialog">
            <div class="dialog">
                <Loading></Loading>
                <div>{{dialogMessage}}</div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { uninstall } from '@/api/api';
import Loading from '@/components/Loading.vue';
import {ref,onMounted,onBeforeUnmount,watch,computed} from 'vue'
import AppItem from '@/components/AppItem.vue';
import { useInstalledState } from '@/stores/installed';
import { useKeyEventState } from '@/stores/dialog'
import SoftKey from '@/components/SoftKey.vue';
import Dialog from '@/components/Dialog.vue';

const keyEventState=useKeyEventState();
const installed=useInstalledState();

const selected=ref(0)

const items=ref([])
const showDialog=ref(false)
const dialogMessage=ref("")

watch(selected,(newVal)=>{
    items.value[newVal].$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

const uninstallBtnText=computed(()=>{
    const o=installed.appList[selected.value]
    if(!o){
        return null
    }
    if(o.name=="ostore"){
        return null
    }
    return "Uninstall"
})

const handleLaunch=()=>{
    const o=installed.appList[selected.value]
    window.open(o.manifest_url,'__blank__',"kind=app,noopener=yes")
}

const handleUninstall=async()=>{
    const o=installed.appList[selected.value]
    if(!window.confirm(`Confirm to uninstall ${o.manifestObj.name}?`)){
        return
    }
    //find it
    try{
        showDialog.value=true
        dialogMessage.value="Uninstalling..."
        await uninstall(o.manifest_url)

        //refresh list
        installed.updateInstalledList();
        // show alert
        alert("Uninstall Successful")
    }catch(e){
        console.error(e)
        alert(e.message)
    }finally{
        showDialog.value=false
    }
}

const onKeyDown=(evt)=>{
    if(keyEventState.dialogShow){
        return
    }
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