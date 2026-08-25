# Thiết kế game Bầu Cua Cá Ngựa

## Phạm vi

Game web tĩnh tiếng Việt gồm ba tệp: `index.html`, `styles.css`, và `game.js`. Không dùng thư viện hoặc máy chủ.

## Cấu hình

`game.js` có một khối `CONFIG` chứa vốn khởi tạo (25.000), cược tối thiểu (5.000), phí xem trước kết quả (15.000), sáu biểu tượng và danh sách câu hỏi bốn đáp án. Các thông số này có thể thay đổi độc lập khỏi phần xử lý giao diện.

## Màn hình người chơi

Người dùng thêm, xóa và đặt tên người chơi trước khi bắt đầu. Khi nhấn bắt đầu, mỗi người chỉ nhận 25.000 một lần. Số dư được lưu trong trạng thái phiên chơi và giữ nguyên qua các vòng kế tiếp.

## Bắt đầu vòng

Ngay khi mở vòng, hệ thống ngẫu nhiên và khóa ba mặt xúc xắc. Kết quả bị ẩn với mọi người chơi, ngoại trừ người dùng quyền xem trước. Thứ tự cược của vòng bắt đầu bằng thứ tự người chơi đã tạo.

## Luồng lượt cược

Ở lượt của mình, người chơi có hai lựa chọn:

1. **Xem trước kết quả**: trả 15.000 ngay, được chuyển xuống cuối hàng đợi cược của vòng. Những người phía sau tự động tiến lên. Đến lượt cuối mới của người đó, ba mặt xúc xắc đã khóa được hiển thị trước khi họ đặt cược. Quyền này chỉ được dùng một lần mỗi vòng.
2. **Đặt cược**: chọn một biểu tượng và số tiền không thấp hơn mức tối thiểu, không vượt quá số dư hiện có. Một popup chọn ngẫu nhiên câu hỏi cùng bốn đáp án xuất hiện. Câu hỏi không lặp lại trong vòng. Trả lời đúng: số tiền được trừ và cược được ghi nhận. Trả lời sai: số tiền vẫn bị trừ nhưng không có cược và lượt kết thúc.

Nếu không đủ tiền để cược tối thiểu, người chơi được bỏ lượt. Nếu không đủ 15.000, nút xem trước bị khóa.

## Thanh toán

Sau lượt cược cuối, game công bố kết quả đã khóa. Với mỗi biểu tượng, người chơi nhận tiền thưởng bằng tiền cược nhân số lần biểu tượng đó xuất hiện trong ba xúc xắc. Vì tiền cược đã trừ khi đặt, một lần xuất hiện hoàn vốn; hai hoặc ba lần tạo lợi nhuận tương ứng. Số dư sau thanh toán trở thành số dư mở đầu vòng sau.

## Giao diện và phản hồi

Giao diện dùng chủ đề dân gian Việt Nam, tối ưu một cột trên điện thoại và lưới bàn cược trên màn hình lớn. Luôn hiển thị người đến lượt, thứ tự còn lại, số dư, cược đã chốt và thông báo rõ cho câu trả lời đúng/sai, phí xem trước, kết quả và thanh toán.

## Kiểm thử thủ công

- Thêm/xóa/đặt tên người chơi và khởi tạo vốn đúng một lần.
- Kết quả được tạo trước lượt cược và chỉ người đổi thứ tự nhìn thấy ở lượt cuối của họ.
- Chuyển một người đang ở giữa hàng xuống cuối và giữ đúng thứ tự của những người còn lại.
- Cược hợp lệ chỉ được ghi nhận sau câu đúng; câu sai trừ tiền nhưng không ghi cược.
- Câu hỏi không lặp trong vòng, và thanh toán khớp số lần từng biểu tượng xuất hiện.
