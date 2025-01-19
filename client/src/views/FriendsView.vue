<template>
  <div class="page">
    <div class="text-content invites">
    <h1>
      <span>
        Invite friends
      </span>
    </h1>

    <div class="center buttons">
      <button class="share" @click="share">Invite friends</button>

      <button class="referal" @click="copy">
        <span v-html="referalText"></span>
      </button>
    </div>

    <h3 v-if="friends.length === 0">No friends yet</h3>

    <ul class="list">
  <li class="list-item" v-for="friend in friends" :key="friend.id">
    <img :src="friend.photo" alt="Pet photo" class="pet-photo" />
    <span class="friend-name">{{ friend.name }}</span>
    <span class="list-btn done">+50</span>
  </li>
</ul>
  </div>
  <TheMenu />
  </div>
</template>

<script setup>
import { useTelegram } from '@/services/telegram'
import { useAppStore } from '@/stores/app'
import { fetchFriendPet } from '@/api/app'
import { ref, onMounted } from 'vue'
import TheMenu from '../components/TheMenu.vue'

const app = useAppStore()
const { user } = useTelegram()

const referalText = ref('<i class="fa-regular fa-copy"></i>') // Установка начальной иконки

const friends = ref([]);

async function loadFriends() {
  const friendIds = Object.keys(app.user.friends);
  
  const friendDataPromises = friendIds.map(async (id) => {
    const pet = await fetchFriendPet(id); // Получаем данные о питомце
    return {
      id,
      name: app.user.friends[id],
      photo: pet ? `/assets/pets/${pet.type.toLowerCase()}-sm.webp` : '/assets/pets/default_pet.png', // Задаем фото питомца
    };
  });

  friends.value = await Promise.all(friendDataPromises);
}

function copy() {
  navigator.clipboard.writeText(
    'https://t.me/tamagotchicrypto_bot?start=' + user?.id
  )
  referalText.value = '<i class="fa-solid fa-circle-check"></i>' // Изменяем текст на "Copied!"
  setTimeout(() => {
    referalText.value = '<i class="fa-regular fa-copy"></i>' // Возвращаем иконку
  }, 1000) // Через 1 секунду
}

function share() {
  const url = "https://t.me/tamagotchicrypto_bot?start=" + user?.id
  const comment = "Hey buddy! Check out Tamagotchi! Join now and level up your pet!"
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(comment)}`, '_blank')
}

onMounted(() => {
  loadFriends();
});
</script>


<style scoped>
.invites h1{
  font-size: 6lvw;
  text-transform: uppercase;
}

.list-item{
  color: black;
  align-items: center;
}
.list-item .image{
  background-color: wheat;
    width: 12vw;
    height: 12vw;
    border-radius: 100px;
}

.image img{
  width: 12vw;
}
.list-item .name{
  white-space: nowrap;
    overflow: hidden;
    padding: 5px;
    text-overflow: ellipsis;
    width: 15em;
}

.friend-name{
  flex-grow: 2;
  width: 80vw;
}
.list-btn{
  flex-grow: 1;
  width: 20vw;
  text-align: right;
  padding-left: 7vw;
}
.buttons{
  display: flex;
  flex-wrap: wrap;
}

.buttons button{
  margin: 0.5vh;
  border: 0;
  border-radius: 100px;
}
.buttons .share{
  display: block;
  background-color: blue;
  padding: 0.8em;
  flex-grow: 8;
  color: #ffffff;
  font-size: 5vw;
}

.buttons .referal{
  flex-grow: 1;
  width: 3em;
  background-color: blue;
  color: #ffffff;
}

.buttons .referal span{
  font-size: 1.5em;
}

.image{
  background-size: cover;
}

.pet-photo{
  width: 4em;
}

.friend-name{
  width: 100%;
}
</style>