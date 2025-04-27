// haksa-nuxt/stores/adminStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCookie } from '#app';

export const useAdminStore = defineStore('admin', () => {
  const me = ref(null);
  const token = ref(null);

  // 관리자 로그인
  async function login(userId, password) {
    const res = await fetch('http://localhost:4000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.message || '관리자 로그인 실패');
    }
    const { admin, token: t } = await res.json();
    me.value = admin;
    token.value = t;

    // 쿠키에도 저장 (sameSite·secure 권장)
    useCookie('admin_token', { sameSite: 'strict', secure: true }).value = t;
    localStorage.setItem('admin_token', t);
  }

  // 페이지 새로고침 시 토큰으로 상태 복원
  async function fetchMe() {
    if (process.server) return;
    const saved = useCookie('admin_token').value;
    if (!saved) return;

    try {
      const res = await fetch('http://localhost:4000/api/admin/me', {
        headers: { Authorization: `Bearer ${saved}` },
      });
      if (!res.ok) throw new Error('인증 실패');
      const { admin } = await res.json();
      me.value = admin;
      token.value = saved;
    } catch {
      logout();
    }
  }

  // 로그아웃
  function logout() {
    me.value = null;
    token.value = null;
    useCookie('admin_token').value = null;
    localStorage.removeItem('admin_token');
  }

  return { me, token, login, fetchMe, logout };
});
