<!-- components/Sidebar.vue -->
<template>
  <div class="container"> <!--- container : Bootstrap에서 반응형 중앙 정렬 + padding이 기본 적용되는 컨테이너 --> 
    <!-- 로그인 전 -->
    <LoginForm v-if="!userStore.me" /> <!-- 로그인 입력 폼 렌더링하는 컴포넌트 -->
 
    <!-- 로그인 후 -->
    <div v-else class="mb-4 p-3 border rounded bg-light">
      <p><strong>{{ userStore.me.name }}</strong>님 환영합니다</p> <!-- 로그인한 사용자 이름 표시 (반응형 렌더링) -->
      <button @click="userStore.logout()" class="btn btn-outline-danger w-100">로그아웃</button> <!-- @click 클릭 시 이벤트 발생(userStore.logout) -->
    </div>

    <!-- 메뉴 링크 -->
    <NuxtLink to="/notice" class="btn btn-primary mb-2 w-100">📢 공지사항</NuxtLink> <!-- NuxtLink : Nuxt 전용 라우터 링크, <a> 태그처럼 동작하지만 SPA 방식으로 동작 -->
    <NuxtLink to="/transcript" class="btn btn-success mb-2 w-100 text-white">📄 성적 열람</NuxtLink>
    <NuxtLink to="/tuition" class="btn btn-warning mb-2 w-100 text-dark">💰 학비</NuxtLink>
    <NuxtLink to="/schedule" class="btn btn-info mb-2 w-100 text-white">📅 수강 스케줄</NuxtLink>
  </div>
</template>

<script setup>
import LoginForm from './LoginForm.vue';
import { useUserStore } from '~/stores/userStore'; // Pinia 스토어 가져오기


// Pinia 스토어 인스턴스로 상태변수(me), 로그인/로그아웃 함수(login, logout)를 포함
const userStore = useUserStore(); // ✅ 이거 하나면 충분!
</script>

<!--
- container : Bootstrap에서 반응형 중앙 정렬 + padding이 기본 적용되는 컨테이너
- mb-4 : margin-bottom 4단계
- p-3 : padding 3단계
- border : 테두리 1px 회색 적용
- rounded : 테두리 둥글게
- bg-light : 배경색 연한 회색
- btn :  Bootstrap 버튼 기본 스타일 적용 
- btn-primary : Bootstrap 기본 파란색 버튼
- btn-outline-danger : Bootstrap 기본 빨간색 버튼
- btn-success : Bootstrap 기본 초록색 버튼
- btn-warning : Bootstrap 기본 노란색 버튼
- btn-info : Bootstrap 기본 하늘색 버튼
- text-white : 글자색 흰색(색 있는 배경 대비용)
- text-dark : 글자색 검정색(흰 배경 대비용)
- w-100 : Bootstrap에서 너비 100% 적용(전체 너비 버튼)
- mb-2 : margin-bottom 2단계
 -->
