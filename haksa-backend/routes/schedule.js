// routes/schedule.js
import express from 'express';
import { getStudentSchedule } from '../controllers/scheduleController.js';
const router = express.Router();

// 인증된 사용자의 스케줄 조회
router.get('/', getStudentSchedule);

export default router;

