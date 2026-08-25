# Thiết kế nâng cấp hoạt ảnh Bầu Cua

## Phạm vi

Nâng cấp game hiện có bằng SVG inline và CSS animation, không thêm thư viện. Giữ quy tắc vốn, câu hỏi và thanh toán hiện tại, nhưng thay đổi trình tự hình ảnh, bố cục màn chơi và quyền preview.

## Mở vòng

`startRound` vẫn ngẫu nhiên và khóa ba kết quả ngay khi vòng được tạo. Trước khi mở quyền cược, một lớp sân khấu che bàn chơi: ba xúc xắc SVG đi vào khung, bát SVG úp xuống và rung trong khoảng ba giây. Sau hoạt ảnh, sân khấu biến mất và người đầu tiên được đặt cược. Không hiển thị mặt xúc xắc thật trong màn này.

## Bố cục

Trên desktop, màn chơi chia hai cột: thanh người chơi bên trái và bàn cược bên phải. Thanh trái hiển thị mọi người chơi với tên, số dư, số thứ tự cược hiện tại và dấu hiệu người đang tới lượt. Trên màn hình hẹp, thanh này nằm phía trên bàn cược. Các ô Bầu, Cua, Tôm, Cá, Gà, Nai dùng SVG minh họa inline thay emoji. Xúc xắc cũng dùng SVG.

## Lượt cược bắt buộc

Loại bỏ hoàn toàn hành động bỏ lượt. Người chơi đang tới lượt phải chọn một ô, nhập mức tiền hợp lệ và trả lời câu hỏi. Sau câu trả lời đúng hoặc sai, lượt kết thúc theo luật cũ. Nếu số dư thấp hơn mức cược tối thiểu, trò chơi hiển thị trạng thái không thể tiếp tục thay vì tự bỏ lượt; người dùng cần bắt đầu phiên mới.

## Quyền xem trước

Người chơi đang tới lượt có thể trả 15.000 để chuyển xuống cuối hàng. Khi họ thực sự trở lại ở lượt cuối, popup preview tự động mở và hiển thị ba kết quả SVG đã khóa. Popup có nút đóng. Khi đóng, nội dung preview bị xóa khỏi state và popup không thể mở lại trong vòng đó; người chơi tiếp tục đặt cược theo hiểu biết của mình. Toàn bộ state preview, gồm người mua và kết quả popup, tự được tạo lại trong vòng mới.

## Mở kết quả và thanh toán

Khi lượt cược bắt buộc cuối cùng hoàn tất, sân khấu kết quả che bàn chơi. Bát SVG được nhấc lên, ba xúc xắc SVG kết quả xuất hiện theo nhịp ngắn, sau đó mới tính và hiển thị thanh toán. Điều này không đổi kết quả đã khóa trước vòng; chỉ trì hoãn việc công bố và ghi số dư cho tới khi hoạt ảnh kết thúc.

## Kiểm thử

- Trạng thái mở vòng chuyển từ `intro` sang `betting` chỉ sau khi animation kết thúc.
- Người mua preview được chuyển cuối, popup tự mở đúng một lần tại lượt cuối, đóng popup xóa dữ liệu preview, và vòng sau cho phép mua lại.
- Không còn API hoặc nút bỏ lượt; chỉ câu trả lời mới chuyển lượt.
- Kết quả được thanh toán sau, không trước, animation mở bát.
- SVG được render cho sáu ô cược và ba xúc xắc; bố cục không tràn tại kích thước 390px.
