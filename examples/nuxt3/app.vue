<template>
  <Head>
    <!-- An ineffective element to disable overriding on page transition -->
    <!-- Therefore don't set content attribute -->
    <Meta name="viewport" />

    <!-- Google Fonts -->
    <Link
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />
    <Link
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />
    <Link
      href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
      rel="stylesheet"
    />
  </Head>

  <!-- eslint-disable-next-line vue/no-multiple-template-root -->
  <NuxtPage/>
</template>

<script setup>
import { setContent, updateReference } from 'viewport-extra'

onMounted(() => {
  updateReference()
  setContent({ minWidth: 414 })
})
</script>
