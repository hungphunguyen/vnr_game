# Thiết kế căn chỉnh que thăm trong ống

## Mục tiêu

Khi mở cơ hội bốc thăm, bốn que thăm phải trông như được đặt trong lòng ống. Chỉ phần đầu que nhô qua miệng ống; phần còn lại bị thân ống che. Kéo một que sẽ nâng chính que đó lên nhưng không làm mất góc nghiêng tự nhiên.

## Nguyên nhân hiện tại

Hai bộ quy tắc CSS cùng điều khiển kích thước, vị trí và `transform` của que thăm. Ngoài ra, mã kéo gán lại `transform` chỉ với `translateY`, nên ghi đè góc xoay của từng que. Ảnh ống cũng đang đứng trước trong HTML, khiến việc duy trì lớp che không rõ ràng.

## Thiết kế được chọn

- Lớp `.draw-sticks` đặt trước ảnh `.draw-box-art` và có `z-index` thấp hơn; ảnh ống nằm trên để che phần thân que.
- Mỗi nút `.draw-stick` lưu góc nghỉ riêng tại `data-resting-angle`.
- Một bộ CSS duy nhất đặt kích thước ống, vị trí cụm que, vị trí ngang và góc nghỉ của mỗi que; các quy tắc trùng lặp bị loại bỏ.
- Trong thao tác kéo, JavaScript kết hợp độ nhấc với góc nghỉ thay vì thay thế `transform`.
- Trên màn hình hẹp, kích thước ống và que giảm theo `clamp()` để không tràn hộp thoại.

## Kiểm thử

Một kiểm thử hồi quy xác minh HTML giữ đúng thứ tự lớp che và cả bốn que có góc nghỉ. Toàn bộ bộ kiểm thử Node hiện có sẽ được chạy lại sau thay đổi.
