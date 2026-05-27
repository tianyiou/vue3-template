<template>
  <div class="blue">{{ JSON.stringify(data) }}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import testListApi, { type ListItem } from '@/apis/test/test-list-api'

const data = ref<ListItem[]>()

const init = async () => {
  try {
    Promise.all([
      testListApi.getList(
        { page: 1 },
        { headers: { 'X-Custom-Header': 'CustomValue' }, showLoading: false },
      ),
    ]).then(([res1]) => {
      data.value = res1.page_data
    })
  } catch (e) {
    console.log('请求出错', e)
  }

  // const { page_data } = await testListApi.getList(
  //   { page: 1 },
  //   { headers: { 'X-Custom-Header': 'CustomValue' }, showLoading: true },
  // )
  // const { list } = await testListApi.getList1({ page: 1 }, { showLoading: true })
  // data.value = page_data
  // data1.value = list
}
init()
</script>

<style scoped lang="less"></style>
