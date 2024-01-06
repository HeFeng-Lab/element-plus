import {
  componentPreview,
  containerPreview
} from '@vitepress-demo-preview/plugin'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/element-plus/',

  title: 'Element Plus',
  description: 'Custom Element Plus UI Components',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Icon', link: '/components/icon/index' },
          { text: 'Button', link: '/components/button/index' },
          { text: 'Checkbox', link: '/components/checkbox/index' },
          { text: 'Tree', link: '/components/tree/index' },
          { text: 'Input', link: '/components/input/index' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/HeFeng-Lab/element-plus' }
    ]
  },
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    },
    config(md) {
      md.use(componentPreview)
      md.use(containerPreview)
    }
  }
})
