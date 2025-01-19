<template>
    <li class="paid" :class="remainingTime > 0 ? 'wait' : 'start'">
        <a 
        :disabled="isDisabled" 
        @click="handleClick"
        class="list-btn">
            <i>
                Show Ad
                <br>
                <span class="amount">
              + 50
            </span>
            </i>
            <span class="task-start">
                {{ remainingTime > 0 ? `Wait ${remainingTime}s` : "Start" }}
            </span>
        </a>
    </li>
</template>

<script>
import { ref, onMounted } from "vue";
import { updateTimers, fetchUserTimers } from "@/api/app";
import { useAppStore } from "@/stores/app";

export default {
    name: "Monetag",
    setup() {
        const isDisabled = ref(false);
        const remainingTime = ref(0);
        const timerType = "paid_ad";

        const appStore = useAppStore();

        // Загружаем скрипт рекламы
        const loadAdScript = async () => {
            return new Promise((resolve, reject) => {
                if (window.show_8139969) {
                    resolve(); // Скрипт уже загружен
                    return;
                }

                const script = document.createElement("script");
                script.src = "//doodiwom.com/vignette.min.js";
                script.dataset.zone = "8139969";
                script.dataset.sdk = "show_8139969";
                script.onload = resolve;
                script.onerror = () => reject("Failed to load ad script");
                document.body.appendChild(script);
            });
        };

        const showAd = async () => {
            if (window.show_8139969) {
                return window.show_8139969().then(() => {
                    alert("You have seen an ad!");
                });
            } else {
                console.error("Ad script is not loaded.");
                throw new Error("Ad script is not loaded.");
            }
        };

        const startTimer = async (duration) => {
            const startTime = Date.now();
            const remaining = duration * 1000;

            await updateTimers({
                [timerType]: { startTime, remaining },
            });

            remainingTime.value = duration;
            isDisabled.value = true;

            const interval = setInterval(() => {
                remainingTime.value -= 1;

                if (remainingTime.value <= 0) {
                    clearInterval(interval);
                    isDisabled.value = false;
                }
            }, 1000);
        };

        const syncTimer = async () => {
            const timers = await fetchUserTimers();
            const now = Date.now();

            if (timers[timerType]) {
                const elapsed = now - timers[timerType].startTime;
                const remaining = Math.max(
                    0,
                    Math.floor((timers[timerType].remaining - elapsed) / 1000)
                );

                remainingTime.value = remaining;
                isDisabled.value = remaining > 0;

                if (remaining > 0) {
                    startTimer(remaining);
                }
            }
        };

        const handleClick = async () => {
            if (isDisabled.value) return;

            try {
                await loadAdScript();
                await showAd();

                await appStore.completeTask({
                    id: timerType,
                    amount: 50,
                });

                await startTimer(300);
            } catch (error) {
                console.error("Error completing task:", error);
            }
        };

        onMounted(async () => {
            await syncTimer();
        });

        return {
            isDisabled,
            remainingTime,
            handleClick,
        };
    },
};
</script>

<style scoped>
.paid{
    height: 62px;
    background-color: rgb(221, 169, 0);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
}

.paid a{
    display: contents;
}
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.list .wait a{
    color: #383838;
}
</style>
