<!-- pages/schedule.vue -->
<template>
  <div class="container">
    <h2 class="mb-4">🗓️ 시간표 조회</h2>

    <!-- 필터 영역 -->
    <div class="row mb-4">
      <div class="col-md-3">
        <select v-model="selectedYear" class="form-select" @change="fetchSchedule">
          <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
        </select>
      </div>
      <div class="col-md-3">
        <select v-model="selectedTerm" class="form-select" @change="fetchSchedule">
          <option value="SPRING">1학기 (Spring)</option>
          <option value="FALL">2학기 (Fall)</option>
        </select>
      </div>
    </div>

    <!-- 시간표 출력 -->
    <ScheduleTable :schedule="schedule" :selectedYear="selectedYear" :selectedTerm="selectedTerm" />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import ScheduleTable from '~/components/ScheduleTable.vue';
import { useUserStore } from '~/stores/userStore';
import { useCookie } from '#app'; // 쿠키 유틸 가져오기 (setup 내부에서 사용하기 위해)

const userStore = useUserStore();

// ✅ 현재 연도 기준 연도 리스트 자동 생성
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);
const currentMonth = new Date().getMonth() + 1;

// 기본 선택값
const selectedYear = ref(currentYear);
const selectedTerm = ref(getCurrentTerm());
const schedule = ref([]);
const isLoading = ref(false);

// 현재 학기를 계산하는 함수
function getCurrentTerm() {
  return currentMonth <= 6 ? 'SPRING' : 'FALL';
}

// 서버에서 수업 시간표를 가져오는 함수
async function fetchSchedule() {
  isLoading.value = true;
  try {
    const token = useCookie('token').value; // ✅ 함수 안에서 호출
    const res = await fetch(
      `http://localhost:4000/api/schedule?year=${selectedYear.value}&term=${selectedTerm.value}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error('시간표 조회 실패');

    const data = await res.json();
    schedule.value = Array.isArray(data) ? data : []; // ✅ 배열인지 확인
  } catch (error) {
    console.error('[fetchSchedule] 시간표 불러오기 실패:', error);
    schedule.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchSchedule);
</script>

