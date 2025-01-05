<template>
<div class="menu-block">
  <div class="menu">
    <RouterLink to="/" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-bullseye"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      >
      <span>Play</span>
    </i>
    </RouterLink>
    <RouterLink to="/tasks" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-tasks"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      >
      <span>Task</span>
    </i>
    </RouterLink>
    <RouterLink to="/friends" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-users"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      >
      <span>Frens</span>
    </i>
    </RouterLink>
    <RouterLink to="/leaderboard" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-ranking-star"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      >
      <span>Board</span>
    </i>
    </RouterLink>
    <!-- <RouterLink to="/wallet" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa fa-ranking-star"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      >
      <span>Wallet</span>
    </i>
    </RouterLink>-->
  </div>
</div>
</template>

<script>
import { RouterLink } from 'vue-router'
</script>
