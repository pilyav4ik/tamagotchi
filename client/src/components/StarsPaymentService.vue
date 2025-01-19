<script setup>
import { useWebAppNavigation } from 'vue-tg';

defineProps({
  body: {
    type: String,
    required: true
  }
});

const webAppNavigation = useWebAppNavigation();

/**
* Generic function for getting invoice link.
* @param {string} endpoint URL for request
* @returns {Promise<object>} Request result
*/
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

/**
 * Universal function to open an account.
 * @param {string} endpoint URL to get a link to the account
 */

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

</script>

<template>
  <a @click="() => openInvoice('/tg/getInvoiceLink')" class="button-pay">Pay</a>
  <br />
  <a @click="() => openInvoice('/tg/getInvoiceLink2')" class="button-pay">Pay2</a>
</template>

<style scoped>
.button-pay{
  border: 1px solid #000;
  padding: 4px 9px;
  border-radius: 80px;
  display: inline-block;
}
</style>