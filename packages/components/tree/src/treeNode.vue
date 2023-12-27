<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { computed } from 'vue'
import CaretRight from '../../caretRight/caretRight'
import Loading from '../../loading/loading'
import { TreeNode, treeNodeEmits, treeNodeProps } from './treeNode'
import Tree from '../index'

defineOptions({
  name: 'ElTreeNode'
})

const props = defineProps(treeNodeProps)

const emits = defineEmits(treeNodeEmits)

const ns = createNamespace('tree-node')

const handlerExpandIconClick = (node: TreeNode) => {
  emits('toggle', node)
}

const isLoading = computed(() => {
  return props.loadingKeys?.has(props.node!.key)
})

const handlerClickContent = (node: TreeNode) => {
  if (node.disabled) return

  emits('select', node)
}

const isSelected = computed(() => {
  return props.selectedKeys.includes(props.node!.key)
})

const isDisabled = computed(() => {
  return props.node!.disabled
})
</script>

<template>
  <div
    :class="[
      ns.b(),
      ns.is('selected', isSelected),
      ns.is('disabled', isDisabled)
    ]"
    :style="{ paddingLeft: `${props.node!.level * 16 + 'px'}` }"
  >
    <div :class="[ns.e('content')]">
      <span
        :class="[
          ns.e('expand-icon'),
          ns.is('leaf', props.node!.isLeaf),
          { expanded: !props.node!.isLeaf && props.expanded! }
        ]"
        @click.stop="handlerExpandIconClick(props.node!)"
      >
        <el-icon :class="[isLoading && ns.e('icon-loading')]">
          <CaretRight v-if="!isLoading"></CaretRight>
          <Loading v-else></Loading>
        </el-icon>
      </span>
      <span :class="[ns.e('label')]" @click="handlerClickContent(props.node!)">
        {{ props.node!.label }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
