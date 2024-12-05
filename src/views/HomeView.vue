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
import { ref, computed } from 'vue'
import ScoreProgress from '@/components/ScoreProgress.vue'
import { useScoreStore } from '@/stores/score'
import frog from '@/assets/frog.png'
import lizard from '@/assets/lizzard.png'

const img = ref(null)
const store = useScoreStore()

const imgSrc = computed(() => (store.score > 25 ? lizard : frog))

const tapCoast = 1

let isEatClickable = true; // Flag for Eat
let isWalkClickable = true; // Flag for Walk

const eatTimer = ref(0); // Flag for Eat
const walkTimer = ref(0); // Flag for Walk

function startTimer(timerRef, duration, callback) {
  timerRef.value = duration;
  const interval = setInterval(() => {
    timerRef.value -= 1;
    if (timerRef.value <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 1000);
}



function eat() {
  if (!isEatClickable) return;

  isEatClickable = false;
  store.add(tapCoast);

  startTimer(eatTimer, 6, () => {
    isEatClickable = true;
  });
}

function walk() {
  if (!isWalkClickable) return;

  isWalkClickable = false;
  store.add(tapCoast + 2);

  startTimer(walkTimer, 600, () => {
    isWalkClickable = true;
  });
}
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
