<!-- components/LoginForm.vue -->
<template>
  <!-- ✅ 학사정보 열람 시스템 타이틀은 여기서 제거 -->
  <form @submit.prevent="login" class="mb-4 p-3 border rounded bg-light">
    <div class="mb-2">
      <input v-model="userId" class="form-control" placeholder="아이디" />
    </div>
    <div class="mb-2">
      <input v-model="password" type="password" class="form-control" placeholder="비밀번호" />
    </div>
    <button class="btn btn-primary w-100">로그인</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '~/stores/userStore'; // Pinia 스토어 가져오기
import { useRouter } from 'vue-router'; // Vue Router 가져오기


const userId = ref('');
const password = ref('');
const userStore = useUserStore(); // Pinia 스토어 인스턴스 생성
const router = useRouter(); // Vue Router 인스턴스 생성

// 로그인 함수
async function login() {
  if (!userId.value || !password.value) {
    alert('아이디와 비밀번호를 입력하세요.')
    return
  }

  try {
    // 간단한 더미 로그인 처리
    await userStore.login({
      name: userId.value,
      id: userId.value,
      password: password.value
    })

    alert('로그인 성공!')
    router.push('/schedule') // ✅ 로그인 후 스케줄 페이지로 이동
  } catch (error) {
    alert('로그인 실패: ' + error.message)
  }
}
</script>
