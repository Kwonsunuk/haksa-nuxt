<!-- components/LoginForm.vue -->
<template>
  <!-- 
   <form>: 사용자 입력을 제출하는 영역
    @submit: 제출 이벤트 발생 시 실행
    .prevent: 기본 동작(페이지 새로고침)을 막고 login() 함수만 실행 -->
  <form @submit.prevent="login" class="mb-4 p-3 border rounded bg-light">
    <div class="mb-2">
      <input v-model="student_id" class="form-control" placeholder="학번" />
    </div>
    <div class="mb-2">
      <input v-model="password" type="password" class="form-control" placeholder="비밀번호" />
    </div>
    <button type="submit" class="btn btn-primary w-100">로그인</button>
  </form>
</template>

<script setup>
// Vue 3 Composition API의 ref를 불러옴. - 반응형 변수 생성(v-model과 바인딩하기 위해 필요)
import { ref } from 'vue';
import { useUserStore } from '~/stores/userStore'; // Pinia 스토어 가져오기
// 라우팅을 위한 Nuxt 내부 라우터 객체 불러오기 - 로그인 성공 후 페이지 이동에 사용
import { useRouter } from 'vue-router'; // Vue Router 가져오기

// 로그인 입력 값을 위한 상태 변수 정의
const userId = ref('');
const password = ref('');

const userStore = useUserStore(); // Pinia 스토어 인스턴스 생성
const router = useRouter(); // Vue Router 인스턴스 생성

// 로그인 함수
async function login() {
  if (!userId.value || !password.value) {
    alert('아이디와 비밀번호를 입력하세요.');
    return;
  }

  try {
    await userStore.login(userId.value, password.value); // Pinia 스토어의 login 함수 호출
    alert('로그인 성공!'); // 로그인 성공 시 알림
    router.push('/schedule'); // 로그인 성공 후 메인 페이지로 이동
  } catch (error) {
    alert('로그인 실패: ' + error.message); // 로그인 실패 시 알림
  }
}
</script>

<!-- 
- mb-4 : margin-bottom 4단계
- p-3 : padding 3단계
- border : 테두리 1px 회색 적용
- rounded : 테두리 둥글게
- bg-light : 배경색 연한 회색
- form-control : Bootstrap에서 입력폼 기본 스타일 적용
- btn :  Bootstrap 버튼 기본 스타일 적용
- btn-primary : Bootstrap 기본 파란색 버튼
- w-100 : Bootstrap에서 너비 100% 적용(전체 너비 버튼)
- mb-2 : margin-bottom 2단계
 -->