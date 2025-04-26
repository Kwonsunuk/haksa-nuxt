// haksa-backend/routes/announcement.js
import express from 'express';
import { getAnnouncements, toggleVisibility, deleteAnnouncement } from '../controllers/announcementController.js';
import { authAdminMiddleware } from '../middleware/authAdminMiddleware.js';

const router = express.Router();

// 학생용 공지조회
router.get('/', getAnnouncements);

// 관리자용 공개/비공개 토글
router.patch('/:id/visibility', authAdminMiddleware, toggleVisibility);

// 관리자용 공지사항 삭제
router.delete('/:id', authAdminMiddleware, deleteAnnouncement);

export default router;