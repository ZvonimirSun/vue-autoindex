<script setup lang="ts">
const { isFetching, error, data } = useFetch('/config.json').json()

const host = computed(() => {
  if (!isFetching.value && !error.value && data.value?.host)
    return data.value.host
})
</script>

<template>
  <Suspense>
    <router-view v-if="host" :host="host" />
  </Suspense>
</template>

<style scoped lang="scss">
</style>
