// plugins/fetchMe.client.js
import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();

  console.log('[plugin] fetchMe plugin start');

  // userStore의 me가 이미 존재하면 로그인 상태이므로 fetchMe 호출하지 않음
  if (userStore.me) {
    console.log('[plugin] already logged in');
    return;
  }

  // userStiore의 me가 null이면 로그인 상태가 아니므로 fetchMe 호출
  // ❗ fetchMe는 서버에 요청을 보내므로 async/await 사용
  // ❗ useCookie는 클라이언트에서만 사용 가능하므로 async/await 사용

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
