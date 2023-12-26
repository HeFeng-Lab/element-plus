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
  loadingKeys: {
    type: Object as PropType<Set<Key>>
  }
} as const

export type TreeProps = ExtractPropTypes<typeof treeProps>
