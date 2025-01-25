<template>
  <div class="page">
    <h1>Index Page</h1>
    <p>--------------- 430px wide text ---------------</p>
    <NuxtLink to="/another">Go to another page</NuxtLink>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>
