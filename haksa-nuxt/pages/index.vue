<!-- pages/index.vue -->
<template>
  <div class="container text-center mt-5" v-if="!userStore.me && !adminStore.me">
    <h1>학사정보 열람 시스템</h1>
    <p class="text-muted">로그인 후 메뉴를 통해 열람하세요.</p>
  </div>
  <div class="container">
    
  </div>
</template>
<script setup>
import { useUserStore } from '~/stores/userStore'; // Pinia 스토어 가져오기
import { useAdminStore } from '~/stores/adminStore'; // 관리자 스토어 가져오기

const userStore = useUserStore(); // Pinia 스토어 인스턴스 생성
const adminStore = useAdminStore(); // 관리자 스토어 인스턴스 생성
</script>
