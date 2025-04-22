// stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () =>{
  const me = ref(null); // 사용자 정보
  const token = ref(null); // JWT 토큰

  // 로그인
  async function login(student_id, password) {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id,
        password,
      }),
    });

    if(!response.ok) throw new Error('로그인 실패');

    const data = await response.json();
    me.value = data.student;
    token.value = data.token;

    // 로컬 스토리지에 JWT 토큰 저장
    localStorage.setItem('token', token.value);
  }

  // 토큰으로 유저 정보 재인증
  async function fetchMe() {
    const response = await fetch('http://localhost:4000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      me.value = data.student;
      token.value = data.token;
    } else {
      logout();
    }
  }

  // 로그아웃
  function logout() {
    me.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    me,
    token,
    login,
    fetchMe,
    logout,
  };
})
