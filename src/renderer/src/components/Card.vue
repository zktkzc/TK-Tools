<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="">
    <div class=""></div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped></style>
