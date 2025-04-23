// controllers/scheduleController.js
import db from "../config/db.js";
import jwt from "jsonwebtoken";

export async function getStudentSchedule(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  const token = authHeader.split(" ")[1];
  let studentId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    studentId = decoded.student_id;
  } catch (err) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }

  const { year, term } = req.query;

  // 현재 학기 여부 판단 (직접 비교)
  const currentYear = 2025;
  const currentTerm = "SPRING";
  const isCurrentTerm = Number(year) === currentYear && term === currentTerm;

  // SQL SELECT 필드 구성
  const baseFields = `
    C.course_name,
    C.course_code,
    C.credit,
    P.name AS professor,
    S.day_of_week,
    S.start_time,
    S.end_time,
    S.room
  `;

  const gradeFields = `
    , E.score,
    E.letter_grade,
    E.grade_point,
    E.pass_fail
  `;

  try {
    const [rows] = await db.execute(
      `
      SELECT
        ${baseFields}
        ${!isCurrentTerm ? gradeFields : ""}
      FROM Enrollment E
      JOIN CourseOffering O ON E.offering_id = O.offering_id
      JOIN Course C ON O.course_id = C.course_id
      JOIN ClassSchedule S ON S.offering_id = O.offering_id
      JOIN Professor P ON P.professor_id = O.professor_id
      WHERE
        E.student_id = ?
        AND O.year = ?
        AND O.term = ?
      `,
      [studentId, year, term]
    );

    let summary = null;
    if (rows.length > 0 && rows[0].score !== null) {
      const totalScore = rows.reduce(
        (acc, row) => acc + parseFloat(row.score || 0),
        0
      );
      const totalCredit = rows.reduce(
        (acc, row) => acc + parseInt(row.credit),
        0
      );
      const totalGradePoint = rows.reduce(
        (acc, row) => acc + parseFloat(row.grade_point || 0),
        0
      );

      summary = {
        avg_score: parseFloat((totalScore / rows.length).toFixed(2)),
        total_credit: totalCredit,
        gpa: parseFloat((totalGradePoint / totalCredit).toFixed(2)),
      };
    }

    return res.json(rows, summary);
  } catch (err) {
    console.error("[getStudentSchedule] 에러:", err);
    return res.status(500).json({ message: "시간표 조회 실패" });
  }
}
