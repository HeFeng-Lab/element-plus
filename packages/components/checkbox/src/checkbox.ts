import {
  isBoolean,
  isNumber,
  isString
} from '@code-lab/element-plus-utils/types'
import { ExtractPropTypes, PropType } from 'vue'

export type CheckboxValueType = string | number | boolean

export const checkboxProps = {
  modelValue: {
    type: [String, Number, Boolean],
    default: false
  },
  label: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  checked: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  trueLabel: {
    type: [String, Number, Boolean]
  },
  falseLabel: {
    type: [String, Number, Boolean]
  },
  border: {
    type: Boolean
  },
  size: {
    type: String as PropType<'large' | 'default' | 'small'>,
    default: 'default'
  },
  validateEvent: {
    type: Boolean,
    default: false
  },
  tabindex: {
    type: [String, Number]
  },
  id: {
    type: String
  },
  controls: {
    type: Boolean
  }
}

export const checkboxEmits = {
  change: (val: CheckboxValueType) =>
    isString(val) || isNumber(val) || isBoolean(val),
  'update:modelValue': (val: CheckboxValueType) =>
    isString(val) || isNumber(val) || isBoolean(val)
}

export type CheckboxProps = Partial<ExtractPropTypes<typeof checkboxProps>>

export type CheckboxEmits = ExtractPropTypes<typeof checkboxEmits>
