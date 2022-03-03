<template>
  <div>
    <NuxtPage/>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { setContent, updateReference } from 'viewport-extra'

onMounted(() => {
  nextTick(() => {
    updateReference()
    setContent({ minWidth: 414 })
  })
})
</script>
