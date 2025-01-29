<template>
  <div>
    <div class="shop-header" v-if="activeTab === 0">
      <img src="/assets/star-spinner.gif" alt="star" />
      <span>Star Shop</span>
    </div>
    <div class="shop-header" v-if="activeTab === 1">
      <img src="/assets/star-spinner.gif" alt="star" />
      <span>Ton Shop</span>
    </div>

    <div class="tabs">
      <div class="tabs-header">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab-header', { active: index === activeTab }]"
          @click="setActiveTab(index)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tabs-content">
        <div v-for="(tab, index) in tabs" :key="index" v-show="index === activeTab">
          <slot :name="tab.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Tabs",
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const activeTab = ref(0);

    const setActiveTab = (index) => {
      activeTab.value = index;
    };

    return {
      activeTab,
      setActiveTab,
    };
  },
};
</script>

<style scoped>
.shop-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #27384f;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.shop-header img {
  margin-right: 10px;
}

.tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.tabs-header {
  display: flex;
  justify-content: space-around;
  background-color: #27384f;
}

.tab-header {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  background-color: #213045;
  border: none;
  border-radius: 8px 8px 0 0;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
}

.tab-header.active {
  background-color: #161f2c;
  color: #ffd700;
  border-radius: 8px 8px 0 0;
}

.tabs-content {
  flex-grow: 1;
  background-color: #171f2a;
}
</style>
