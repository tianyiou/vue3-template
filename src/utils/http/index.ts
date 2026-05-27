import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import useRequestLoading from '@/use/http/use-request-loading'
import requestManager from './request-manager'

// 获取请求头
const getHttpHeader = (config: InternalAxiosRequestConfig) => {
  // 可能存在自定义的头部配置
  const headers: Record<string, string | number> = Object.assign({}, config.headers || {})

  const token = localStorage.getItem('token')
  if (token) {
    headers['X-Token'] = token
  }

  return headers
}

const { increase, decrease } = useRequestLoading()

// ---------- 创建 Axios 实例 ----------
const http = axios.create({
  // 设置超时时间
  timeout: 1000 * 60,
  // 设置默认请求头
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  // baseURL: `${import.meta.env.VITE_APP_BASE_URL}`,
  baseURL: '/api', // 开发环境使用代理，生产环境请设置为实际后端地址
})

// ---------- 请求拦截器 ----------
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    requestManager.addPendingRequest(config) // 添加请求到 pending 队列

    increase(config.showLoading) // 增加加载计数

    // 自动注入 Token
    const headers = getHttpHeader(config)
    Object.keys(headers).forEach((key) => {
      config.headers[key] = headers[key]
    })

    return config
  },
  (error) => {},
)

// ---------- 响应拦截器 ----------
http.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config) {
      requestManager.removePendingRequest(response.config) // 响应结束，移除 pending 队列中的请求
    }

    // 响应结束，减少加载计数
    decrease(response.config.showLoading)

    // 返回200状态，但后端ret不是则说明，后端需要返回错误原因
    if (response.data?.ret !== 0) {
      // 业务错误，弹出提示
      message.error(response.data?.msg || '请求失败')
      return Promise.reject(response.data)
    }
    return response.data?.body || response.data
  },
  (error) => {
    if (error.config) {
      requestManager.removePendingRequest(error.config) // 响应结束，移除 pending 队列中的请求
    }

    // 响应结束，减少加载计数
    decrease(error.response?.config?.showLoading)

    const errorMsgMap: Record<number, string> = {
      400: '请求参数错误',
      401: '登陆已过期',
      403: '访问禁止的内容，请检查电脑设置的时间是否与北京时间一致',
      404: '接口不存在',
      426: '系统需要刷新',
      500: '服务器错误',
      501: '接口未实现',
      503: '服务超时',
    }
    // 错误码处理
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          // 清除 Token 并跳转登录
          localStorage.removeItem('token')
          // 避免循环跳转
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
          break
        default:
          const errorMsg =
            error?.response?.data?.msg || errorMsgMap[error.response?.status] || '请求失败'
          message.error(errorMsg)
      }
    } else if (axios.isCancel(error) || error.isCanceled || error.code === 'ERR_CANCELED') {
      // 主动取消的请求，不提示错误
      console.warn('请求已取消:', error.message)
    } else {
      message.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  },
)

// 导出 axios 实例以备不时之需
export default http
