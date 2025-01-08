<template>
  <div class="progress">
    <h4 class="progress-level">
      <span>{{ store.currentScore }} / {{ store.level.value }}</span>
      <span>{{ store.level.level + 1 }}</span>
    </h4>
    <div>
      <div>
        <span v-if="(progress / 10).toFixed(1) >10">{{ (progress / 100).toFixed(1) }}</span>
  <span 
    v-if="(progress / 10).toFixed(1) < 1"
    style="
      background-color: coral; 
      border-radius: 100px; 
      padding: 0.5em;
      position: relative;
      top: -2vh;">
    Month: {{ progress }}
  </span>
  <span 
    v-else
    style="
      background-color: coral; 
      border-radius: 100px; 
      padding: 0.5em;
      position: relative;
      top: -2vh;">
    Years: {{ (progress / 10).toFixed(1) }}
  </span>
</div>
<div class="progress-container">
  <div class="progress-value" :style="{ width: progress + '%' }"></div>
</div>
    </div>
      </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score'
import { computed } from 'vue'

const store = useScoreStore()

const progress = computed(() => (100 * store.currentScore) / store.level.value)
</script>
