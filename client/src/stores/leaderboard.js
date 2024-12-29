import { defineStore } from 'pinia';
import { fetchLeaderboard } from '@/api/app';

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    users: [],
  }),
  actions: {
    async loadLeaderboard() {
      try {
        const data = await fetchLeaderboard();
        this.users = data;
      } catch (error) {
        console.error('Ошибка загрузки лидерборда:', error);
      }
    },
  },
});
