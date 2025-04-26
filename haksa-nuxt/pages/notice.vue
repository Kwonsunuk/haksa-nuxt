<!-- pages/notice.vue -->
<template>
    <div class="container">
      <h2 class="mb-4">📢 공지사항</h2>
  
      <ul class="list-group mb-4">
        <li
          v-for="notice in notices"
          :key="notice.announcement_id"
          class="list-group-item p-2"
        >
          <!-- 제목/메타 영역: 클릭하면 toggle -->
          <div
            class="d-flex justify-content-between align-items-center"
            style="cursor: pointer;"
            @click="toggle(notice.announcement_id)"
          >
            <div>
              <h5 class="mb-1">{{ notice.title }}</h5>
              <small class="text-muted">
                {{ formatDate(notice.posted_date) }} · {{ notice.posted_by_name }}
              </small>
            </div>
            <i
              :class="[
                'bi', 
                expandedItems.has(notice.announcement_id) ? 'bi-chevron-up' : 'bi-chevron-down'
              ]"
            />
          </div>
  
          <!-- 내용 아코디언 -->
          <transition name="collapse">
            <div
              v-show="expandedItems.has(notice.announcement_id)"
              class="mt-2"
            >
              <p class="mb-0">{{ notice.content }}</p>
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
          <li class="page-item" :class="{ disabled: page === totalPages }" @click="changePage(page + 1)">
            <a class="page-link">Next »</a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useCookie } from '#app'
  
  const notices       = ref([])
  const page          = ref(1)
  const size          = 10
  const totalPages    = ref(1)
  const tokenCookie   = useCookie('token')
  
  // 열려 있는 공지 ID를 저장할 Set
  const expandedItems = ref(new Set())
  
  function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString('ko-KR', {
      year:  'numeric',
      month: '2-digit',
      day:   '2-digit',
    })
  }
  
  async function fetchNotices() {
    const token = tokenCookie.value
    const url   = `http://localhost:4000/api/announcements?page=${page.value}&size=${size}`
  
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`,
      },
    })
    if (!res.ok) throw new Error(`공지사항 불러오기 실패: ${res.status}`)
    const json = await res.json()
    notices.value    = json.data
    totalPages.value = json.totalPages
  }
  
  function changePage(p) {
    if (p < 1 || p > totalPages.value) return
    page.value = p
    fetchNotices()
  }
  
  // 클릭된 공지의 ID를 토글
  function toggle(id) {
    if (expandedItems.value.has(id)) {
      expandedItems.value.delete(id)
    } else {
      expandedItems.value.add(id)
    }
  }
  
  onMounted(fetchNotices)
  </script>
  
  <style scoped>
  /* collapse transition */
  .collapse-enter-active, .collapse-leave-active {
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }
  .collapse-enter-from, .collapse-leave-to {
    max-height: 0;
    opacity: 0;
  }
  .collapse-enter-to, .collapse-leave-from {
    max-height: 500px; /* 충분히 큰 값 */
    opacity: 1;
  }
  
  /* 아이콘용 Bootstrap Icons 를 쓰신다면 import 필요 */
  @import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css";
  </style>
  