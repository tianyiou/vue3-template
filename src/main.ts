import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/less/index.less'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
