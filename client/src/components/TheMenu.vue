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
    <RouterLink to="/ton" custom v-slot="{ isActive, navigate }">
      <i
        class="menu-button fa-solid fa-wallet"
        :class="{ active: isActive }"
        @click="navigate"
        aria-hidden="true"
      >
      <span>Wallet</span>
    </i>
    </RouterLink>
  </div>
</div>
</template>

<script>
import { RouterLink } from 'vue-router'
</script>

<style>
.menu-block{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.menu {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0.3rem;
  right: 0.3rem;
  justify-content: space-between;
  font-size: 1.2rem;
  background-color: #5b483e;
  border-radius: 20px 20px 0 0;
}

.menu span{
  display: block;
  font-family: Calibri;
  font-weight: lighter;
  font-size: 0.6em;
  color: #ffffff;
  padding-top: 0.3em;
}

.menu-button {
  color: #ffffff;
  cursor: pointer;
  transition: color 0.3s;
  text-align: center;
  padding: 0.3em 0.5em 0.2em 0.5em;
  border-bottom: 2px solid #5b483e;
}
.menu .menu-button.active:first-of-type {
  border-radius: 20px 0 0 0;
}

.menu .menu-button.active:last-of-type {
    border-radius: 0 20px 0 0;
}

.menu-button.active {
  color: #ffffff;
  background-color: #2b221d;
  border-bottom: 2px solid #1d1713;
  cursor: pointer;
}
</style>