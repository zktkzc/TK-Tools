<script setup lang="ts">
import TitleBar from './components/TitleBar.vue'
import Footer from '@renderer/components/Footer.vue'
</script>

<template>
  <TitleBar />
  <router-view />
  <Footer />
</template>
