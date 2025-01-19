import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
    createTonConnectUIProvider,
    TonConnectUIContext,
    TonConnectUIOptionsContext,
  } from "ton-ui-vue";
  
import App from './App.vue'
import router from './router'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { Buffer } from "buffer";

window.Buffer = Buffer;


const { tonConnectUI, setOptions } = createTonConnectUIProvider({
    manifestUrl:
      "https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt",
  });


const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.provide(TonConnectUIContext, tonConnectUI);
app.provide(TonConnectUIOptionsContext, setOptions);

app.mount('#app')
