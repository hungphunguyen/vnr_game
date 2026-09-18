# Thiết kế luật chơi theo mức Dễ và Khó

## Mục tiêu

Thay cơ chế dùng điểm sao làm tiền cược bằng cơ chế chọn độ khó. Mỗi người chỉ trả lời một câu và đặt một lượt cược trong mỗi vòng. Độ khó quyết định số ô được chọn và điểm nhận cho mỗi viên xúc xắc khớp với lựa chọn.

## Luồng một lượt chơi

1. Người chơi chọn một trong hai mức:
   - Dễ: câu hỏi dễ, được chọn đúng 1 ô và nhận 1 điểm cho mỗi viên xúc xắc khớp.
   - Khó: câu hỏi khó, được chọn đúng 3 ô khác nhau và nhận 1,5 điểm cho mỗi viên xúc xắc khớp.
2. Hệ thống mở một câu hỏi thuộc đúng mức đã chọn và bắt đầu bộ đếm 20 giây.
3. Nếu trả lời đúng, bàn cược được mở để người chơi chọn đủ số ô tương ứng.
4. Nếu trả lời sai hoặc hết giờ, người chơi không được chọn ô.
5. Người chơi chủ động bấm `Kết thúc lượt`. Nút chỉ hoàn tất lượt khi người chơi đã trả lời sai/hết giờ, hoặc đã trả lời đúng và chọn đủ số ô.
6. Sau khi đã trả lời, người chơi không thể chọn độ khó hoặc trả lời lần thứ hai trong cùng lượt.

## Phân loại câu hỏi tạm thời

Mỗi câu hỏi có thuộc tính `difficulty` là `easy` hoặc `hard`. Trong khi chờ bộ câu hỏi chính thức, 100 câu hiện có được chia xen kẽ thành 50 câu Dễ và 50 câu Khó. Cấu trúc này cho phép thay nội dung sau mà không phải sửa luồng trò chơi.

Câu hỏi đã dùng không lặp lại trong cùng một vòng. Hệ thống chỉ chọn từ các câu chưa dùng thuộc độ khó hiện tại.

## Trạng thái và dữ liệu

- Người chơi dùng `score`, khởi tạo bằng 0, thay cho `balance`.
- Mỗi lượt lưu độ khó đã chọn, kết quả trả lời và danh sách biểu tượng đã cược.
- Một lượt chỉ tạo tối đa một bản ghi cược.
- Bản ghi cược gồm người chơi, độ khó, hệ số điểm và một hoặc ba biểu tượng khác nhau.
- Trạng thái lượt tách rõ các bước chọn độ khó, trả lời câu hỏi và chọn ô cược để giao diện chỉ cho phép hành động hợp lệ.

## Cách tính điểm

Khi mở bát, hệ thống xét từng viên trong ba viên xúc xắc. Nếu biểu tượng của viên đó nằm trong danh sách ô người chơi đã chọn, người chơi nhận hệ số điểm của độ khó:

- Dễ: 1 điểm cho mỗi viên khớp.
- Khó: 1,5 điểm cho mỗi viên khớp.

Các mặt lặp được tính riêng. Ví dụ, người chơi Khó chọn Bầu, Cua và Tôm; kết quả là Bầu, Bầu và Cua thì cả ba viên đều khớp, tổng điểm của vòng là 4,5.

Điểm được cộng dồn qua các vòng và dùng để xếp hạng. Giao diện định dạng số thập phân theo tiếng Việt, ví dụ `1,5 điểm`.

## Giao diện

- Khu `Mức cược` được thay bằng hai lựa chọn Dễ và Khó, kèm mô tả `1 ô × 1 điểm` và `3 ô × 1,5 điểm`.
- Bỏ ô nhập số tiền cược và mọi nội dung về cược tối thiểu hoặc số dư.
- Bàn Bầu Cua bị khóa trước khi người chơi trả lời đúng. Sau khi trả lời đúng, người chơi có thể chọn hoặc bỏ chọn ô cho đến khi đủ giới hạn.
- Bảng trạng thái người chơi hiển thị tổng điểm và các ô đã chọn trong vòng.
- Hộp kết quả vòng hiển thị số điểm vừa nhận và tổng điểm mới.
- Tổng kết phiên xếp hạng theo tổng điểm.
- Xóa toàn bộ nút, hộp thoại và logic `Xem trước kết quả` giá 15 sao.

## Tính năng được giữ lại

- Kết quả xúc xắc được khóa trước giai đoạn người chơi chọn độ khó.
- Bộ đếm trả lời 20 giây.
- Xếp hạng kiến thức theo số câu đúng và tổng thời gian trả lời đúng.
- Nút kết thúc lượt do người chơi chủ động bấm.
- Tính năng bốc thăm cuối phiên được giữ nguyên để chỉnh sửa sau; ở thời điểm này, thăm phạt vẫn đưa tổng điểm của người chơi về 0.

## Xử lý hành động không hợp lệ

- Không mở câu hỏi nếu chưa chọn Dễ hoặc Khó.
- Không cho chọn ô trước khi trả lời đúng.
- Dễ không thể chọn quá một ô; Khó không thể chọn quá ba ô.
- Không thể chọn trùng một ô trong cùng danh sách; bấm lại ô đã chọn sẽ bỏ chọn.
- Không thể kết thúc lượt sau câu trả lời đúng nếu chưa chọn đủ số ô.
- Không thể chọn độ khó, trả lời hoặc ghi cược lần hai trong cùng lượt.

## Kiểm thử

Kiểm thử tự động cần chứng minh:

- Phiên mới khởi tạo người chơi với 0 điểm.
- Câu hỏi được phân đều và chọn đúng nhóm Dễ/Khó.
- Trả lời sai hoặc hết giờ không tạo cược và vẫn cho phép kết thúc lượt.
- Trả lời đúng mức Dễ chỉ cho ghi đúng một ô.
- Trả lời đúng mức Khó chỉ cho ghi đúng ba ô khác nhau.
- Một người không thể trả lời hoặc cược lần thứ hai trong cùng lượt.
- Mỗi viên xúc xắc khớp cộng 1 điểm ở Dễ hoặc 1,5 điểm ở Khó, kể cả khi kết quả lặp.
- Điểm cộng dồn và thứ hạng dùng tổng điểm mới.
- Mã và giao diện không còn số dư, mức cược tiền hoặc xem trước kết quả.
- Các kiểm thử hiện có không liên quan đến luật cược vẫn tiếp tục đạt.
