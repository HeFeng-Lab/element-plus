import Form from './src/form.vue'
import FormItem from './src/formItem.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

const ElForm = withInstall(Form)
const ElFormItem = withInstall(FormItem)

export default {}

export { ElForm, ElFormItem }

export * from './src/form'
export * from './src/formItem'

// 添加类型，会与全局的类型合并，在使用模板 <ElForm></ElForm> 时会被解析出来
declare module 'vue' {
  export interface GlobalComponents {
    ElForm: typeof ElForm
    ElFormItem: typeof ElFormItem
  }
}
