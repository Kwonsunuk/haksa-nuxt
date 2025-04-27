<!-- components/ToastContainer.vue -->
<template>
  <div class="toast-box">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'toast-item',
        {
          'toast-success': toast.type === 'success',
          'toast-error'  : toast.type === 'error',
          'toast-warning': toast.type === 'warning',
          'toast-info'   : toast.type === 'default'
        }
      ]"
    >
      <div class="toast-content">
        {{ toast.message }}
      </div>
      <div class="toast-progress">
        <div class="toast-progress-bar" :style="{ animationDuration: toast.duration + 'ms' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useToastStore } from '~/stores/toastStore'

const toastStore = useToastStore()
// toasts 객체에 duration (ms) 값을 포함시키도록 스토어를 업데이트해야 합니다.
const toasts = computed(() => toastStore.toasts)
</script>

<style scoped>
.toast-box {
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 1050;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 250px;
}

.toast-item {
  background: #333;
  color: #fff;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: relative;
}
.toast-success { background: #28a745; }
.toast-error   { background: #dc3545; }
.toast-warning { background: #ffc107; color: #212529; }
.toast-info    { background: #17a2b8; }

.toast-content {
  position: relative;
  z-index: 2;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.3);
  overflow: hidden;
  z-index: 1;
}

.toast-progress-bar {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8);
  animation-name: shrinkBar;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes shrinkBar {
  from { width: 100%; }
  to   { width: 0%; }
}
</style>
