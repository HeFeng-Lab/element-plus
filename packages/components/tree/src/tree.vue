<script setup lang="ts">
import { createNamespace } from '@code-lab/element-plus-utils'
import { computed, nextTick, provide, ref, useSlots, watch } from 'vue'
import { CheckboxValueType } from '../../checkbox'
import {
  Key,
  TreeOption,
  treeEvents,
  treeInjectionKey,
  treeProps
} from './tree'
import type { TreeNode } from './treeNode'
import ElTreeNode from './treeNode.vue'

defineOptions({
  name: 'ElTree'
})

const props = defineProps(treeProps)

const emits = defineEmits(treeEvents)

provide(treeInjectionKey, {
  slots: useSlots() // 提供slots属性
})

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
        rawNode: node,
        disabled: !!node.disabled,
        parentKey: parent?.key
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

const selectedKeys = ref<Key[]>([])

function handlerSelect(node: TreeNode) {
  if (!props.selectable) {
    return
  }

  if (props.multiple) {
    const index = selectedKeys.value.findIndex((key: Key) => key === node.key)
    if (index > -1) {
      selectedKeys.value.splice(index, 1)
    } else {
      selectedKeys.value.push(node.key)
    }
  } else {
    if (selectedKeys.value.includes(node.key)) {
      selectedKeys.value = []
    } else {
      selectedKeys.value = [node.key]
    }
  }

  emits('update:modelValue', selectedKeys.value)
}

const checkedKeysRefs = ref(new Set(props.defaultCheckedKeys))
const indeterminateRefs = ref<Set<Key>>(new Set())

function isIndeterminate(node: TreeNode) {
  return indeterminateRefs.value.has(node.key)
}

function isChecked(node: TreeNode) {
  return checkedKeysRefs.value.has(node.key)
}

// 自上而下的选中
function toggle(node: TreeNode, checked: CheckboxValueType) {
  if (!node) return
  const checkedKeys = checkedKeysRefs.value

  if (checked) {
    // 选中的时候 去掉半选状态
    indeterminateRefs.value.delete(node.key)
  }
  // 维护当前的key列表
  nextTick(() => {
    checkedKeys[checked ? 'add' : 'delete'](node.key)
  })
  const children = node.children
  if (children) {
    children.forEach(childNode => {
      if (!childNode.disabled) {
        toggle(childNode, checked)
      }
    })
  }
}

function findNode(key: Key) {
  return flattenData.value.find(node => node.key === key)
}

function updateCheckedKeys(node: TreeNode) {
  // 自下而上的更新
  if (node.parentKey) {
    const parentNode = findNode(node.parentKey as Key)

    if (parentNode) {
      let allChecked = true //默认儿子应该全选
      let hasChecked = false // 儿子有没有被选中

      const nodes = parentNode.children
      for (const node of nodes) {
        if (checkedKeysRefs.value.has(node.key)) {
          hasChecked = true // 子节点被选中了
        } else if (indeterminateRefs.value.has(node.key)) {
          allChecked = false
          hasChecked = true
        } else {
          allChecked = false
        }
      }
      if (allChecked) {
        checkedKeysRefs.value.add(parentNode.key)
        indeterminateRefs.value.delete(parentNode.key)
      } else if (hasChecked) {
        checkedKeysRefs.value.delete(parentNode.key)
        indeterminateRefs.value.add(parentNode.key)
      }
      updateCheckedKeys(parentNode)
    }
  }
}

const handlerCheckToggle = (node: TreeNode, val: CheckboxValueType) => {
  toggle(node, val)
  updateCheckedKeys(node)
}
</script>

<template>
  <div :class="[ns.b()]">
    <ElTreeNode
      v-for="node in flattenData"
      :key="node.key"
      :node="node"
      :expanded="false"
      :loading-keys="loadingKeysRef"
      :selected-keys="selectedKeys"
      :checkable="props.checkable"
      :indeterminate="isIndeterminate(node)"
      :checked="isChecked(node)"
      :disabled="node.disabled"
      @toggle="toggleExpand"
      @select="handlerSelect"
      @check="handlerCheckToggle"
    >
    </ElTreeNode>
  </div>
</template>

<style scoped lang="scss"></style>
