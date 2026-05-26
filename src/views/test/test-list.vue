<template>
  <div class="blue">{{ JSON.stringify(data) }}</div>
  <div class="red">{{ JSON.stringify(data1) }}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import testListApi, { type ListItem } from '@/apis/test/test-list-api'

const data = ref<ListItem[]>()
const data1 = ref<ListItem[]>()

const init = async () => {
  try {
    Promise.all([
      testListApi.getList(
        { page: 1 },
        { headers: { 'X-Custom-Header': 'CustomValue' }, showLoading: false },
      ),
      testListApi.getList1({ page: 1 }, { showLoading: true }),
      // testListApi.getList1({ page: 1 }, { showLoading: true }),
      // testListApi.getList1({ page: 1 }, { showLoading: true }),
    ]).then(([res1, res2]) => {
      data.value = res1.page_data
      data1.value = res2.list
      // console.log('res3', res3)
      // console.log('res4', res4)
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

<style scoped lang="less">
.blue {
  color: @colorPrimary;
  width: 100%;
  height: 200px;
  background-color: skyblue;
}
.red {
  color: @colorPrimary;
  width: 100%;
  height: 200px;
  background-color: yellow;
}
</style>
