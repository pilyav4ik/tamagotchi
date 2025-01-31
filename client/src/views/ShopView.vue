<template>
<Tabs :tabs="[
{ label: 'Stars Shop', name: 'tab1' },
{ label: 'TON Shop', name: 'tab2' }

]">
  <template #tab1>
    <div class="shop-body">
    <div class="items-container">
      <div class="item" v-for="(item, index) in items" :key="index">
        <a @click.prevent="openInvoice(item.link, item.type, item.hours, item.price)" class="item-link">
          <div class="service">
            <img :src="item.serviceImg" alt="Service Image">
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="price-block">
            <img :src="item.priceImg" alt="Price Icon"> {{ item.price }}
          </div>
        </a>
      </div>
    </div>
  </div>
  </template>
  <template #tab2>
    <TonDapp/>
  </template>
</Tabs>  

  <TheMenu />
</template>


<script setup>
import { useWebAppNavigation } from 'vue-tg';
import TheMenu from '@/components/TheMenu.vue';
import Tabs from '@/components/Tabs.vue';
import { reduceTimer } from '@/api/app';
import { ref } from 'vue';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@townsquarelabs/ui-vue';
import { useNotification } from '@kyvg/vue3-notification';
import TonDapp from '@/components/TonDapp.vue';

const webAppNavigation = useWebAppNavigation();
const actions = ref([]);


const address = ref(useTonAddress());
const receiver = ref('');
const amount = ref(null);
const [tonConnectUI] = useTonConnectUI();
const { notify } = useNotification();

const selectAmount = (amt) => {
  amount.value = amt;
  sendTransaction();
};

const sendTransaction = async () => {
  if (receiver.value && amount.value) {
    await tonConnectUI.sendTransaction({
      validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
      messages: [{
        address: receiver.value,
        amount: amount.value * 10**9
      }]
    });
  } else {
    notify({
      title: receiver.value ? 'Amount missed' : 'Receiver missed',
      type: 'error',
      duration: 1500
    });
  }
};



// Fetch actions and populate state
const fetchActions = async () => {
  try {
    const currentTimers = await fetchUserTimers(); // Fetch timers from the server
    actions.value = Object.entries(currentTimers).map(([type, { remaining }]) => ({
      type,
      timer: remaining,
      isClickable: remaining === 0,
    }));
  } catch (error) {
    console.error('Error fetching actions:', error);
  }
};

fetchActions();

const sendInvoiceRequest = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error(`Error during invoice request: ${error.message}`);
    return { success: false, data: error.message };
  }
};

const createInvoice = (link, type, hours, price) =>
  sendInvoiceRequest(`/tg/${link}`, { link, type, hours, price });

const processInvoice = (link, type, hours, status) =>
  sendInvoiceRequest(`/tg/${link}`, { link, type, hours, status });

const handleInvoiceStatus = async (link, type, hours, status) => {
  const reduceSeconds = hours * 3600;
  const actionTypeMapping = {
    food: 'eat',
    play: 'play',
    walk: 'walk',
    sleep: 'sleep',
  };

  try {
    const mappedActionType = actionTypeMapping[type];
    if (!mappedActionType) throw new Error(`Unknown action type: ${type}`);

    await reduceTimer(mappedActionType, reduceSeconds);

    const action = actions.value.find((a) => a.type === type);
    if (action) {
      action.timer = Math.max(0, action.timer - reduceSeconds);
      action.isClickable = action.timer === 0;
    }
  } catch (error) {
    console.error('Error reducing timer:', error.message);
  }
};

const openInvoice = async (link, type, hours, price) => {
  const result = await createInvoice(link, type, hours, price);
  if (!result.success) return console.error(`Error: ${result.data}`);

  const invoiceLink = result.data;
  webAppNavigation.openInvoice(invoiceLink, async (status, url) => {
    console.log(`Invoice URL: ${url}`);
    console.log(`Invoice status: ${status}`);

    if (status === 'cancelled') {
      await handleInvoiceStatus(link, type, hours, status);
    } else if (status === 'paid') {
      console.log('User cancelled payment');
    }
  });
};

const createItems = (currencyImg) => [
  { id: 1, name: 'Food -30m', serviceImg: '/assets/food.png', price: 50, type: 'food', hours: 1, link: 'getFoodInvoiceLinkOneHour' },
  { id: 2, name: 'Food -1h', serviceImg: '/assets/food.png', price: 100, type: 'food', hours: 3, link: 'getFoodInvoiceLinkThreeHour' },
  { id: 3, name: 'Food -2h', serviceImg: '/assets/food.png', price: 150, type: 'food', hours: 8, link: 'getFoodInvoiceLinkEightHour' },
  { id: 4, name: 'Play -30m', serviceImg: '/assets/play.png', price: 50, type: 'play', hours: 1, link: 'getPlayInvoiceLinkOneHour' },
  { id: 5, name: 'Play -2h', serviceImg: '/assets/play.png', price: 100, type: 'play', hours: 3, link: 'getPlayInvoiceLinkThreeHour' },
  { id: 6, name: 'Play -3h', serviceImg: '/assets/play.png', price: 150, type: 'play', hours: 8, link: 'getPlayInvoiceLinkEightHour' },
  { id: 7, name: 'Walk -30m', serviceImg: '/assets/walk.png', price: 50, type: 'walk', hours: 1, link: 'getWalkInvoiceLinkOneHour' },
  { id: 8, name: 'Walk -1h', serviceImg: '/assets/walk.png', price: 100, type: 'walk', hours: 3, link: 'getWalkInvoiceLinkThreeHour' },
  { id: 9, name: 'Walk -2h', serviceImg: '/assets/walk.png', price: 150, type: 'walk', hours: 8, link: 'getWalkInvoiceLinkEightHour' },
  { id: 10, name: 'Sleep -1h', serviceImg: '/assets/sleeping.png', price: 50, type: 'sleep', hours: 1, link: 'getSleepInvoiceLinkOneHour' },
  { id: 11, name: 'Sleep -3h', serviceImg: '/assets/sleeping.png', price: 100, type: 'sleep', hours: 3, link: 'getSleepInvoiceLinkThreeHour' },
  { id: 12, name: 'Sleep -4h', serviceImg: '/assets/sleeping.png', price: 150, type: 'sleep', hours: 8, link: 'getSleepInvoiceLinkEightHour' },
].map((item) => ({ ...item, priceImg: currencyImg }));


const createItemsTon = (currencyImg) => [
  { id: 1, name: 'Food -30m', serviceImg: '/assets/food.png', price: 0.15, type: 'food', hours: 1, link: 'getFoodInvoiceLinkOneHour' },
  { id: 2, name: 'Food -1h', serviceImg: '/assets/food.png', price: 0.25, type: 'food', hours: 3, link: 'getFoodInvoiceLinkThreeHour' },
  { id: 3, name: 'Food -2h', serviceImg: '/assets/food.png', price: 0.4, type: 'food', hours: 8, link: 'getFoodInvoiceLinkEightHour' },
  { id: 4, name: 'Play -30m', serviceImg: '/assets/play.png', price: 0.15, type: 'play', hours: 1, link: 'getPlayInvoiceLinkOneHour' },
  { id: 5, name: 'Play -2h', serviceImg: '/assets/play.png', price: 0.25, type: 'play', hours: 3, link: 'getPlayInvoiceLinkThreeHour' },
  { id: 6, name: 'Play -3h', serviceImg: '/assets/play.png', price: 0.4, type: 'play', hours: 8, link: 'getPlayInvoiceLinkEightHour' },
  { id: 7, name: 'Walk -30m', serviceImg: '/assets/walk.png', price: 0.15, type: 'walk', hours: 1, link: 'getWalkInvoiceLinkOneHour' },
  { id: 8, name: 'Walk -1h', serviceImg: '/assets/walk.png', price: 0.25, type: 'walk', hours: 3, link: 'getWalkInvoiceLinkThreeHour' },
  { id: 9, name: 'Walk -2h', serviceImg: '/assets/walk.png', price: 0.4, type: 'walk', hours: 8, link: 'getWalkInvoiceLinkEightHour' },
  { id: 10, name: 'Sleep -1h', serviceImg: '/assets/sleeping.png', price: 0.15, type: 'sleep', hours: 1, link: 'getSleepInvoiceLinkOneHour' },
  { id: 11, name: 'Sleep -3h', serviceImg: '/assets/sleeping.png', price: 0.25, type: 'sleep', hours: 3, link: 'getSleepInvoiceLinkThreeHour' },
  { id: 12, name: 'Sleep -4h', serviceImg: '/assets/sleeping.png', price: 0.4, type: 'sleep', hours: 8, link: 'getSleepInvoiceLinkEightHour' },
].map((item) => ({ ...item, priceImg: currencyImg }));

const items = createItems('/assets/tgstar.png');
const itemsTon = createItemsTon('/assets/ton.png');
</script>

<style lang="css">
.shop-header {
  flex-direction: column;
  padding-top: 30px;
}

.shop-header > span {
  color: white;
  font-size: 7vw;
  font-weight: bold;
}

.shop-bg {
  padding: 0;
  margin: 0;
  background-color: #212a39 !important;
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

#ton-connect-button {
  width: 100% !important;
}

#ton-connect-button button {
  width: 100%;
  height: 62px !important;
  border-radius: 8px !important;
}
</style>
