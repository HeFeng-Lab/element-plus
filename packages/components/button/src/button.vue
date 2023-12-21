<script setup lang="ts">
import { createNamespace } from '../../../utils'
import { buttonEmits, buttonProps } from './button'

defineOptions({
  name: 'ElButton'
})

const props = defineProps(buttonProps)
const emits = defineEmits(buttonEmits)

const ns = createNamespace('button')

const handlerClick = (e: MouseEvent) => emits('click', e)
</script>

<template>
  <button
    :class="[
      ns.b(),
      props.type && ns.m(props.type),
      props.size && ns.m(props.size),
      props.plain && ns.is('plain', props.plain),
      props.disabled && ns.is('disabled', props.disabled),
      props.text && ns.is('text', props.text),
      props.loading && ns.is('loading', props.loading),
      props.round && ns.is('round', props.round)
    ]"
    :type="props.nativeType"
    @click="handlerClick"
  >
    <slot></slot>
  </button>
</template>

<style scoped lang="scss"></style>
