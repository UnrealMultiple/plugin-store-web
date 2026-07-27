<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { searchPlugins, type SortKey } from '@/api'
import type { PluginInfo } from '@/plugin'
import PluginCard from '@/components/PluginCard.vue'

const PAGE_SIZE = 12

const SORTS: { key: SortKey; label: string; icon: string }[] = [
  {
    key: 'download',
    label: '下载最多',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>',
  },
  {
    key: 'rating',
    label: '评分最高',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>',
  },
  {
    key: 'name',
    label: '名称',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m131-252 165-440h79l165 440h-76l-39-112H247l-40 112h-76Zm139-176h131l-64-182h-4l-63 182Zm395 186q-51 0-81-27.5T554-342q0-44 34.5-72.5T677-443q23 0 45 4t38 11v-12q0-29-20.5-47T685-505q-23 0-42 9.5T610-468l-47-35q24-29 54.5-43t68.5-14q69 0 103 32.5t34 97.5v178h-63v-37h-4q-14 23-38 35t-53 12Zm12-54q35 0 59.5-24t24.5-56q-14-8-33.5-12.5T689-393q-32 0-50 14t-18 37q0 20 16 33t40 13Z"/></svg>',
  },
]

const keyword = ref('')
const sort = ref<SortKey>('download')
const page = ref(1)
const total = ref(0)
const plugins = ref<PluginInfo[]>([])
const loading = ref(false)
const error = ref('')

const pages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await searchPlugins({
      keyword: keyword.value || undefined,
      sort: sort.value,
      page: page.value,
      page_size: PAGE_SIZE,
    })
    plugins.value = data.items
    total.value = data.total
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined
watch(keyword, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    load()
  }, 300)
})

watch(page, load)

watch(sort, () => {
  page.value = 1
  load()
})

onMounted(load)
</script>

<template>
  <section class="hero">
    <div class="container">
      <h1>插件超市</h1>

      <div class="search-wrap">
        <svg
          class="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 -960 960 960"
          width="24px"
          height="24px"
          fill="currentColor"
        >
          <path
            d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
          />
        </svg>
        <input v-model="keyword" class="search" type="search" placeholder="搜索插件名称..." />
      </div>
      <p class="total">已收录 {{ total }} 个插件</p>
    </div>
  </section>

  <section class="container list-area">
    <div class="sort-bar">
      <button
        v-for="s in SORTS"
        :key="s.key"
        class="sort-pill"
        :class="{ active: sort === s.key }"
        @click="sort = s.key"
      >
        <div v-html="s.icon"></div>
        {{ s.label }}
      </button>
    </div>

    <p v-if="error" class="error">加载失败: {{ error }}</p>
    <p v-else-if="loading && plugins.length === 0" class="hint">加载中...</p>
    <p v-else-if="plugins.length === 0" class="hint">没有找到插件捏~</p>

    <div class="grid">
      <PluginCard v-for="p in plugins" :key="p.id" :plugin="p" />
    </div>

    <div v-if="pages > 1" class="pager">
      <button class="btn-outline btn-sm" :disabled="page <= 1" @click="page--">上一页</button>
      <span class="pager-info">{{ page }} / {{ pages }}</span>
      <button class="btn-outline btn-sm" :disabled="page >= pages" @click="page++">下一页</button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 2rem 0 0;
  text-align: center;
}

.hero h1 {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-heading);
  letter-spacing: 0.05em;
}

.search-wrap {
  position: relative;
  max-width: 560px;
  margin: 1.6rem auto 0;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.35rem;
  height: 1.35rem;
  color: var(--color-text);
  opacity: 0.5;
  pointer-events: none;
}

.search {
  width: 100%;
  padding: 0.8rem 1.2rem 0.8rem 2.6rem;
  border: 2px solid var(--color-border);
  border-radius: 99px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
}

.search:focus {
  border: 2px solid var(--color-accent);
}

.total {
  margin-top: 0.9rem;
  font-size: 0.9rem;
  opacity: 0.6;
}

.list-area {
  padding-top: 1.4rem;
  padding-bottom: 2.5rem;
}

.sort-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
}

.sort-pill {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  padding: 0.4rem 0.95rem;
  border: 2px solid var(--color-border);
  border-radius: 99px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.2s;
}

.sort-pill:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.sort-pill.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  cursor: not-allowed;
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.1rem;
}

.pager {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.8rem;
}

.pager button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pager-info {
  font-size: 0.9rem;
  opacity: 0.7;
}

.hint,
.error {
  text-align: center;
  padding: 2.5rem 0;
  opacity: 0.7;
}

.error {
  color: #e5484d;
  opacity: 1;
}
</style>
