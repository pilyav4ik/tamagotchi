<template>
  <div class="page">
    <div class="text-content">
    <ul class="list">
      <Monetag />
    </ul>

    <ul class="list">
      <li class="list-item" v-for="task in sortedTasks" :key="task.id">
        <a
        :href="task.url"
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
  </div>
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
  }, 10000); // The duration matches the animation
}

// Load tasks on mount
onMounted(() => {
  app.fetchTasks()
})
</script>


<style scoped>

.text-content{
  padding-top: 2em;
}

.list {
  font-family: Roboto;
  font-size: 16px;
  padding-top: 2em;
}

.list-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item i{
  font-style: normal;
}

.list-item .task-start {
  background-color: #ffded2;

}

.list-btn .amount {
  color: #fff;
}

.list-btn.done .amount {
  background-color: #C1A99E;
  color: #917a71;
  display: inline-flex;
}

.list-btn {
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #917a71;
  color: #000;
  text-decoration: none;
  width: 100%;
  display:flex;
  justify-content: space-between;
  align-items: center;
}

.list-btn:last-of-type{
  border-bottom: none;
}

.list-btn.done {
  color: #917a71;
  pointer-events: none;
}

.list-btn.done span {
  color: #fff;
  background-color: #d6b7ac;
}

.list-btn.done .task-start{
  display: none;
}
.list-btn .task-completed{
  display: none;
}

.list-btn.done .task-completed{
  display: block;
}

.list-btn.done .task-start{
  display: none;
}

.task-start, .task-completed {
  width:56px !important;
  height:30px !important;
  border-radius: 30px !important;
  padding: 5px 10px;
}


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
  background-color: #c1a89e !important;
}
</style>
