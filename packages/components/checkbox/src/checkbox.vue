<template>
  <label
    for=""
    :class="[
      ns.b(),
      ns.is('checked', isChecked),
      ns.is('disabled', props.disabled)
    ]"
    @click="handlerClick"
  >
    <span
      :class="[
        ns.e('input'),
        ns.is('checked', isChecked),
        ns.is('disabled', props.disabled),
        ns.is('indeterminate', props.indeterminate)
      ]"
    >
      <input :id="props.id" type="checkbox" :class="[ns.e('original')]" />
      <span :class="ns.e('inner')"></span>
    </span>
    <span :class="[ns.e('label')]">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { ref } from 'vue'
import { checkboxEmits, checkboxProps, CheckboxValueType } from './checkbox'

defineOptions({
  name: 'ElCheckbox'
})

const props = defineProps(checkboxProps)

const emits = defineEmits(checkboxEmits)

const ns = createNamespace('checkbox')

const isChecked = ref(false)

isChecked.value = props.checked

const handlerClick = () => {
  if (props.disabled) return

  isChecked.value = !isChecked.value

  const value = isChecked.value + ''

  const map: Record<string, CheckboxValueType> = {
    true: props.trueLabel!,
    false: props.falseLabel!
  }

  emits('change', map[value]!)
  emits('update:modelValue', map[value]!)
}
</script>

<style scoped lang="scss"></style>
