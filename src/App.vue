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
export default {
  name: "app",
  data: () => ({
    loading: true,
  }),
  mounted() {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  },
};
</script>

<script setup>
import { RouterView } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useTelegram } from "@/services/telegram";
import { fetchPet } from "@/api/app";
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
    router.push("/select-pet"); // Перенаправление на страницу выбора питомца
  }
  loaded.value = true;
});

onMounted(() => {
  tg.ready();
  tg.expand();
});
</script>
