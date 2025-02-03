<template>
  <div class="gmenu"> 
    <div ref="activator" class="activator" @click="toggleNav">
      <div class="signal" v-if="hasClickableAction"></div>
      <i
        class="fa fa-bolt"
        aria-hidden="true"
      ></i>
    </div>
    <nav ref="nav">
      <div class="button-game">
        <span
          v-for="action in actions"
          :key="action.type"
          :class="[action.type, { disabled: !action.isClickable, enable: action.isClickable }]"
          @click="handleAction(action)"
        >
          <div class="button">
            <i :class="action.icon"></i>
          </div>
          <span class="timer" v-if="!action.timer">{{ formatTime(action.type) }}</span>
          <span class="timer" v-if="action.timer > 0">{{ formatTime(action.timer) }}</span>
        </span>
      </div>
    </nav>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import gsap from 'gsap';
import { updateTimers, fetchUserTimers } from '@/api/app';
import { useScoreStore } from '@/stores/score';

export default {
  setup() {
    const store = useScoreStore();
    const activator = ref(null);
    const nav = ref(null);
    const toggle = ref(false);
    let tl;

    const actions = ref([
      { type: 'eat', timer: 0, isClickable: true, icon: 'fas fa-utensils', duration: 18000, score: 20 },
      { type: 'walk', timer: 0, isClickable: true, icon: 'fas fa-shoe-prints', duration: 21600, score: 35 },
      { type: 'play', timer: 0, isClickable: true, icon: 'fas fa-gamepad', duration: 32400, score: 50 },
      { type: 'sleep', timer: 0, isClickable: true, icon: 'fas fa-bed', duration: 39600, score: 75 },
    ]);

    const hasClickableAction = computed(() => actions.value.some(action => action.isClickable));



    const toggleNav = () => {
      toggle.value = !toggle.value;
      toggle.value ? tl.play() : tl.reverse();
    };

    // ButtonsGame logic
    const startTimer = (action, remainingTime = action.duration) => {
      action.timer = remainingTime;
      action.isClickable = false;

      const interval = setInterval(() => {
        action.timer -= 1;

        if (action.timer <= 0) {
          clearInterval(interval);
          action.isClickable = true;
        }
      }, 1000);
    };

    const handleAction = (action) => {
      if (!action.isClickable) return;

      store.add(action.score);
      const startTime = Date.now();
      const remainingTime = action.duration * 1000;

      updateTimers({ [action.type]: { startTime, remaining: remainingTime } });
      startTimer(action);
    };

    const formatTime = (seconds) => {
      if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} h`;
      } else if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} m`;
      }
      return `${seconds}`;
    };

    const syncTimers = async () => {
      const timers = await fetchUserTimers();
      const now = Date.now();

      actions.value.forEach((action) => {
        const timerData = timers[action.type];
        if (timerData) {
          const elapsed = now - timerData.startTime;
          const remaining = Math.max(0, Math.floor((timerData.remaining - elapsed) / 1000));
          action.timer = remaining;
          action.isClickable = remaining === 0;
          if (remaining > 0) startTimer(action, remaining);
        }
      });
    };
    // Lifecycle hooks
    onMounted(async () => {
      // GSAP Animation
      tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      tl.to(activator.value, {
        background: '#805ad5',
        borderRadius: '5em 0 0 5em',
        width: 'auto'
      });
      tl.to(nav.value, {
        clipPath: 'ellipse(100% 100% at 50% 50%)'
      }, "-=0.5");
      tl.to(nav.value.querySelectorAll('.button'), {
        opacity: 1,
        transform: 'translateX(0)',
        stagger: 0.05
      }, "-=0.5");
      tl.pause();

      // ButtonsGame init
      await syncTimers();
      window.addEventListener('reduce-timer', handleReduceTimer);
    });

    onUnmounted(() => {
      window.removeEventListener('reduce-timer', handleReduceTimer);
    });

    const handleReduceTimer = (event) => {
      const { type, seconds } = event.detail;
      const action = actions.value.find((a) => a.type === type);
      if (action) {
        action.timer = Math.max(0, action.timer - seconds);
        action.isClickable = action.timer === 0;
      }
    };

    return { activator, nav, toggleNav, actions, handleAction, formatTime, hasClickableAction };
  }
};
</script>

<style scoped>
.gmenu {
  display: flex;
}

.activator {
  width: 74px !important;
  background: rgb(30,33,41);
  cursor: pointer;
  padding: 1em;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.activator:hover {
  background: rgb(30,33,41);
}

.activator i{
  font-size: 26px;
}

.signal{
  position: absolute;
    margin-top: -50px;
    margin-left: -42px;
    width: 15px;
    height: 15px;
    background-color: rgb(255, 0, 0);
    border-radius: 100px;
}
nav {
  width: 100%;
  background: rgb(128, 90, 213);
  border-radius: 0 5em 5em 0;
  padding: .5em;
  clip-path: ellipse(0% 0% at 50% 50%);
}

.button-game {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  font-size: 21px;
  width: 100%;
  padding-right: 6px;
}

.enable {
  border-radius: 100em;
    height: 2.5em;
    width: 2.5em;
    display: flex;
    text-align: center;
    align-items: center;
    color: antiquewhite;
    background-color: #ffffff;
    flex-wrap: wrap;
    flex-direction: column;
    align-content: center;
    justify-content: flex-end;
}

.disabled {
  border-radius: 100em;
  height: 2.5em;
  width: 2.5em;
  display: flex;
  text-align: center;
  align-items: center;
  color: gray;
  background: rgb(173, 135, 255);
  pointer-events: none;
  cursor: not-allowed;
  flex-direction: column;
  justify-content: space-evenly;
  padding-top: 0.7em;
}

.enable:active {
  background-color: darkgray;
}

.enable .timer{
  position: relative;
    top: 0.2em;
}


.timer {
  font-family: "Calibri";
  font-size: 0.8em;
  color: #000;
  background-color: #fff;
  border-radius: 0.3em;
  padding: 0 0.1em;
  line-height: 18px;
}

.button {
  opacity: 0;
  transform: translateX(-20px);
}

.enable{
  color: #000;
}


.button-pay{
  border: 1px solid #000;
  padding: 4px 9px;
  border-radius: 80px;
}

.button{
  top: 3px;
  position: relative;
}

.disabled i{
  top: -5px;
  position: relative;
}
</style>