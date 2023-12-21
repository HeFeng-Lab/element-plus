import DefaultTheme from 'vitepress/theme'
import '@code-lab/theme-chalk/src/index.scss'

import { ELIcon } from '@code-lab/components'
// .vitepress/theme/index.js

// You can directly import Vue files in the theme entry
// VitePress is pre-configured with @vitejs/plugin-vue.
// import Layout from './Layout.vue'

export default {
  // Layout,
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(ELIcon) // 注册组件
  }
}
