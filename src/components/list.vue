<script setup lang="ts">
const props = defineProps<{
  host: string
}>()
const route = useRoute()
const router = useRouter()

const url = computed(() => {
  return props.host + route.path
})

const { isFetching, error, data } = await useFetch(url, {
  refetch: true,
}).json()

const list = computed(() => {
  if (!isFetching.value && !error.value && data.value && Array.isArray(data.value)) {
    return data.value.map(({ name, mtime, size, type }: { name: string; mtime: string; size?: number; type: string }) => {
      let link = ''
      if (route.path.startsWith('/'))
        link += route.path
      else
        link += `/${route.path}`

      if (!link.endsWith('/'))
        link += '/'
      link += name

      return {
        name,
        mtime: new Date(mtime),
        size,
        type,
        link,
      }
    })
  }
  else if (!isFetching.value && (error.value || !data.value || !Array.isArray(data.value))) {
    window.open(props.host + route.path)
    error.value = null
    if (history.length > 1 && history?.state?.back)
      router.back()
  }
})

async function openLink(row: { type: string; link: string }) {
  if (row.type === 'directory')
    await router.push(row.link)
  else
    window.open(props.host + row.link)
}
</script>

<template>
  <div w-full h-full overflow-auto>
    <el-table v-if="list" v-loading="isFetching" :data="list" stripe border>
      <el-table-column prop="name" label="名称" sortable>
        <template #default="scope">
          <div class="name-wrapper">
            <i v-if="scope.row.type === 'directory'" class="i-icon-park-outline-folder-open" />
            <i v-else class="i-icon-park-outline-file-code" />
            <span cursor-pointer underline :title="scope.row.link" @click="openLink(scope.row)">
              {{ scope.row.name }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mtime" label="修改时间" sortable>
        <template #default="scope">
          {{ scope.row.mtime.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="文件大小" sortable>
        <template #default="scope">
          {{ scope.row.size > 0 ? `${(scope.row.size / 1024).toFixed(2)} KB` : '' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
[class^="i-"] {
  mask: var(--un-icon) no-repeat;
  mask-size: 100% 100%;
  -webkit-mask: var(--un-icon) no-repeat;
  -webkit-mask-size: 100% 100%;
  background-color: currentColor;
  display: inline-block;
  height: 1em;
  width: 1em;
  line-height: 0;
}

.name-wrapper {
  display: inline-block;

  font-size: 16px;

  i {
    font-size: 20px;
    margin-right: 5px;
  }
}
</style>
