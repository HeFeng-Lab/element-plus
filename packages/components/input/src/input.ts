import { isString } from '@code-lab/element-plus-utils/types'
import { definePropType } from '@code-lab/element-plus-utils/vue/props/runtime'
import { ExtractPropTypes, PropType } from 'vue'

export type componentSizes = '' | 'default' | 'small' | 'large'

export const inputProps = {
  modelValue: {
    type: definePropType<string | number | null | undefined>([
      String,
      Number,
      Object
    ]),
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as PropType<componentSizes>,
    default: 'default'
  },
  placeholder: {
    type: String as PropType<string>,
    default: ''
  }
}

export type InputProps = ExtractPropTypes<typeof inputProps>

export const inputEmits = {
  'update:modelValue': (value: string) => isString(value),
  input: (value: string) => isString(value),
  change: (value: string) => isString(value),
  focus: (e: FocusEvent) => e instanceof FocusEvent,
  blur: (e: FocusEvent) => e instanceof FocusEvent,
  clear: () => true // 清空事件
}

export type InputEmits = ExtractPropTypes<typeof inputEmits>
