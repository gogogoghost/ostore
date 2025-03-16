import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useKeyEventState = defineStore('keyEvent', () => {
  const dialogShow=ref(false)
  function updateDialogShow(show){
    dialogShow.value=show
  }

  return { dialogShow, updateDialogShow }
})
