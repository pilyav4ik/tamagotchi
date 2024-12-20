import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PetSelectionView from '@/views/PetSelectionView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { backgroundColor: '#f0f8ff' },
      screenOrientation: 'autoRotate:disabled', 
    },
    {
      path: '/checkin',
      name: 'checkin',
      component: () => import('../views/CheckInView.vue'),
      meta: { backgroundColor: '#ffffff' }, 
      screenOrientation: 'autoRotate:disabled',
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('../views/TasksView.vue'),
      meta: { backgroundColor: '#f0f8ff' }, 
      screenOrientation: 'autoRotate:disabled', 
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FriendsView.vue'),
      meta: { backgroundColor: '#ffffff' }, 
      screenOrientation: 'autoRotate:disabled', 
    },
    {
      path: '/select-pet',
      name: 'select-pet',
      component: () => import('../views/PetSelectionView.vue'),
      screenOrientation: 'autoRotate:disabled', 
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
      screenOrientation: 'autoRotate:disabled', 
    },
  ],
});

router.afterEach((to) => {
  const metaTag = document.querySelector('meta[http-equiv="ScreenOrientation"]');
  if (metaTag) {
    metaTag.setAttribute('content', to.meta.screenOrientation || 'autoRotate:enabled');
  } else {
    const newMetaTag = document.createElement('meta');
    newMetaTag.setAttribute('http-equiv', 'ScreenOrientation');
    newMetaTag.setAttribute('content', to.meta.screenOrientation || 'autoRotate:enabled');
    document.head.appendChild(newMetaTag);
  }
});

router.beforeEach((to, from, next) => {
  // Change background color depending on meta.backgroundColor
  const color = to.meta.backgroundColor || '#ffffff'; // Color by default
  document.body.style.backgroundColor = color;
  next();
});

export default router;
