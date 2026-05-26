import { createApp } from 'vue'
import type { App } from 'vue'
import instanceComponent from './full-loading.vue'

const obj: {
  app?: App<Element>
  root?: HTMLDivElement
  initInstance: (text?: string) => void
  show: (text?: string) => void
  hide: () => void
} = {
  app: undefined,
  root: undefined,
  initInstance(text) {
    this.root = document.createElement('div')

    this.app = createApp(instanceComponent, {
      text,
    })

    this.app.mount(this.root)

    document.body.appendChild(this.root)
  },

  show(text) {
    console.log('出发了show')
    // 显示前把之前的取消了
    this.hide()
    return new Promise(() => {
      this.initInstance(text)
    })
  },
  hide() {
    if (this.app) {
      this.app.unmount()
      this.app = undefined
    }
    if (this.root) {
      document.body.removeChild(this.root)
      this.root = undefined
    }
  },
}

export default obj
