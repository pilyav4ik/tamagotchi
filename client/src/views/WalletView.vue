<script setup>
import { useWebAppNavigation } from 'vue-tg';
import TheMenu from '../components/TheMenu.vue'
import PayService from '@/components/PayService.vue';

</script>

<template>
  <main>
    <br><br><br><br><br>
    <PayService/>

    <TheMenu />
  </main>
</template>
