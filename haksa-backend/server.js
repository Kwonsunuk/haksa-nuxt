// haksa-backend/server.js

/**
 * Express 프레임워크를 불러온다.
 * 웹 서버를 쉽게 만들 수 있게 도와주는 Node.js 기반의 프레임워크
 */
import express from 'express';

/**
 * CORS(Cross-Origin Resource Sharing) 미들웨어 모듈을 불러온다.
 * 프론트엔드와 백엔드가 서로 다른 도메인/포트를 쓸 때, 브라우저 보안 정책을 우회하기 위해 필요하다.
 * 예를들어, 프론트엔드가 localhost:3000에 있고, 백엔드가 localhost:5000에 있을 때, CORS를 설정해야 한다.
 * 이렇게 하지 않으면, 브라우저가 보안 상의 이유로 요청을 차단한다.
 */
import cors from 'cors';

/**
 * dotenv 모듈을 불러온다.
 * 환경 변수(.env 파일)를 Node.js에서 사용할 수 있도록 설정
 * .env 파일에 있는 환경 변수를 process.env 객체를 통해 접근할 수 있게 해준다.
 * 비밀번호, DB 주소, API 키 등과 같은 민감한 정보를 코드에 직접 작성하지 않고 관리할 수 있다.
 * 예를 들어, process.env.DB_HOST와 같이 사용한다.
 * .env 파일은 보안 상의 이유로 git에 업로드하지 않는 것이 좋다.
 * gitignore 파일에 .env를 추가하여 git에 업로드하지 않도록 설정할 수 있다.
 * .env 파일은 보통 프로젝트 루트 디렉토리에 위치하며, key=value 형태로 환경 변수를 정의한다.
 * 예를 들어, DB_HOST=localhost와 같이 작성한다.
 * 이 값을 코드에서 사용할 때는 process.env.DB_HOST와 같이 사용한다.
 * dotenv.config()를 호출하면, .env 파일에 정의된 환경 변수가 process.env 객체에 추가된다.
 * 이 객체를 통해 환경 변수에 접근할 수 있다.
 */
import dotenv from 'dotenv';

/**
 * 로그인 관련 라우터를 불러온다.
 * 로그인 요청을 처리하는 라우터
 */
import authRouter from './routes/auth.js';

/**
 * 시간표 관련 라우터를 불러온다.
 * 시간표 조회 요청을 처리하는 라우터
 */
import scheduleRouter from './routes/schedule.js';

/**
 * 성적 관련 라우터를 불러온다.
 * 성적 조회 요청을 처리하는 라우터
 */
import gradeRouter from './routes/grade.js';

/**
 * 관리자 관련 라우터를 불러온다.
 * 관리자 로그인 및 정보 조회 요청을 처리하는 라우터
 */
import adminRouter from './routes/admin.js';

/**
 * 공지사항 관련 라우터를 불러온다.
 */

import announcementRouter from './routes/announcement.js';

import tuitionRoutes from './routes/tuition.js';


// .env 파일을 로드하여 환경 변수를 설정한다.
dotenv.config();

/**
 * Express 애플리케이션을 생성한다.
 * 이 app 객체를 통해 모든 서버 설정과 경로 연결을 진행한다.
 * express() 함수는 Express 애플리케이션 객체를 생성한다.
 */
const app = express();

/**
 * CORS 미들웨어를 설정한다.
 * 모든 도메인에서 들어오는 요청을 허용한다.
 * 이 설정은 보안 상의 이유로 주의해서 사용해야 한다.
 * 특정 도메인만 허용하고 싶다면, cors({ origin: 'http://example.com' })과 같이 설정할 수 있다.
 * 이렇게 하면, http://example.com 도메인에서 오는 요청만 허용된다.
 * 보안을 강화하려면 origin을 특정 도메인으로 설정하는 것이 좋다.
 */
app.use(cors());

/**
 * JSON 요청 본문을 파싱하기 위한 미들웨어를 설정한다.
 * express.json()은 JSON 형식의 요청 본문을 파싱하여 req.body에 추가한다.
 * 클라이언트에서 JSON 형식으로 데이터를 보낼 때, 이 미들웨어가 필요하다.
 * 예를 들어, 클라이언트에서 { "name": "John" }과 같은 JSON 데이터를 보낼 때, 이 미들웨어가 필요하다.
 * 이 미들웨어가 없으면, req.body는 undefined가 된다.
 * 따라서, 클라이언트에서 보낸 JSON 데이터를 서버에서 처리할 수 없다.
 * 이 미들웨어는 POST, PUT, PATCH 요청에서 주로 사용된다.
 * GET 요청에서는 본문(body)이 없기 때문에, 이 미들웨어가 필요하지 않다.
 * 하지만, GET 요청에서도 본문을 사용할 수 있지만, 일반적이지 않다.
 * 본문을 사용하려면, express.urlencoded() 미들웨어를 사용해야 한다.
 * express.urlencoded()는 URL 인코딩된 데이터를 파싱하여 req.body에 추가한다.
 * 이 미들웨어는 주로 HTML 폼에서 데이터를 보낼 때 사용된다.
 * 예를 들어, 클라이언트에서 name=John&age=30과 같은 데이터를 보낼 때, 이 미들웨어가 필요하다.
 * 이 미들웨어가 없으면, req.body는 undefined가 된다.
 * 따라서, 클라이언트에서 보낸 URL 인코딩된 데이터를 서버에서 처리할 수 없다.
 */

app.use(express.json());

/**
 * /api/auth 경로로 들어오는 요청을 authRouter에서 처리하도록 설정한다.
 * authRouter는 로그인 관련 라우터이다.
 * 이 설정은 authRouter에서 정의한 모든 경로가 /api/auth로 시작하도록 한다.
 * 예를 들어, authRouter에서 /login 경로를 정의하면, 실제 경로는 /api/auth/login이 된다.
 * 이 설정은 라우터를 모듈화하여 코드의 가독성을 높이고, 유지보수를 쉽게 한다.
 * 라우터를 모듈화하면, 각 라우터 파일에서 관련된 경로와 로직을 정의할 수 있다.
 * 이렇게 하면, 각 라우터 파일이 독립적으로 동작하며, 서로 간섭하지 않는다.
 * 또한, 각 라우터 파일에서 관련된 미들웨어와 로직을 정의할 수 있다.
 * 예: POST /api/auth/login -> routes/auth.js의 login 함수 호출
 */
app.use('/api/auth', authRouter);

app.use('/api/schedule', scheduleRouter)

app.use('/api/grades', gradeRouter);

app.use('/api/admin', adminRouter);

app.use('/api/announcements', announcementRouter);

app.use('/api/admin/announcements', announcementRouter)

// 학생용 학비 조회 및 납부 처리 라우트
app.use('/api', tuitionRoutes);


/**
 * 서버가 실행될 포트를 지정한다.
 * process.env.PORT는 환경 변수에서 포트를 가져온다.
 * 만약 환경 변수가 설정되어 있지 않으면, 기본값으로 4000을 사용한다.
 */
const PORT = process.env.PORT || 4000;

/**
 * 지정한 포트에서 Express 서버를 실행한다.
 * app.listen() 함수는 서버를 시작하고, 지정한 포트에서 요청을 대기한다.
 * 서버가 시작되면, 지정한 포트에서 들어오는 요청을 처리할 준비가 된다.
 * 이 함수는 두 번째 인자로 콜백 함수를 받는다.
 * 이 콜백 함수는 서버가 성공적으로 시작되었을 때 호출된다.
 * 이 콜백 함수에서 서버가 시작되었다는 메시지를 콘솔에 출력한다.
 * 이 메시지는 서버가 정상적으로 실행되고 있음을 나타낸다.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* 
서버가 시작되면, 콘솔에 메시지를 출력한다.
이 메시지는 서버가 정상적으로 실행되고 있음을 나타낸다.
예를 들어, "Server is running on port 4000"과 같이 출력된다.
이 메시지를 통해 개발자는 서버가 정상적으로 실행되고 있는지 확인할 수 있다.
만약 서버가 실행되지 않으면, 이 메시지는 출력되지 않는다.
이 경우, 서버가 실행되지 않은 이유를 찾아야 한다.
예를 들어, 포트가 이미 사용 중이거나, 코드에 오류가 있는 경우 등이 있다.
이 경우, 콘솔에 오류 메시지가 출력된다.
이 오류 메시지를 통해 개발자는 문제를 해결할 수 있다.
서버가 실행되면, 클라이언트는 이 서버에 요청을 보낼 수 있다.
클라이언트는 서버에 요청을 보내고, 서버는 요청을 처리하여 응답을 반환한다.
클라이언트는 서버의 응답을 받아서 처리한다.
이 과정에서 클라이언트와 서버 간의 데이터 전송이 이루어진다.
이 데이터 전송은 HTTP 프로토콜을 통해 이루어진다.
HTTP 프로토콜은 클라이언트와 서버 간의 데이터 전송을 위한 규약이다.
HTTP 프로토콜은 요청(request)과 응답(response)으로 이루어져 있다.
클라이언트는 서버에 요청을 보내고, 서버는 요청을 처리하여 응답을 반환한다.
이 요청과 응답은 JSON 형식으로 이루어진다.
JSON 형식은 데이터를 교환하기 위한 경량 데이터 포맷이다.
JSON 형식은 사람이 읽기 쉽고, 기계가 분석하기 쉽다.
JSON 형식은 데이터를 키-값 쌍으로 표현한다.
예를 들어, {"name": "John", "age": 30}과 같이 표현된다.
이 JSON 형식은 JavaScript 객체와 유사하다.
JSON 형식은 다양한 프로그래밍 언어에서 지원된다.
JSON 형식은 데이터 전송에 많이 사용된다.
JSON 형식은 웹 API에서 데이터를 주고받을 때 많이 사용된다.
JSON 형식은 클라이언트와 서버 간의 데이터 전송을 쉽게 해준다.
JSON 형식은 데이터를 직렬화(serialization)하고 역직렬화(deserialization)하는 과정을 거친다.
직렬화는 데이터를 문자열로 변환하는 과정이다.
역직렬화는 문자열을 데이터로 변환하는 과정이다.
직렬화와 역직렬화는 데이터를 전송하기 위해 필요하다.
직렬화와 역직렬화는 데이터를 전송하고 저장하는 데 필요한 과정이다.
*/
