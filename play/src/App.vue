<script setup lang="ts">
import { ref } from 'vue'
// import { Edit } from '@element-plus/icons-vue'
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
</template>

<style scoped></style>
