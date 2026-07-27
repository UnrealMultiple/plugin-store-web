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
          <span class="brand-tag">TShock 插件下载</span>
        </RouterLink>

        <a class="btn-solid" :href="getDownloadAllLink()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path
              d="m480-240 160-160-56-56-64 64v-168h-80v168l-64-64-56 56 160 160ZM200-640v440h560v-440H200Zm0 520q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v499q0 33-23.5 56.5T760-120H200Zm16-600h528l-34-40H250l-34 40Zm264 300Z"
            />
          </svg>
          下载插件包</a
        >
      </div>
    </header>

    <main class="page">
      <RouterView />
    </main>

    <footer class="site-footer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path
          d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h480q33 0 56.5 23.5T800-800v640q0 33-23.5 56.5T720-80H240Zm0-80h480v-640H240v640Zm381.5-98.5Q680-317 680-400t-58.5-141.5Q563-600 480-600t-141.5 58.5Q280-483 280-400t58.5 141.5Q397-200 480-200t141.5-58.5ZM480-268q-26 0-50.5-9.5T386-306l188-188q19 19 28.5 43.5T612-400q0 55-38.5 93.5T480-268ZM320-680q17 0 28.5-11.5T360-720q0-17-11.5-28.5T320-760q-17 0-28.5 11.5T280-720q0 17 11.5 28.5T320-680Zm148.5-11.5Q480-703 480-720t-11.5-28.5Q457-760 440-760t-28.5 11.5Q400-737 400-720t11.5 28.5Q423-680 440-680t28.5-11.5ZM240-160v-640 640Z"
        />
      </svg>
      <p>此下载镜像由迅猛龙赞助 · 闽ICP备2024057933号-1</p>
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-top: 1px solid var(--color-border);
  padding: 1.2rem 0;
  font-size: 0.8rem;
  opacity: 0.6;
}

@media (max-width: 640px) {
  .brand-tag {
    display: none;
  }
}
</style>
