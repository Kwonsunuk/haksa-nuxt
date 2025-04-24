
<!-- components/LoginForm.vue -->
<template>
  <div class="login-form-wrapper">
    <!-- 토글 버튼 (원하시면 화살표 대신 반원 트리거에 걸어도 됩니다) -->
    <div class="toggle-trigger" @click="showAdmin = !showAdmin">
      {{ showAdmin ? '학생 로그인으로 돌아가기' : '관리자 로그인하기' }}
    </div>

    <!-- 폼 자체를 슬라이드 아웃·인 시킵니다 -->
    <transition name="slide-form" mode="out-in">
      <!-- 학생 로그인 -->
      <form
        v-if="!showAdmin"
        key="student"
        @submit.prevent="login"
        class="mb-4 p-3 border rounded bg-light"
      >
        <div class="mb-2">
          <input v-model="student_id" class="form-control" placeholder="학번" />
        </div>
        <div class="mb-2">
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="비밀번호"
          />
        </div>
        <div v-if="errorMessage" class="text-danger mb-2">
          {{ errorMessage }}
        </div>
        <button
          type="submit"
          class="btn btn-primary w-100"
          :disabled="isLoading"
        >
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>

      <!-- 관리자 로그인 -->
      <AdminLoginForm v-else key="admin" />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '~/stores/userStore'
import { useRouter } from 'vue-router'
import AdminLoginForm from './AdminLoginForm.vue'

const student_id   = ref('')
const password     = ref('')
const isLoading    = ref(false)
const errorMessage = ref('')
const showAdmin    = ref(false)

const userStore = useUserStore()
const router    = useRouter()

async function login() {
  errorMessage.value = ''
  isLoading.value   = true
  if (!student_id.value || !password.value) {
    errorMessage.value = '아이디와 비밀번호를 입력하세요.'
    isLoading.value = false
    return
  }
  try {
    await userStore.login(student_id.value, password.value)
    router.push('/schedule')
  } catch (err) {
    errorMessage.value = err.message || '로그인에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-form-wrapper {
  padding: 0 0px;  /* 좌우 약간의 여유 */
}
.login-form-wrapper form {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

@media (max-width: 768px) and (orientation: landscape) {
  .login-form-wrapper form {
    max-width: 80%;
  }
}



/* 토글 텍스트 */
.toggle-trigger {
  text-align: right;
  margin-bottom: 8px;
  cursor: pointer;
  color: #007bff;
  user-select: none;
}

/* 슬라이드 트랜지션 */
.slide-form-enter-active,
.slide-form-leave-active {
  transition: transform 0.3s ease;
}
.slide-form-enter-from {
  transform: translateX(100%);
}
.slide-form-enter-to {
  transform: translateX(0);
}
.slide-form-leave-from {
  transform: translateX(0);
}
.slide-form-leave-to {
  transform: translateX(-100%);
}
</style>


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
