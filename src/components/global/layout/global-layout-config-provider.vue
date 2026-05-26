<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      // 修改默认基础色,更改的为ant desgin vue中的默认色，需要同步更改variables.less中的主题色
      token: {
        colorInfo: '#3fa2f5',
        colorPrimary: '#3fa2f5',
        colorError: '#f25060',
        colorSuccess: '#14bc99',
        colorWarning: '#fb8339',
      },
    }"
    :autoInsertSpaceInButton="false"
  >
    <slot></slot>
  </a-config-provider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<style scoped lang="less"></style>
