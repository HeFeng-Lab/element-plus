import DefaultTheme from 'vitepress/theme'

import ElementPlus from '@code-lab/element-plus'
import '@code-lab/theme-chalk/src/index.scss'

import {
  AntDesignContainer,
  ElementPlusContainer,
  NaiveUIContainer
} from '@vitepress-demo-preview/component'
import '@vitepress-demo-preview/component/dist/style.css'

export default {
  // Layout,
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // ...
    app.use(ElementPlus) // 注册组件
    app.component('demo-preview', AntDesignContainer)
  }
}
