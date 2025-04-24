// stores/adminStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookie } from '#app'

export const useAdminStore = defineStore('admin', () => {
  const me    = ref(null)
  const token = ref(null)

  async function login(userId, password) {
    const res = await fetch('http://localhost:4000/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => null)
      throw new Error(err?.message || '관리자 로그인 실패')
    }
    const data = await res.json()
    me.value    = data.admin
    token.value = data.token
    // 쿠키에도 저장
    useCookie('admin_token', { sameSite: 'strict' }).value = data.token
    localStorage.setItem('admin_token', data.token)
  }

  // ★ 새로고침 시 토큰으로 상태 복원
  async function fetchMe() {
    console.log('[fetchMe] called');
    const cookieToken = useCookie('admin_token').value
    if (!cookieToken) return

    try {
      const res = await fetch('http://localhost:4000/api/admin/me', {
        headers: { Authorization: `Bearer ${cookieToken}` }
      })
      if (!res.ok) throw new Error('인증 실패')
      const data = await res.json()
      me.value    = data.admin
      token.value = cookieToken
    } catch {
      logout()
    }
  }

  function logout() {
    me.value    = null
    token.value = null
    useCookie('admin_token').value = null
    localStorage.removeItem('admin_token')
  }

  return { me, token, login, fetchMe, logout }
})


