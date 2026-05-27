import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export default function () {
  // 存储请求标识与取消控制器的映射
  const pendingMap = new Map<string, AbortController>()

  const getRequestKey = (config: InternalAxiosRequestConfig): string => {
    const { url, method, params, data } = config
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  // 添加请求到 pending 队列
  const addPendingRequest = (config: InternalAxiosRequestConfig, key?: string) => {
    // 如果配置了 cancel: false，则不加入取消队列
    if (config.cancel === false) return
    const requestKey = key || getRequestKey(config) // 兼容搜索时候需要取消上一个请求的情况
    // 创建取消控制器
    const controller = new AbortController()
    config.signal = controller.signal
    pendingMap.set(requestKey, controller)
    console.log('添加请求到 pending 队列:', pendingMap)
  }

  // 取消单个请求
  const removePendingRequest = (config: InternalAxiosRequestConfig, key?: string) => {
    const requestKey = key || getRequestKey(config)
    const controller = pendingMap.get(requestKey)
    if (controller) {
      controller.abort()
      pendingMap.delete(requestKey)
    }
    console.log('移除请求:', pendingMap)
  }

  const cancelAllRequest = () => {
    console.log('取消所有请求:', pendingMap)
    pendingMap.forEach((controller) => controller.abort())
    pendingMap.clear()
  }

  return {
    addPendingRequest,
    removePendingRequest,
    cancelAllRequest,
  }
}
