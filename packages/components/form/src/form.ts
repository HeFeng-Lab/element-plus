import { ExtractPropTypes, InjectionKey } from 'vue'
import { FormItemContext } from './formItem'

export const formProps = {
  model: {
    type: Object
  },
  rules: {
    type: Object
  }
}

export const formEmits = {}

export type FormProps = ExtractPropTypes<typeof formProps>

export type FormEmits = ExtractPropTypes<typeof formEmits>

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void
}

export const FormContextKey: InjectionKey<FormContext> = Symbol()
