<!-- pages/transcript.vue -->
<template>
    <div class="container">
      <h2 class="mb-4">📄 성적 조회</h2>
  
      <!-- 연도 및 학기 선택 -->
      <div class="row mb-4">
        <div class="col-md-3">
          <select v-model="selectedYear" class="form-select" @change="fetchGrades">
            <option v-for="year in years" :key="year" :value="year">{{ year }}년</option>
          </select>
        </div>
        <div class="col-md-3">
          <select v-model="selectedTerm" class="form-select" @change="fetchGrades">
            <option value="SPRING">1학기 (Spring)</option>
            <option value="FALL">2학기 (Fall)</option>
          </select>
        </div>
      </div>
  
      <!-- 성적 테이블 -->
      <GradeTable :grades="grades" />
  
      <!-- GPA 요약 -->
      <div class="mt-4">
        <strong>📊 평균 평점:</strong> {{ averageGPA }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
import GradeTable from '~/components/GradeTable.vue';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);

// ✅ 함수 먼저 정의
const getCurrentTerm = () => (new Date().getMonth() + 1 <= 6 ? 'SPRING' : 'FALL');

// ✅ 그 다음에 사용
const selectedYear = ref(currentYear);
const selectedTerm = ref(getCurrentTerm());
const grades = ref([]);

  
  // GPA 계산
  const averageGPA = computed(() => {
  if (!grades.value.length) return '0.00';

  const totalPoints = grades.value.reduce((sum, g) => {
    const point = parseFloat(g.grade_point); // 문자열 -> 숫자 변환
    return sum + (isNaN(point) ? 0 : point);
  }, 0);

  return (totalPoints / grades.value.length).toFixed(2);
});

  async function fetchGrades() {
    try {
      const res = await fetch(`http://localhost:4000/api/grades?year=${selectedYear.value}&term=${selectedTerm.value}`, {
        headers: {
          Authorization: `Bearer ${useCookie('token').value}`,
        },
      });
      const data = await res.json();
      grades.value = data || [];
    } catch (err) {
      console.error('성적 조회 오류:', err);
      grades.value = [];
    }
  }
  
  onMounted(() => {
    fetchGrades();
  });
  </script>
  