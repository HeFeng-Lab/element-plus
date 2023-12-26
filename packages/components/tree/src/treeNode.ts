import { ExtractPropTypes, PropType } from 'vue'
import { TreeOption } from './tree'

export interface TreeNode extends Required<TreeOption> {
  level: number
  children: TreeNode[]
  rawNode: TreeOption
}

export const treeNodeProps = {
  node: {
    type: Object as PropType<TreeNode>
  },
  expanded: {
    type: Boolean,
    default: false
  }
} as const

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>
