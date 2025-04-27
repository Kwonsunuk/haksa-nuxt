// haksa-backend/middleware/authAdminMiddleware.js
import jwt from 'jsonwebtoken';

/**
 * 관리자 권한 확인 미들웨어
 * 요청 헤더의 Bearer 토큰을 검증하고, payload에 admin_id가 있으면 다음으로 넘깁니다.
 */
export function authAdminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: '관리자 토큰이 없습니다.' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: '유효한 Bearer 토큰 형식이 아닙니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin_id) {
      return res.status(403).json({ message: '관리자 전용 기능입니다.' });
    }
    req.admin = { admin_id: decoded.admin_id, user_id: decoded.user_id };
    return next();
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 관리자 토큰입니다.' });
  }
}
