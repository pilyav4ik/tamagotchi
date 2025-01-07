<template>
  <div>
    <main class="game" v-if="loaded">
      <div class="page">
        <RouterView />
      </div>
    </main>

    <div
      id="load"
      v-if="loading"
      :style="{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 10000,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }"
    >

    <div class="loading-bar">
        <div
          class="loading-bar-progress"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserData, fetchPet } from "@/api/app"; // Импорт функций
import { RouterView } from "vue-router";
import { ref } from "vue";
import { useRouter } from "vue-router";
import bgImage from "@/assets/splash.png";

export default {
  name: "App",
  data: () => ({
    loading: true,
    progress: 0, // Прогресс загрузки
  }),
  async mounted() {
    const router = useRouter(); // Подключение роутера
    this.simulateLoading(); // Инициация симуляции загрузки

    try {
      const userData = await fetchUserData();
      const today = new Date();
      const lastCheckIn = userData?.last_check_in ? new Date(userData.last_check_in) : null;

      const isTodayCheckedIn =
        lastCheckIn &&
        lastCheckIn.getDate() === today.getDate() &&
        lastCheckIn.getMonth() === today.getMonth() &&
        lastCheckIn.getFullYear() === today.getFullYear();

      if (!isTodayCheckedIn) {
        router.push("/checkin");
      } else {
        const pet = await fetchPet();
        if (!pet || !pet.id) {
          router.push("/select-pet"); // Редирект на выбор питомца
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setTimeout(() => {
        this.loading = false;
      }, 2000); // Минимальное время отображения сплэш-скрина
    }
  },
  methods: {
    simulateLoading() {
      const interval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 10; // Обновление прогресса каждые 200ms
        } else {
          clearInterval(interval);
        }
      }, 200);
    },
  },
};
</script>

<style>
/* Стиль контейнера полосы загрузки */
.loading-bar {
  width: 80%;
  height: 7px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  margin-top: 20px; /* Добавляем отступ для центрации */
}

/* Прогресс полосы */
.loading-bar-progress {
  height: 100%;
  background: #4caf50; /* Зеленый цвет полосы */
  width: 0;
  transition: width 0.2s ease-in-out; /* Плавное увеличение ширины */
}
</style>


<script setup>
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useTelegram } from "@/services/telegram";
import { fetchPet } from "@/api/app";
import { useRouter } from "vue-router";

const loaded = ref(false);
const app = useAppStore();
const router = useRouter();

const { tg } = useTelegram();

const urlParams = new URLSearchParams(window.location.search);

app.init(urlParams.get("ref")).then(async () => {
  const pet = await fetchPet();
  if (!pet || !pet.id) {
    router.push("/select-pet"); // Редирект на выбор питомца
  }
  loaded.value = true;
});

onMounted(() => {
  tg.ready();
  tg.expand();
});
</script>
