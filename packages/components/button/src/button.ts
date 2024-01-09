import { ExtractPropTypes, PropType } from 'vue'

export type Size = 'small' | 'default' | 'large'
export type Type =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'text'

export const buttonProps = {
  size: {
    type: String as PropType<Size>,
    default: 'default'
  },
  type: {
    type: String as PropType<Type>,
    validator(val: string) {
      return [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'text'
      ].includes(val)
    }
  },
  plain: Boolean,
  text: Boolean,
  loading: Boolean,
  disabled: Boolean,
  round: Boolean,
  nativeType: {
    // 按钮原生属性
    type: String as PropType<'button' | 'submit' | 'reset'>,
    default: 'button'
  }
} as const

export const buttonEmits = {
  click: (e: MouseEvent) => e instanceof MouseEvent
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export type ButtonEmits = typeof buttonEmits
