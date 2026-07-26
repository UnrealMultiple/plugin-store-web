<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { getDownloadAllLink } from '@/api'
</script>

<template>
  <div class="shell">
    <header class="site-header">
      <div class="container header-inner">
        <RouterLink to="/" class="brand">
          <img alt="logo" class="logo" src="@/assets/logo.png" width="26" height="31" />
          <span class="brand-name">插件超市</span>
          <span class="brand-tag">Terraria 插件下载镜像</span>
        </RouterLink>

        <a class="btn-solid" :href="getDownloadAllLink()">⬇ 下载插件包</a>
      </div>
    </header>

    <main class="page">
      <RouterView />
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>此下载镜像由迅猛龙赞助~ · 闽ICP备2024057933号-1</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-background) 85%, transparent);
  backdrop-filter: blur(10px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 60px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.logo {
  display: block;
  image-rendering: pixelated;
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-heading);
  white-space: nowrap;
}

.brand-tag {
  font-size: 0.78rem;
  opacity: 0.55;
  color: var(--color-text);
  white-space: nowrap;
  border-left: 1px solid var(--color-border);
  padding-left: 0.6rem;
}

.page {
  flex: 1;
  width: 100%;
}

.site-footer {
  border-top: 1px solid var(--color-border);
  padding: 1.2rem 0;
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.6;
}

@media (max-width: 640px) {
  .brand-tag {
    display: none;
  }
}
</style>
