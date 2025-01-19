<template>
  <div class="shop-body">
    <div class="shop-header">
      <img src="/assets/star-spinner.gif" alt="star">
      <span>Star Shop</span>
    </div>

    <div class="items-container">
      <div class="item" v-for="(item, index) in items" :key="index">
        <a @click.prevent="openInvoice(item.link, item.type, item.hours, item.price)" class="item-link">
          <div class="service">
            <img :src="item.serviceImg" alt="Service Image">
          </div>
          <div>{{ item.name }}</div>
          <div class="price-block">
            <img :src="item.priceImg" alt="Price Icon"> {{ item.price }}
          </div>
        </a>
      </div>
    </div>
  </div>

  <TheMenu />
</template>


<script setup>
import { useWebAppNavigation } from 'vue-tg';
import TheMenu from '@/components/TheMenu.vue';
import { reduceTimer } from '@/api/app';
import { ref } from 'vue';


const webAppNavigation = useWebAppNavigation();

const actions = ref([]);

const fetchActions = async () => {
  const currentTimers = await fetchUserTimers(); // Get timers from the server
  actions.value = Object.keys(currentTimers).map((key) => ({
    type: key,
    timer: currentTimers[key].remaining,
    isClickable: currentTimers[key].remaining === 0,
  }));
};

fetchActions(); // Function call at initialization


const createInvoice = async (link, type, hours, price) => {
  try {
    const response = await fetch(`/tg/${link}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
    link: link,
    type: type,
    hours: hours,
    status: status,
  }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error creating invoice: ${error.message}`);
    return { success: false, data: error.message };
  }
};


const processInvoice = async (link, type, hours, status) => {
  try {
    const response = await fetch(`/tg/${link}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
    link: link,
    type: type,
    hours: hours,
    status: status,
  }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error processing invoice: ${error.message}`);
  }
};

const openInvoice = async (link, type, hours, price) => {
  const result = await createInvoice(link, type, hours, price);
  const actionTypeMapping = {
  food: 'eat',
  play: 'play',
  walk: 'walk',
  sleep: 'sleep',
};

  if (result.success) {
    const invoiceLink = result.data;
    webAppNavigation.openInvoice(invoiceLink, async (status, url) => {
      console.log(`Invoice URL: ${url}`);
      console.log(`Invoice status: ${status}`);

      await processInvoice(link, type, hours, status);


      // ***Change status to 'paid' on production*** //
      if (status === 'cancelled') {
        const reduceSeconds = hours * 3600;

        try {
          // Convert actionType before calling reduceTimer
          const mappedActionType = actionTypeMapping[type];
          if (!mappedActionType) {
            throw new Error(`Unknown action type: ${type}`);
          }

          await reduceTimer(mappedActionType, reduceSeconds);

          // Update the local state of the timers
          const action = actions.value.find((a) => a.type === type);
          if (action) {
            action.timer = Math.max(0, action.timer - reduceSeconds);
            action.isClickable = action.timer === 0;
          }
        } catch (err) {
          console.error('Error while reducing timer:', err.message);
        }
      // ***Change status to 'cancelled' on production*** //
    } else if (status === 'paid') {
        console.log('User cancelled payment')
      }
    });
  } else {
    console.error(`Error: ${result.data}`);
  }
};

const items = [
  { id: 1, name: 'Food -30m', serviceImg: '/assets/food.png', priceImg: '/assets/tgstar.png', price: 50, type: 'food', hours: 1, link: 'getFoodInvoiceLinkOneHour' },
  { id: 2, name: 'Food -1h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 100, type: 'food', hours: 3, link: 'getFoodInvoiceLinkThreeHour' },
  { id: 3, name: 'Food -2h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 150, type: 'food', hours: 8, link: 'getFoodInvoiceLinkEightHour' },
  { id: 4, name: 'Play -30m', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 50, type: 'play', hours: 1, link: 'getPlayInvoiceLinkOneHour' },
  { id: 5, name: 'Play -2h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 100, type: 'play', hours: 3, link: 'getPlayInvoiceLinkThreeHour' },
  { id: 6, name: 'Play -3h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 150, type: 'play', hours: 8, link: 'getPlayInvoiceLinkEightHour' },
  { id: 7, name: 'Walk -30m', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 50, type: 'walk', hours: 1, link: 'getWalkInvoiceLinkOneHour' },
  { id: 8, name: 'Walk -1h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 100, type: 'walk', hours: 3, link: 'getWalkInvoiceLinkThreeHour' },
  { id: 9, name: 'Walk -2h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 150, type: 'walk', hours: 8, link: 'getWalkInvoiceLinkEightHour' },
  { id: 10, name: 'Sleep -1h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 50, type: 'sleep', hours: 1, link: 'getSleepInvoiceLinkOneHour' },
  { id: 11, name: 'Sleep -3h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 100, type: 'sleep', hours: 3, link: 'getSleepInvoiceLinkThreeHour' },
  { id: 12, name: 'Sleep -4h', serviceImg: '/assets/service.png', priceImg: '/assets/tgstar.png', price: 150, type: 'sleep', hours: 8, link: 'getSleepInvoiceLinkEightHour' },
];

</script>


<style lang="css">
.shop-header {
  flex-direction: column;
}

.shop-header>span {
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
  flex-wrap: nowrap;
  flex-direction: column;
  padding-bottom: 50px;
}

.shop-body>div:first-child {
  font-weight: bold;
  color: white;
  background-color: #171f2a;
  padding: 10px;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.items-container {
  display: grid;
  justify-content: center;
  grid-template-columns: auto auto auto;
  gap: 3vw;
  background-color: #212a39;
  align-items: center;
  justify-items: center;
  align-content: flex-start;
  overflow-y: auto; 
  padding: 10px; 
  scrollbar-width:none;
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
  width: 100px;
  height: 100px;
  background-color: #171f2a;
  border-radius: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: white;
  flex-wrap: wrap;
  flex-direction: column;
}

.item .price-block {
  background-color: #27384f;
  min-width: 40px;
  width: auto;
  border-radius: 50px;
  text-align: center;
  padding: 3px 8px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.item a{
  display: contents;
}
.item .service>img {
  width: 40px;
  height: 40px;


}

.item .price-block>img {
  width: 13px;
  height: 13px;
  margin-right: 5px;
}
</style>