<!-- components/GradeTable.vue -->
<template>
    <div class="table-responsive">
      <table class="table table-bordered text-center align-middle">
        <thead class="table-dark">
          <tr>
            <th>과목명</th>
            <th>과목코드</th>
            <th>학점</th>
            <th>점수</th>
            <th>등급</th>
            <th>평점</th>
            <th>이수여부</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="grades.length === 0">
            <td colspan="7" class="text-muted">해당 학기의 성적 정보가 없습니다.</td>
          </tr>
          <tr v-for="(grade, index) in grades" :key="index">
            <td>{{ grade.course_name }}</td>
            <td>{{ grade.course_code }}</td>
            <td>{{ grade.credit }}</td>
            <td>{{ grade.score }}</td>
            <td>{{ grade.letter_grade }}</td>
            <td>{{ grade.grade_point }}</td>
            <td>{{ grade.pass_fail === 'Y' ? '이수' : '미이수' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  // 부모 컴포넌트로부터 props로 성적 리스트를 받는다
  defineProps({
    grades: {
      type: Array,
      required: true,
    },
  });
  </script>
  