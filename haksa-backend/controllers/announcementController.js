// controllers/announcementController.js
import { fetchVisibleAnnouncements } from '../models/announcementModel.js';

/**
 * 학생용 공지사항 조회 핸들러
 */
export async function getAnnouncements(req, res) {
  try {
    const announcements = await fetchVisibleAnnouncements();
    return res.json(announcements);
  } catch (err) {
    console.error('[getAnnouncements] 에러:', err);
    return res.status(500).json({ message: '공지사항 조회 실패' });
  }
}
