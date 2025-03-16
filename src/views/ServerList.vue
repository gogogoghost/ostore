<template>
    <div class="flex-center full" v-if="!loaded">
        <Loading></Loading>
    </div>
    <div class="app-list full" v-else>
        <div class="items">
            <AppItem v-for="item,index in appList" 
            :img="item.iconSrc" 
            :name="item.name" 
            :desc="item.desc"
            :selected="selected==index"
            :version="item.version"
            ref="items"
            :installed-version="item.installedVersion"
            />
        </div>
        <SoftKey 
        :center="installBtnText" 
        :right="uninstallBtnText"
        @enter="handleInstall"
        @rightClick="handleUninstall"
        ></SoftKey>

        <Dialog v-if="showDialog">
            <div class="dialog">
                <Loading></Loading>
                <div>{{dialogMessage}}</div>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { getAllList,getPopularList, install, resourceUrl, uninstall } from '@/api/api';
import Loading from '@/components/Loading.vue';
import {ref,onMounted,onBeforeUnmount,watch,computed} from 'vue'
import AppItem from '@/components/AppItem.vue';
import SoftKey from '@/components/SoftKey.vue';
import { useInstalledState } from '@/stores/installed';
import Dialog from '@/components/Dialog.vue';
import { useKeyEventState } from '@/stores/dialog'
import { addFile, path2fileName } from '@/utils';

const keyEventState=useKeyEventState();
const installed=useInstalledState();

const props=defineProps({
    all:{
        type:Boolean,
        default:false
    }
})

const loaded=ref(false)

const appList=ref([])

const selected=ref(0)

const items=ref([])
const dialogMessage=ref("")
const showDialog=ref(false)

const handleInstall=async()=>{
    const o=appList.value[selected.value]
    if(!window.confirm(`Confirm to install ${o.name} ${o.version}?`)){
        return
    }
    try{
        showDialog.value=true
        dialogMessage.value="Downloading..."
        const res=await (await fetch(o.url)).blob()
        const sdcard = navigator.b2g.getDeviceStorage("sdcard");
        const filePath=await addFile(sdcard,res,o.fileName)
        const rootPath=(await sdcard.getRoot()).path
        
        dialogMessage.value="Installing..."
        const fullPath="/data"+rootPath+'/'+path2fileName(filePath)

        // alert(fullPath)
        await install(fullPath)

        // refresh list
        installed.updateInstalledList();
        // show alert
        if(o.id=="ostore"){
            alert("Install Successful. OStore will restart automatically")
            window.location.reload();
        }else{
            alert("Install Successful")
        }
    }catch(e){
        // SecurityError
        console.error(e)
        alert(e.message)
    }finally{
        showDialog.value=false
    }
    console.log('install')
}
const handleUninstall=async()=>{
    const o=appList.value[selected.value]
    if(!window.confirm(`Confirm to uninstall ${o.name} ${o.version}?`)){
        return
    }
    //find it
    try{
        showDialog.value=true
        dialogMessage.value="Uninstalling..."
        await uninstall(o.manifestUrl)

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

// 1>2 return 1
// 1<2 return -1
// 1=2 return 0
function compareVersions(version1, version2) {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (v1[i] > v2[i]) {
      return 1;
    }
    if (v1[i] < v2[i]) {
      return -1;
    }
  }
  return 0;
}

const installBtnText=computed(()=>{
    const o=appList.value[selected.value]
    if(!o){
        return null
    }
    if(!o.installedVersion){
        return "Install"
    }
    if(o.versionState==-1){
        return "Downgrade"
    }else if(o.versionState==0){
        return "Reinstall"
    }else if(o.versionState==1){
        return "Upgrade"
    }
})

const uninstallBtnText=computed(()=>{
    const o=appList.value[selected.value]
    if(!o){
        return null
    }
    if(!o.installedVersion){
        return null
    }
    if(o.id=="ostore"){
        return null
    }
    return "Uninstall"
})

watch(selected,(newVal)=>{
    items.value[newVal].$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

const onKeyDown=(evt)=>{
    if(keyEventState.dialogShow){
        return
    }
    if(!loaded.value||appList.value.length==1){
        return
    }
    if(evt.key=="ArrowUp"){
        if(selected.value==0){
            selected.value=appList.value.length-1
        }else{
            selected.value--
        }
        evt.preventDefault();
    }else if(evt.key=="ArrowDown"){
        if(selected.value==appList.value.length-1){
            selected.value=0
        }else{
            selected.value++
        }
        evt.preventDefault();
    }
}

const updateInstalledVersion=()=>{
    for(const item of appList.value){
        const obj=installed.appList.find(o=>o.name==item.id)
        if(obj){
            item.installedVersion=obj.version
            item.versionState=compareVersions(item.version,obj.version)
            item.manifestUrl=obj.manifest_url
        }else{
            item.installedVersion=null
            item.versionState=null
            item.manifestUrl=null
        }
    }
}

watch(()=>installed.appList,()=>{
    updateInstalledVersion();
})

onMounted(()=>{
    document.addEventListener("keydown",onKeyDown)
})
onBeforeUnmount(()=>{
    document.removeEventListener("keydown",onKeyDown)
})
onMounted(async()=>{
    try{
        const res=await(props.all?getAllList():getPopularList())
        for(const item of res){
            item.iconSrc=resourceUrl+item.id+'_'+item.icon
            item.fileName=item.id+'_'+item.version+'.zip'
            item.url=resourceUrl+item.fileName
        }
        // console.log(res)
        appList.value=res
        if(installed.loaded){
            updateInstalledVersion();
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
.dialog{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding:20px 0;
}
</style>