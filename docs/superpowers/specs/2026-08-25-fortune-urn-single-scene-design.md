# Thiết kế cảnh bốc thăm một hoạt ảnh

## Mục tiêu

Thay thế toàn bộ cơ chế que thăm rời và kéo/click từng que bằng một popup bốc thăm lớn, giàu tính khuyến mãi. Người chơi click trực tiếp vào ống thăm; ống lắc, sau đó biến mất để nhường chỗ cho duy nhất một que kết quả bật lên.

## Giao diện

- Popup rộng tối đa 960px, phù hợp màn hình hẹp với chiều rộng gần toàn màn hình.
- Nền đỏ-vàng, khung hai lớp, badge ×2/×5/×10, hạt sáng và dải trang trí kiểu chương trình sale.
- Ảnh chính là một ống thăm đỏ-vàng có chính xác năm que ở trong ống, tạo bằng một PNG trong suốt duy nhất.
- Khi công bố, ảnh ống thăm bị ẩn; chỉ cảnh que được rút và hào quang phía sau hiển thị.

## Tương tác và trạng thái

1. Popup mở ở trạng thái sẵn sàng, hiển thị lời mời bấm vào ống.
2. Click ống thăm khóa tương tác và chạy rung trong thời gian ngắn.
3. Sau rung, màn ống biến mất; que kết quả trượt dần lên, có ánh sáng lấp lánh phía sau và chữ “MẤT TOÀN BỘ ĐIỂM” trên thân que.
4. Khi hiệu ứng hoàn tất, áp dụng `drawPenalty`, hiện số điểm đã mất và nút xác nhận.

## Phạm vi

- Xóa cơ chế kéo, các nút que thăm rời, lớp cắt/mặt nạ hiện tại và các handler pointer.
- Không thay đổi luật mất điểm, bảng xếp hạng hoặc các popup ngoài luồng bốc thăm.

## Kiểm thử

Kiểm thử Node xác minh HTML chỉ dùng một vùng click ống thăm, JavaScript dùng click để chuyển sang trạng thái rung/công bố và không còn handler pointer cho que rời. Toàn bộ bộ kiểm thử chạy sau thay đổi.
