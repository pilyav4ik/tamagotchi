<template>
  <div class="promotion-list">
    <div class="action">
      <span v-for="(modal, index) in modals" :key="index" class="action__icon" @click="openModal(index)">
        <span class="name">{{ modal.actionName }}</span>
        <img :src="modal.icon" />
      </span>
    </div>
  </div>

  <Teleport to="body">
    <modal v-for="(modal, index) in modals" 
    :key="index" 
    :show="modal.show" 
    :type="'custom-' + index"
    :bg="modal.bg"
    @close="closeModal(index)">

      <template #footer>
        <div class="submit-button">
          <a @click="() => openInvoice(modal.invoiceLink)" >
            <span>
            make transaction
          </span>
          </a>
          <img src="/assets/tgstar-dark.png" width="25px" />
          <span>
            {{ modal.price }}
          </span>
        </div>
      </template>

    </modal>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useWebAppNavigation } from 'vue-tg';
import {getPromotions} from '@/api/app'
import Modal from './Modal.vue';

/*
****************************** DEMO DATA **********************************

  const modals = ref([
  { show: false, header: '', body: '', buttonText: '', bg: 'assets/promo-1.webp', actionName: '10k', price: 100, invoiceLink:'/tg/getMainAction' },
  { show: false, header: '', body: '', buttonText: '', bg: 'assets/promo-2.webp', actionName: '20k', price: 1000, invoiceLink:'/tg/getMainAction' },
]);

 */
const modals = ref([]);

const loadPromotions = async () => {
  const data = await getPromotions();
  console.log('Promotions:', data);

    modals.value = data.map((promo) => ({
      show: promo.show || false,
      header: promo.header || '',
      body: promo.body || '',
      buttonText: promo.buttonText || '',
      icon: promo.icon || '',
      bg: promo.bg || '',
      actionName: promo.actionName || '',
      price: promo.price || 0,
      invoiceLink: promo.invoiceLink || '',
    }));
};



const openModal = (index) => {
  modals.value[index].show = true;
};

const closeModal = (index) => {
  modals.value[index].show = false;
};

defineProps({
  body: {
    type: String,
    required: true
  }
});


const webAppNavigation = useWebAppNavigation();

const fetchInvoiceLink = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting invoice link: ${error.message}`);
    return { success: false, data: error.message };
  }
};


const openInvoice = async (endpoint) => {
  const result = await fetchInvoiceLink(endpoint);

  if (result.success) {
    const invoiceLink = result.data;
    webAppNavigation.openInvoice(invoiceLink, (url, status) => {
      console.log(`Invoice opened with status: ${status}`, `URL: ${url}`);
    });
  } else {
    console.error(`Error: ${result.data}`);
  }
};


onMounted(loadPromotions)
</script>


<style>
.promotion-list {
  position: absolute;
  right: 1.5vw;
  top: 49vh;
  z-index: 100;
}

.action {
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 6px;
  border-radius: 10px;
}

.action .action__icon:first-child {
  margin-top: 0;
}

.action .action__icon:last-child {
  margin-bottom: 0;
}

.action__icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 30px 0;
}

.action .action__icon {
  margin: 5px 0;
}

.action__icon img {
  width: 50px;
  height: 50px;
}

.action__icon .name {
  position: absolute;
  background-color: antiquewhite;
  padding: 2px 4px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-top: 45px;
}

.modal-custom-0 {
  background-color: #342619;
  background-image: url('../assets/purchase.jpg');
  background-size:contain;
  background-position: top center;
  background-repeat:no-repeat;
}

.modal-custom-1 {
  background-color: #342619;
  background-image: url('../assets/purchase.jpg');
  background-size:contain;
  background-position: top center;
  background-repeat:no-repeat;
}

.submit-button {
  padding: 20px 0;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(129deg, rgb(255, 196, 0) 15%, rgba(252, 215, 0, 1) 15%, rgba(252, 215, 0, 1) 30%, rgba(255, 196, 0) 30%, rgba(255, 196, 0) 60%, rgba(252, 210, 1, 1) 60%, rgba(252, 215, 0, 1) 75%, rgba(255, 196, 0) 75%);
  border-radius: 20px;
  text-align: center;

}

.submit-button span {
  font-size: 1.4em;
  text-transform: uppercase;
  color: #5a3000;
  font-weight: bold;
  font-family: "Roboto";
}

.submit-button img {
  margin: 0 10px;
}
</style>