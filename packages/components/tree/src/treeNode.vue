<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import CaretRight from '../../caretRight/caretRight'
import { TreeNode, treeNodeEmits, treeNodeProps } from './treeNode'

defineOptions({
  name: 'ElTreeNode'
})

const props = defineProps(treeNodeProps)

const emits = defineEmits(treeNodeEmits)

const ns = createNamespace('tree-node')

const handlerExpandIconClick = (node: TreeNode) => {
  emits('toggle', node)
}
</script>

<template>
  <div
    :class="[ns.b()]"
    :style="{ paddingLeft: `${props.node!.level * 16 + 'px'}` }"
  >
    <div
      :class="[
        ns.e('content'),
        ns.e('expand-icon'),
        ns.is('leaf', props.node!.isLeaf),
        { expanded: !props.node!.isLeaf && props.expanded! }
      ]"
    >
      <span :class="[]">
        <el-icon @click.stop="handlerExpandIconClick(props.node!)">
          <CaretRight></CaretRight>
        </el-icon>
      </span>
      <span>{{ props.node!.label }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>