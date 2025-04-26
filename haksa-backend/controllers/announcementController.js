// controllers/announcementController.js
import { fetchVisibleAnnouncements } from '../models/announcementModel.js';


export async function getAnnouncements(req, res) {
  // 쿼리 파라미터 파싱
  const page = parseInt(req.query.page || '1', 10);
  const size = parseInt(req.query.size || '10', 10);

  try {
    const { rows, totalCount } = await fetchVisibleAnnouncements(page, size);
    const totalPages = Math.ceil(totalCount / size);

    return res.json({
      data: rows,
      page,
      size,
      totalCount,
      totalPages,
    });
  } catch (err) {
    console.error('[getAnnouncements] 에러:', err);
    return res.status(500).json({ message: '공지사항 조회 실패' });
  }
}

