<template>
  <i :class="[ns.b()]" :style="styles" v-bind="$attrs">
    <slot></slot>
  </i>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { iconProps } from "./icon"
import { createNamespace } from "@code-lab/element-plus-utils"

defineOptions({
  name: "ELIcon",
})

const ns = createNamespace("icon")
const props = defineProps(iconProps)

const styles = computed(() => {
  const { size, color } = props

  if (!size && !color) return {}

  return {
    ...(size ? { "font-size": `${size}px` } : {}),
    ...(color ? { color } : {}),
  }
})
</script>

<style scoped lang="scss"></style>
