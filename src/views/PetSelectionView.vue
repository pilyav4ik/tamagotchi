<template>
  <div class="pet-selection">
    <h1 class="title">CHOOSE A PET</h1>
    <p class="subtitle">Swipe to select your pet</p>

    <swiper 
      class="swiper-container"
      :slides-per-view="1"
      :space-between="20"
      @slideChange="onSlideChange"
    >
      <swiper-slide 
        v-for="pet in pets" 
        :key="pet.id" 
        class="pet-slide"
      >
        <div class="pet-card">
          <img class="pet-image" :src="pet.image" alt="Pet image" />
          <h2 class="pet-name">{{ pet.name }}</h2>
          <p class="pet-description">{{ pet.description }}</p>
        </div>
      </swiper-slide>
    </swiper>

    <button 
      class="select-button" 
      @click="selectPet(selectedPet)" 
      :disabled="!selectedPet"
    >
      CHOOSE
    </button>
  </div>
</template>

  
  <script setup>
import { ref, computed } from 'vue';
  import { savePet } from '@/api/app';
  import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import dog from '@/assets/dog.jpg';
import cat from '@/assets/cat.jpg';
import cow from '@/assets/cow.jpg';

 
  const router = useRouter();
  
  const pets = ref([
  { id: 'dog', name: 'Doggy', type: 'Dog', image: dog },
  { id: 'cat', name: 'Harrold', type: 'Cat', image: cat },
  { id: 'cow', name: 'Melany', type: 'Cow', image: cow },
  ]);

const selectedPet = ref(null);

function onSlideChange(swiper) {
  selectedPet.value = pets.value[swiper.activeIndex];
}
  
  async function selectPet(pet) {
  if (!pet) return;

    try {
      await savePet(pet);
      router.push('/');
    } catch (error) {
      console.error('Error when saving a pet:', error);
    }
  }
  </script>
  

  <style>
  body, .game, .page{
    background-color: #f9f9f9;
  }
  .pet-selection {
    text-align: center;
    font-family: 'Arial', sans-serif;
    padding: 20px;
    background-color: #f9f9f9;
    max-width: 400px;
    margin: 0 auto;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .subtitle {
    font-size: 16px;
    color: #777;
    margin-bottom: 20px;
  }
  
  .swiper-container {
    margin-bottom: 20px;
  }
  
  .pet-card {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .pet-image {
    max-width: 100px;
    margin-bottom: 15px;
  }
  
  .pet-name {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    display: flex;
    background-color: blueviolet;
    width: fit-content;
    padding: 0.5em;
    border-radius: 100px;
    color: white;
  }
  
  .pet-description {
    font-size: 14px;
    color: #555;
  }
  
  .select-button {
    background-color: #202020;
    color: white;
    font-size: 24px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .select-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .select-button:not(:disabled):hover {
    background-color: #5b4fb1;
  }
  </style>
  