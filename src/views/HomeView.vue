<template>
  <div class="game-container">
    <ScoreProgress />
    <div class="header">
      <img src="../assets/coin.png" alt="coin" />
      <h2 class="score" id="score">{{ store.score }}</h2>
    </div>
    <div class="circle">
      <img ref="img" id="circle" :src="imgSrc" />
    </div>

    <div class="button-game">
      <span 
        :class="{ disabled: !isEatClickable, enable: isEatClickable }" 
        @click="eat"
      >
        {{ eatTimer > 0 ? eatTimer : "Eat" }}
      </span>
      <span 
        :class="{ disabled: !isWalkClickable, enable: isWalkClickable }" 
        @click="walk"
      >
        {{ walkTimer > 0 ? walkTimer : "Walk" }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { saveTimers, fetchTimers } from '@/api/app';
import ScoreProgress from '@/components/ScoreProgress.vue';
import { useScoreStore } from '@/stores/score';
import frog from '@/assets/frog.png';
import lizard from '@/assets/lizzard.png';

const img = ref(null);
const store = useScoreStore();
const userId = '53';

const imgSrc = computed(() => (store.score > 25 ? lizard : frog));

const eatTimer = ref(0);
const walkTimer = ref(0);
let isEatClickable = ref(true);
let isWalkClickable = ref(true);

async function saveCurrentTimers() {
  const timers = {
    eat: { remaining: eatTimer.value, startTime: isEatClickable.value ? null : Date.now() },
    walk: { remaining: walkTimer.value, startTime: isWalkClickable.value ? null : Date.now() },
  };

  await saveTimers(userId, timers);
}

function startTimer(timerRef, duration, isClickableRef) {
  timerRef.value = duration;
  isClickableRef.value = false;
  saveCurrentTimers();

  const interval = setInterval(() => {
    timerRef.value -= 1;

    if (timerRef.value <= 0) {
      clearInterval(interval);
      isClickableRef.value = true;
      saveCurrentTimers();
    }
  }, 1000);
}

function eat() {
  if (!isEatClickable.value) return;
  store.add(1);
  startTimer(eatTimer, 30, isEatClickable);
}

function walk() {
  if (!isWalkClickable.value) return;
  store.add(3);
  startTimer(walkTimer, 60, isWalkClickable);
}

onMounted(async () => {
  const savedTimers = await fetchTimers(userId);
  const now = Date.now();

  if (savedTimers) {
    if (savedTimers.eat) {
      const elapsed = Math.floor((now - savedTimers.eat.startTime) / 1000);
      eatTimer.value = Math.max(savedTimers.eat.remaining - elapsed, 0);
      isEatClickable.value = eatTimer.value <= 0;
    } else {
      eatTimer.value = 0;
    }

    if (savedTimers.walk) {
      const elapsed = Math.floor((now - savedTimers.walk.startTime) / 1000);
      walkTimer.value = Math.max(savedTimers.walk.remaining - elapsed, 0);
      isWalkClickable.value = walkTimer.value <= 0;
    } else {
      walkTimer.value = 0;
    }
  }

  // Таймер обновления интерфейса
  const updateInterval = setInterval(() => {
    if (eatTimer.value > 0) eatTimer.value -= 1;
    if (walkTimer.value > 0) walkTimer.value -= 1;

    isEatClickable.value = eatTimer.value <= 0;
    isWalkClickable.value = walkTimer.value <= 0;
  }, 1000);

  // Очищаем интервал при размонтировании
  onUnmounted(() => clearInterval(updateInterval));
});
</script>


<style>
.button-game {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  cursor: pointer;
}
.disabled {
  color: gray;
  pointer-events: none;
  cursor: not-allowed;
}
.enable {
  color: antiquewhite;
}

.walk, .eat {
  color: white;
}
</style>
