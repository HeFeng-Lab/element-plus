<template>
  <div :class="[ns.b()]">
    <el-icon>
      <CaretRight></CaretRight>
    </el-icon>
    <span>{{ props.node?.label }}</span>
  </div>
</template>

<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import CaretRight from '../../caretRight/caretRight'
import { treeNodeProps } from './treeNode'

defineOptions({
  name: 'ElTreeNode'
})

const props = defineProps(treeNodeProps)

// const emits = defineEmits({})

const ns = createNamespace('tree-node')
</script>

<style scoped lang="scss"></style>
