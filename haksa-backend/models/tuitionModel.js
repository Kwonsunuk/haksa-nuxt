import pool from '../config/db.js'

/**
 * 특정 학생의 모든 학비 인보이스 조회
 * @param {string} studentId
 * @returns {Promise<Array>} TuitionInvoice 레코드 배열
 */
export async function fetchTuitionInvoicesByStudent(studentId) {
  // student_id 컬럼으로 필터링하여 내림차순 정렬
  const [rows] = await pool.execute(
    `SELECT 
       invoice_id, year, term, tuition_fee, scholarship_amount,
       payable_amount, pay_start_date, pay_end_date
     FROM TuitionInvoice
     WHERE student_id = ?
     ORDER BY year DESC, term DESC`,
    [studentId]
  )
  return rows
}

/**
 * 특정 인보이스의 분납 내역 조회
 * @param {number} invoiceId
 * @returns {Promise<Array>} Installment 레코드 배열
 */
export async function fetchInstallments(invoiceId) {
  // installment_no 순으로 정렬
  const [rows] = await pool.execute(
    `SELECT 
       installment_no, amount, due_start_date, due_end_date, paid_date
     FROM Installment
     WHERE invoice_id = ?
     ORDER BY installment_no`,
    [invoiceId]
  )
  return rows
}

/**
 * 특정 분납 건을 결제 처리 (paid_date = NOW())
 * @param {number} invoiceId
 * @param {number} installmentNo
 * @returns {Promise<number>} affectedRows
 */
export async function payInstallment(invoiceId, installmentNo) {
  const [result] = await pool.execute(
    `UPDATE Installment
       SET paid_date = NOW()
     WHERE invoice_id = ? AND installment_no = ?`,
    [invoiceId, installmentNo]
  )
  return result.affectedRows
}