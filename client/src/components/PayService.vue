<script setup>
import { useWebAppNavigation } from 'vue-tg';

defineProps({
  body: {
    type: String,
    required: true
  }
});

const webAppNavigation = useWebAppNavigation();

const getInvoiceLink = async () => {
  const response = await fetch('/tg/getInvoiceLink', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  });
  const invoiceLink = await response.json();
  return invoiceLink;
};

const openInvoice = async () => {
  const getInvoiceLinkResult = await getInvoiceLink();

  if (getInvoiceLinkResult.success) {
    const invoiceLink = getInvoiceLinkResult.data;
    webAppNavigation.openInvoice(invoiceLink, (url, status) => {});
  } else {
    console.log(getInvoiceLinkResult.data);
  }
};



const getInvoiceLink2 = async () => {
  const response = await fetch('/tg/getInvoiceLink2', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  });
  const invoiceLink = await response.json();
  return invoiceLink;
};

const openInvoice2 = async () => {
  const getInvoiceLinkResult = await getInvoiceLink2();

  if (getInvoiceLinkResult.success) {
    const invoiceLink = getInvoiceLinkResult.data;
    webAppNavigation.openInvoice(invoiceLink, (url, status) => {});
  } else {
    console.log(getInvoiceLinkResult.data);
  }
};
</script>

<template>
    <a @click="openInvoice" class="button-pay">Pay</a>
    <br/>
    <a @click="openInvoice2" class="button-pay">Pay2</a>
</template>
