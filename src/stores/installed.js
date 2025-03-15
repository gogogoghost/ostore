import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useInstalledState = defineStore('installed', () => {
  const appList=ref([])
  const loaded=ref(false)
  function updateAppList(list){
    appList.value=list;
    loaded.value=true;
    // console.log(list)
  }

  return { updateAppList, loaded, appList }
})
