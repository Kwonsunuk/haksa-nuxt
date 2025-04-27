// stores/toastStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])        // [{ id, message, type }]
  const timers = new Map()      // Map<toastId, timeoutId>

  function addtoast(message, type = 'default', duration = 3000) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })

    // 타이머 등록
    const timeoutId = setTimeout(() => remove(id), duration)
    timers.set(id, timeoutId)
  }

  function remove(id) {
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

  return { toasts, addtoast, remove, clearAll }
})