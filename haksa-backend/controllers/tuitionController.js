import jwt from 'jsonwebtoken'
import {
  fetchTuitionInvoicesByStudent,
  fetchInstallments,
  payInstallment
} from '../models/tuitionModel.js'

/**
 * GET /api/tuition-invoices
 * 학생 로그인 토큰에서 student_id 추출 후 자신의 인보이스 반환
 */
export async function getMyInvoices(req, res) {
  // 1) Authorization 헤더에서 토큰 꺼내기
  const auth = req.headers.authorization || ''
  const token = auth.replace(/^Bearer\s+/, '')
  let studentId

  // 2) JWT 검증
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    studentId = decoded.student_id
  } catch {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' })
  }

  // 3) 모델 호출하여 반환
  try {
    const invoices = await fetchTuitionInvoicesByStudent(studentId)
    return res.json({ data: invoices })
  } catch (err) {
    console.error('[getMyInvoices] 에러:', err)
    return res.status(500).json({ message: '인보이스 조회 실패' })
  }
}

/**
 * GET /api/tuition-invoices/:invoice_id/installments
 * 특정 인보이스 분납 내역 조회
 */
export async function getInstallmentsHandler(req, res) {
  const invoiceId = parseInt(req.params.invoice_id, 10)
  if (isNaN(invoiceId)) {
    return res.status(400).json({ message: '유효하지 않은 인보이스 ID입니다.' })
  }
  try {
    const installments = await fetchInstallments(invoiceId)
    return res.json({ data: installments })
  } catch (err) {
    console.error('[getInstallments] 에러:', err)
    return res.status(500).json({ message: '분납 내역 조회 실패' })
  }
}

/**
 * PATCH /api/installments/:invoice_id/:installment_no/pay
 * 특정 분납 건 결제 처리
 */
export async function payInstallmentHandler(req, res) {
  const invoiceId     = parseInt(req.params.invoice_id, 10)
  const installmentNo = parseInt(req.params.installment_no, 10)
  if (isNaN(invoiceId) || isNaN(installmentNo)) {
    return res.status(400).json({ message: '유효하지 않은 파라미터입니다.' })
  }

  try {
    const affected = await payInstallment(invoiceId, installmentNo)
    if (affected === 0) {
      return res.status(404).json({ message: '해당 분납 건을 찾을 수 없습니다.' })
    }
    return res.json({ message: '납부 처리되었습니다.' })
  } catch (err) {
    console.error('[payInstallment] 에러:', err)
    return res.status(500).json({ message: '납부 처리 실패' })
  }
}