import db from '../config/db.js';
import jwt from 'jsonwebtoken';

// 학생 성적 조회 API
export async function getStudentGrades(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];
  let studentId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    studentId = decoded.student_id;
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  const { year, term } = req.query;

  try {
    const [rows] = await db.execute(
      `
      SELECT
        C.course_name,
        C.course_code,
        C.credit,
        E.score,
        E.letter_grade,
        E.grade_point,
        E.pass_fail
      FROM Enrollment E
      JOIN CourseOffering O ON E.offering_id = O.offering_id
      JOIN Course C ON O.course_id = C.course_id
      WHERE
        E.student_id = ?
        AND O.year = ?
        AND O.term = ?
        AND E.score IS NOT NULL
      `,
      [studentId, year, term]
    );

    return res.json(rows);
  } catch (err) {
    console.error('[getStudentGrades] 에러:', err);
    return res.status(500).json({ message: '성적 조회 실패' });
  }
}
