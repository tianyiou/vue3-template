import type { AxiosRequestConfig } from 'axios'
import type { BaseListResult } from '@/types/basic'
import http from '@/utils/http/index'

export type GetListParams = {
  page: number
}

export type ListItem = {
  title: string
  id: number
}

export default {
  getList(params: GetListParams, options?: AxiosRequestConfig): Promise<BaseListResult<ListItem>> {
    return http.post('/list_delay', params, options)
  },
  getList1(
    params: GetListParams,
    options?: AxiosRequestConfig,
  ): Promise<BaseListResult<ListItem, 'list'>> {
    return http.post('/list_1_delay', params, options)
  },
}
