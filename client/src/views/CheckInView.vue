<template>
  <div class="daily-check-in">
    <h2>DailyCheckIn</h2>
    <button 
      :disabled="isCheckingIn || timeLeft > 0" 
      @click="handleCheckIn" 
      class="check-in-button"
    >
      {{ timeLeft > 0 ? `Next check in ${formatTimeLeft(timeLeft)} minutes.` : 'Check in' }}
    </button>
    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="checkInCount >= 0" class="check-in-count">
      Total: {{ checkInCount }}
    </p>
  </div>
</template>

<script>
import { fetchUserData, dailyCheckIn } from "@/api/app";

export default {
  name: "DailyCheckIn",
  data() {
    return {
      isCheckingIn: false, // Status of request execution
      message: "", // Message to user
      lastCheckIn: null, // LastCheckIn time
      timeLeft: 0, // Remaining time to the next check-in in seconds
      checkInCount: 0, // Number of check-ins
    };
  },
  async mounted() {
    await this.loadUserData(); // Load user data
    this.calculateTimeLeft(); // Calculate the time remaining
    this.startTimer(); // Start timer
  },
  methods: {
    async loadUserData() {
      try {
        const userData = await fetchUserData();

        if (userData) {
          this.lastCheckIn = userData.last_check_in 
            ? new Date(userData.last_check_in) 
            : null;
          this.checkInCount = userData.check_in_count || 0;
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        this.message = "Failed to load data. Try again later.";
      }
    },
    async handleCheckIn() {
      this.isCheckingIn = true;
      this.message = "";

      try {
        const result = await dailyCheckIn();

        if (result.success) {
          this.lastCheckIn = new Date();
          this.checkInCount = result.checkInCount;
          this.calculateTimeLeft();
          this.startTimer();

          this.$router.push("/");
        }

        this.message = result.message;
      } catch (error) {
        console.error("Check-in error:", error);
        this.message = "Failed to load data. Try again later.";
      } finally {
        this.isCheckingIn = false;
      }
    },
    calculateTimeLeft() {
      if (!this.lastCheckIn) return;

      const now = new Date();
      const nextCheckInTime = new Date(
        this.lastCheckIn.getFullYear(),
        this.lastCheckIn.getMonth(),
        this.lastCheckIn.getDate() + 1, // Next day
        0, 0, 0
      );

      const diff = Math.floor((nextCheckInTime - now) / 1000);

      this.timeLeft = diff > 0 ? diff : 0;
    },
    startTimer() {
      if (this.timeLeft > 0) {
        const interval = setInterval(() => {
          this.calculateTimeLeft();

          if (this.timeLeft <= 0) {
            clearInterval(interval);
          }
        }, 1000);
      }
    },
    formatTimeLeft(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours}ч ${minutes}м ${secs}с`;
    },
  },
};
</script>

<style scoped>
.daily-check-in {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.check-in-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.check-in-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.message {
  margin-top: 10px;
  font-size: 14px;
  color: #28a745;
}

.check-in-count {
  margin-top: 10px;
  font-size: 16px;
  color: #007bff;
}
</style>
