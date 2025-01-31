<template>
      <TonConnectButton/>
</template>


<script setup>
import { ref } from 'vue'
import {
TonConnectButton,
useTonAddress,
useTonConnectUI,
} from '@townsquarelabs/ui-vue'
import { useNotification } from '@kyvg/vue3-notification'

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

<style>

  #ton-connect-button > div > tc-root > div{
    width: 100%;
    display: block;
  }
  </style>