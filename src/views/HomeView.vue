<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { searchPlugins, type SortKey } from '@/api'
import type { PluginInfo } from '@/plugin'
import PluginCard from '@/components/PluginCard.vue'

const PAGE_SIZE = 12

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'download', label: '下载最多' },
  { key: 'rating', label: '评分最高' },
  { key: 'newest', label: '最新收录' },
  { key: 'name', label: '名称' },
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
        <span class="search-icon">🔍</span>
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
      >{{ s.label }}</button>
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
  padding: 3.2rem 0 2.6rem;
  text-align: center;
  background:
    radial-gradient(ellipse 60% 120% at 50% -20%, var(--color-accent-soft), transparent),
    var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
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
  font-size: 0.95rem;
  opacity: 0.5;
  pointer-events: none;
}

.search {
  width: 100%;
  padding: 0.8rem 1.2rem 0.8rem 2.6rem;
  border: 1px solid var(--color-border);
  border-radius: 99px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  outline: none;
  box-shadow: var(--shadow-card);
  transition: 0.2s;
}

.search:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.total {
  margin-top: 0.9rem;
  font-size: 0.85rem;
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
  padding: 0.32rem 0.95rem;
  border: 1px solid var(--color-border);
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
