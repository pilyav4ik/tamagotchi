<template>
  <div class="game-container">
    <div class="head">
      <ScoreProgress />
      <div class="header">
        <img src="../assets/coin.png" alt="coin" />
        <h2 class="score" id="score">{{ (store.score / 2) }}</h2>
      </div>
    </div>
    <div class="game">
      <div class="circle">
        <img ref="img" id="circle" :src="imgSrc" />
      </div>

      <div class="button-game">
        <span
          v-for="action in actions"
          :key="action.type"
          :class="[action.type, { disabled: !action.isClickable, enable: action.isClickable }]"
          @click="handleAction(action)"
        >
          <div class="button">
            <i  :class="action.icon"></i>
          </div>
          <span class="timer" v-if="action.timer > 0">{{ formatTime(action.timer) }}</span>
        </span>
      </div>
    </div>
    <TheMenu />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import ScoreProgress from '@/components/ScoreProgress.vue';
import { useScoreStore } from '@/stores/score';
import { updateTimers, fetchUserTimers, fetchPet } from '@/api/app';
import dog from '@/assets/pets/dog.webp';
import cat from '@/assets/pets/cat.webp';
import cow from '@/assets/pets/cow.webp';
import dino from '@/assets/pets/dino.webp';
import elephant from '@/assets/pets/elephant.webp';
import fox from '@/assets/pets/fox.webp';
import humster from '@/assets/pets/humster.webp';
import onehorn from '@/assets/pets/onehorn.webp';
import tiger from '@/assets/pets/tiger.webp';
import TheMenu from '@/components/TheMenu.vue';

const img = ref(null);
const store = useScoreStore();

const imgSrc = ref(null);
const pet = ref(null);

const actions = ref([
  { type: 'eat', timer: 0, isClickable: true, icon: 'fas fa-utensils', duration: 3600, score: 20 },
  { type: 'walk', timer: 0, isClickable: true, icon: 'fas fa-shoe-prints', duration: 14400, score: 40 },
  { type: 'play', timer: 0, isClickable: true, icon: 'fas fa-gamepad', duration: 7200, score: 35 },
  { type: 'sleep', timer: 0, isClickable: true, icon: 'fas fa-bed', duration: 32400, score: 75 },
]);

const isMobile = ref(false);

async function fetchPetData() {
  pet.value = await fetchPet();
  const petImages = { Cow: cow, Cat: cat, Dog: dog, Dino: dino, Elephant: elephant, Fox: fox, Humster: humster, Onehorn: onehorn, Tiger: tiger };
  imgSrc.value = petImages[pet.value?.type] || '';
}

function startTimer(action, remainingTime = action.duration) {
  action.timer = remainingTime;
  action.isClickable = false;

  const interval = setInterval(() => {
    action.timer -= 1;

    if (action.timer <= 0) {
      clearInterval(interval);
      action.isClickable = true;
    }
  }, 1000);
}

function handleAction(action) {
  if (!action.isClickable) return;

  store.add(action.score);
  const startTime = Date.now();
  const remainingTime = action.duration * 1000;

  updateTimers({ [action.type]: { startTime, remaining: remainingTime } });
  startTimer(action);
}

function formatTime(seconds) {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `> ${hours} h`;
  } else if (seconds >= 60) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes} m` : `${minutes} m`;
  } else {
    return `${seconds} s`;
  }
}


async function syncTimers() {
  const timers = await fetchUserTimers();
  const now = Date.now();

  actions.value.forEach((action) => {
    const timerData = timers[action.type];
    if (timerData) {
      const elapsed = now - timerData.startTime;
      const remaining = Math.max(0, Math.floor((timerData.remaining - elapsed) / 1000));

      action.timer = remaining;
      action.isClickable = remaining === 0;

      if (remaining > 0) {
        startTimer(action, remaining);
      }
    }
  });
}

async function detectMobileDevice() {
  const regex = /Android|iPhone/i;
  isMobile.value = regex.test(navigator.userAgent);
  console.log("mobile: " + isMobile.value);
}

onMounted(async () => {
  await fetchPetData();
  await syncTimers();
  await detectMobileDevice();
});
</script>


<style>
.head{
  display: flex;
    width: 100%;
    height: fit-content;
    justify-content: space-between;
    align-items: center;
}

.button-game {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 21px;
  width: 100%;
}

.enable{
  border-radius: 100em;
  height: 2.5em;
  width: 2.5em;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.disabled {
  border-radius: 100em;
    height: 2.5em;
    width: 2.5em;
    display: flex;
    text-align: center;
    align-items: center;
    color: gray;
    background-color: #ccc;
    pointer-events: none;
    cursor: not-allowed;
    flex-direction: column;
    justify-content: space-evenly;
    padding-top: 0.7em;
}

.enable {
  color: antiquewhite;
  background-color: black;
}
.enable:active {
  background-color: darkgray;
}

.eat::after, .walk::after, .play::after, .sleep::after {
  content: none;
}


.eat::after, .walk::after, .play::after, .sleep::after{
    position: absolute;
    margin-top: 4.2em;
    color: #000;
    z-index: 1;
    font-size: 0.85em;
    font-family: Calibri;
}
.eat::after{
  content: "eat";
}
.walk::after{
  content: "walk";
}
.play::after{
  content: "play";
}
.sleep::after{
  content: "sleep";
}

.disabled::after{
  content: "" !important;
}
.page{
  padding: 4vw !important; 
}
.game{
  width: 100%;
}

.timer{
  padding-top: 1em;
}
</style>
