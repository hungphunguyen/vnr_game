# Kế hoạch thực thi đếm ngược 5 giây cho câu hỏi

> Dựa trên thiết kế: `docs/superpowers/specs/2026-09-18-quiz-five-second-countdown-design.md`

**Mục tiêu:** Giảm thời gian trả lời mỗi câu hỏi từ 10 giây xuống 5 giây, tính từ khi bấm nút bắt đầu.

---

### Task 1: Cập nhật cấu hình và giao diện đếm ngược 5 giây

**Tệp:**
- `index.html`
- `game.js`
- `game.test.js`

**Các bước thực hiện:**
- [ ] **Bước 1: Cập nhật kiểm thử tự động trong `game.test.js` sang 5 giây**
  - Cập nhật test hết giờ tại 5000 ms.
  - Cập nhật test nhãn mặc định `5 giây` và `Còn <strong>5 giây</strong>`.
  - Cập nhật test cấu hình `questionDurationMs: 5000`.
- [ ] **Bước 2: Cập nhật markup mặc định trong `index.html`**
  - Chuyển `Còn <strong>10 giây</strong>` thành `Còn <strong>5 giây</strong>`.
- [ ] **Bước 3: Cập nhật cấu hình và reset nhãn trong `game.js`**
  - Đổi `CONFIG.questionDurationMs` thành `5000`.
  - Trong `openQuestion`, đặt nhãn hiển thị mặc định `5 giây`.
- [ ] **Bước 4: Chạy toàn bộ test suite để kiểm tra nghiệm thu**
  - Chạy `node game.test.js` đảm bảo tất cả test PASS.
