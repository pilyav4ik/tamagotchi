<template>
  <div class="page">
    <div class="text-content invites">

      <div class="buttons-block">
        <div class="center buttons">
      <button class="share" @click="share">Invite friends</button>

      <button class="referal" @click="copy">
        <span v-html="referalText"></span>
      </button>
    </div>
      </div>

    <h3 v-if="friends.length === 0">No friends yet</h3>

    <div class="list">
  <div class="list-item" v-for="friend in friends" :key="friend.id">
    <div class="photo">
    <img :src="friend.photo" alt="Pet photo" />
    </div>
    <div class="info-container">
      <span class="friend-name">{{ friend.name }}</span>
    <span class="friend-score">{{ friend.score }}</span>
    </div>
  </div>
</div>
  </div>
  <TheMenu />
  </div>
</template>

<script setup>
import { useTelegram } from '@/services/telegram'
import { useAppStore } from '@/stores/app'
import { fetchFriendData } from '@/api/app'
import { ref, onMounted } from 'vue'
import TheMenu from '../components/TheMenu.vue'

const app = useAppStore()
const { user } = useTelegram()

const referalText = ref('<i class="fa-regular fa-copy"></i>') // Установка начальной иконки

const friends = ref([]);

async function loadFriends() {
  const friendIds = Object.keys(app.user.friends);

  const friendDataPromises = friendIds.map(async (id) => {
    const { pet, score } = await fetchFriendData(id); // Получаем данные о питомце и счете

    return {
      id,
      name: app.user.friends[id],
      photo: pet ? `/assets/pets/${pet.type.toLowerCase()}-icon.png` : '/assets/pets/giraffe-icon.png', // Задаем фото питомца
      score: score
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


<style>

.friends-bg{
  background-image: url('./assets/friends.webp');
  background-position: center bottom;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: contain;
  background-color: #d4bdb3 !important;
  padding-top: 19vh;
}
</style>


<style scoped>
.invites h1{
  font-size: 6lvw;
  text-transform: uppercase;
}

.list{
  display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    justify-content: center;
    padding-top: 2.5vh;
  padding-bottom: 10vh;
}
.list ul{
  list-style-type: none;
}

.list-item{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: black;
  align-items: center;
  list-style-type: none;
  background-color: #ccada0;
  border-radius: 100px;
  margin-bottom: 1.2vh;
  padding-right: 2vw;
}

.list-item .photo{
  width: fit-content;
  height:fit-content;
  background-color: #ffffff;
  border-radius: 100px;
  display: inline-block;
  padding: 0.2em;
}
.list-item img{
  width:fit-content;
    background-color: #ffffff;
    border-radius: 100px;
    overflow: visible;
}

.list-item .friend-name{
  font-size: 1.2em;
  font-weight: 600;
  color: black;
  padding-left: 4vw;
}

.list-item .friend-score{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4vh;
  min-width: 4em;
  background-color: #9b7a6d;
  padding: 3vw;
  border-radius: 100px;
  font-family: Arial, Helvetica, sans-serif;
  color: #d8c2b8;
}
.list-btn{
  flex-grow: 1;
  width: 20vw;
  text-align: right;
  padding-left: 7vw;
}

.info-container{
  width: 100%;
  display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
}

.buttons-block{
  position: fixed;
  top: 10vh;
  left: 0;
  width: 100%;
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

</style>