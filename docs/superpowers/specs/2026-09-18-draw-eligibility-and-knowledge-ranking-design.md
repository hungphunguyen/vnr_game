# Bốc thăm theo hạng và xếp hạng tri thức

## Mục tiêu

Sau khi người chơi chốt phiên, chỉ các người chơi có thứ hạng điểm thứ 2 và thứ 3 mới được bốc thăm. Bốc thăm là cơ chế phạt mô phỏng, có hai kết quả ngẫu nhiên: mất toàn bộ điểm hoặc giảm 70% điểm hiện có (giữ lại 30%). Bảng xếp hạng tri thức phải ưu tiên năng lực trả lời câu khó.

## Phạm vi

- Giữ nguyên cơ chế tính điểm và số lượt chơi hiện có.
- Giữ giới hạn mỗi người chỉ bốc thăm một lần.
- Không thay đổi ngân hàng câu hỏi hoặc thời lượng trả lời.

## Luồng bốc thăm

1. Khi mở tổng kết, tạo bảng xếp hạng điểm hiện hành.
2. Chỉ các mục ở chỉ số hạng 2 và hạng 3 được hiển thị nút bốc thăm, miễn là hạng đó tồn tại. Vì vậy phiên hai người chỉ có hạng 2 đủ điều kiện.
3. Khi người đủ điều kiện bấm ống thăm, hệ thống chọn ngẫu nhiên một trong hai kết quả có xác suất bằng nhau:
   - `lose-all`: điểm trở thành `0`.
   - `reduce-70`: điểm trở thành 30% của điểm trước khi rút.
4. Kết quả hiển thị rõ số điểm đã giảm và số điểm còn lại. Sau khi xác nhận, tổng kết được render lại theo thứ hạng điểm mới.
5. Người đã rút không thể rút lại. Người không nằm ở hạng 2 hoặc hạng 3 không có đường thao tác để rút.

## Dữ liệu và API

- Mỗi người chơi lưu thêm `hardCorrectAnswers`, khởi tạo bằng `0`.
- Khi trả lời đúng câu có `difficulty: 'hard'`, tăng cả `correctAnswers` và `hardCorrectAnswers`.
- `drawPenalty(session, playerId, random)` vẫn bảo vệ một lần rút nhưng trả về thông tin kết quả gồm loại thăm, điểm trước/sau và số điểm bị giảm. Tham số `random` cho phép kiểm thử xác định.

## Xếp hạng tri thức

`knowledgeRanking` sắp xếp lần lượt theo:

1. `hardCorrectAnswers` giảm dần.
2. `correctAnswers` giảm dần.
3. `correctAnswerTimeMs` tăng dần.
4. `id` tăng dần để tạo thứ tự ổn định nếu vẫn hòa.

Mỗi dòng bảng tri thức hiển thị số câu khó đúng, tổng số câu đúng và tổng thời gian trả lời đúng.

## Giao diện và khả năng tiếp cận

- Nút bốc thăm chỉ render cho đúng người đủ điều kiện, không chỉ bị vô hiệu hóa.
- Ảnh và nội dung thẻ thăm phản ánh kết quả thực tế, gồm phương án giảm 70%.
- Thông báo kết quả dùng văn bản, không chỉ dựa vào hình ảnh/màu sắc.

## Kiểm thử

- Kiểm tra hạng 1 và hạng từ 4 trở xuống không đủ điều kiện, còn hạng 2/3 đủ điều kiện khi tồn tại.
- Kiểm tra cả hai kết quả thăm, gồm giữ lại 30% khi giảm 70%, và chặn lần rút thứ hai.
- Kiểm tra câu khó đúng được ghi nhận riêng.
- Kiểm tra thứ tự tri thức: câu khó đúng, tổng câu đúng, thời gian, rồi ID.
