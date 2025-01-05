<template>
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
    }"
  >
  </div>
</template>

<script>

import { fetchUserData } from "@/api/app"; // Импорт функции
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useTelegram } from "@/services/telegram";
import { fetchPet } from "@/api/app";
import { useRouter } from "vue-router";
import bgImage from "@/assets/splash.png";

export default {
  name: "App",
  data: () => ({
    loading: true,
  }),
  // Fix in mounted hook
async mounted() {
  const router = useRouter(); // Ensure router instance is available
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
      router.push("/");
    }
  } catch (error) {
    console.error("Check-ins error:", error);
  } finally {
    this.loading = false;
  }
},
};
</script>

<script setup>
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useTelegram } from "@/services/telegram";
import { fetchPet, fetchUserData } from "@/api/app";
import { useRouter } from "vue-router";
import bgImage from "@/assets/splash.png";

const loaded = ref(false);
const app = useAppStore();
const router = useRouter();

const { tg } = useTelegram();

const urlParams = new URLSearchParams(window.location.search);

app.init(urlParams.get("ref")).then(async () => {
  const pet = await fetchPet();
  if (!pet || !pet.id) {
    router.push("/select-pet"); // Redirects to the pet selection page
  }
  loaded.value = true;
});

onMounted(() => {
  tg.ready();
  tg.expand();
});
</script>
