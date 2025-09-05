<script setup lang="ts">
import TitleBar from './components/TitleBar.vue'
import Footer from '@renderer/components/Footer.vue'
</script>

<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden">
    <div class="w-full h-[30px]">
      <TitleBar />
    </div>
    <div class="w-full flex-1 overflow-hidden">
      <router-view />
    </div>
    <div class="w-full h-[30px]">
      <Footer />
    </div>
  </div>
</template>
