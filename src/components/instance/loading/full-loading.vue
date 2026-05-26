<template>
  <div class="full-loading">
    <a-spin :tip="text" />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: string
  }>(),
  {
    text: '加载中...',
  },
)
</script>

<style scoped lang="less">
.full-loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
