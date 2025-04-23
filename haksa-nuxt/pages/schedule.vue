<!-- pages/schedule.vue -->
<template>
  <div class="container">
    <h2 class="mb-3">🗓️ 수강 시간표</h2>

    <!-- 학기/연도 선택 필터 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <select v-model="selectedYear" class="form-select" @change="fetchSchedule">
          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedTerm" class="form-select" @change="fetchSchedule">
          <option value="SPRING">1학기/봄학기</option>
          <option value="FALL">2학기/가을학기</option>
        </select>
      </div>
    </div>

    <!-- 시간표 로딩 표시 -->
    <div v-if="schedule.length === 0 && isLoading" class="text-center">
      <p>수업 시간표를 불러오는 중입니다...</p>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <!-- 수업 시간표  컴포넌트-->
    <ScheduleTable v-else :schedule="schedule" :selectedYear="selectedYear" :selectedTerm="selectedTerm" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ScheduleTable from '~/components/ScheduleTable.vue';

// ✅ 현재 연도 기준 연도 리스트 자동 생성
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);// 학기/연도 선택 필터

// 기본 선택값
const selectedYear = ref(new Date().getFullYear()); // 기본 값: 현재 연도
const selectedTerm = ref(getCurrentTerm()); // 기본 값: 현재 학기
const schedule = ref([]); // 수업 시간표 데이터
const isLoading = ref(false); // 로딩 상태

// 현재 학기를 계산하는 함수(1~6월: SPRING, 7~12월: FALL)
function getCurrentTerm() {
  const month = new Date().getMonth() + 1; // 월은 0부터 시작하므로 +1
  return month <= 6 ? 'SPRING' : 'FALL';
}

// 서버에서 수업 시간표를 가져오는 함수
async function fetchSchedule() {
  isLoading.value = true; // 로딩 상태 시작
  try {
    const res = await fetch(`/api/schedule?year=${selectedYear.value}&term=${selectedTerm.value}`);
    if (!res.ok) {
      throw new Error('Failed to fetch schedule');
    }
    const data = await res.json();
    schedule.value = data.schedule || []; // 수업 시간표 데이터 배열을 받는다고 가정
  } catch (error) {
    console.error('Error fetching schedule:', error);
    schedule.value = []; // 에러 발생 시 빈 배열로 초기화
  } finally {
    isLoading.value = false; // 로딩 상태 종료
  }
}

onMounted(() => {
  fetchSchedule; // 컴포넌트가 마운트될 때 수업 시간표를 가져옴
});
</script>
