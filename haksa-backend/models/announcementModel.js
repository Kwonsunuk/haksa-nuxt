// models/announcementModel.js
import pool from '../config/db.js';

/**
 * @param {number} page
 * @param {number} size
 * @returns {Promise<{ rows: any[], totalCount: number }>}
 */
export async function fetchVisibleAnnouncements(page = 1, size = 10) {
  const offset = (page - 1) * size;

  // 1) 전체 개수 조회
  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS cnt
     FROM Announcement
     WHERE is_visible = 1`
  );
  const totalCount = countRows[0].cnt;

  // 2) 페이지 데이터 조회
  // → pool.execute 대신 pool.query 사용
  const [rows] = await pool.query(
    `
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
    LIMIT ?, ?
    `,
    [offset, size]
  );

  return { rows, totalCount };
}



