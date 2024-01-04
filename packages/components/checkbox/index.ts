import Tree from './src/checkbox.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

export const ElCheckbox = withInstall(Tree)

export default ElCheckbox

export * from './src/checkbox'

// 添加类型，会与全局的类型合并，在使用模板 <ElIcon></ElIcon> 时会被解析出来
declare module 'vue' {
  export interface GlobalComponents {
    ElCheckbox: typeof ElCheckbox
  }
}
