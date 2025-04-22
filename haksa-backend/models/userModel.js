// 학생 유저 DB 쿼리

/**
 * MySQl 데이터베이스와 연결하기 위한 pool 객체를 import한다.
 * DB 연결을 직접 관리하는 대신, pool을 사용하여 연결을 효율적으로 관리한다.
 * pool은 여러 개의 연결을 미리 만들어두고, 필요할 때마다 재사용하는 방식이다.
 * 이를 통해 DB 연결을 효율적으로 관리하고, 성능을 향상시킬 수 있다.
 */
import pool from "../config/db.js";


/**
 * 학번으로 학생을 조회하는 함수이다.
 * DB에서 student_id로 학생 정보를 가져온다.
 * 비밀번호 비교 및 로그인 처리를 위해 사용된다.
 */
export async function findStudentById(student_id) {
    // pool.query()를 통해 DB에 SQL 쿼리를 보낸다.
    // 첫 번째 인자는 SQL 쿼리, 두 번째 인자는 쿼리의 파라미터이다.
    // ?는 파라미터 자리 표시자이다.
    // ?는 배열의 인덱스와 매칭된다.
    // [student_id]는 student_id 값을 쿼리에 바인딩한다.
    // 이 방식은 SQL 인젝션 공격을 방지하는 데 도움이 된다.
    // SQL 인젝션 공격은 악의적인 사용자가 SQL 쿼리를 조작하여 DB에 접근하는 공격이다.
    // 예를 들어, ' OR 1=1; --'와 같은 값을 student_id로 보내면,
    // DB에서 모든 데이터를 가져올 수 있다.
    // 이를 방지하기 위해 ?를 사용하여 파라미터를 바인딩한다.
    // 이렇게 하면, DB에서 쿼리를 실행할 때 ?를 실제 값으로 대체한다.
    // 이 과정에서 SQL 인젝션 공격을 방지할 수 있다.
    const [rows] = await pool.query(
        "SELECT * FROM student WHERE student_id = ?",
        [student_id]
    );

    // rows는 쿼리 결과를 담고 있는 배열이다.
    // 쿼리 결과가 없으면 빈 배열이 반환된다.
    // 쿼리 결과가 있을 경우, 첫 번째 결과를 반환한다.
    // rows[0]은 첫 번째 결과를 의미한다.
    // 만약 쿼리 결과가 없으면 undefined가 반환된다.
    // 이 경우, 사용자가 존재하지 않는 것으로 간주한다.
    // 따라서, rows[0]이 undefined이면 사용자가 존재하지 않는 것이다.
    return rows[0];
}

/*
client → POST /api/login
→ routes/auth.js → login()
→ controllers/authController.js → findStudentById(student_id)
→ models/userModel.js → DB SELECT

반환 예시(가정)
{
  student_id: 'S20230001',
  password: '$2b$10$DIE...암호화된비밀번호',
  name: '김학생',
  email: 'student@email.com'
}

 */