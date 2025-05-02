import express from 'express'
import {
  getMyInvoices,
  getInstallmentsHandler,
  payInstallmentHandler
} from '../controllers/tuitionController.js'
import { authStudentMiddleware } from '../middleware/authStudentMiddleware.js'

const router = express.Router()

// 내 인보이스 조회
router.get('/tuition-invoices', authStudentMiddleware, getMyInvoices)

// 특정 인보이스 분납 내역 조회
router.get('/tuition-invoices/:invoice_id/installments', authStudentMiddleware, getInstallmentsHandler)

// 분납 건 납부 처리
router.patch('/installments/:invoice_id/:installment_no/pay', authStudentMiddleware, payInstallmentHandler)

export default router