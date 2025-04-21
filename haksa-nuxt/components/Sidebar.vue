<!-- components/Sidebar.vue -->
<template>
  <div class="container">
    <!-- 로그인 전 -->
    <LoginForm v-if="!userStore.me" />

    <!-- 로그인 후 -->
    <div v-else class="mb-4 p-3 border rounded bg-light">
      <p><strong>{{ userStore.me.name }}</strong>님 환영합니다</p>
      <button @click="userStore.logout()" class="btn btn-outline-danger w-100">로그아웃</button>
    </div>

    <!-- 메뉴 링크 -->
    <NuxtLink to="/notice" class="btn btn-primary mb-2 w-100">📢 공지사항</NuxtLink>
    <NuxtLink to="/transcript" class="btn btn-success mb-2 w-100 text-white">📄 성적 열람</NuxtLink>
    <NuxtLink to="/tuition" class="btn btn-warning mb-2 w-100 text-dark">💰 학비</NuxtLink>
    <NuxtLink to="/schedule" class="btn btn-info mb-2 w-100 text-white">📅 수강 스케줄</NuxtLink>
  </div>
</template>

<script setup>
import LoginForm from './LoginForm.vue';
import { useUserStore } from '~/stores/userStore'; // Pinia 스토어 가져오기

const userStore = useUserStore(); // ✅ 이거 하나면 충분!
</script>

