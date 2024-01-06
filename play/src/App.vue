<script setup lang="ts">
import { ref, watch } from 'vue'
// import { Edit } from '@element-plus/icons-vue'
import { ElCheckbox } from '@code-lab/components'
import { TreeOption } from '@code-lab/components/tree/src/tree'

const treeData = ref()

treeData.value = createData()

function createData(level = 4, baseKey = ''): TreeOption[] | undefined {
  if (!level) return undefined
  return new Array(6 - level).fill(0).map((_, index) => {
    const key = '' + baseKey + level + index
    return {
      label: createLabel(level),
      key,
      children: createData(level - 1, key)
    }
  })
}

function createLabel(level: number): string {
  if (level === 4) return '道生一'
  if (level === 3) return '一生二'
  if (level === 2) return '二生三'
  if (level === 1) return '三生万物'
  return ''
}

const treeData2 = ref<TreeOption[]>(createData2())

function createData2() {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false
    }
  ]
}

function nextLabel(currentLabel?: string): string {
  if (!currentLabel) return 'Out of Tao, One is born'
  if (currentLabel === 'Out of Tao, One is born') return 'Out of One, Two'
  if (currentLabel === 'Out of One, Two') return 'Out of Two, Three'
  if (currentLabel === 'Out of Two, Three') {
    return 'Out of Three, the created universe'
  }
  if (currentLabel === 'Out of Three, the created universe') {
    return 'Out of Tao, One is born'
  }
  return ''
}

const handleLoad = (node: TreeOption) => {
  // 每次实现懒加载时，会触发此方法，将当前点击的node传入
  return new Promise<TreeOption[]>((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          label: nextLabel(node.label),
          key: node.key + nextLabel(node.label),
          isLeaf: false
        }
      ])
    }, 300)
  })
}

const treeValue = ref([])

watch(
  () => treeValue.value,
  val => {
    console.log('tree 选择变化', val)
  },
  {
    deep: true
  }
)

const treeValue3 = ref<TreeOption[]>([
  {
    key: '0',
    label: '0',
    children: [
      {
        key: '0-0',
        label: '0-0'
      },
      {
        disabled: true,
        key: '0-1',
        label: '0-1',
        children: [
          {
            label: '0-1-0',
            key: '0-1-0'
          },
          {
            label: '0-1-1',
            key: '0-1-1'
          }
        ]
      }
    ]
  }
])

const checkStatus = ref(false)

const handlerCheckboxChange = (val: string | number | boolean) => {
  console.log(val)
}
</script>

<template>
  <!-- <el-icon :size="20" color="red">
    <Edit />
  </el-icon>
  <el-icon :size="20" color="blue">
    <Edit />
  </el-icon>

  <el-button>Default</el-button>
  <el-button type="primary">Primary</el-button>
  <el-button type="success">Success</el-button>
  <el-button type="info">Info</el-button>
  <el-button type="warning">Warning</el-button>
  <el-button type="danger">Danger</el-button> -->

  <el-tree :data="treeData" :default-expanded-keys="['40', '41']"></el-tree>
  <!--  <el-tree v-model="treeValue" :data="treeData2" :on-load="handleLoad" :selectable="true" :multiple="true"></el-tree>-->
  <!-- <el-tree
    :data="treeValue3"
    :on-load="handleLoad"
    :selectable="true"
    :multiple="true"
  >
    <template #default="{ node }">
      template {{ node.key }} - {{ node.label }}
    </template>
  </el-tree> -->

  <hr />

  <ElCheckbox
    v-model="checkStatus"
    label="checkbox"
    true-label="TrueLabel"
    false-label="FalseLabel"
    @change="handlerCheckboxChange"
  >
    test
  </ElCheckbox>
</template>

<style scoped></style>
