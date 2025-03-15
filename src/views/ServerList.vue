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
        :right="(appList[selected]||{}).installedVersion?'Uninstall':null"
        @enter="handleInstall"
        @rightClick="handleUninstall"
        ></SoftKey>
    </div>
</template>

<script setup>
import { getAllList,getPopularList, resourceUrl } from '@/api/api';
import Loading from '@/components/Loading.vue';
import {ref,onMounted,onBeforeUnmount,watch,computed} from 'vue'
import AppItem from '@/components/AppItem.vue';
import SoftKey from '@/components/SoftKey.vue';
import { useInstalledState } from '@/stores/installed';

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

const handleInstall=()=>{
    console.log('install')
}
const handleUninstall=()=>{
    console.log('uninstall')
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
    if(o.versionState==1){
        return "Downgrade"
    }else if(o.versionState==0){
        return "Reinstall"
    }else if(o.versionState==1){
        return "Upgrade"
    }
})

watch(selected,(newVal)=>{
    // console.log(items.value[newVal].$props)
    items.value[newVal].$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
})

const onKeyDown=(evt)=>{
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
            item.url=resourceUrl+item.id+'_'+item.version+'.zip'
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
</style>