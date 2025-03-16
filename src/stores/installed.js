import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getList,proxyBaseUrl } from '@/api/api'

export const useInstalledState = defineStore('installed', () => {
  const appList=ref([])
  const loaded=ref(false)
  function updateAppList(list){
    appList.value=list;
    loaded.value=true;
    // console.log(list)
  }

  async function updateInstalledList(){
    try{
      const res=await getList()
      // get manifest
      for(const item of res){
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
      updateAppList(res)
    }catch(e){
        alert(e.message||"Unkown Error")
    }
  }

  return { loaded, appList,updateInstalledList }
})
