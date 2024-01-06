<template>
  <el-tree :data="treeData" :default-expanded-keys="['40', '41']"></el-tree>
</template>

<script setup lang="ts">
import { TreeOption } from '@code-lab/components/tree/src/tree'
import { ref } from 'vue'

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

<style scoped lang="scss"></style>
