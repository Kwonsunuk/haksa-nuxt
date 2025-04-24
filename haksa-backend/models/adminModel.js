// 관리자 유저 DB 모델
import pool from '../config/db.js';

/**
 * user_id(관리자 로그인 ID)로 관리자 조회
 * @param {string} userId
 * @returns {Promise<Admin|null>}
 */
export async function findAdminByUserId(userId) {
  
  const [rows] = await pool.execute(
    'SELECT admin_id, user_id, password, name FROM Admin WHERE user_id = ?',
    [userId]
  );
  return rows[0] || null;
}


