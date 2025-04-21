# haksa-nuxt

# 🎓 학사정보 열람 시스템 - Database 설계

본 프로젝트는 **유학생 대상 학사정보 열람 시스템** 구축을 위한 데이터베이스 설계 문서입니다.  
학생은 로그인 후 성적, 수강 목록, 학비 정보, 공지사항 등을 **열람 전용**으로 확인할 수 있습니다.  
(관리자는 공지사항 작성 및 열람 가능)

---

## 🏗️ ERD 개요

[![ERD](./docs/haksa-erd.png)](https://github.com/user-attachments/assets/8c2dc425-42e9-4f67-9669-7d860fd537ad) <!-- 실제 이미지 경로에 맞게 변경 -->

- 총 11개 테이블로 구성된 관계형 DB
- 핵심 기능: 성적 열람, 수강 목록, 고지서/분할납부 확인, 공지사항 열람
- 실제 학사 시스템에 가까운 현실적인 구조 반영

---

## 🧩 테이블 목록 및 역할

| 테이블 | 설명 |
|--------|------|
| `Student` | 학생 기본 정보 (로그인, 학과 연결 등) |
| `Department` | 학과 정보 (국문/영문 명칭) |
| `Professor` | 교수 정보 |
| `Course` | 과목 정보 |
| `CourseOffering` | 개설 과목 (연도, 학기, 섹션 단위 개설) |
| `Enrollment` | 수강 및 성적 기록 (점수, 등급, 패스 여부 등) |
| `ClassSchedule` | 주 단위 수업 요일 정보 |
| `TuitionInvoice` | 학생별 등록금 고지서 (학기 단위) |
| `Installment` | 고지서에 따른 분할 납부 상태 |
| `Admin` | 공지사항을 등록하는 관리자 정보 |
| `Announcement` | 공지사항 게시글 |

---

## 🔗 테이블 관계 요약

- `Student.dept_id` → `Department.dept_id`
- `Course.dept_id` → `Department.dept_id`
- `CourseOffering.course_id` → `Course.course_id`
- `CourseOffering.professor_id` → `Professor.professor_id`
- `Enrollment.student_id` → `Student.student_id`
- `Enrollment.offering_id` → `CourseOffering.offering_id`
- `ClassSchedule.offering_id` → `CourseOffering.offering_id`
- `TuitionInvoice.student_id` → `Student.student_id`
- `Installment.invoice_id` → `TuitionInvoice.invoice_id`
- `Announcement.posted_by` → `Admin.admin_id`

---

## 🧾 주요 설계 특징

- 학생은 **로그인 후 자신에게 해당되는 정보만 열람** 가능
- 수강 내역과 성적은 `Enrollment` 테이블에 통합 저장
- `TuitionInvoice` + `Installment`를 통해 유학생 대상 분납 기능 반영
- 공지사항은 관리자만 등록 가능하며, `Announcement`로 관리
- Bootstrap 기반의 프론트엔드와 연동 고려한 실용적 데이터 구조

---

## 📁 기타 정보

- DBMS: **MySQL 8.x 기준 설계**
- 문자셋: `utf8mb4`, 정렬 방식: `utf8mb4_unicode_ci`
- 테이블 생성 시 외래키(FK) 제약조건 포함
- 날짜 컬럼은 `datetime` 혹은 `date` 사용

---

## ✍️ 향후 확장 고려 사항

- `학생 로그인 로그`, `휴학/복학`, `시간표 PDF 출력`, `성적 통계 조회` 등 기능 확장 가능
- `관리자 페이지`는 별도 개발 가능 (공지사항 등록/수정/삭제)

---

> Designed by [권순욱] — Powered by Nuxt3 + MySQL + Pinia  
> 본 설계는 연습 및 포트폴리오 용도로 제작되었으며, 실제 학사 운영 시스템에 근접한 구조로 모델링되었습니다.
