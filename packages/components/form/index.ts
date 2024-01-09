import Form from './src/form.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

export const ElForm = withInstall(Form)
export const ElFormItem = withInstall(Form)

export default ElForm

export * from './src/form'
export * from './src/formItem'

// 添加类型，会与全局的类型合并，在使用模板 <ElForm></ElForm> 时会被解析出来
declare module 'vue' {
  export interface GlobalComponents {
    ElForm: typeof ElForm
    ElFormItem: typeof ElFormItem
  }
}
