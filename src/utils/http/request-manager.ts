import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'

export default {
  // 存储请求标识与取消控制器的映射
  pendingMap: new Map<string, AbortController>(),

  getRequestKey(config: InternalAxiosRequestConfig) {
    const { url, method, params, data } = config
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
  },

  // 添加请求到 pending 队列
  addPendingRequest(config: InternalAxiosRequestConfig) {
    // 如果配置了 cancel: false，则不加入取消队列
    if (config.cancel === false) return
    const requestKey = this.getRequestKey(config)
    // 创建取消控制器
    const controller = new AbortController()
    config.signal = controller.signal
    this.pendingMap.set(requestKey, controller)
  },

  // 取消单个请求
  removePendingRequest(config: InternalAxiosRequestConfig) {
    const requestKey = this.getRequestKey(config)
    const controller = this.pendingMap.get(requestKey)
    if (controller) {
      controller.abort()
      this.pendingMap.delete(requestKey)
    }
  },

  cancelAllRequest() {
    this.pendingMap.forEach((controller) => controller.abort())
    this.pendingMap.clear()
  },
}
