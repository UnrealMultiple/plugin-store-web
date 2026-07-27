<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPluginDetail, getPluginDocLink, getPluginDownloadLink, ratePlugin } from '@/api'
import type { PluginDetail } from '@/plugin'
import RatingStars from '@/components/RatingStars.vue'

const route = useRoute()

const detail = ref<PluginDetail>()
const loading = ref(true)
const error = ref('')
const rateMsg = ref('')

function pluginId(): number {
  return Number(route.params.id)
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    detail.value = await getPluginDetail(pluginId())
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
}

async function onRate(score: number) {
  if (!detail.value) return
  rateMsg.value = ''
  try {
    const data = await ratePlugin(detail.value.plugin.id, score)
    detail.value.plugin.rating_count = data.rating_count
    detail.value.plugin.rating_score = data.rating_score
    rateMsg.value = `已评 ${score} 分~`
  } catch (e) {
    rateMsg.value = `评分失败: ${e instanceof Error ? e.message : String(e)}`
  }
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('zh-CN')
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('zh-CN')
}

/** 按浏览器语言从多语言 descriptions 中取最佳描述，回退到 description 单字段 */
function pickDesc(descriptions: Record<string, string>, fallback: string): string {
  if (!descriptions || Object.keys(descriptions).length === 0) return fallback
  const lang = navigator.language
  if (descriptions[lang]) return descriptions[lang]
  const base = lang.split('-')[0]
  const match = Object.keys(descriptions).find((k) => k.startsWith(base || ''))
  if (match) return descriptions[match] || ''
  if (descriptions['en']) return descriptions['en']
  return Object.values(descriptions)[0] || fallback
}

watch(() => route.params.id, load)
onMounted(load)
</script>

<template>
  <div class="container detail-page">
    <RouterLink to="/" class="back">← 返回列表</RouterLink>

    <p v-if="loading" class="hint">加载中...</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <div v-else-if="detail" class="layout">
      <section class="panel head-panel">
        <div class="head-line">
          <h1>{{ detail.plugin.name }}</h1>
          <span class="badge">v{{ detail.plugin.version }}</span>
        </div>
        <div class="author">@{{ detail.plugin.author }}</div>

        <p class="desc">
          {{ pickDesc(detail.plugin.descriptions, detail.plugin.description) || '暂无描述' }}
        </p>

        <div class="head-actions">
          <a class="btn-solid" :href="getPluginDownloadLink(detail.plugin.id)"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path
                d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
              />
            </svg>
            下载</a
          >
          <a
            class="btn-outline"
            :href="getPluginDocLink(detail.plugin.assembly_name)"
            target="_blank"
            rel="noopener"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path
                d="M480-480ZM202-65l-56-57 118-118h-90v-80h226v226h-80v-89L202-65Zm278-15v-80h240v-440H520v-200H240v400h-80v-400q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H480Z"
              />
            </svg>
            文档</a
          >
        </div>
      </section>

      <div class="duo">
        <section class="panel rating-panel">
          <div class="score-big">{{ detail.plugin.rating_score.toFixed(1) }}</div>
          <RatingStars
            class="rating-stars"
            :score="detail.plugin.rating_score"
            interactive
            @rate="onRate"
          />
          <p class="rating-note">
            {{ detail.plugin.rating_count }} 人评分 · {{ rateMsg || '点击星星评分' }}
          </p>
        </section>

        <section class="panel info-panel">
          <h2>插件信息</h2>
          <dl>
            <div class="row">
              <dt>下载次数</dt>
              <dd>{{ detail.plugin.download_count }}</dd>
            </div>
            <div class="row">
              <dt>版本总数</dt>
              <dd>{{ detail.versions.length }}</dd>
            </div>
            <div class="row">
              <dt>程序集</dt>
              <dd class="mono">{{ detail.plugin.assembly_name }}</dd>
            </div>
            <div class="row">
              <dt>收录时间</dt>
              <dd>{{ fmtDate(detail.plugin.created_at) }}</dd>
            </div>
            <div class="row">
              <dt>更新时间</dt>
              <dd>{{ fmtDate(detail.plugin.updated_at) }}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section class="panel">
        <h2>历史版本</h2>
        <table class="versions">
          <thead>
            <tr>
              <th>版本</th>
              <th>发布时间</th>
              <th>依赖</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in detail.versions" :key="v.version">
              <td>
                <span class="mono">v{{ v.version }}</span>
                <span v-if="v.version === detail.plugin.version" class="badge badge-sm">最新</span>
                <span v-if="v.hot_reload" class="badge badge-sm badge-hotreload">热重载</span>
              </td>
              <td>{{ fmtDateTime(v.created_at) }}</td>
              <td>
                <div v-if="v.dependencies && v.dependencies.length > 0" class="dep-list">
                  <span v-for="dep in v.dependencies" :key="dep" class="dep-chip">{{ dep }}</span>
                </div>
                <span v-else class="dep-chip dep-none">无依赖</span>
              </td>
              <td class="td-right">
                <a
                  class="btn-outline btn-sm"
                  :href="getPluginDownloadLink(detail.plugin.id, v.version)"
                  >下载</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  padding-top: 1.5rem;
  padding-bottom: 2.5rem;
}

.back {
  display: inline-block;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.layout {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.duo {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 1.1rem;
  align-items: stretch;
}

.panel {
  padding: 1.4rem 1.6rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-background);
}

.head-line {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.head-line h1 {
  font-size: 1.6rem;
  font-weight: 750;
  color: var(--color-heading);
  line-height: 1.25;
}

.badge {
  font-size: 0.82rem;
  color: var(--color-accent);
  border: 1px solid var(--color-accent-border);
  background: var(--color-accent-soft);
  border-radius: 99px;
  padding: 0.1rem 0.6rem;
  white-space: nowrap;
}

.badge-sm {
  font-size: 0.72rem;
  padding: 0 0.45rem;
  margin-left: 0.4rem;
}

.badge-hotreload {
  color: #2e8a3a;
  border-color: #a3d9a8;
  background: #edf7ee;
}

.desc {
  margin-top: 0.6rem;
  opacity: 0.8;
  line-height: 1.65;
}

.head-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.1rem;
  flex-wrap: wrap;
}

/* 评分卡 */
.rating-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 1.6rem;
  padding-bottom: 1.6rem;
}

.score-big {
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-heading);
}

.rating-stars {
  margin-top: 0.6rem;
  justify-content: center;
}

.rating-stars :deep(.star) {
  font-size: 1.4rem;
}

.rating-stars :deep(.score) {
  display: none;
}

.rating-note {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.6;
}

.author {
  color: var(--color-accent);
  font-size: 0.9rem;
}

/* 信息卡 */
h2 {
  font-size: 1.1rem;
  font-weight: 650;
  color: var(--color-heading);
  margin-bottom: 0.7rem;
}

.info-panel dl {
  display: flex;
  flex-direction: column;
}

.info-panel .row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  padding: 0.55rem 0;
  border-bottom: 1px dashed var(--color-border);
  font-size: 0.9rem;
}

.info-panel .row:last-child {
  border-bottom: none;
}

.info-panel dt {
  opacity: 0.6;
  white-space: nowrap;
}

.info-panel dd {
  color: var(--color-heading);
  font-weight: 550;
  overflow-wrap: anywhere;
  text-align: right;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.92em;
}

/* 版本表 */
.versions {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.versions th,
.versions td {
  text-align: left;
  padding: 0.55rem 0.8rem;
  border-bottom: 1px solid var(--color-border);
}

.versions tr:last-child td {
  border-bottom: none;
}

.versions th {
  opacity: 0.6;
  font-weight: 500;
}

.td-right {
  text-align: right;
}

.dep-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.dep-chip {
  display: inline-block;
  font-size: 0.78rem;
  padding: 0.1rem 0.5rem;
  border-radius: 99px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  border: 1px solid var(--color-accent-border);
  cursor: default;
  white-space: nowrap;
}

.dep-none {
  opacity: 0.35;
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

@media (max-width: 720px) {
  .duo {
    grid-template-columns: 1fr;
  }
}
</style>
