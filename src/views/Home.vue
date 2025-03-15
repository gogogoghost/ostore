<template>
  <div class="page-container">
    <Title>OStore</Title>
    <Tab :arr="['Popular','All','Installed','About']" v-model="currentTab"></Tab>
    <div class="page-content">
      <ServerList v-if="currentTab==0"></ServerList>
      <ServerList v-else-if="currentTab==1" all></ServerList>
      <Installed v-else-if="currentTab==2"></Installed>
      <About v-else-if="currentTab==3"></About>
    </div>
    <!-- <SoftKey left="Left" center="Ok" right="Right" @enter="onEnter"></SoftKey> -->
  </div>
</template>

<script setup>
import Title from '@/components/Title.vue'
import Tab from '@/components/Tab.vue'
import {ref,onMounted} from 'vue'
import Installed from './Installed.vue'
import About from './About.vue'
import ServerList from './ServerList.vue'
import { useInstalledState } from '@/stores/installed'
import { getList,proxyBaseUrl } from '@/api/api'

const installed=useInstalledState();

const currentTab=ref(0)

onMounted(async()=>{
    try{
        const res=await getList()
        if(res.code!=0){
            throw new Error(res.msg)
        }
        // appList.value=res.data
        // get manifest
        for(const item of res.data){
            item.baseUrl=proxyBaseUrl+item.origin.replace('http://','')
            const obj=await (await fetch(proxyBaseUrl+item.manifest_url.replace('http://',''))).json()
            item.manifestObj=obj
            // console.log(item)
            item.version=obj.b2g_features.version;
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
        installed.updateAppList(res.data)
    }catch(e){
        alert(e.message||"Unkown Error")
    }
})

</script>

<style lang="css" scoped>
.loading{
  width:50px;
  height:50px;
}
.page-container{
  display: flex;
  flex-direction: column;
  height:100%;
  width:100%;
}
.page-content{
  flex:1;
  min-height: 0;
}
</style>