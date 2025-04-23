<template>
  <div class="table-responsive">
    <table class="table table-bordered text-center align-middle">
      <thead class="table-dark">
        <tr>
          <th style="width: 120px">시간</th>
          <th v-for="day in days" :key="day" style="width: 120px">
            {{ dayLabels[day] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="time in timeSlots" :key="time">
          <td>
            <strong>{{ time }}</strong>
          </td>
          <td v-for="day in days" :key="day">
            <!-- 셀에 매칭되는 수업 정보가 있으면 출력 -->
            <div
              v-for="cls in getClassAt(day, time)"
              :key="cls.course_name"
              class="p-1 bg-light border rounded"
            >
              <div>{{ cls.course_name }}</div>
              <div class="text-muted small">{{ cls.room }} / {{ cls.professor_name }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
// 요일 순서 정의 (고정)
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

const dayLabels = {
  MON: '월요일',
  TUE: '화요일',
  WED: '수요일',
  THU: '목요일',
  FRI: '금요일',
};

// 시간 슬롯 정의 (고정)
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// 부모로부터 전달받는 props 시간표 데이터
const props = defineProps({
  schedule: {
    type: Array,
    required: true,
  },
  selectedYear: {
    type: Number,
    required: true,
  },
  selectedTerm: {
    type: String,
    required: true,
  },
});

// 각 셀에 해당하는 수업 정보를 반환하는 함수
function getClassAt(day, time) {
  return props.schedule.filter((cls) => {
    if (cls.day_of_week !== day) return false;

    const clsStart = cls.start_time.slice(0, 5); // HH:MM
    const clsEnd = cls.end_time.slice(0, 5); // HH:MM
    return;
  });
}
</script>

<style scoped>
.table {
  min-width: 800px;
}
</style>
