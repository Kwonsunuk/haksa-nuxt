// models/announcementModel.js
import pool from '../config/db.js';

/**
 * @param {number} page
 * @param {number} size
 * @param {string} q 검색어
 * @param {boolean} includeHidden 관리자용 전체조회 여부
 * @returns {Promise<{ rows: any[], totalCount: number }>}
 */
export async function fetchAnnouncements(page = 1, size = 10, q = '', includeHidden = false) {
  const offset   = (page - 1) * size;
  const hasQuery = Boolean(q.trim());
  const like     = `%${q.trim()}%`;

  // 1) 전체 개수 조회
  let countSql      = 'SELECT COUNT(*) AS cnt FROM Announcement';
  const countParams = [];
  const countConds  = [];

  if (!includeHidden) {
    countConds.push('is_visible = 1');
  }
  if (hasQuery) {
    countConds.push('(title LIKE ? OR content LIKE ?)');
    countParams.push(like, like);
  }
  if (countConds.length) {
    countSql += ' WHERE ' + countConds.join(' AND ');
  }
  const [countRows] = await pool.execute(countSql, countParams);
  const totalCount  = countRows[0].cnt;

  // 2) 실제 공지사항 데이터 조회 (LIMIT 은 직접 삽입)
  let selectSql   = `
    SELECT
      A.announcement_id,
      A.title,
      A.content,
      A.posted_date,
      A.is_visible,
      M.name AS posted_by_name
    FROM Announcement A
    JOIN Admin M ON A.posted_by = M.admin_id
  `;
  const selectParams = [];
  const selectConds  = [];

  if (!includeHidden) {
    selectConds.push('A.is_visible = 1');
  }
  if (hasQuery) {
    selectConds.push('(A.title LIKE ? OR A.content LIKE ?)');
    selectParams.push(like, like);
  }
  if (selectConds.length) {
    selectSql += ' WHERE ' + selectConds.join(' AND ');
  }

  // 바인딩 대신 직접 숫자를 삽입
  selectSql += ` ORDER BY A.posted_date DESC LIMIT ${offset}, ${size}`;

  const [rows] = await pool.execute(selectSql, selectParams);
  return { rows, totalCount };
}



// LIMIT ?, ? 바인딩 때문에 현재 ER_WRONG_ARGUMENTS 오류 발생 offset을 직접 삽입해야하나?
// 직접 삽입해야하네.

// 조회(관리자용)
export async function fetchAllAnnouncements(page = 1, size = 10, q = '') {
  const offset   = (page - 1) * size;
  const hasQuery = Boolean(q.trim());
  const like     = `%${q.trim()}%`;

  // 1) 전체 개수
  const countSql    = hasQuery
    ? `SELECT COUNT(*) AS cnt FROM Announcement WHERE title LIKE ? OR content LIKE ?`
    : `SELECT COUNT(*) AS cnt FROM Announcement`;
  const countParams = hasQuery ? [like, like] : [];
  const [countRows] = await pool.execute(countSql, countParams);
  const totalCount  = countRows[0].cnt;

  // 2) 페이징
  let selectSql = `
    SELECT 
      A.announcement_id, A.title, A.content, A.posted_date,
      A.is_visible, M.name AS posted_by_name
    FROM Announcement A
    JOIN Admin M ON A.posted_by = M.admin_id
    ${hasQuery ? 'WHERE (A.title LIKE ? OR A.content LIKE ?)' : ''}
    ORDER BY A.posted_date DESC
    LIMIT ${offset}, ${size}
  `;
  const selectParams = hasQuery ? [like, like] : [];
  const [rows] = await pool.execute(selectSql, selectParams);

  return { rows, totalCount };
}


export async function updateAnnouncementVisibility(id, isVisible) {
  const [result] = await pool.execute(
    `UPDATE Announcement
       SET is_visible = ?
     WHERE announcement_id = ?`,
    [isVisible ? 1 : 0, id]
  );
  return result.affectedRows;
}
