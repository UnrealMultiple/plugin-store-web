<script setup lang="ts">
import type { PluginInfo } from '@/plugin'
import { getPluginDownloadLink } from '@/api'
import RatingStars from './RatingStars.vue'

defineProps<{
  plugin: PluginInfo
}>()
</script>

<template>
  <article class="card">
    <div class="card-top">
      <div class="title-block">
        <RouterLink class="name" :to="`/plugin/${plugin.id}`">{{ plugin.name }}</RouterLink>
        <div class="sub">
          <div class="version">
            <span class="material-symbols-outlined">shoppingmode</span>
            <span>v{{ plugin.version }}</span>
          </div>
          <div class="download">
            <span class="material-symbols-outlined">download</span>
            <span>{{ plugin.download_count }}</span>
          </div>
        </div>
      </div>
    </div>

    <p class="desc">{{ plugin.description || '暂无描述' }}</p>

    <div class="card-foot">
      <RatingStars :score="plugin.rating_score" :count="plugin.rating_count" />
      <div class="actions">
        <a class="btn-solid btn-sm" :href="getPluginDownloadLink(plugin.id)"
          ><span class="material-symbols-outlined">download</span>下载</a
        >
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1.1rem 1.2rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-background);
  transition:
    box-shadow 0.25s,
    transform 0.25s,
    border-color 0.25s;
}

.card:hover {
  border-color: var(--color-accent-border);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 0;
}

.title-block {
  min-width: 0;
}

.name {
  display: block;
  font-size: 1.4rem;
  font-weight: 650;
  color: var(--color-heading);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name:hover {
  color: var(--color-accent);
}

.sub {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 0.15rem;
  font-size: 0.9rem;
  opacity: 0.65;
}

.version {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  opacity: 1;
}

.download {
  display: flex;
  align-items: center;
  gap: 0.1rem;
  opacity: 1;
}

.sub .material-symbols-outlined {
  font-size: 1rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
}

.desc {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.55;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7em;
}

.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
