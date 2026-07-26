<script setup lang="ts">
import { ref } from 'vue'

// 5颗星显示, 每颗星对应2分(后端评分为0-10分)
const props = withDefaults(
  defineProps<{
    score: number
    count?: number
    interactive?: boolean
  }>(),
  { count: undefined, interactive: false },
)

const emit = defineEmits<{
  rate: [score: number]
}>()

const hoverStar = ref(0)

function fillOf(i: number): number {
  const stars = hoverStar.value > 0 ? hoverStar.value : props.score / 2
  return Math.max(0, Math.min(1, stars - (i - 1)))
}

function onClick(i: number) {
  if (props.interactive) {
    emit('rate', i * 2)
  }
}
</script>

<template>
  <div class="rating" :class="{ interactive }" @mouseleave="hoverStar = 0">
    <span
      v-for="i in 5"
      :key="i"
      class="star"
      @mouseenter="interactive && (hoverStar = i)"
      @click="onClick(i)"
    >
      <span class="star-bg">★</span>
      <span class="star-fill" :style="{ width: fillOf(i) * 100 + '%' }">★</span>
    </span>
    <span class="score">{{ score.toFixed(1) }}</span>
    <span v-if="count !== undefined" class="count">({{ count }}人)</span>
  </div>
</template>

<style scoped>
.rating {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  line-height: 1;
}

.star {
  position: relative;
  font-size: 1.05rem;
  color: var(--color-border);
}

.interactive .star {
  cursor: pointer;
}

.star-fill {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  color: #f5a623;
  pointer-events: none;
}

.score {
  margin-left: 0.4rem;
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.9rem;
}

.count {
  margin-left: 0.2rem;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
