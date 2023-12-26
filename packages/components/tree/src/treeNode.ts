import { ExtractPropTypes, PropType } from 'vue'
import { Key, TreeOption } from './tree'

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
  },
  loadingKeys: {
    type: Object as PropType<Set<Key>>,
    required: true
  }
} as const

export const treeNodeEmits = {
  toggle: (node: TreeNode) => node
}

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>

export type ButtonEmits = typeof treeNodeEmits
