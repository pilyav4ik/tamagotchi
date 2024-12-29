<template>
  <div class="leaderboard">
    <h2>🏆 Leaderboard</h2>
    <div class="card-list">
      <div v-for="(user, index) in mockLeaderboard" :key="user.telegram" class="card">
        <div class="rank">
          <span v-if="index === 0" class="medal gold">🥇</span>
          <span v-else-if="index === 1" class="medal silver">🥈</span>
          <span v-else-if="index === 2" class="medal bronze">🥉</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="user-info">
          <div class="user-name"><b>{{ user.first_name || 'Loading...' }}</b></div>
        </div>
        <div class="user-score">{{ user.score }}</div>
      </div>
    </div>
  </div>

  <TheMenu />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TheMenu from '../components/TheMenu.vue';
import { fetchLeaderboard } from '@/api/app';

const leaderboard = ref([]);

onMounted(async () => {
  leaderboard.value = await fetchLeaderboard();
});


const mockLeaderboard = [
{ telegram: 12345, first_name: 'Krystian Graba', score: 120 },
  { telegram: 67890, first_name: 'amanx1586', score: 100 },
  { telegram: 11121, first_name: 'McCall Damon ', score: 80 },
  { telegram: 14151, first_name: 'kaminina 🎄', score: 60 },
  { telegram: 16171, first_name: 'md parvez', score: 40 },  
  { telegram: 12345, first_name: 'Rabioul', score: 120 },
  { telegram: 67890, first_name: 'Olu111', score: 100 },
  { telegram: 11121, first_name: 'Chaizer8617', score: 80 },
  { telegram: 14151, first_name: 'ROCBEE', score: 60 },
  { telegram: 16171, first_name: 'Smart Emm', score: 40 },  
  { telegram: 12345, first_name: 'Pablo', score: 120 },
  { telegram: 67890, first_name: 'Bbention04', score: 100 },
  { telegram: 11121, first_name: 'Caleb Muzeh', score: 80 },
  { telegram: 14151, first_name: 'Richard None', score: 60 },
  { telegram: 16171, first_name: 'LomGGGG', score: 40 },
];
</script>

<style scoped>
.leaderboard {
  font-family: Arial, sans-serif;
  text-align: center;
  margin: 20px auto;
  width: 100%;
}

.leaderboard h2 {
  margin-bottom: 24px;
}
.card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank {
  font-size: 1rem;
  width: 40px;
  text-align: center;
  font-weight: lighter;
}

.medal.gold {
  color: #FFD700;
}

.medal.silver {
  color: #C0C0C0;
}

.medal.bronze {
  color: #CD7F32;
}

.user-info {
  flex: 1;
  text-align: left;
  padding-left: 12px;
}

.user-name {
  font-size: 1rem;
  font-weight: normal;
}

.user-score {
  font-size: 0.9rem;
  color: #ffffff;
  background-color: #CD7F32;
  width: 3em;
  border-radius: 100px;
  padding: 0.2em;
}
</style>