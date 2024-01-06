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
import { ref } from 'vue'
import { inputEmits, inputProps } from './input'

defineOptions({
  name: 'ElInput'
})

const props = defineProps(inputProps)

defineEmits(inputEmits)

const ns = createNamespace('input')

const inputRef = ref()
const isFocus = ref(false)

const handlerFocus = () => {
  inputRef.value.focus()
  isFocus.value = true
}

const handlerBlur = () => {
  inputRef.value.blur()
  isFocus.value = false
}
</script>

<style scoped lang="scss"></style>
