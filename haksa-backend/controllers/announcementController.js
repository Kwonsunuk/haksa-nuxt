// controllers/announcementController.js
import jwt from "jsonwebtoken";
import {
  fetchAnnouncements,
  updateAnnouncementVisibility,
  deleteModelAnnouncement,
  updateModelAnnouncement,
} from "../models/announcementModel.js";

export async function getAnnouncements(req, res) {
  const page = parseInt(req.query.page || "1", 10);
  const size = parseInt(req.query.size || "10", 10);
  const q = req.query.q?.trim() || "";

  // 관리자 토큰이면 includeHidden = true
  let includeHidden = false;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.admin_id) includeHidden = true;
    } catch {}
  }

  try {
    const { rows, totalCount } = await fetchAnnouncements(
      page,
      size,
      q,
      includeHidden
    );
    const totalPages = Math.ceil(totalCount / size);
    return res.json({ data: rows, page, size, totalCount, totalPages });
  } catch (err) {
    console.error("[getAnnouncements] 에러:", err);
    return res.status(500).json({ message: "공지사항 조회 실패" });
  }
}

/**
 * PATCH /api/announcements/:id/visibility
 * 관리자만 호출 가능 (authAdminMiddleware 적용)
 * req.params.id 에 해당 공지 ID,
 * req.body.is_visible 에 새 공개 여부(boolean)
 */
export async function toggleVisibility(req, res) {
  const id = parseInt(req.params.id, 10);
  const { is_visible } = req.body;
  if (typeof is_visible !== "boolean") {
    return res
      .status(400)
      .json({ message: "is_visible는 boolean이어야 합니다." });
  }

  try {
    const affected = await updateAnnouncementVisibility(id, is_visible);
    if (affected === 0) {
      return res.status(404).json({ message: "해당 공지를 찾을 수 없습니다." });
    }
    return res.json({ message: "공지 공개 상태가 변경되었습니다." });
  } catch (err) {
    console.error("[toggleVisibility] 에러:", err);
    return res.status(500).json({ message: "공지사항 공개 상태 변경 실패" });
  }
}

/**
 * DELETE /api/announcements/:id
 * 관리자만 호출 가능 (authAdminMiddleware 적용)
 * req.params.id 에 해당 공지 ID
 */
export async function deleteAnnouncement(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "유효하지 않은 공지 ID입니다." });
  }

  try {
    const affected = await deleteModelAnnouncement(id);
    if (affected === 0) {
      return res.status(404).json({ message: "해당 공지를 찾을 수 없습니다." });
    }
    return res.json({ message: "공지사항이 삭제되었습니다." });
  } catch (err) {
    console.error("[deleteAnnouncement] 에러:", err);
    return res.status(500).json({ message: "공지사항 삭제 실패" });
  }
}

/**
 * PATCH /api/announcements/:id
 * 관리자만 호출 가능 (authAdminMiddleware 적용)
 * req.params.id 에 해당 공지 ID,
 * req.body.title, req.body.content 에 새 제목과 내용
 */
export async function updateAnnouncement(req, res) {
  const id = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  if(!title || !content) {
    return res.status(400).json({ message: "제목과 내용을 모두 입력해야 합니다." });
  }

  try {
    const affected = await updateModelAnnouncement(id, title, content);
    if (affected === 0) {
      return res.status(404).json({ message: "해당 공지를 찾을 수 없습니다." });
    }
    return res.json({ message: "공지사항이 수정되었습니다." });
  } catch (error) {
    console.error("[updateAnnouncement] 에러:", error);
    return res.status(500).json({ message: "공지사항 수정 실패" });
  }
};
// 나머지 토스트도 변경하기..