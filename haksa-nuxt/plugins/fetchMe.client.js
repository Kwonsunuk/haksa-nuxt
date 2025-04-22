// plugins/fetchMe.client.js
import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();

  console.log('[plugin] fetchMe plugin start');

  if (userStore.me) {
    console.log('[plugin] already logged in');
    return;
  }

  const tokenCookie = useCookie('token');
  if (tokenCookie.value) {
    console.log('[plugin] token exists, try fetchMe');
    await userStore.fetchMe();

    // ❗ fetchMe가 끝난 뒤에도 userStore.me가 null이면 로그 출력
    if (!userStore.me) {
      console.warn('[plugin] fetchMe finished, but user not authenticated');
    } else {
      console.log('[plugin] fetchMe finished, user:', userStore.me);
    }
  } else {
    console.log('[plugin] no token, skip fetchMe');
  }
});



/*
[사용자 로그인 성공]
 ↳ 백엔드: JWT 발급 (token + user info 응답)
 ↳ 프론트엔드: 
     - token 저장 (localStorage)
     - user info 저장 (Pinia)

[다음 페이지 이동 시 (middleware/auth.global.js)]
 ↳ 로그인이 필요한 페이지면 로그인 상태 확인
     ↳ 상태 없으면 localStorage에 token 있는지 확인 → fetchMe()

[새로고침 시]
 ↳ Nuxt 플러그인 fetchMe.client.js가 실행됨
     ↳ localStorage에 token 있으면 → fetchMe()로 상태 복원

[로그아웃 시]
 ↳ Pinia 상태, localStorage 초기화 → 홈으로 이동

*/
