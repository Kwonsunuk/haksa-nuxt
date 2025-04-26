<!-- pages/notice.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">공지사항</h2>

    <div v-if="isLoading" class="text-center">
      <p>Loading...</p>
    </div>

    <div v-else>
      <div v-if="announcements.length === 0" class="text-muted">
        <p>공지사항이 없습니다.</p>
      </div>
      <div v-else>
        <div
          v-for="item in announcements"
          :key="item.announcement_id"
          class="mb-4 p-3 border rounded"
        >
          <h5>{{ item.title }}</h5>
          <small class="text-secondary">
            {{  formatDate(item.posted_date) }} by {{  item.posted_by_name }}
          </small>
          <p class="mt-2"> {{  item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const announcements = ref([]);
const isLoading = ref(false);

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

async function fetchAnnouncements() {
  isLoading.value = true;

  try {
    const response = await fetch('http://localhost:4000/api/announcements');
    const data = await response.json();
    announcements.value = data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchAnnouncements();
});
</script>
