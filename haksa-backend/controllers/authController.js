// controllers/authController.js

/**
 * JWT(JSON Web Token) 모듈을 불러온다.
 * JWT는 JSON 형식으로 정보를 안전하게 전송하기 위한 개방형 표준이다.
 * JWT는 주로 인증 및 정보 교환에 사용된다.
 * JWT는 세 부분으로 구성되어 있다.
 * Header, Payload, Signature로 구성되어 있다.
 * Header는 토큰의 유형과 해싱 알고리즘을 정의한다.
 * Payload는 전송할 정보를 포함한다.
 * Signature는 Header와 Payload를 기반으로 생성된 서명이다.
 * Signature는 비밀 키를 사용하여 생성된다.
 * Signature는 토큰의 무결성을 보장한다.
 * JWT는 클라이언트와 서버 간의 인증 정보를 안전하게 전송하는 데 사용된다.
 * JWT는 클라이언트가 서버에 요청을 보낼 때마다 포함된다.
 * 서버는 JWT를 검증하여 클라이언트의 인증 정보를 확인한다.
 * JWT는 클라이언트와 서버 간의 상태를 유지하지 않는다.
 * 즉, 서버는 클라이언트의 상태를 저장하지 않는다.
 * 클라이언트는 JWT를 사용하여 서버에 인증 정보를 전송한다.
 * 로그인 성공 시 사용자의 정보를 암호화한 JWT 토큰을 발급한다.
 * 클라이언트는 이 JWT 토큰을 저장하고, 이후 요청 시 이 토큰을 서버에 전송한다.
 */
import jwt from "jsonwebtoken";

/**
 * bcrypt 모듈을 불러온다.
 * bcrypt는 비밀번호 해싱을 위한 라이브러리이다.
 * bcrypt는 비밀번호를 안전하게 저장하기 위해 사용된다.
 * 사용자의 비밀번호는 DB에 암호화된 상태로 저장되기 때문에
 * 사용자가 입력한 평문 비밀번호화 비교할 때 bcrypt를 사용한다.
 */
import bcrypt from "bcrypt";

/**
 * 사용자 정보를 DB에서 가져오는 모델을 import한다.
 * student_id로 학생 데이터를 가져온다.
 */
import { findStudentById } from "../models/userModel.js";

/**
 * 로그인 요청이 들어왔을 때 실행되는 컨트롤러 함수이다.
 */
export async function login(req, res) {
  // 클라이언트에서 보낸 요청 본문을 가져와 로그인 정보를 추출한다.
  // req.body는 클라이언트에서 보낸 JSON 형식의 요청 본문을 파싱한 결과이다.
  const { student_id, password } = req.body;

  try {
    // DB에서 student_id로 해당하는 사용자 정보를 찾는 쿼리를 실행한다.
    // findStudentById 함수는 userModel.js에서 정의된 함수이다.
    const user = await findStudentById(student_id);

    //  사용자가 없을 경우 401 응답 (Unauthorized)
    if (!user)
      return res.status(401).json({ message: "존재하지 않는 사용자입니다." });

    // 비밀번호가 맞는지 bcrypt로 확인 (DB 비밀번호는 암호화된 상태)
    // bcrypt.compare는 비밀번호를 비교하는 함수이다.
    // 첫 번째 인자는 평문 비밀번호, 두 번째 인자는 암호화된 비밀번호이다.
    // 비밀번호가 일치하면 true를 반환하고, 일치하지 않으면 false를 반환한다.
    const isMatch = await bcrypt.compare(password, user.password);

    // 비밀번호가 일치하지 않을 경우 401 응답 (Unauthorized)
    if (!isMatch)
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

    // 비밀번호가 일치하면 JWT 토큰을 생성한다.
    // jwt.sign은 JWT 토큰을 생성하는 함수이다.
    // 첫 번째 인자는 payload, 두 번째 인자는 비밀 키, 세 번째 인자는 옵션이다.
    // payload는 JWT 토큰에 포함될 정보를 담고 있다.
    // 비밀 키는 JWT 토큰을 서명하는 데 사용된다.
    // 옵션은 JWT 토큰의 만료 시간 등을 설정할 수 있다.
    // expiresIn은 JWT 토큰의 만료 시간을 설정하는 옵션이다.
    // 1시간 후 만료되도록 설정한다.
    const token = jwt.sign(
      { student_id: user.student_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 로그인 성공 시 토큰과 학생 정보를 클라이언트에 반환한다.
    // res.json은 JSON 형식으로 응답을 반환하는 함수이다.
    // 클라이언트는 이 토큰을 저장하고, 이후 요청 시 이 토큰을 서버에 전송한다.
    // 서버는 JWT를 검증하여 클라이언트의 인증 정보를 확인한다.
    res.json({ token, student: { id: user.student_id, name: user.name } });
  } catch (err) {
    // 예외 발생 시 500 응답 (서버 내부 오류)
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
}
