import Button from './src/button.vue'

import { withInstall } from '@code-lab/element-plus-utils/withInstall'

export const ElButton = withInstall(Button)

export default ElButton

export * from './src/button'

declare module 'vue' {
  export interface GlobalComponents {
    ElButton: typeof ElButton
  }
}
