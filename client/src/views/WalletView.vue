<script setup>
import TheMenu from '../components/TheMenu.vue'
import TonConnectComponent from '../components/TonConnectComponent.vue';

</script>

<template>
  <div class="page">
    <main>
    <TonConnectComponent/>

    <TheMenu />
  </main>
  </div>
</template>


<style scoped>
  #ton-connect-button{
    padding-top: 10vh;
  }
  </style>