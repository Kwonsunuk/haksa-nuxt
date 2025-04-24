// routes/admin.js

import express from 'express';
import { loginAdmin, meAdmin } from '../controllers/adminAuthController.js'


const router = express.Router();

// 관리자 로그인 API
router.post('/login', loginAdmin);
// 관리자 정보 조회 API
router.get('/me', meAdmin);

export default router;