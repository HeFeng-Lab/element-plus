import { ExtractPropTypes, PropType } from 'vue'

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
  selectable: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
  }
} as const

export type TreeProps = ExtractPropTypes<typeof treeProps>

export const treeEvents = {
  "update:modelValue": (keys: Key[]) => keys
}
