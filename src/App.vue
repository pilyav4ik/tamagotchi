<template>
  <main class="game" v-if="loaded">
    <div class="page">
      <RouterView />
    </div>
    <TheMenu />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheMenu from './components/TheMenu.vue'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { useTelegram } from '@/services/telegram'
import { fetchPet } from '@/api/app'
import { useRouter } from 'vue-router'

const loaded = ref(false)
const app = useAppStore()
const router = useRouter()

const { tg } = useTelegram()

const urlParams = new URLSearchParams(window.location.search)

app.init(urlParams.get('ref')).then(async () => {
  const pet = await fetchPet()
  if (!pet || !pet.id) {
    router.push('/select-pet') // Перенаправление на страницу выбора питомца
  }
  loaded.value = true
})

onMounted(() => {
  tg.ready()
  tg.expand()
})
</script>
