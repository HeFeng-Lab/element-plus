<template>
  <form :class="[ns.b()]">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { Values } from 'async-validator'
import { provide } from 'vue'
import { FormContext, FormContextKey, formEmits, formProps } from './form'

defineOptions({
  name: 'ElForm'
})

const props = defineProps(formProps)

defineEmits(formEmits)

const ns = createNamespace('form')

const fields: any = []

const addField: FormContext['addField'] = context => {
  fields.push(context)
}

const context = {
  ...props,
  addField
}

provide(FormContextKey, context)

const validate = async (
  callback?: (valid: boolean, fields?: Values) => void
) => {
  let errors: Values = {}
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields
      }
    }
  }
  // 没有错误就成功
  if (Object.keys(errors).length === 0) {
    return callback?.(true)
  } else {
    // 有错误就失败
    if (callback) {
      callback?.(false, errors)
    } else {
      return Promise.reject(errors)
    }
  }
}

defineExpose({
  validate: validate
})
</script>

<style scoped lang="scss"></style>
