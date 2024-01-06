import { ExtractPropTypes, InjectionKey, PropType, SetupContext } from 'vue'
import { TreeNode } from './treeNode'

export type Key = string | number

export interface TreeOption {
  key?: Key
  label?: string
  isLeaf?: boolean
  children?: TreeOption[]

  [key: string]: unknown
}

export const treeProps = {
  modelValue: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  data: {
    type: Object as PropType<TreeOption[]>,
    default: () => []
  },
  defaultCheckedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  defaultExpandedKeys: {
    type: Array as PropType<Key[]>,
    default: () => []
  },
  labelField: {
    type: String,
    default: 'label'
  },
  childrenField: {
    type: String,
    default: 'children'
  },
  keyField: {
    type: String,
    default: 'key'
  },
  onLoad: {
    type: Function as PropType<(node: TreeOption) => Promise<TreeOption[]>>
  },
  // 节点是否可以被选中
  selectable: {
    type: Boolean,
    default: true
  },
  // 是否显示选择框
  checkable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean
  }
} as const

export type TreeProps = ExtractPropTypes<typeof treeProps>

export const treeEvents = {
  'update:modelValue': (keys: Key[]) => keys
}

export interface TreeContext {
  slots: SetupContext['slots']
}

export const treeInjectionKey: InjectionKey<TreeContext> = Symbol()

export const treeNodeContentProps = {
  node: {
    type: Object as PropType<TreeNode>,
    required: true
  }
} as const
