// models/announcementModel.js
import pool from '../config/db.js';

/**
 * 학생용 공지사항 조회
 * @returns {Promise<Array>} 공지사항 배열
 */
export async function fetchVisibleAnnouncements() {
  const [rows] = await pool.execute(`
    SELECT 
      A.announcement_id,
      A.title,
      A.content,
      A.posted_date,
      M.name AS posted_by_name
    FROM Announcement A
    JOIN Admin M ON A.posted_by = M.admin_id
    WHERE A.is_visible = 1
    ORDER BY A.posted_date DESC
  `);
  return rows;
}
