import { ExtractPropTypes } from 'vue'

export const formProps = {}

export const formEmits = {}

export type FormProps = ExtractPropTypes<typeof formProps>

export type FormEmits = ExtractPropTypes<typeof formEmits>
