// stores/toastStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Toast 타입: 'success' | 'error' | 'warning' | 'default'
export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]); // {id: number, type: string, message: string}[]
  const timers = new Map()      // Map<toastId, timeoutId>
  let counter = 0;

  function addToast(type, message, duration = 3000) {
    const id = ++counter;
    toasts.value.push({ id, type, message });
    // 타이머 등록
    const timeoutId = setTimeout(() => removeToast(id), duration)
    timers.set(id, timeoutId)
  }

  function removeToast(id) {
    // 타이머 해제
    const timeoutId = timers.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timers.delete(id)
    }
    // 토스트 제거
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // (선택) 모든 토스트와 타이머를 한번에 지우고 싶다면
  function clearAll() {
    for (const timeoutId of timers.values()) {
      clearTimeout(timeoutId)
    }
    timers.clear()
    toasts.value = []
  }

  return { toasts, addToast, removeToast, clearAll };
});
