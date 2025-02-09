<template>
  <div class="progress">
    <h4 class="progress-level">
      <span>{{ store.currentScore }}</span>
      <span>{{ store.level.level + 1 }}</span>
    </h4>
    <div>
      <div>
  <span 
    v-if="(progress % 10) < 12"
    style="
      background-color: coral; 
      border-radius: 100px; 
      padding: 0.5em;
      position: relative;
      top: -2vh;">
    Month: {{ progress % 10 }}
  </span>
  <span 
    v-else
    style="
      background-color: coral; 
      border-radius: 100px; 
      padding: 0.5em;
      position: relative;
      top: -2vh;">
    Years: {{ progress % 10 }}
  </span>
</div>
<div class="progress-container">
  <div class="progress-value" :style="{ width: progress % 10 + '%' }"></div>
</div>
    </div>
      </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score'
import { computed } from 'vue'

const store = useScoreStore()

const progress = computed(() => store.currentScore)
</script>
