<template>
  <web-view :src="url" />
</template>

<script setup>
import { ref } from 'vue'

const url = ref('')

onLoad((options) => {
  if (options && options.url) {
    url.value = decodeURIComponent(options.url)
  }
})
</script>
