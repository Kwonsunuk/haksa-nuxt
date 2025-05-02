// haksa-backend/middleware/authStudentMiddleware.js
import jwt from 'jsonwebtoken';

/**
 * 학생 전용 인증 미들웨어
 * 요청 헤더: Authorization: Bearer <token>
 */
export function authStudentMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.student_id) {
      return res.status(403).json({ message: '학생 권한이 없습니다.' });
    }
    // 검증된 student_id를 req.user에 저장
    req.user = { student_id: decoded.student_id };
    next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
}