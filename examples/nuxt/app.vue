<template>
  <Head>
    <!-- Google Fonts -->
    <Link rel="preconnect" href="https://fonts.googleapis.com" />
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

  <NuxtPage />
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  import("viewport-extra").then(({ apply }) => {
    apply([{ content: { minimumWidth: 412 } }]);
  });
});
</script>
