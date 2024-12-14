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
  <TheMenu />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ScoreProgress from '@/components/ScoreProgress.vue';
import { useScoreStore } from '@/stores/score';
import { updateTimers, fetchUserTimers, fetchPet } from '@/api/app';
import frog from '@/assets/dog.jpg';
import cow from '@/assets/cow.jpg';
import cat from '@/assets/cat.png';
import TheMenu from '../components/TheMenu.vue'

const img = ref(null);
const store = useScoreStore();

const imgSrc = ref(null); // By default
const pet = ref(null);


const eatTimer = ref(0);
const walkTimer = ref(0);
let isEatClickable = ref(true);
let isWalkClickable = ref(true);

async function fetchPetData() {
  pet.value = await fetchPet();
  if (pet.value && pet.value.type) {
    console.log('Pet type:', pet.value.type);
    switch (pet.value.type) {
      case 'Cow':
        imgSrc.value = cow; 
        break;
      case 'Cat':
        imgSrc.value = cat; 
        break;
      default:
        imgSrc.value = frog;
        break;
    }
  }
}


async function startTimer(timerRef, duration, isClickableRef, type) {
  const startTime = Date.now();
  const remainingTime = duration * 1000;

  // Update timers
  await updateTimers({
    [type]: { startTime, remaining: remainingTime },
  });

  timerRef.value = duration;
  isClickableRef.value = false;

  const interval = setInterval(() => {
    timerRef.value -= 1;

    if (timerRef.value <= 0) {
      clearInterval(interval);
      isClickableRef.value = true;
    }
  }, 1000);
}

async function eat() {
  if (!isEatClickable.value) return;
  store.add(1);
  await startTimer(eatTimer, 30, isEatClickable, 'eat');
}

async function walk() {
  if (!isWalkClickable.value) return;
  store.add(3);
  await startTimer(walkTimer, 60, isWalkClickable, 'walk');
}

// Synchronization of timers on application loading
async function syncTimers() {
  const timers = await fetchUserTimers();
  const now = Date.now();

  if (timers.eat) {
    const elapsed = now - timers.eat.startTime;
    const remaining = Math.max(0, Math.floor((timers.eat.remaining - elapsed) / 1000));
    eatTimer.value = remaining;
    isEatClickable.value = remaining === 0;
  }

  if (timers.walk) {
    const elapsed = now - timers.walk.startTime;
    const remaining = Math.max(0, Math.floor((timers.walk.remaining - elapsed) / 1000));
    walkTimer.value = remaining;
    isWalkClickable.value = remaining === 0;
  }

  if (eatTimer.value > 0) {
    startTimer(eatTimer, eatTimer.value, isEatClickable, 'eat');
  }

  if (walkTimer.value > 0) {
    startTimer(walkTimer, walkTimer.value, isWalkClickable, 'walk');
  }
}

onMounted(async () => {
  await fetchPetData(); // get the data on the pet
  await syncTimers(); // synchronize the timers
});

</script>


<style>
.button-game {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 21px;
}

.enable, .disabled{
  padding: 0.5em 1em;
  border-radius: 80px;
  min-width: 4em;
  display: block;
  text-align: center;
}
.disabled {
  color: gray;
  background-color: #ccc;
  pointer-events: none;
  cursor: not-allowed;
}

.enable {
  color: antiquewhite;
  background-color: black;
}

.enable:active{
  background-color: darkgray;
}

</style>
