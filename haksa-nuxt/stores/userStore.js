// stores/userStore.js
import { defineStore } from 'pinia';
import { useCookie } from '#app'; // Nuxt 3에서 쿠키를 사용하기 위한 라이브러리

import { ref } from 'vue';

// 'user'라는 이름으로 Pinia 스토어를 정의.
// 첫 번째 인자는 고유한 스토어 ID로 사용되며, 두 번째 인자는 스토어의 상태와 메서드를 정의하는 함수.
// 이 스토어는 사용자 정보를 관리하는 데 사용됩니다.
export const useUserStore = defineStore('user', () => {
  // 초기값은 null이며, 로그인 성공 시 객체 형태로 저장된다. (ex. { name: '홍길동', student_id: 'S20230001' })
  const me = ref(null); // 사용자 정보 (ex. 이름, 학번)

  // 로그인 시 서버로부터 전달받은 토큰을 저장하고, 요청 시 인증 헤더에 포함하는 데 사용된다.
  const token = ref(null); // JWT 토큰 저장

  // 로그인 함수
  async function login(student_id, password) {
    // student_id와 password를 JSON 형식으로 POST 전송한다.
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // json 형식으로 데이터 전송
      },
      body: JSON.stringify({
        // 입력된 값을 JSON 형식으로 변환
        student_id,
        password,
      }),
    });

    // ✅ 여기에 추가해봐 (응답 확인)
    console.log('[login] response.status:', response.status);

    // 응답 상태가 200이 아닐 경우 에러를 발생시킨다.
    if (!response.ok) throw new Error('로그인 실패');

    // 응답 상태가 200이면 JSON 형식으로 변환하여 사용자 정보와 토큰을 저장한다.
    // JSON 형태로 응답 바디를 파싱
    // 응답 바디는 { student: { name: '홍길동', student_id: 'S20230001' }, token: 'JWT_TOKEN' } 형태이다.
    const data = await response.json();

    // 사용자 정보와 토큰을 반응형 상태로 저장
    me.value = data.student;
    token.value = data.token;
    // ✅ Composition API 안에서 useCookie 호출
    const tokenCookie = useCookie('token', {
      sameSite: 'strict',
    });

    tokenCookie.value = data.token;
    console.log('[login] token saved to cookie:', tokenCookie.value);

    // JWT 토큰을 localStorage에 저장하여 페이지 새로고침 시에도 유지되도록 한다.
    // localStorage는 브라우저에 데이터를 저장하는 방법 중 하나로, 페이지를 새로고침해도 데이터가 유지된다.
    // localStorage.setItem('token', data.token);
    // localStorage에 저장된 토큰을 가져온다.
    localStorage.setItem('token', token.value);
  }

  const isFetching = ref(true); // 데이터 요청 중 상태

  // 토큰으로 유저 정보 재인증(로그인 상태 복원 함수)
  async function fetchMe() {
    console.log('[fetchMe] called');
    isFetching.value = true; // 시작

    // localStorage에 저장된 토큰을 가져온다.
    // 만약 토큰이 없다면 로그아웃 처리한다.
    // localStorage는 브라우저에 데이터를 저장하는 방법 중 하나로, 페이지를 새로고침해도 데이터가 유지된다.
    if (typeof window === 'undefined') {
      isFetching.value = false; // ✅ SSR에서는 아무것도 하지 않으므로 false 처리 필요
      return;
    }

    const tokenCookie = useCookie('token');
    const savedToken = tokenCookie.value;
    if (!savedToken) {
      logout();
      isFetching.value = false; // ✅ 토큰 없으면 즉시 false로 마무리
      return;
    }

    try {
      // 토큰을 Authorization 헤더에 Bearer 토큰을 포함하여 서버에 요청한다.
      // 서버는 이 토큰을 사용하여 사용자의 인증 정보를 확인한다.
      // 응답으로 사용자 정보를 포함한 JSON 데이터를 반환한다.
      // 만약 응답 상태가 200이 아닐 경우 로그아웃 처리한다.
      // fetch는 네트워크 요청을 보내는 함수로, 첫 번째 인자는 요청할 URL, 두 번째 인자는 옵션을 설정하는 객체이다.
      // 이 예제에서는 GET 요청을 보내고, Authorization 헤더에 Bearer 토큰을 포함하여 서버에 요청한다.
      // 응답으로 사용자 정보를 포함한 JSON 데이터를 반환한다.
      const response = await fetch('http://localhost:4000/api/auth/me', {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json(); // 응답을 JSON 형식으로 변환(파싱)
        console.log('[fetchMe] data loaded:', data);
        me.value = data.student; // 사용자 정보 저장
        token.value = savedToken; // 토큰 저장
      } else {
        logout(); // 인증 실패 시 로그아웃
      }
    } catch (err) {
      console.error('[fetchMe] 서버 요청 중 오류 발생:', err);
      logout(); // 네트워크 오류 등 예외 발생 시 로그아웃
    } finally {
      isFetching.value = false; // ✅ 어떤 경우든 최종적으로 false로 설정
    }
  }

  // 로그아웃
  function logout() {
    // 사용자 정보와 토큰을 초기화한다.
    me.value = null;
    token.value = null;
    // localStorage.removeItem('token'); // localStorage에서 토큰을 삭제함으로써 브라우저에 남아있는 로그인 상태 정보를 제거한다.
    localStorage.removeItem('token');
    useCookie('token').value = null; // ✅ 쿠키에서도 제거
  }

  return {
    me,
    token,
    isFetching,
    login,
    fetchMe,
    logout,
  };
});
