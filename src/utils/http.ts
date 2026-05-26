// import axios, {
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from 'axios'
// import { message } from 'ant-design-vue'

// // ---------- 类型定义 ----------
// interface PendingRequest {
//   controller: AbortController
//   promise: Promise<any>
// }

// type RequestKey = string

// // ---------- 配置 ----------
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
// const TIMEOUT = 15000

// // 存储进行中的请求
// const pendingMap = new Map<RequestKey, PendingRequest>()

// // Loading 计数器
// let loadingCount = 0
// const loadingListeners: Set<(count: number) => void> = new Set()

// // ---------- 辅助函数 ----------
// /**
//  * 生成请求唯一标识
//  * 规则： method + url + params/query 序列化
//  */
// function generateRequestKey(config: AxiosRequestConfig): RequestKey {
//   const { method, url, params, data } = config
//   const sortParams = (obj: any) => {
//     if (!obj) return ''
//     const sortedKeys = Object.keys(obj).sort()
//     const sortedObj: any = {}
//     sortedKeys.forEach((key) => {
//       if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
//         sortedObj[key] = typeof obj[key] === 'object' ? sortParams(obj[key]) : obj[key]
//       }
//     })
//     return JSON.stringify(sortedObj)
//   }
//   return `${method}&${url}&${sortParams(params)}&${sortParams(data)}`
// }

// /**
//  * 添加/更新 loading 计数
//  */
// function updateLoadingCount(delta: number) {
//   loadingCount += delta
//   loadingListeners.forEach((listener) => listener(loadingCount))
// }

// /**
//  * 暴露 loading 监听
//  */
// export function onLoadingChange(callback: (count: number) => void) {
//   loadingListeners.add(callback)
//   return () => loadingListeners.delete(callback)
// }

// export function getLoadingCount() {
//   return loadingCount
// }

// /**
//  * 取消所有进行中的请求
//  */
// export function cancelAllRequests(reason = 'Route changed') {
//   pendingMap.forEach(({ controller }, key) => {
//     controller.abort(reason)
//     pendingMap.delete(key)
//   })
//   // 重置 loading 计数（因为所有请求都被取消了）
//   if (loadingCount > 0) {
//     updateLoadingCount(-loadingCount)
//   }
// }

// /**
//  * 取消特定请求
//  * @param key 请求唯一标识，若不传则取消当前所有
//  */
// export function cancelRequest(key: RequestKey) {
//   const pending = pendingMap.get(key)
//   if (pending) {
//     pending.controller.abort('Request cancelled by user')
//     pendingMap.delete(key)
//     updateLoadingCount(-1)
//   }
// }

// // ---------- 创建 Axios 实例 ----------
// const service: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   timeout: TIMEOUT,
// })

// // ---------- 请求拦截器 ----------
// service.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     // 1. 自动注入 Token
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     // 2. 统一参数处理：时间格式化 + 空值过滤
//     if (config.params) {
//       config.params = filterEmptyValue(formatDateParams(config.params))
//     }
//     if (config.data && !(config.data instanceof FormData)) {
//       config.data = filterEmptyValue(formatDateParams(config.data))
//     }

//     // 3. 重复请求检测
//     const requestKey = generateRequestKey(config)
//     if (pendingMap.has(requestKey)) {
//       // 相同请求正在处理中，直接返回已有的 Promise
//       return pendingMap.get(requestKey)!.promise
//     }

//     // 为当前请求创建 AbortController
//     const controller = new AbortController()
//     config.signal = controller.signal

//     // 存储 pending 请求
//     const promise = new Promise((resolve, reject) => {
//       // 这里只是占位，实际请求由 axios 后续发起
//       // 把 resolve/reject 存储起来，但实际响应会走响应拦截器
//       // 为了让返回的 promise 真正与请求结果关联，我们需要在拦截器中手动控制
//       // 下面采用一种简单可靠的方法：将 promise 存在 pendingMap 中，
//       // 但拦截器函数必须返回一个 Promise，所以我们需要手动构造
//     })
//     // 实际上这样不行，因为请求还没发出去，我们无法控制。
//     // 改进：不使用拦截器拦截，而是封装 request 方法。见下文。
//     // 为了满足题目要求，我们在拦截器中只做 token 和参数处理，
//     // 重复检测通过自定义的 request 函数实现（后面会提供）。
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )

// // 由于重复检测在拦截器中实现复杂，我们将主体逻辑迁移到自定义的 request 函数中
// // 下面的 response 拦截器正常实现

// // ---------- 响应拦截器 ----------
// service.interceptors.response.use(
//   (response: AxiosResponse) => {
//     const requestKey = generateRequestKey(response.config)
//     // 请求完成，从 pendingMap 中删除
//     if (pendingMap.has(requestKey)) {
//       pendingMap.delete(requestKey)
//       updateLoadingCount(-1)
//     }
//     // 统一解包 response.data（假设后端返回格式 { code, data, msg }）
//     const res = response.data
//     if (res.code !== undefined) {
//       if (res.code === 0 || res.code === 200) {
//         return res.data // 直接返回业务数据
//       } else {
//         // 业务错误
//         const errorMsg = res.msg || 'Request failed'
//         ElMessage.error(errorMsg)
//         return Promise.reject(new Error(errorMsg))
//       }
//     }
//     // 如果没有 code 字段，直接返回 data
//     return response.data
//   },
//   async (error) => {
//     // 请求失败也要清理 pending 状态
//     const config = error.config
//     if (config) {
//       const requestKey = generateRequestKey(config)
//       if (pendingMap.has(requestKey)) {
//         pendingMap.delete(requestKey)
//         updateLoadingCount(-1)
//       }
//     }

//     // 错误码处理
//     if (error.response) {
//       const status = error.response.status
//       switch (status) {
//         case 401:
//           // 清除 Token 并跳转登录
//           localStorage.removeItem('token')
//           // 避免循环跳转
//           if (!window.location.pathname.includes('/login')) {
//             window.location.href = '/login'
//           }
//           break
//         case 403:
//           ElMessage.error('没有权限访问')
//           break
//         case 500:
//           ElMessage.error('服务器内部错误')
//           break
//         default:
//           ElMessage.error(error.response.data?.msg || `请求失败: ${status}`)
//       }
//     } else if (error.code === 'ERR_CANCELED') {
//       // 主动取消的请求，不提示错误
//       console.warn('Request cancelled:', error.message)
//     } else {
//       ElMessage.error(error.message || '网络异常')
//     }
//     return Promise.reject(error)
//   },
// )

// // ---------- 核心 request 函数（支持去重、取消） ----------
// export async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
//   const requestKey = generateRequestKey(config)

//   // 重复检测：如果已有相同请求正在进行，直接返回它的 Promise
//   if (pendingMap.has(requestKey)) {
//     return pendingMap.get(requestKey)!.promise as Promise<T>
//   }

//   // 创建 AbortController
//   const controller = new AbortController()
//   config.signal = controller.signal

//   // 增加 loading 计数
//   updateLoadingCount(1)

//   // 发起真实请求
//   const promise = service.request<any, T>(config)
//   pendingMap.set(requestKey, { controller, promise: promise as Promise<any> })

//   try {
//     const result = await promise
//     return result
//   } finally {
//     // 请求结束后（成功或失败）从 pendingMap 移除
//     if (pendingMap.has(requestKey)) {
//       pendingMap.delete(requestKey)
//       updateLoadingCount(-1)
//     }
//   }
// }

// // 辅助函数：格式化 Date 对象为 ISO 字符串
// function formatDateParams(obj: any): any {
//   if (!obj || typeof obj !== 'object') return obj
//   const newObj: any = Array.isArray(obj) ? [] : {}
//   for (const key in obj) {
//     const val = obj[key]
//     if (val instanceof Date) {
//       newObj[key] = val.toISOString()
//     } else if (val && typeof val === 'object') {
//       newObj[key] = formatDateParams(val)
//     } else {
//       newObj[key] = val
//     }
//   }
//   return newObj
// }

// // 辅助函数：过滤空值（undefined, null, 空字符串）
// function filterEmptyValue(obj: any): any {
//   if (!obj || typeof obj !== 'object') return obj
//   const newObj: any = Array.isArray(obj) ? [] : {}
//   for (const key in obj) {
//     const val = obj[key]
//     if (val === undefined || val === null || val === '') {
//       continue
//     }
//     if (val && typeof val === 'object') {
//       newObj[key] = filterEmptyValue(val)
//     } else {
//       newObj[key] = val
//     }
//   }
//   return newObj
// }

// // 导出 axios 实例以备不时之需
// export default service
