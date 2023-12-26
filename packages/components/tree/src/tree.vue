<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { computed, ref, watch } from 'vue'
import { Key, TreeOption, treeProps } from './tree'
import type { TreeNode } from './treeNode'
import ElTreeNode from './treeNode.vue'

defineOptions({
  name: 'ElTree'
})

const props = defineProps(treeProps)

const ns = createNamespace('tree')

const tree = ref<TreeNode[]>([])

function createTreeOptions(
  keyField: string,
  childrenField: string,
  labelField: string
) {
  return {
    getKey<T>(node: T): Key {
      return node[keyField]
    },
    getChildren<T>(node: T): T[] {
      return node[childrenField]
    },
    getLabel<T>(node: T): string {
      return node[labelField]
    }
  }
}
const treeOptions = createTreeOptions(
  props.keyField,
  props.childrenField,
  props.labelField
)

watch(
  () => props.data,
  (val: TreeOption[]) => {
    tree.value = createTree(val)
  },
  {
    immediate: true
  }
)

function createTree(
  data: TreeOption[],
  parent: TreeNode | null = null
): TreeNode[] {
  const traversal = (data: TreeOption[], parent: TreeNode | null) => {
    return data.map(node => {
      const children = treeOptions.getChildren(node) || []
      const childrenLen = children.length || 0

      const treeNode: TreeNode = {
        key: treeOptions.getKey(node),
        label: treeOptions.getLabel(node),
        level: parent ? parent.level + 1 : 0,
        isLeaf: node.isLeaf ?? childrenLen == 0,
        children: [],
        rawNode: node
      }

      if (childrenLen > 0) {
        treeNode.children = traversal(children, treeNode)
      }

      return treeNode
    })
  }

  const result = traversal(data, parent)

  return result
}

const expandedKeySet = ref(new Set(props.defaultExpandedKeys))

// 根据 defaultExpandedKeys值，将树状数据格式化为扁平化数组
const flattenData = computed(() => {
  const expandedKeys = expandedKeySet.value
  const flattenNodes: TreeNode[] = []
  const nodes = tree.value || []
  const stack: TreeNode[] = []

  for (let i = nodes.length - 1; i >= 0; --i) {
    stack.push(nodes[i])
  }

  while (stack.length) {
    const node = stack.pop()

    if (!node) continue

    flattenNodes.push(node)

    if (expandedKeys.has(node.key)) {
      const children = node.children

      if (children) {
        const length = children.length

        for (let i = length - 1; i >= 0; --i) {
          stack.push(children[i])
        }
      }
    }
  }
  return flattenNodes
})
</script>

<template>
  <div :class="[ns.b()]">
    <ElTreeNode
      v-for="node in flattenData"
      :key="node.key"
      class=""
      :node="node"
      :expanded="false"
    ></ElTreeNode>
  </div>
</template>

<style scoped lang="scss"></style>
