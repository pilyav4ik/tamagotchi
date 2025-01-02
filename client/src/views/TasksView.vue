<template>
  <div class="text-content">

    <ul>
      <li class="list-item">
        <a
          target="_blank"
          class="list-btn"
        >
          <i>
            Connect Wallet
            <br>
            <span class="amount">
              + 1000
            </span>
          </i>
          <span class="task-start">start</span>
          <span class="task-completed">done</span>
        </a>
      </li>
    </ul>

    <ul class="list">
      <Monetag />
    </ul>

    <ul class="list">
      <li class="list-item" v-for="task in sortedTasks" :key="task.id">
        <a
  @click.prevent="task.type === 'subscription' ? checkSubscription(task) : toggleTaskStatus(task)"
  target="_blank"
  class="list-btn"
  :class="{ done: isTaskCompleted(task), checking: checkingTaskId === task.id }"
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
import { completeTask } from '@/api/app';
import { useScoreStore } from '@/stores/score';

import { onMounted, computed } from 'vue'
import { ref } from 'vue';
import TheMenu from '../components/TheMenu.vue'
import Monetag from '@/components/Monetag.vue'

const { tg } = useTelegram()
const app = useAppStore()
const score = useScoreStore();
const checkingTaskId = ref(null);

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
  checkingTaskId.value = task.id;

  // Запускаем анимацию проверки
  setTimeout(async () => {
    try {
      // Call API to save the completed task
      await completeTask(app.user, task);

      // Update task status locally
      app.user.tasks = {
        ...app.user.tasks,
        [task.id]: true,
      };

      // Updating the local score
      const newScore = score.score + task.amount;
      score.setScore(newScore);

    } catch (error) {
      console.error('Error completing task:', error);
      tg.showAlert('Failed to complete task. Please try again.');
    } finally {
      // Removing the check indicator
      checkingTaskId.value = null;
    }
  }, 3000); // The duration matches the animation
}

// Load tasks on mount
onMounted(() => {
  app.fetchTasks()
})
</script>


<style scoped>
.text-content{
  padding-bottom: 2.5em;
}
.checking {
  position: relative;
}

.checking::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  animation: check-animation 0.8s ease-in-out;
  border-radius: 5px;
}

@keyframes check-animation {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

.done {
  text-decoration: line-through;
  color: grey;
  opacity: 0.7;
}
</style>
