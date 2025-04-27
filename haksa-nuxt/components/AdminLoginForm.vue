<!-- components/AdminLoginForm.vue -->
<template>
  <form @submit.prevent="loginAdmin" class="mb-4 p-3 border rounded bg-light">
    <div class="mb-2">
      <input v-model="userId" class="form-control" placeholder="관리자 ID" />
    </div>
    <div class="mb-2">
      <input v-model="password" type="password" class="form-control" placeholder="비밀번호" />
    </div>

    <!-- 에러 메시지 -->
    <div v-if="errorMessage" class="text-danger mb-2">
      {{ errorMessage }}
    </div>

    <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
      {{ isLoading ? '로그인 중...' : '로그인' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminStore } from '~/stores/adminStore';
import { useRouter } from 'vue-router';
import { useToastStore } from '~/stores/toastStore';

const userId = ref(''); // user_id 에 바인딩
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const adminStore = useAdminStore();
const toastStore = useToastStore();
const router = useRouter();

async function loginAdmin() {
  errorMessage.value = '';
  isLoading.value = true;

  if (!userId.value || !password.value) {
    errorMessage.value = '아이디와 비밀번호를 입력하세요.';
    isLoading.value = false;
    return;
  }

  try {
    await adminStore.login(userId.value, password.value);
    router.push('');
    toastStore.addToast('success', `${adminStore.me.name}님 환영합니다!`, 4000);
    // /admin/announcements
  } catch (err) {
    errorMessage.value = err.message || '관리자 로그인에 실패했습니다.';
    toastStore.addToast('error', errorMessage.value, 4000);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Bootstrap 기반 스타일이 적용되어 있으니, 추가 커스터마이징 시 여기에 */
</style>
