<!-- components/EditAnnouncementModal.vue -->
<template>
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="cancel">
        <div class="modal-dialog">
          <div class="modal-content p-4">
            <h5 class="modal-title mb-3">
              {{ announcement.announcement_id ? '공지사항 수정' : '새 공지사항' }}
            </h5>
            <div class="mb-3">
              <label class="form-label">제목</label>
              <input
                v-model="localTitle"
                type="text"
                class="form-control"
                placeholder="제목을 입력하세요"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">내용</label>
              <textarea
                v-model="localContent"
                class="form-control"
                rows="6"
                placeholder="내용을 입력하세요"
              ></textarea>
            </div>
            <div class="d-flex justify-content-end gap-2">
              <button class="btn btn-secondary" @click="cancel">취소</button>
              <button class="btn btn-primary" @click="save">저장</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: { type: Boolean, required: true },
    announcement: {
      type: Object,
      default: () => ({ title: '', content: '' }),
    },
  });
  
  const emit = defineEmits(['update:modelValue', 'save']);
  
  // 로컬 복사
  const localTitle   = ref(props.announcement.title);
  const localContent = ref(props.announcement.content);
  
  // announcement prop이 바뀌면 로컬도 업데이트
  watch(() => props.announcement, a => {
    localTitle.value   = a.title;
    localContent.value = a.content;
  });
  
  function save() {
    emit('save', {
      ...props.announcement,
      title: localTitle.value,
      content: localContent.value,
    });
    emit('update:modelValue', false);
  }
  
  function cancel() {
    emit('update:modelValue', false);
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
    border-radius: .5rem;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .2s ease;
  }
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
  }
  </style>
  