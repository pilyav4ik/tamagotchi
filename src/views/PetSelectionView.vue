<template>
    <div class="pet-selection">
      <h1>Выберите своего питомца</h1>
      <div class="pets">
        <div 
          v-for="pet in pets" 
          :key="pet.id" 
          class="pet-card"
          @click="selectPet(pet)"
        >
          <img :src="pet.image" :alt="pet.name" />
          <h2>{{ pet.name }}</h2>
          <p>{{ pet.type }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { savePet } from '@/api/app';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const pets = ref([
    { id: 'dog', name: 'Бобик', type: 'Собака', image: '/assets/dog.jpg' },
    { id: 'cat', name: 'Мурзик', type: 'Кот', image: '/assets/cat.jpg' },
    { id: 'cow', name: 'Бурёнка', type: 'Корова', image: '/assets/cow.jpg' },
  ]);
  
  async function selectPet(pet) {
    try {
      await savePet(pet);
      router.push('/'); // Перенаправление на главную страницу
    } catch (error) {
      console.error('Ошибка при сохранении питомца:', error);
    }
  }
  </script>
  
  <style>
  .pet-selection {
    text-align: center;
  }
  
  .pets {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .pet-card {
    cursor: pointer;
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    transition: transform 0.3s;
  }
  
  .pet-card:hover {
    transform: scale(1.1);
  }
  </style>
  