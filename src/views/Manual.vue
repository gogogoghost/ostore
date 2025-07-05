<template>
    <div class="container">
        <h4>Install PWA from url</h4>
        <input type="text" v-model="url" ref="pwaUrl" class="url" />
        <button ref="pwaBtn" @click="onInstallPWA" class="install-pwa">Install PWA</button>
        <h4>Install app from sdcard</h4>
        <div v-if="zipFileList.length == 0" class="no-zip-files">
            No zip files found
        </div>
        <div v-else>
            <button v-for="item in zipFileList" class="zip-file" ref="zipFileRef" @click="onInstallZip(item)">{{
                item.name }}</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, useTemplateRef, nextTick } from 'vue'
import { useKeyEventState } from '@/stores/dialog'
import { filterZip, saveFile } from '@/utils';
import { install, installPWA } from '@/api/api';

const keyEventState = useKeyEventState();

const url = ref("")
const zipFileList = ref([])
const focuable = [
    useTemplateRef('pwaUrl'),
    useTemplateRef('pwaBtn')
]
const zipFileRef = ref([])

const onInstallZip = async (file) => {
    if (!window.confirm(`Confirm to install '${file.name}'?`)) {
        return
    }
    try {
        const fullPath = await saveFile(file, "tmp.zip")
        await install(fullPath)
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
}

const onInstallPWA = async () => {
    try {
        await installPWA(url.value)
    } catch (e) {
        console.error(e)
        alert(e.message)
    }
}

const onKeyDown = (evt) => {
    if (keyEventState.dialogShow) {
        return
    }
    let focusedIndex = -1;
    for (let i = 0; i < focuable.length; i++) {
        if (document.activeElement == focuable[i].value) {
            focusedIndex = i;
            break;
        }
    }
    if (focusedIndex < 0) {
        focuable[0].value.focus()
        return
    }
    if (evt.key == "ArrowUp") {
        focusedIndex--
        if (focusedIndex < 0) {
            focusedIndex = focuable.length - 1
        }
        focuable[focusedIndex].value.focus()
        focuable[focusedIndex].value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else if (evt.key == "ArrowDown") {
        focusedIndex++
        if (focusedIndex >= focuable.length) {
            focusedIndex = 0
        }
        focuable[focusedIndex].value.focus()
        focuable[focusedIndex].value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
}

onMounted(async () => {
    focuable[0].value.focus()
    document.addEventListener("keydown", onKeyDown)
    const list = await filterZip()
    zipFileList.value = list
    nextTick(() => {
        focuable.push(...zipFileRef.value.map(o => { return { value: o } }))
    })
})
onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeyDown)
})

</script>

<style lang="scss" scoped>
.container {
    padding: 10px;

    &>h4 {
        position: relative;
        padding-left: 10px;
        font-weight: bold;
    }

    &>h4::after {
        content: '';
        position: absolute;
        left: 0;
        top: 10%;
        width: 3px;
        height: 80%;
        background-color: #E65100;
    }

    &>h4:not(:first-child) {
        margin-top: 20px;
    }

    &>.picker {
        display: none;
    }

    &>.url {
        width: 100%;
        height: 20px;
    }
}

.zip-file {
    width: 100%;
}

.zip-file:not(:first-child),
.install-pwa {
    margin-top: 5px;
}

.no-zip-files {
    text-align: center;
    color: gray;
    margin-top: 10px;
}
</style>