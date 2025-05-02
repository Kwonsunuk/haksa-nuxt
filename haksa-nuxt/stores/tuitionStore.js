// stores/tuitionStore.js
import { defineStore } from 'pinia';
import { useCookie } from '#app';
import { ref, computed } from 'vue';

export const useTuitionStore = defineStore('tuition', () => {
  const base = 'http://localhost:4000';
  const token = useCookie('token').value;

  const invoices = ref([]); // TuitionInvoice[]
  const installmentsMap = ref({}); // { [invoiceId]: Installment[] }

  // paidAmountMap: 인보이스별 지금까지 낸 금액 합계
  const paidAmountMap = computed(() => {
    const map = {};
    for (const inv of invoices.value) {
      const insts = installmentsMap.value[inv.invoice_id] || [];
      map[inv.invoice_id] = insts
        .filter((i) => i.paid_date)
        .reduce((sum, i) => sum + (i.amount ?? 0), 0);
    }
    return map;
  });

  // 내 인보이스 목록 불러오기
  async function fetchInvoices() {
    const res = await fetch(`${base}/api/tuition-invoices`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch invoices');
    const { data } = await res.json();
    invoices.value = data;

    // 모든 인보이스에 대한 분납 내역 미리 로드
    await Promise.all(data.map((inv) => fetchInstallments(inv.invoice_id)));
  }

  // 특정 인보이스 분납 내역 불러오기
  async function fetchInstallments(invoiceId) {
    const res = await fetch(`${base}/api/tuition-invoices/${invoiceId}/installments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch installments');
    const { data } = await res.json();
    installmentsMap.value = {
      ...installmentsMap.value,
      [invoiceId]: data,
    };
  }

  // 분납 건 납부 처리
  async function payInstallment(invoiceId, installmentNo) {
    const res = await fetch(`${base}/api/installments/${invoiceId}/${installmentNo}/pay`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to pay installment');
    // 다시 로드해서 paidAmountMap 갱신
    await fetchInstallments(invoiceId);
  }

  return {
    invoices,
    installmentsMap,
    paidAmountMap,
    fetchInvoices,
    fetchInstallments,
    payInstallment,
  };
});
