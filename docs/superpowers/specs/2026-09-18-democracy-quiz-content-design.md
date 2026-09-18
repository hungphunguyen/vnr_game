# Thiết kế bộ câu hỏi dân chủ xã hội chủ nghĩa

## Mục tiêu

Thay kho 100 câu hỏi phòng, chống tham nhũng bằng đúng 14 câu hỏi dựa trên nội dung thuyết trình Chương 4, Mục 1 về dân chủ và dân chủ xã hội chủ nghĩa. Bộ câu hỏi gồm 7 câu Dễ và 7 câu Cực khó, giữ nguyên thời gian trả lời 10 giây.

## Phân tầng độ khó

- **Dễ:** hỏi trực tiếp một dữ kiện, khái niệm, mốc lịch sử hoặc quyền cụ thể đã được nêu rõ trong nội dung thuyết trình. Người chơi chỉ cần nhận biết hoặc nhớ đúng một ý.
- **Cực khó:** yêu cầu kết hợp ít nhất hai luận điểm, phân biệt các khái niệm gần nhau, xác định chuỗi lập luận, hoặc áp dụng tiêu chí lý luận vào một tình huống thực tiễn. Câu hỏi vẫn phải đủ gọn để đọc trong thời gian hiện có.

Hai nhóm phải khác nhau rõ ràng ngay từ yêu cầu nhận thức của câu hỏi, không tạo độ khó giả bằng cách dùng câu chữ tối nghĩa.

## Cấu trúc dữ liệu

Mỗi câu hỏi được khai báo đầy đủ với các trường `id`, `text`, `answers`, `correctIndex` và `difficulty`. Không dùng kho đáp án nhiễu chung hoặc nối thêm các cụm từ đệm tự động.

- Tổng số: 14 câu.
- Mỗi mức: 7 câu.
- Mỗi câu: 4 phương án và đúng 1 đáp án đúng.
- Phương án đúng được phân bố gần đều giữa A, B, C và D, không theo chu kỳ dễ đoán.

## Thiết kế phương án nhiễu

Mỗi phương án nhiễu được viết riêng cho câu hỏi và phải:

- cùng trường nghĩa với đáp án đúng;
- đồng dạng về ngữ pháp;
- có độ dài gần tương đương;
- không chứa từ tuyệt đối hoặc chi tiết vô lý khiến người chơi loại ngay;
- chỉ sai ở một quan hệ, điều kiện, chủ thể, phạm vi hoặc kết luận then chốt.

Độ che giấu của phương án nhiễu là như nhau ở cả hai mức; sự khác biệt về độ khó nằm ở nội dung và thao tác tư duy của câu hỏi.

## Phạm vi nội dung

Bộ câu hỏi bao quát:

- khái niệm và ba phương diện của dân chủ;
- sự biến đổi của dân chủ trong lịch sử;
- lý do dân chủ là một phạm trù lịch sử;
- sự ra đời và các mặt bản chất của dân chủ xã hội chủ nghĩa;
- so sánh dân chủ xã hội chủ nghĩa với dân chủ tư sản;
- Luật Thực hiện dân chủ ở cơ sở năm 2022 và quyền thực hành dân chủ;
- bài học, ý nghĩa và trách nhiệm của sinh viên.

## Kiểm thử

Kiểm thử tự động phải xác nhận:

- có đúng 14 câu, gồm 7 câu Dễ và 7 câu Cực khó;
- mọi câu có đủ bốn phương án và một `correctIndex` hợp lệ;
- mã câu hỏi thuộc bộ nội dung mới;
- đáp án đúng không liên tục nằm ở vị trí dài nhất hoặc ngắn nhất;
- dữ liệu cũ về phòng, chống tham nhũng không còn được sử dụng.
