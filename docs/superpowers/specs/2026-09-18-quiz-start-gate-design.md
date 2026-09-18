# Thiết kế nút bắt đầu câu hỏi và đếm ngược 10 giây

## Mục tiêu

Cho người chơi thời gian đọc câu hỏi trước khi đồng hồ bắt đầu. Bộ đếm chỉ chạy sau thao tác chủ động bấm nút bắt đầu trả lời.

## Luồng giao diện

1. Sau khi người chơi chọn mức Dễ hoặc Khó, hộp câu hỏi mở với nội dung, bốn đáp án bị khóa và đồng hồ hiển thị `10 giây`.
2. Nút `Bắt đầu trả lời` xuất hiện ngay trong khu vực đồng hồ.
3. Khi người chơi bấm nút, đáp án được mở, nút bị ẩn và đồng hồ bắt đầu giảm từ 10 giây.
4. Nếu hết 10 giây, câu trả lời bị coi là sai như luồng hiện có.
5. Không có bộ đếm nào chạy hoặc thời gian phản hồi nào được tính trước khi nút bắt đầu được bấm.

## Ràng buộc

- Giữ nguyên luật Dễ/Khó, giới hạn 1 hoặc 3 ô, kết thúc lượt thủ công và cơ chế tính điểm.
- Giữ nguyên cảnh báo khi còn 5 giây cuối.
- Nút bắt đầu chỉ dùng một lần cho mỗi câu hỏi đang mở.
- Hủy hộp câu hỏi vẫn bị chặn như hiện tại.

## Kiểm thử

- HTML có nút `Bắt đầu trả lời` trong hộp câu hỏi.
- Cấu hình thời lượng câu hỏi là 10.000 ms và nội dung hiển thị là 10 giây.
- Đáp án không được kích hoạt trước khi nút bắt đầu được bấm.
- Bấm nút bắt đầu kích hoạt đáp án và khởi động bộ đếm.
- Luồng hết giờ vẫn gửi câu trả lời sai sau 10 giây.
