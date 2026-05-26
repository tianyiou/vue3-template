<template>
  <div>
    <a-button type="primary" @click="showMessage">自动按需引入的按钮</a-button>
    <div>{{ mode }}---<span class="m-l-20"></span>--{{ baseUrl }}</div>
  </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
const mode = import.meta.env.VITE_APP_MODE
const baseUrl = import.meta.env.VITE_APP_BASE_URL

const showMessage = () => {
  message.success('这是一个需要手动导入的提示！')
}
</script>
