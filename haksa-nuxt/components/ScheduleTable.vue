// components/ScheduleTable.vue
<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center align-middle">
      <thead class="table-dark">
        <tr>
          <th style="width: 120px">시간</th>
          <th v-for="day in days" :key="day">{{ dayLabels[day] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="time in timeSlots" :key="time">
          <td><strong>{{ time }}</strong></td>
          <td v-for="day in days" :key="day">
            <div
              v-for="cls in getClassAt(day, time)"
              :key="cls.course_name + cls.day_of_week + cls.start_time"
              class="p-1 bg-light border rounded"
            >
              <div><strong>{{ cls.course_name }}</strong></div>
              <div class="text-muted small">
                {{ cls.room }} / {{ cls.professor }}
              </div>
              <div v-if="isPastSemester && cls.score" class="mt-1 small">
                <div>점수: {{ cls.score }}</div>
                <div>등급: {{ cls.letter_grade }} ({{ cls.grade_point }})</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// 요일 순서 정의
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const dayLabels = {
  MON: '월요일',
  TUE: '화요일',
  WED: '수요일',
  THU: '목요일',
  FRI: '금요일',
};

// 시간 슬롯 정의
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const props = defineProps({
  schedule: Array,
  selectedYear: Number,
  selectedTerm: String,
});

// 현재 연도와 학기 비교 → 성적 표시 여부 결정
const currentYear = new Date().getFullYear();
const currentTerm = (new Date().getMonth() + 1) <= 6 ? 'SPRING' : 'FALL';
const isPastSemester = props.selectedYear < currentYear || (props.selectedYear === currentYear && props.selectedTerm !== currentTerm);

// 각 셀에 해당하는 수업 정보를 반환
function getClassAt(day, time) {
  return props.schedule.filter(cls => {
    if (cls.day_of_week !== day) return false;
    const start = cls.start_time.slice(0, 5); // '09:00'
    const end = cls.end_time.slice(0, 5); // '10:30'

    return time >= start && time < end;
  });
}
</script>

<style scoped>
.table {
  min-width: 800px;
}
</style>

