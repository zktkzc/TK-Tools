<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="border dark:border-[#4C4D4F] rounded-md overflow-hidden">
    <div class="dark:text-[#AEB9C0] dark:bg-[#333333] border-b dark:border-[#4C4D4F] p-2 text-sm">
      {{ title }}
    </div>
    <div class="p-2">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
