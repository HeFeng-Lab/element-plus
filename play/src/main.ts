import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from '@code-lab/element-plus'
import '@code-lab/theme-chalk/src/index.scss'

const app = createApp(App)

app.use(ElementPlus)

app.mount('#app')
