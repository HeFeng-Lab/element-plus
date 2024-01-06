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
      <input
        :id="props.id"
        v-model="model"
        type="checkbox"
        :class="[ns.e('original')]"
      />
      <span :class="ns.e('inner')"></span>
    </span>
    <span :class="[ns.e('label')]">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { computed, ref, watch } from 'vue'
import { CheckboxValueType, checkboxEmits, checkboxProps } from './checkbox'

defineOptions({
  name: 'ElCheckbox'
})

const props = defineProps(checkboxProps)

const emits = defineEmits(checkboxEmits)

const ns = createNamespace('checkbox')

const model = computed<any>({
  get() {
    return props.modelValue
  },
  set(val) {
    return emits('update:modelValue', val)
  }
})

const isChecked = ref<string | number | boolean>(false)

isChecked.value = props.checked

watch(
  () => props.modelValue,
  val => {
    isChecked.value = val
  }
)

const handlerClick = () => {
  if (props.disabled) return

  isChecked.value = !isChecked.value

  let result: any = isChecked.value

  const map: Record<string, CheckboxValueType> = {
    true: props.trueLabel!,
    false: props.falseLabel!
  }

  if (props.trueLabel || props.falseLabel) {
    result = map[isChecked.value + '']
  }

  emits('change', result!)
  emits('update:modelValue', result!)
}
</script>

<style scoped lang="scss"></style>
