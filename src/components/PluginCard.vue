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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path
                d="M446-80q-15 0-30-6t-27-18L103-390q-12-12-17.5-26.5T80-446q0-15 5.5-30t17.5-27l352-353q11-11 26-17.5t31-6.5h287q33 0 56.5 23.5T879-800v287q0 16-6 30.5T856-457L503-104q-12 12-27 18t-30 6Zm0-80 353-354v-286H513L160-446l286 286Zm253-480q25 0 42.5-17.5T759-700q0-25-17.5-42.5T699-760q-25 0-42.5 17.5T639-700q0 25 17.5 42.5T699-640ZM480-480Z"
              />
            </svg>
            <span>v{{ plugin.version }}</span>
          </div>
          <div class="download">
            <svg
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
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill="currentColor"
          >
            <path
              d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
            />
          </svg>
          <p>下载</p></a
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

.sub svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
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
