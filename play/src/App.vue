<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
</script>

<template>
  <ElIcon :size="20" color="red">
    <Edit />
  </ElIcon>
  <ElIcon :size="20" color="blue">
    <Edit />
  </ElIcon>

  <ElButton
    type="primary"
    size="large"
    plain
    :disabled="true"
    :loading="false"
    :round="true"
    :native-type="'submit'"
    :text="true"
  >
    Button
  </ElButton>
</template>

<style scoped></style>
