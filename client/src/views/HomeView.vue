<template>
  <div class="page">
    <div class="game-container">
    <ShopService/>
    <div class="head">
      <ScoreProgress />
      <div class="header">
        <img src="../assets/coin.png" alt="coin" />
        <h2 class="score" id="score">{{formattedScore}}</h2>
      </div>
    </div>
    <div class="game">
      <div class="circle">
        <img ref="img" id="circle" :src="imgSrc" />
      </div>
      <ActionsMenu/>
    </div>
    <TheMenu />
  </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import ScoreProgress from '@/components/ScoreProgress.vue';
import ShopService from '@/components/ShopButton.vue';
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
import ActionsMenu from '@/components/ActionsMenu.vue';

const img = ref(null);
const store = useScoreStore();
const formattedScore = computed(() => {
  const score = store.score;
  if (score >= 1000000) return (score / 1000000).toFixed(1) + 'M';
  if (score >= 1000) return (score / 1000).toFixed(1) + 'K';
  return score;
});

const imgSrc = ref(null);
const pet = ref(null);

async function fetchPetData() {
  pet.value = await fetchPet();
  const petImages = { Cow: cow, Cat: cat, Dog: dog, Dino: dino, Elephant: elephant, Fox: fox, Humster: humster, Onehorn: onehorn, Tiger: tiger };
  imgSrc.value = petImages[pet.value?.type] || '';
}


onMounted(async () => {
  await fetchPetData();
});

</script>


<style>
.head{
  display: flex;
    width: 100%;
    height: fit-content;
    justify-content: space-between;
    align-items: center;
    margin-top: 70px;
}


.page{
  padding: 2vw !important; 
}
.game{
  width: 100%;
}
</style>
