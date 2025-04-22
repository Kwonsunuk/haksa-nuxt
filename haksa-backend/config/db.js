// haksa-backend/config/db.js MySQL 연결 모듈

/**
 * mysql2/promise 모듈을 불러온다.
 * mysql2는 MySQL 데이터베이스와 연결하기 위한 Node.js 모듈이다.
 * promise는 비동기 처리를 위한 Promise 기반의 API를 제공한다.
 * 이를 통해 비동기적으로 MySQL 데이터베이스에 연결하고 쿼리를 실행할 수 있다.
 * 즉, await 키워드를 사용해서 비동기 DB 쿼리를 깔끔하게 처리할 수 있다.
 */
import mysql from 'mysql2/promise';

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

dotenv.config(); // .env의 DB 설정 값을 process.env에 등록한다.

/**
 * MySQL 데이터베이스 연결 풀을 생성한다.
 * connectionLimit: 10은 최대 10개의 연결을 허용한다.
 * waitForConnections: true는 연결이 없을 때 대기하도록 설정한다.
 * 이 설정은 서버의 부하를 줄이고, 데이터베이스 연결을 효율적으로 관리하는 데 도움이 된다.
 * connectionLimit을 설정하지 않으면 기본값은 10이다.
 * waitForConnections을 설정하지 않으면 기본값은 false이다.
 * 이 경우, 연결이 없으면 에러가 발생한다.
 * connectionLimit을 설정하면, 동시에 처리할 수 있는 연결 수를 제한하여 서버의 부하를 줄일 수 있다.
 * waitForConnections을 설정하면, 연결이 없을 때 대기하도록 설정하여 서버의 부하를 줄일 수 있다.
 * pool을 통해 DB에 연결하고 쿼리를 실행한다.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

/**
 * 외부에서 이 pool 객체를 사용할 수 있도록 export 한다.
 * 이 pool 객체를 통해 DB에 연결하고 쿼리를 실행할 수 있다.
 * 다른 파일에서 import해서 pool.query()로 SQL 실행이 가능하다.
 * import pool from '../config/db.js';
 * await pool.query(...); // 이렇게 사용
 * pool.query()는 비동기 함수이므로 await 키워드를 사용해야 한다.
 * await 키워드를 사용하지 않으면, Promise 객체가 반환된다.
 * 이 Promise 객체를 사용하려면, then() 메서드를 사용해야 한다.
 * 예를 들어, pool.query(...).then(result => { ... })와 같이 사용한다.
 * 하지만 async/await 문법을 사용하는 것이 더 깔끔하고 가독성이 좋다.
 * 따라서, 가능하면 async/await 문법을 사용하는 것이 좋다.
 * async/await 문법을 사용하면, 비동기 코드를 동기 코드처럼 작성할 수 있다.
 * 즉, 코드의 흐름을 더 쉽게 이해할 수 있다.
 */
export default pool;
