// 로그인 관련 라우터

/**
 * Express 프레임워크에서 Router 기능만 가져온다.
 * Router는 Express 애플리케이션의 라우팅을 정의하는 데 사용된다.
 * Router는 여러 개의 라우트를 그룹화하여 관리할 수 있도록 도와준다.
 * 이를 통해 코드의 가독성을 높이고, 유지보수를 쉽게 한다.
 * Router는 미니 앱처럼 작동하며, URL과 HTTP 메서드에 따라 요청을 처리하는 핸들러를 정의할 수 있다.
 * Router는 Express 애플리케이션의 일부로 사용되며, 다른 미들웨어와 함께 사용할 수 있다.
 */
import express from 'express';

/**
 * 로그인 로직이 정의된 컨트롤러의 login 함수를 import한다.
 * 이 함수는 사용자가 로그인할 때 호출된다.
 * 로그인 요청이 들어오면 이 함수가 실제로 DB 확인, JWT 발급 등을 처리한다.
 * 이 함수는 비즈니스 로직을 처리하는 부분으로, 라우터와 분리하여 관리한다.
 * 이를 통해 코드의 가독성을 높이고, 유지보수를 쉽게 한다.
 */
import { login, me } from '../controllers/authController.js';


/**
 * Express Router 객체를 생성한다.
 * 이 객체는 라우팅을 정의하는 데 사용된다.
 * 이 router 객체를 통해 여러 개의 API 경로를 정의할 수 있다.
 */
const router = express.Router();

/**
 * 로그인 API 경로를 정의한다.
 * 클라이언트가 POST /api/login 요청을 보내면, login 함수를 호출한다.
 * 이 함수는 사용자가 로그인할 때 호출된다.
 * -"api/auth"는 server.js에서 미리 붙이므로 여기서는 "/login"만 정의한다.
 */
router.post('/login', login);

/**
 * 사용자 정보 조회 API 경로를 정의한다.
 * 클라이언트가 GET /api/me 요청을 보내면, me 함수를 호출한다.
 * 이 함수는 사용자의 정보를 조회할 때 호출된다.
 * 이 함수는 비즈니스 로직을 처리하는 부분으로, 라우터와 분리하여 관리한다.
 * 이를 통해 코드의 가독성을 높이고, 유지보수를 쉽게 한다.
 */
router.get('/me', me);

/**
 * 이 router 객체를 외부에서 사용할 수 있도록 export 한다.
 * 이 router 객체는 다른 파일에서 import해서 사용할 수 있다.
 * 예를 들어, server.js 파일에서 import해서 사용할 수 있다.
 * 이 router 객체를 통해 여러 개의 API 경로를 정의할 수 있다.
 * 이 router 객체는 Express 애플리케이션의 일부로 사용된다.
 */
export default router;

/*
Client → POST /api/login
→ server.js → auth.js → login()
→ authController.js → userModel.js → DB 쿼리
→ 결과 반환
*/