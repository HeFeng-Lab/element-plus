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
  input: (value: string) => isString(value)
}

export type InputEmits = ExtractPropTypes<typeof inputEmits>
