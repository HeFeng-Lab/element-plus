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

const loadingKeysRef = ref(new Set<Key>())

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

function collapse(node: TreeNode) {
  expandedKeySet.value.delete(node.key)
}

function expand(node: TreeNode) {
  const keySet = expandedKeySet.value
  keySet.add(node.key)

  triggerLoading(node)
}

const toggleExpand = (node: TreeNode) => {
  const expandedKeys = expandedKeySet.value
  // 收起条件：在展开的集合中，并且不在正在加载的集合中
  if (expandedKeys.has(node.key) && !loadingKeysRef.value.has(node.key)) {
    collapse(node)
  } else {
    expand(node)
  }
}

function triggerLoading(node) {
  if (!node.children.length && !node.isLeaf) {
    // 需要异步加载
    const loadingKeys = loadingKeysRef.value
    const { onLoad } = props // 有onLoad方法
    if (!loadingKeys.has(node.key)) {
      // 防止重复加载
      loadingKeys.add(node.key) // 添加为正在加载
      if (onLoad) {
        // 调用用户提供的加载方法
        props.onLoad!(node.rawNode).then((children: TreeOption[]) => {
          node.rawNode.children = children
          node.children = createTree(children, node) // 格式化后绑定children属性
          loadingKeys.delete(node.key) // 加载完毕移除key
        })
      }
    }
  }
}
</script>

<template>
  <div :class="[ns.b()]">
    <ElTreeNode
      v-for="node in flattenData"
      :key="node.key"
      class=""
      :node="node"
      :expanded="false"
      :loading-keys="loadingKeysRef"
      @toggle="toggleExpand"
    >
    </ElTreeNode>
  </div>
</template>

<style scoped lang="scss"></style>