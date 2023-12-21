import Icon from './src/icon.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

export const ElIcon = withInstall(Icon)

export default ElIcon

export * from './src/icon'

// 添加类型，会与全局的类型合并，在使用模板 <ElIcon></ElIcon> 时会被解析出来
declare module 'vue' {
  export interface GlobalComponents {
    ElIcon: typeof ElIcon
  }
}
