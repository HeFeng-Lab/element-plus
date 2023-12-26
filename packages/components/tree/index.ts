import Tree from './src/tree.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

export const ElTree = withInstall(Tree)

export default ElTree

export * from './src/tree'

// 添加类型，会与全局的类型合并，在使用模板 <ElIcon></ElIcon> 时会被解析出来
declare module 'vue' {
  export interface GlobalComponents {
    ElTree: typeof ElTree
  }
}
