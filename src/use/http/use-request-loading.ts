import { ref } from 'vue'
import Loading from '@/components/instance/loading'

export default function () {
  // 当前正在进行的请求数量（响应式）
  const pendingCount = ref(0)
  let showTime = 0 // 记录Loading实际显示的时间戳
  const minLoadingTime = 300 // 最小加载时间，单位毫秒

  // 增加计数
  const increase = (showLoading = false) => {
    if (!showLoading) return // 不需要显示加载，直接返回
    pendingCount.value++
    if (pendingCount.value === 1) {
      Loading.show()
      showTime = Date.now() // 记录显示时刻
    }
  }

  // 解决请求过快，loading一闪而过的问题，和300ms对比，比300ms更快的请求，至少显示300ms的loading
  const _hideLoading = () => {
    const elapsed = Date.now() - showTime // 实际使用的时间
    if (elapsed < minLoadingTime) {
      setTimeout(() => {
        if (pendingCount.value === 0) {
          Loading.hide()
        }
      }, minLoadingTime - elapsed)
      return
    }

    if (pendingCount.value === 0) {
      Loading.hide()
    }
  }

  // 减少计数
  const decrease = (showLoading = false) => {
    if (!showLoading) return // 不需要显示加载，直接返回
    if (pendingCount.value > 0) {
      pendingCount.value--
    }
    if (pendingCount.value === 0) {
      _hideLoading()
    }
  }

  return {
    increase,
    decrease,
  }
}
