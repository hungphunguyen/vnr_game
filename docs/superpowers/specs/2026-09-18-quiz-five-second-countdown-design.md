# Thiết kế đếm ngược trả lời 5 giây

## Mục tiêu

Giảm thời gian trả lời mỗi câu hỏi từ 10 giây xuống 5 giây, tính từ khi người chơi bấm nút bắt đầu trả lời.

## Thay đổi

- Đặt `CONFIG.questionDurationMs` thành `5000` trong `game.js`. Bộ đếm, hạn chót và đánh giá hết giờ tiếp tục dùng cấu hình trung tâm này.
- Đổi nhãn thời gian mặc định của hộp câu hỏi thành `5 giây` để giao diện đúng trước khi bộ đếm bắt đầu.
- Cập nhật kiểm thử về ngưỡng hết giờ và các kiểm thử kiểm tra chuỗi/cấu hình từ 10 giây sang 5 giây.

## Không thay đổi

- Nút bắt đầu, luồng trả lời đúng/sai/hết giờ, luật cược và tính điểm giữ nguyên.
- Trạng thái cảnh báo khẩn cấp vẫn được áp dụng khi còn tối đa 5 giây; với giới hạn mới, nó sẽ xuất hiện trong toàn bộ thời gian trả lời.

## Kiểm thử

- Câu trả lời đúng tại 5.000 ms được coi là hết giờ.
- Bộ kiểm thử hiện có chạy thành công và kiểm tra nhãn ban đầu/cấu hình 5 giây.
