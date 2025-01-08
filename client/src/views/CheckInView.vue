<template>
  <div class="daily-checkin-container">
    <h3>Daily check-in rewards</h3>
  <div>
    <img src="../assets/checker-pet.webp" class="hero"/>
  </div>
    <div class="progress-table">
      <div class="rewards-grid">
        <div 
          v-for="day in 7" 
          :key="day" 
          :class="['reward-cell', { completed: isDayCompleted(day), 'full-width': day === 7 }]"
        >
        <span class="day-number">
              {{ day }}
            </span>
          <div class="reward-details">
            <span v-if="dayRewards[day].type === 'points'">{{ dayRewards[day].value }}
            </span>
            <img src="../assets/coin.png" alt="coin">
            <!--<span v-else-if="dayRewards[day].type === 'gift'">🎁</span>-->
          </div>
        </div>
      </div>
    </div>

    <button 
      :disabled="isCheckingIn || timeLeft > 0" 
      @click="handleCheckIn" 
      class="check-in-button"
    >
      Check in
    </button>
  </div>
</template>

<script>
import confetti from "canvas-confetti";
import { fetchUserData, dailyCheckIn } from "@/api/app";

export default {
  name: "DailyCheckIn",
  data() {
    return {
      stars: 0,
      tomatoes: 4000,
      tickets: 3,
      isCheckingIn: false,
      message: "",
      lastCheckIn: null,
      timeLeft: 0,
      checkInCount: 0,
      dayRewards: {
  1: { type: 'points', value: 10 },
  2: { type: 'points', value: 15 },
  3: { type: 'points', value: 20 },
  4: { type: 'points', value: 30 },
  5: { type: 'points', value: 40 },
  6: { type: 'points', value: 50 },
//  6: { type: 'gift', value: null },
  7: { type: 'points', value: 100 },
},
    };
  },
  async mounted() {
    await this.loadUserData();
    this.calculateTimeLeft();
    this.startTimer();
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

  try {
    const result = await dailyCheckIn();

    if (result.success) {
      this.lastCheckIn = new Date();
      this.checkInCount = result.checkInCount;
      this.calculateTimeLeft();
      this.startTimer();

      this.launchConfetti();

      // Add a delay of 1 second before transitioning
      setTimeout(() => {
        this.$router.push("/");
      }, 2000);
    }

    this.message = result.message;
  } catch (error) {
    console.error("Check-in error:", error);
    this.message = "Failed to check-in. Try again later.";
  } finally {
    this.isCheckingIn = false;
  }
},
isDayCompleted(day) {
  const currentDay = this.checkInCount % 7;
  return currentDay === 0 ? day <= 7 : day <= currentDay;
}
,
    calculateTimeLeft() {
      if (!this.lastCheckIn) return;

      const now = new Date();
      const nextCheckInTime = new Date(
        this.lastCheckIn.getFullYear(),
        this.lastCheckIn.getMonth(),
        this.lastCheckIn.getDate() + 1,
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
      return `${hours}h ${minutes}m ${secs}s`;
    },
    launchConfetti() {
      const end = Date.now() + 2 * 1000;

      const interval = setInterval(() => {
        const timeLeft = end - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        confetti({
          particleCount: 100,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        });
      }, 250);
    },
  },
};
</script>

<style>
.checkin-bg{
  background-color: #007bff !important;
}
.daily-checkin-container {
  text-align: center;
    padding: 20px;
    display: grid;
    justify-content: center;
    height: 95vh;
}

.daily-checkin-container h3{
  color: #d4edda;
  font-size: 7vw;
}
.daily-checkin-container .hero{
    padding: 0;
    margin: 0;
    max-width: 80%;
    height: auto;
}

.header {
  margin-bottom: 20px;
}

.icon img {
  width: 48px;
}

.rewards-summary {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.reward {
  text-align: center;
}

.reward .value {
  font-size: 24px;
  font-weight: bold;
}

.reward .label {
  font-size: 14px;
}

.progress-table {
  margin: 20px 0;
}

.rewards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.reward-cell {
    padding: 5px;
    text-align: center;
    border-radius: 5px;
    background-color: #006add;
    display: grid;
    align-content: center;
    color: #fff;
    height: 4em;
}


.reward-cell.completed {
  background-color: #d4edda;
  color: black;
}

.reward-details{
  font-size: 3dvh;
    display: flex;
    align-content: center;
    justify-content: center;
}

.reward-details img{
  width: 1em;

}

.full-width {
  grid-column: span 3;
}


.day-number{
  background-color: #538fce;
    text-align: center;
    display: inline;
    width: 20px;
    height: 20px;
    border-radius: 100px;
    justify-content: center;
    align-items: center;
    font-size: 3.5vw;
    position: absolute;
}

.day-number span{
  background-color: #007bff;
    color: #d4edda;
    width: 25px;
    height: 25px;
    border-radius: 100px;
    display: flex
;
    justify-content: center;
    align-items: center;
}

.check-in-button {
  margin-top: 20px;
  font-size: 5vw;
  background-color: #fff;
  color: #007bff;
  border: none;
  border-radius: 100px;
  cursor: pointer;
}
</style>
