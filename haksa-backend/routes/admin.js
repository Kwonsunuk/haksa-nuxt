// routes/admin.js
import express from 'express';
import { authAdminMiddleware } from '../middleware/authAdminMiddleware.js';
import { loginAdmin, meAdmin } from '../controllers/adminAuthController.js';

const router = express.Router();

// POST /api/admin/login — 관리자 로그인
router.post('/login', loginAdmin);

// GET  /api/admin/me    — 토큰으로 관리자 정보 복원 (인증 필요)
router.get('/me', authAdminMiddleware, meAdmin);

export default router;