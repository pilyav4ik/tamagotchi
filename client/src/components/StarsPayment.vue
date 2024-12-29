<template>
    <div class="star-payment">
      <h3>Оплатите Stars</h3>
      <input
        type="number"
        v-model="amount"
        placeholder="Введите сумму"
        class="input"
      />
      <button @click="handlePayment" class="button">Оплатить</button>
      <p v-if="paymentUrl">
        <a :href="paymentUrl" target="_blank">Перейти к оплате</a>
      </p>
    </div>
  </template>
  
  <script>
  import { createPayment } from "@/services/starsApi";
  
  export default {
    data() {
      return {
        amount: 0,
        paymentUrl: null,
      };
    },
    methods: {
      async handlePayment() {
        try {
          const payment = await createPayment(this.amount, "Оплата Stars для Tamagotchi");
          this.paymentUrl = payment.url; // Ссылка для оплаты
        } catch (error) {
          alert("Ошибка при создании платежа");
        }
      },
    },
  };
  </script>
  
  <style>
  .star-payment {
    margin: 20px;
  }
  .input {
    margin: 10px 0;
    padding: 5px;
    width: 100%;
  }
  .button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  .button:hover {
    background-color: #45a049;
  }
  </style>
  