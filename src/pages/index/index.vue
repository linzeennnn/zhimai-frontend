<template>
  <div class="px-10 py-20 text-center">
    首页
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const globalStore = useGlobalStore()

function navigateTo() {
  router.push({
    path: '/subPackages/collection/index'
  })
}
</script>
