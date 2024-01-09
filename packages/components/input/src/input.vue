<template>
  <div :class="[ns.b()]">
    <div :class="[ns.e('wrapper'), ns.is('focus', isFocus)]">
      <input
        ref="inputRef"
        :type="props.type"
        :size="props.size"
        :class="[ns.e('inner')]"
        @focus="handlerFocus"
        @blur="handlerBlur"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { inject, onMounted, ref, watch } from 'vue'
import { FormItemContextKey } from '../../form/src/formItem'
import { inputEmits, inputProps } from './input'

defineOptions({
  name: 'ElInput'
})

const formItemContext = inject(FormItemContextKey)

const props = defineProps(inputProps)

const emits = defineEmits(inputEmits)

const ns = createNamespace('input')

watch(
  () => props.modelValue,
  () => {
    ;(formItemContext as any)?.validate('change').catch(() => {})
    setNativeInputValue()
  }
)

onMounted(() => {
  setNativeInputValue()
})

const inputRef = ref()
const isFocus = ref(false)

const setNativeInputValue = () => {
  const inputEle = inputRef.value
  if (!inputEle) {
    return
  }
  inputEle.value = String(props.modelValue)
}

const handlerFocus = () => {
  inputRef.value.focus()
  isFocus.value = true
}

const handlerBlur = (e: FocusEvent) => {
  inputRef.value.blur()
  isFocus.value = false
  ;(formItemContext as any)?.validate('blur').catch(() => {})
  emits('blur', e)
}
</script>

<style scoped lang="scss"></style>
