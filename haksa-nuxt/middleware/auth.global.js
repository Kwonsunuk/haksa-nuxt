import { useUserStore } from '../stores/userStore'; // Pinia 스토어에서 useUserStore를 가져온다.
import { navigateTo } from 'nuxt/app'; // Nuxt의 navigateTo 함수를 가져온다.

// Nuxt에서 global middleware는 모든 페이지 이동 시 실행된다
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 클라이언트 환경에서만 실행
  if (!import.meta.client) return;

  const userStore = useUserStore();

  // 이미 로그인 되어 있다면 아무것도 하지 않음
  if (userStore.me) return;

  const token = localStorage.getItem('token');
  if (token) {
    await userStore.fetchMe(); // 사용자 상태 복구 시도
  }

  // 로그인 안 된 상태에서 보호된 페이지로 이동할 경우 홈으로 돌려보냄
  const protectedPages = ['/schedule', '/transcript', '/tuition'];
  if (protectedPages.includes(to.path) && !userStore.me) {
    return navigateTo('/'); // 로그인 상태 아니면 홈으로
  }
});
