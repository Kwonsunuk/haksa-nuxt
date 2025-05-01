<!-- components/EditAnnouncementModal.vue -->
<template>
  <transition name="modal-fade">
    <!-- 모달 열림 여부에 따라 전체 배경 및 다이얼로그 표시 -->
    <div v-if="modelValue" class="modal-backdrop" @click.self="cancel">
      <div class="modal-dialog">
        <div class="modal-content p-4">
          <!-- 모달 제목: 수정인지 생성인지 분기 -->
          <h5 class="modal-title mb-3">
            {{ announcement.announcement_id ? '공지사항 수정' : '새 공지사항' }}
          </h5>

          <!-- 제목 입력 -->
          <div class="mb-3">
            <label class="form-label">제목</label>
            <input
              v-model="localTitle"
              type="text"
              class="form-control"
              placeholder="제목을 입력하세요"
            />
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3">
            <label class="form-label">내용</label>
            <textarea
              v-model="localContent"
              class="form-control"
              rows="6"
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <!-- 작성 모드일 때만: 공개 여부 체크박스 + 현재 시간 -->
          <div
            v-if="!announcement.announcement_id"
            class="form-check mb-4 d-flex align-items-center"
          >
            <input
              id="visibleCheck"
              class="form-check-input"
              type="checkbox"
              v-model="localIsVisible"
            />
            <label class="form-check-label ms-2" for="visibleCheck">
              공개하기
            </label>
            <span class="ms-3 text-muted">{{ currentTime }}</span>
          </div>

          <!-- 버튼 그룹 -->
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-secondary" @click="cancel">
              취소
            </button>
            <button class="btn btn-primary" @click="save">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
// Vue Composition API 임포트
import { ref, watch, defineProps, defineEmits } from 'vue'

// 부모로부터 받을 props 정의
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  announcement: {
    type: Object,
    default: () => ({ title: '', content: '', is_visible: true }),
  },
})

// 부모에게 보낼 이벤트 정의
const emit = defineEmits(['update:modelValue', 'save'])

// 로컬 상태 변수 선언
const localTitle     = ref(props.announcement.title)      // 제목
const localContent   = ref(props.announcement.content)    // 내용
const localIsVisible = ref(props.announcement.is_visible) // 공개 여부

// 현재 시각 문자열
const currentTime = ref('')

// props.announcement 변경 시 로컬 상태 동기화
watch(
  () => props.announcement,
  (newA) => {
    localTitle.value     = newA.title
    localContent.value   = newA.content
    localIsVisible.value = newA.is_visible ?? true
  },
  { immediate: true }
)

// modal이 열릴 때 & 작성 모드일 때 currentTime 갱신
watch(
  () => props.modelValue,
  (opened) => {
    if (opened && !props.announcement.announcement_id) {
      const now = new Date()
      const pad = (n) => n.toString().padStart(2, '0')
      const Y = now.getFullYear()
      const M = pad(now.getMonth() + 1)
      const D = pad(now.getDate())
      const h = pad(now.getHours())
      const m = pad(now.getMinutes())
      const s = pad(now.getSeconds())
      currentTime.value = `${Y}-${M}-${D} ${h}:${m}:${s}`
    }
  },
  { immediate: true }
)

// 저장: 부모에게 데이터 전달 후 모달 닫기
function save() {
  emit('save', {
    ...props.announcement,        // 수정 모드라면 announcement_id 포함
    title: localTitle.value,
    content: localContent.value,
    is_visible: localIsVisible.value,
  })
  emit('update:modelValue', false)
}

// 취소: 모달 닫기
function cancel() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-dialog {
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>