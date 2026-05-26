import { type InternalAxiosRequestConfig } from 'axios'
import http from './base-request'

// 默认的 key 生成规则
function getRequestKey(config: InternalAxiosRequestConfig) {
  const { method = 'GET', url, params } = config
  // 将 params（query）和 data（body）统一序列化
  const serializedParams = params ? JSON.stringify(params) : ''
  return `${method.toUpperCase()}|${url}|${serializedParams}`
}

const pendingMap = new Map()

const request = (config: InternalAxiosRequestConfig) => {
  const requestKey = getRequestKey(config)

  // ✅ 核心：重复请求检测，直接返回复用的Promise
  if (pendingMap.has(requestKey)) {
    console.log('🔁 检测到重复请求，直接复用:', requestKey)
    return pendingMap.get(requestKey)
  }

  // 发起请求
  const requestPromise = http(config).finally(() => {
    pendingMap.delete(requestKey)
  })

  pendingMap.set(requestKey, requestPromise)

  return requestPromise
}

export default request
