import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import '@code-lab/theme-chalk/src/index.scss'

import { ELIcon } from '@code-lab/components'

const app = createApp(App)

app.use(ELIcon)

app.mount('#app')
