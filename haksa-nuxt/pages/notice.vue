<!-- pages/notice.vue -->
<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">📢 공지사항</h2>
      <div class="input-group" style="max-width: 300px">
        <input
          v-model="searchTerm"
          @keyup.enter="onSearch"
          type="text"
          class="form-control"
          placeholder="검색어를 입력하세요"
        />
        <button class="btn btn-outline-secondary" @click="onSearch">🔍</button>
      </div>
    </div>

    <ul class="list-group mb-4">
      <li v-for="notice in notices" :key="notice.announcement_id" class="list-group-item p-2">
        <!-- 제목/메타 영역: 클릭하면 toggle -->
        <div
          class="d-flex justify-content-between align-items-center"
          style="cursor: pointer"
          @click="toggle(notice.announcement_id)"
        >
          <div>
            <div>
              <h5 class="mb-1">{{ notice.title }}</h5>
              <!-- 관리자 컨트롤 (관리자 로그인 시에만 보임) -->
              <div v-if="isAdmin" class="mt-2 d-flex gap-2">
                <!--
                .stop을 안넣었더니 이벤트가 부모로 전파되어서 부모의 toggle이 실행됨..
                 <button class="btn btn-sm btn-danger" @click="onDelete(notice.announcement_id)">
                  삭제
                </button>
                <button class="btn btn-sm btn-secondary" @click="onEdit(notice)">수정</button>
                <button
                  class="btn btn-sm btn-{{ notice.is_visible ? 'warning' : 'success' }}"
                  @click="onToggleVisibility(notice)"
                >
                  {{ notice.is_visible ? '비공개하기' : '공개하기' }}
                </button> -->
                <button
                  class="btn btn-sm btn-danger"
                  @click.stop="onDelete(notice.announcement_id)"
                >
                  삭제
                </button>
                <button class="btn btn-sm btn-secondary" @click.stop="onEdit(notice)">수정</button>
                <button
                  class="btn btn-sm btn-{{ notice.is_visible ? 'warning' : 'success' }}"
                  @click.stop="onToggleVisibility(notice)"
                >
                  {{ notice.is_visible ? '비공개하기' : '공개하기' }}
                </button>
              </div>
            </div>
            <small class="text-muted">
              {{ formatDate(notice.posted_date) }} · {{ notice.posted_by_name }}
            </small>
          </div>
          <i
            :class="[
              'bi',
              expandedItems.has(notice.announcement_id) ? 'bi-chevron-up' : 'bi-chevron-down',
            ]"
          />
        </div>

        <!-- 내용 아코디언 -->
        <transition name="collapse">
          <div v-show="expandedItems.has(notice.announcement_id)" class="mt-2">
            <p class="mb-0 preserve-whitespace">{{ notice.content }}</p>
          </div>
        </transition>
      </li>
    </ul>

    <!-- 페이징 컨트롤 (이전과 동일) -->
    <nav v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: page === 1 }" @click="changePage(page - 1)">
          <a class="page-link">« Prev</a>
        </li>
        <li
          v-for="p in totalPages"
          :key="p"
          class="page-item"
          :class="{ active: p === page }"
          @click="changePage(p)"
        >
          <a class="page-link">{{ p }}</a>
        </li>
        <li
          class="page-item"
          :class="{ disabled: page === totalPages }"
          @click="changePage(page + 1)"
        >
          <a class="page-link">Next »</a>
        </li>
      </ul>
    </nav>
  </div>
  <!-- 모달 삽입 -->
  <EditAnnouncementModal v-model="showEditModal" :announcement="editingNotice" @save="handleSave" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCookie } from '#app';

import { useAdminStore } from '~/stores/adminStore';
import { useToastStore } from '~/stores/toastStore';

import EditAnnouncementModal from '~/components/EditAnnouncementModal.vue';

const adminStore = useAdminStore();
const toastStore = useToastStore();
const isAdmin = computed(() => !!adminStore.me); // 관리자 로그인 여부

const notices = ref([]);
const page = ref(1);
const size = 10;
const totalPages = ref(1);
const searchTerm = ref(''); // 검색어
const lastWarnTerm  = ref(''); 

const showEditModal = ref(false);
const editingNotice = ref({});

// 학생용 토큰, 관리자용 토큰 둘 다 확인
const studentToken = useCookie('token').value;
const adminToken = useCookie('admin_token').value;

const authToken = studentToken || adminToken; // 둘 중 하나라도 있으면 사용

// 열려 있는 공지 ID를 저장할 Set
const expandedItems = ref(new Set());

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 공지사항 목록을 가져오는 API 호출
async function fetchNotices() {
  const token = authToken
  const params = new URLSearchParams({
    page: page.value,
    size,
    ...(searchTerm.value.trim() ? { q: searchTerm.value.trim() } : {})
  })
  const url = `http://localhost:4000/api/announcements?${params}`

  let res
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch (err) {
    toastStore.addToast('error', '네트워크 오류로 공지사항을 불러올 수 없습니다.', 3000)
    return
  }

  if (!res.ok) {
    toastStore.addToast('error', `공지사항을 불러오는데 실패했습니다: ${res.status}`, 3000)
    return
  }

  const { data, totalPages: tp } = await res.json()
  notices.value   = data
  totalPages.value = tp

  if (data.length === 0) {
    const term = searchTerm.value.trim()
    if (term && lastWarnTerm.value !== term) {
      toastStore.addToast('warning', 'T.T 검색된 공지사항이 없습니다..', 3000)
      lastWarnTerm.value = term
    }
  } else {
    // 결과가 있거나 검색어가 비어 있으면 초기화
    lastWarnTerm.value = ''
  }
}

// 삭제 API 호출
async function onDelete(id) {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await fetch(`http://localhost:4000/api/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useCookie('admin_token').value}`,
      },
    });
    toastStore.addToast('success', '공지사항이 삭제되었습니다.', 4000);
    // 성공하면 로컬 리스트 갱신
    notices.value = notices.value.filter((notice) => notice.announcement_id !== id);
  } catch (err) {
    toastStore.push('공지사항 삭제에 실패했습니다.', 'error');
    console.error(err);
  }
}
// 수정 버튼 클릭 시
function onEdit(notice) {
  editingNotice.value = { ...notice };
  showEditModal.value = true;
}

// 모달에서 저장 눌렀을 때
async function handleSave(updated) {
  try {
    // 예: PATCH 요청 보내고
    await fetch(`http://localhost:4000/api/admin/announcements/${updated.announcement_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useCookie('admin_token').value}`,
      },
      body: JSON.stringify({ title: updated.title, content: updated.content }),
    });

    // 로컬 리스트 업데이트
    const idx = notices.value.findIndex((n) => n.announcement_id === updated.announcement_id);
    if (idx !== -1) {
      notices.value[idx].title = updated.title;
      notices.value[idx].content = updated.content;
    }
    toastStore.addToast('success', '공지사항이 수정되었습니다.', 4000);
  } catch (err) {
    toastStore.addToast('error', '공지사항 수정에 실패했습니다.', 4000);
    console.error(err);
  } finally {
    showEditModal.value = false;
  }
}
// 검색 API 호출
function onSearch() {
  page.value = 1; // 검색할 때는 1페이지로 리셋
  fetchNotices();
}

// 페이지 변경
function changePage(p) {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
  fetchNotices();
}

// 클릭된 공지의 ID를 토글
function toggle(id) {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
}

// 공개/비공개 API 호출
async function onToggleVisibility(notice) {
  const confirmMsg = notice.is_visible
    ? '이 공지를 비공개 처리하시겠습니까?'
    : '이 공지를 공개 처리하시겠습니까?';
  if (!confirm(confirmMsg)) return;

  try {
    await fetch(
      `http://localhost:4000/api/admin/announcements/${notice.announcement_id}/visibility`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${useCookie('admin_token').value}`,
        },
        body: JSON.stringify({ is_visible: !notice.is_visible }),
      }
    );
    // 성공하면 로컬 리스트 갱신
    notice.is_visible = !notice.is_visible;
    const toastStore = useToastStore();
    toastStore.addToast(
      notice.is_visible ? 'success' : 'warning',
      `${notice.is_visible ? '공개' : '비공개'} 처리되었습니다.`,
      4000 // 4초 동안 표시
    );
  } catch (err) {
    alert('공지사항 공개 상태 변경에 실패했습니다.');
    toastStore.push('공지사항 공개 상태 변경에 실패했습니다.', 'error');
    console.error(err);
  }
}

onMounted(fetchNotices);
</script>

<style scoped>
/* 아이콘용 Bootstrap Icons 를 쓰니 import 필요 */
@import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css';
/* collapse transition */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 500px; /* 충분히 큰 값 */
  opacity: 1;
}

/* 줄바꿈 및 공백을 그대로 유지 */
.preserve-whitespace {
  white-space: pre-wrap;
}
</style>
