import Input from './src/input.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

export const ElInput = withInstall(Input)

export default ElInput

export * from './src/input'

// 添加类型，会与全局的类型合并，在使用模板 <ElInput></ElInput> 时会被解析出来
declare module 'vue' {
  export interface GlobalComponents {
    ElInput: typeof ElInput
  }
}
