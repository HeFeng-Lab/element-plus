import { ExtractPropTypes, PropType } from 'vue'
import { CheckboxValueType } from '../../checkbox'
import { Key, TreeOption } from './tree'

export interface TreeNode extends Required<TreeOption> {
  level: number
  children: TreeNode[]
  rawNode: TreeOption
  disabled: boolean
  parentKey?: Key
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
  },
  selectedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  checkable: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  checked: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
} as const

export const treeNodeEmits = {
  toggle: (node: TreeNode) => node,
  select: (node: TreeNode) => node,
  check: (node: TreeNode, val: CheckboxValueType) => typeof val === 'boolean'
}

export type TreeNodeProps = Partial<ExtractPropTypes<typeof treeNodeProps>>

export type ButtonEmits = typeof treeNodeEmits
