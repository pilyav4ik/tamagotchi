<template>
  <TonConnectComponent/>
  <div class="shop-body">
    <div class="items-container">
      <div 
        class="item" 
        v-for="(item, index) in items" 
        :key="`${item.name}-${index}`" 
        @click="selectAmount(item.amount)"
      >
        <div class="service">
          <img :src="item.icon" :alt="item.name">
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="price-block">
          <img src="/assets/ton.png" alt="Price Icon">
          {{ item.amount }} TON
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { name: "Food", icon: "/assets/food.png", amount: 0.1 },
        { name: "Food", icon: "/assets/food.png", amount: 0.2 },
        { name: "Food", icon: "/assets/food.png", amount: 0.3 },
        { name: "Play", icon: "/assets/play.png", amount: 0.15 },
        { name: "Play", icon: "/assets/play.png", amount: 0.25 },
        { name: "Play", icon: "/assets/play.png", amount: 0.4 },
        { name: "Walk", icon: "/assets/walk.png", amount: 0.15 },
        { name: "Walk", icon: "/assets/walk.png", amount: 0.25 },
        { name: "Walk", icon: "/assets/walk.png", amount: 0.4 },
        { name: "Sleep", icon: "/assets/sleeping.png", amount: 0.15 },
        { name: "Sleep", icon: "/assets/sleeping.png", amount: 0.25 },
        { name: "Sleep", icon: "/assets/sleeping.png", amount: 0.4 }
      ]
    };
  },
  methods: {
    selectAmount(amount) {
      console.log(`Selected amount: ${amount} TON`);
    }
  }
};
</script>

<script setup>
import { ref } from 'vue'
import {
TonConnectButton,
useTonAddress,
useTonConnectUI,
} from '@townsquarelabs/ui-vue'
import { useNotification } from '@kyvg/vue3-notification'
import TonConnectComponent from './TonConnectComponent.vue'

const address = ref(useTonAddress())
const amount = ref(null)
const [tonConnectUI, setOptions] = useTonConnectUI()
const { notify }  = useNotification()

const selectAmount = (amt) => {
amount.value = amt
sendTransaction()
}

const sendTransaction = async () => {
if (amount.value) {
  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
    messages: [
      {
        address: 'UQCf1yNub0zU5tKCsn9Te39ZP1t6vvBfhErXqR1n6tHQOjfz',
        amount: amount.value * 10**9 // 1 TON = 1,000,000,000 nanoton
      }
    ]
  })
} else {
  notify({
    title: 'Amount missed',
    type: 'notification',
    speed: 500,
    duration: 1500,
    ignoreDuplicates: true
  })
}
}
</script>

<style scoped>
#ton-connect-button{
  display: none;
}</style>

<style>

#ton-connect-button button{
width: 100%;
height: 62px !important;
border-radius: 8px !important;
}

.shop-body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 2vh;
}

.shop-body > div:first-child {
  font-weight: bold;
  color: white;
  background-color: #171f2a;
}

.items-container {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(30vw, 1fr));
  gap: 2vw;
  background-color: #212a39;
  align-items: center;
  justify-items: center;
  align-content: flex-start;
  overflow-y: auto;
  scrollbar-width: none;
  padding-bottom: 10vh;
}

.items-container::-webkit-scrollbar {
  width: 6px;
}

.items-container::-webkit-scrollbar-thumb {
  background-color: #27384f;
  border-radius: 5px;
}

.items-container::-webkit-scrollbar-thumb:hover {
  background-color: #3a4a5e;
}

.items-container .item {
  width: 30vw;
  min-height: 120px;
  background-color: #171f2a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  font-family: "Calibri";
}

.item .price-block {
  background-color: #27384f;
  border-radius: 50px;
  padding: 3px 8px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item .price-block > img {
  width: 13px;
  height: 13px;
  margin-right: 5px;
}

.item .name {
  font-size: 1em;
}

.item .service{
  width:fit-content;
}
.item .service img{
  width: 2em;
}

.item-link{
  display: flex
;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;
}

</style>
