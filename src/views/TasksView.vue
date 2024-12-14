<template>
  <div class="text-content">
    <h1 class="tasks-h1">Your tasks</h1>
    <h3 v-if="sortedTasks.length === 0">Loading tasks...</h3>
    <ul class="list">
      <li class="list-item" v-for="task in sortedTasks" :key="task.id">
        <a
          @click.prevent="toggleTaskStatus(task)"
          target="_blank"
          class="list-btn"
          :class="{ done: isTaskCompleted(task) }"
        >
          <i>
            {{ task.title }}
            <br>
            <span class="amount">
              + {{ task.amount }}
            </span>
          </i>
          <span class="task-start">start</span>
          <span class="task-completed">done</span>
        </a>
      </li>
    </ul>
  </div>
  <TheMenu />
</template>

<script setup>
import { useTelegram } from '@/services/telegram'
import { useAppStore } from '@/stores/app'
import { onMounted, computed } from 'vue'
import TheMenu from '../components/TheMenu.vue'

const { tg } = useTelegram()
const app = useAppStore()

// Computable task list with sorting
const sortedTasks = computed(() => {
  return [...app.tasks].sort((a, b) => {
    const aDone = app.user?.tasks?.[a.id] || false
    const bDone = app.user?.tasks?.[b.id] || false
    return aDone - bDone // Unfulfilled tasks come first
  })
})

// Check if the task is completed
function isTaskCompleted(task) {
  return app.user?.tasks?.[task.id] || false
}

// Handling task status switching
function toggleTaskStatus(task) {
  const currentStatus = isTaskCompleted(task)
  app.user.tasks = {
    ...app.user.tasks,
    [task.id]: !currentStatus,
  }

  // Send changes to the server
  app.updateTaskStatus(task.id, !currentStatus)
}

// Load tasks on mount
onMounted(() => {
  app.fetchTasks()
})
</script>

<style scoped>
html, body {
  background-color: aqua !important;
}
</style>
