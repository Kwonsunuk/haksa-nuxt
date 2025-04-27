// controller/adminAuthController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findAdminByUserId } from "../models/adminModel.js";

/**
 * 관리자 로그인 API
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 * @throws {Error} 로그인 실패 시 에러 발생
 * @description
 * 1. 요청 본문에서 userId와 password를 추출한다.
 * 2. userId로 DB에서 관리자를 조회한다.
 * 3. 관리자가 존재하지 않으면 401 에러를 반환한다.
 * 4. 관리자가 존재하면 비밀번호를 비교한다.
 * 5. 비밀번호가 일치하지 않으면 401 에러를 반환한다.
 * 6. 비밀번호가 일치하면 JWT 토큰을 생성한다.
 * 7. JWT 토큰을 클라이언트에 반환한다.
 * 8. JWT 토큰은 클라이언트에서 저장하고, 이후 요청 시 Authorization 헤더에 포함하여 서버에 전송한다.
 */
export async function loginAdmin(req, res) {
  console.log("[loginAdmin] body:", req.body);
  const { user_id, password } = req.body;

  // 요청 검증
  if (!user_id || !password) {
    return res.status(400).json({ message: "아이디와 비밀번호를 입력하세요." });
  }

  // 1. 해당 user_id로 관리자를 조회한다.
  const admin = await findAdminByUserId(user_id);
  // 2. 관리자가 존재하지 않으면 401 에러를 반환한다.
  if (!admin) {
    return res.status(401).json({ message: "관리자가 존재하지 않습니다." });
  }

  // 3. 비밀번호를 비교한다.
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  // 4. 비밀번호가 일치하지 않으면 401 에러를 반환한다.
  if (!isPasswordValid) {
    return res.status(401);
  }

  // 5. 비밀번호가 일치하면 JWT 토큰을 생성한다.
  const token = jwt.sign(
    { admin_id: admin.admin_id, user_id: admin.user_id,   name: admin.name},
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // 1시간 후 만료
  );

  // 6. JWT 토큰을 클라이언트에 반환한다.
  return res.json({
    message: "로그인 성공",
    token,
    admin: {
      admin_id: admin.admin_id,
      user_id: admin.user_id,
      name: admin.name,
    },
  });
  // 7. 클라이언트는 JWT 토큰을 저장하고, 이후 요청 시 Authorization 헤더에 포함하여 서버에 전송한다.
  // 8. JWT 토큰은 서버에서 검증하여 유효성을 확인한다.
  // 9. 유효한 토큰이면 요청을 처리하고, 유효하지 않은 토큰이면 401 에러를 반환한다.
}

/**
 * 관리자 인증 확인용 API
 */

export function meAdmin(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({
      message: "인증 성공",
      admin: {
        admin_id: decoded.admin_id,
        user_id: decoded.user_id,
        name: decoded.name,
      },
    });
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}
