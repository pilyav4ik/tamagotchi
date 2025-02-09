<script setup>
const props = defineProps({
  show: Boolean,
  type: String,
  bg: String,
});
const emit = defineEmits(["close"]);
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" @click.self="emit('close')">
      <div :class="['modal-container', type ? `modal-${type}` : '']" :style="{ backgroundImage: `url(${bg})` }">
        <button class="modal-default-button" @click="emit('close')">
                <i class="fa-solid fa-circle-xmark"></i>
            </button>
        <div class="modal-header">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 10000;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);

  display: flex;
  justify-content: center;
  align-items: flex-end;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 100vw;
  height: 90%;
  padding: 20px 30px;
  border-radius: 30px 30px 0 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
}

/* Анимация появления */
.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: translateY(100%);
}

.modal-enter-to {
  opacity: 1;
}

.modal-enter-to .modal-container {
  transform: translateY(0);
}

/* Анимация скрытия */
.modal-leave-from {
  opacity: 1;
}

.modal-leave-from .modal-container {
  transform: translateY(0);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: translateY(100%);
}

.modal-default-button{
    position: absolute;
    right: 0;
    top: 0;
    margin-top: 15px;
    margin-right: 15px;
    border-radius: 100px;
    border: 0;
    color: white;
    font-size: 2em;   
    background-color:transparent;
}

.modal-footer{
  width: 100vw;
}

</style>
