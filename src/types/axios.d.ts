// axios库定义
import 'axios'
import type { AuthType } from '@/utils/http'

declare module 'axios' {
  // AxiosRequestConfig接口扩展，添加showLoading属性
  export interface AxiosRequestConfig {
    showLoading?: boolean
    cancel?: boolean // 是否允许取消请求，默认为true
  }
}
