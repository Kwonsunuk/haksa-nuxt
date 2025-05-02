<!-- pages/tuition.vue -->
<template>
  <div class="container py-4">
    <h2 class="mb-4">내 학비 내역</h2>

    <!-- 인보이스 테이블 -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>연도/학기</th>
          <th>등록금</th>
          <th>장학금</th>
          <th>지금까지 낸 금액</th>
          <th>납부 기간</th>
          <th>상세보기</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inv in tuitionStore.invoices" :key="inv.invoice_id">
          <td>{{ inv.year }} {{ inv.term }}</td>
          <td>{{ (inv.tuition_fee ?? 0).toLocaleString() }}원</td>
          <td>{{ (inv.scholarship_amount ?? 0).toLocaleString() }}원</td>
          <td>{{ (tuitionStore.paidAmountMap[inv.invoice_id] ?? 0).toLocaleString() }}원</td>
          <td>
            {{ formatDate(inv.pay_start_date) }}
            ~
            {{ formatDate(inv.pay_end_date) }}
          </td>
          <td>
            <button class="btn btn-sm btn-outline-primary" @click="toggleDetails(inv.invoice_id)">
              {{ expanded.has(inv.invoice_id) ? '숨기기' : '보기' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 분납 내역 아코디언 -->
    <div v-for="inv in tuitionStore.invoices" :key="`inst-${inv.invoice_id}`" class="mt-3">
      <transition name="collapse">
        <div v-show="expanded.has(inv.invoice_id)" class="ms-4 mb-4">
          <h5>{{ inv.year }} {{ inv.term }} 분납 스케줄</h5>
          <table class="table">
            <thead>
              <tr>
                <th>회차</th>
                <th>금액</th>
                <th>납부 기간</th>
                <th>납부일</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="inst in tuitionStore.installmentsMap[inv.invoice_id]"
                :key="`${inv.invoice_id}-${inst.installment_no}`"
              >
                <td>{{ inst.installment_no }}회차</td>
                <td>{{ (inst.amount ?? 0).toLocaleString() }}원</td>
                <td>
                  {{ formatDate(inst.due_start_date) }}
                  ~
                  {{ formatDate(inst.due_end_date) }}
                </td>
                <td>
                  {{ inst.paid_date ? formatDate(inst.paid_date, true) : '미납' }}
                </td>
                <td>
                  <button
                    v-if="!inst.paid_date"
                    class="btn btn-sm btn-success"
                    @click="pay(inv.invoice_id, inst.installment_no)"
                  >
                    납부하기
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useTuitionStore } from '~/stores/tuitionStore';

const tuitionStore = useTuitionStore();
const expanded = ref(new Set());

// 날짜 포맷팅
function formatDate(dateStr, withTime = false) {
  const d = new Date(dateStr);
  return d.toLocaleString(
    'ko-KR',
    withTime
      ? { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: '2-digit', day: '2-digit' }
  );
}

// 컴포넌트 마운트 후 인보이스 & 분납 내역 미리 로드
onMounted(async () => {
  try {
    await tuitionStore.fetchInvoices();
  } catch (err) {
    console.error('Invoices fetch error:', err);
  }
});

// 아코디언 토글
function toggleDetails(invId) {
  if (expanded.value.has(invId)) {
    expanded.value.delete(invId);
  } else {
    expanded.value.add(invId);
    // 분납 내역이 없으면 추가 로드 (이미 fetchInvoices에서 모두 로드했으니까 반복 호출해도 안전)
    if (!tuitionStore.installmentsMap[invId]) {
      tuitionStore.fetchInstallments(invId).catch((err) => {
        console.error('Installments fetch error:', err);
      });
    }
  }
}

// 납부 처리
async function pay(invoiceId, installmentNo) {
  try {
    await tuitionStore.payInstallment(invoiceId, installmentNo);
    // 즉시 UI에 현재 시간으로 반영
    const insts = tuitionStore.installmentsMap[invoiceId];
    const paidInst = insts && insts.find(i => i.installment_no === installmentNo);
    if (paidInst) {
      paidInst.paid_date = new Date().toISOString();
    }
    alert('납부가 완료되었습니다.');
  } catch (err) {
    console.error('Payment error:', err);
    alert('납부 처리에 실패했습니다.');
  }
}
</script>

<style scoped>
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
  max-height: 1000px;
  opacity: 1;
}
</style>
