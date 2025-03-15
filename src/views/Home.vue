<template>
  <div class="page-container">
    <Title>OStore</Title>
    <Tab :arr="['Popular','All','Installed','About']" v-model="currentTab"></Tab>
    <div class="page-content">
      <Popular v-if="currentTab==0"></Popular>
      <All v-else-if="currentTab==1"></All>
      <Installed v-else-if="currentTab==2"></Installed>
      <About v-else-if="currentTab==3"></About>
    </div>
    <!-- <SoftKey left="Left" center="Ok" right="Right" @enter="onEnter"></SoftKey> -->
  </div>
</template>

<script setup>
import Title from '@/components/Title.vue'
import Tab from '@/components/Tab.vue'
import SoftKey from '@/components/SoftKey.vue'
import Loading from '@/components/Loading.vue'
import { baseUrl, getList } from '@/api/api'
import {ref} from 'vue'
import Popular from './Popular.vue'
import All from './All.vue'
import Installed from './Installed.vue'
import About from './About.vue'

const currentTab=ref(2)

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