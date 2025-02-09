import { defineStore } from 'pinia';
import { fetchLeaderboard, fetchWeeklyLeaderboard } from '@/api/app';

export const useLeaderboardStore = defineStore('leaderboard', {
  state: () => ({
    users: [],
    leaderboard: [],
    weeklyLeaderboard: [],
    lastFetch: null
  }),
  actions: {
    async loadLeaderboard() {
      const cacheDuration = 5 * 60 * 1000; // 5 minutes
      
      if (this.leaderboard.length > 0 && Date.now() - this.lastFetch < cacheDuration) {
        console.log('Cached data is used');
        return;
      }

      console.log('Loading data from the server');
      this.leaderboard = await fetchLeaderboard();
      this.lastFetch = Date.now();
    },

    async loadWeeklyLeaderboard() {
      const cacheDuration = 5 * 60 * 1000; // 5 minutes
      
      if (this.weeklyLeaderboard.length > 0 && Date.now() - this.lastFetch < cacheDuration) {
        console.log('Cached data is used');
        return;
      }

      console.log('Loading data from the server');
      this.weeklyLeaderboard = await fetchWeeklyLeaderboard();
      this.lastFetch = Date.now();
    }
  },
});
