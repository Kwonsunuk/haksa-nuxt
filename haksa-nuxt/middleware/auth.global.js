// middleware/auth.global.js
import { useUserStore } from '~/stores/userStore';
import { useAdminStore } from '~/stores/adminStore';
import { useCookie } from '#app';
import { navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // 클라이언트 전용
  if (!import.meta.client) return;

  const userStore = useUserStore();
  const adminStore = useAdminStore();

  // ——————————————————————
  // 1) 학생 인증 복구
  // ——————————————————————
  if (!userStore.me) {
    const token = useCookie('token').value;
    if (token) {
      await userStore.fetchMe();
    }
  }

  // ——————————————————————
  // 2) 관리자 인증 복구
  // ——————————————————————
  if (!adminStore.me) {
    const adminToken = useCookie('admin_token').value;
    if (adminToken) {
      await adminStore.fetchMe();
    }
  }

  // ——————————————————————
  // 3) 페이지 보호
  // ——————————————————————
  const studentOnly = ['/schedule', '/transcript', '/tuition'];
  const adminOnly = ['/admin', '/admin/announcements'];

  // 학생 전용 페이지 접근 제어
  if (studentOnly.includes(to.path) && !userStore.me) {
    return navigateTo('/');
  }

  // 관리자 전용 페이지 접근 제어
  if (adminOnly.some((p) => to.path.startsWith(p)) && !adminStore.me) {
    return navigateTo('/admin/login');
  }

  // 모두 통과하면 아무 동작 없이 내비게이션 계속
});
