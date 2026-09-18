(function attachGameApi(global) {
  'use strict';

  const PCTN_QUESTIONS = [
    ['Nguyên nhân nào thuộc nhóm hạn chế trong chính sách, pháp luật?', 'Chính sách thiếu công khai, minh bạch', 'Thiên tai kéo dài', 'Dân số tăng nhanh', 'Thay đổi khí hậu'],
    ['Việc thực hiện chính sách đền bù, trợ giá không rõ ràng có thể dẫn đến điều gì?', 'Phát sinh thỏa thuận, chi phí tiêu cực', 'Tăng cạnh tranh lành mạnh', 'Giảm mọi thủ tục', 'Tăng niềm tin tự động'],
    ['Cơ chế “xin – cho” được tài liệu nêu là có thể tạo điều kiện cho?', 'Tham nhũng gia tăng', 'Giảm hoàn toàn độc quyền', 'Tăng minh bạch', 'Bảo vệ người tố cáo'],
    ['Chính sách bao cấp, bảo hộ, độc quyền tác động thế nào đến tham nhũng?', 'Tạo môi trường thuận lợi cho tham nhũng', 'Loại trừ mọi hành vi hối lộ', 'Không liên quan đến tham nhũng', 'Chỉ ảnh hưởng văn hóa'],
    ['Theo tài liệu, chính sách tiền lương không bảo đảm đời sống có thể khiến một số cán bộ?', 'Sách nhiễu để đòi hối lộ', 'Tự động từ chức', 'Không thực hiện công vụ', 'Tăng đầu tư công'],
    ['Hệ thống pháp luật chưa đầy đủ, đồng bộ tạo ra?', 'Kẽ hở cho tham nhũng', 'Cơ chế bảo vệ tuyệt đối', 'Nguồn thu thuế cao hơn', 'Cạnh tranh bình đẳng hơn'],
    ['Một biểu hiện hạn chế của pháp luật là gì?', 'Nhiều lĩnh vực chưa được pháp luật điều chỉnh', 'Mọi quy định đều rõ ràng', 'Không có khoảng trống pháp luật', 'Văn bản luôn được hướng dẫn đủ'],
    ['Sự chồng chéo, mâu thuẫn giữa các quy định pháp luật có thể gây?', 'Khó áp dụng thống nhất và tạo kẽ hở', 'Minh bạch cao hơn', 'Tăng trách nhiệm cá nhân', 'Giảm tùy tiện'],
    ['Quy định pháp luật thiếu minh bạch trong quản lý đất đai, đấu thầu dễ bị lợi dụng để?', 'Sách nhiễu, đòi hối lộ', 'Bảo vệ tài sản công tốt hơn', 'Rút ngắn mọi thủ tục', 'Nâng chất lượng công trình'],
    ['Văn bản luật thiếu hướng dẫn thực hiện dễ dẫn đến?', 'Áp dụng không thống nhất, tùy tiện', 'Thực thi đồng đều hơn', 'Không cần giám sát', 'Không có tiêu cực'],
    ['Làm giả hồ sơ, khai khống đối tượng chính sách nhằm chiếm đoạt tài sản phản ánh?', 'Lợi dụng kẽ hở khi thực thi chính sách', 'Công khai chính sách', 'Tăng hiệu quả trợ giúp', 'Cạnh tranh lành mạnh'],
    ['Trong quản lý tài sản công, quyền hạn lớn nhưng trách nhiệm không rõ ràng có thể?', 'Làm giảm trách nhiệm và tạo điều kiện tham ô', 'Loại bỏ rủi ro tham nhũng', 'Tăng kiểm toán tự động', 'Tạo minh bạch đầy đủ'],
    ['Công cụ như kiểm kê, kiểm toán, giám sát, thanh tra không được thực hiện nghiêm túc sẽ?', 'Tạo điều kiện để lợi dụng tài sản công', 'Tăng khả năng phát hiện', 'Ngăn mọi sai phạm', 'Tăng cạnh tranh'],
    ['Cơ chế cấp vốn, đấu thầu, cấp phép chưa công khai có thể dẫn đến?', 'Sách nhiễu và hối lộ', 'Giảm chi phí giao dịch', 'Tăng bình đẳng tiếp cận', 'Bảo đảm khách quan'],
    ['Sự can thiệp quá sâu của cơ quan nhà nước vào thị trường có thể?', 'Tạo đặc quyền và cơ hội tham nhũng', 'Xóa mọi thủ tục hành chính', 'Tăng cạnh tranh tự do', 'Không tác động đến kinh tế'],
    ['Phân công quyền hạn chồng chéo giữa các chủ thể quản lý làm?', 'Khó xác định trách nhiệm', 'Tăng trách nhiệm cá nhân', 'Giảm hoàn toàn tham ô', 'Minh bạch hơn'],
    ['Một hạn chế trong hoạt động cơ quan nhà nước được nêu là?', 'Thủ tục hành chính còn phiền hà', 'Mọi thủ tục hoàn toàn số hóa', 'Không có tình trạng nhũng nhiễu', 'Không cần cải cách'],
    ['Việc công khai, minh bạch tài sản, thu nhập không hiệu quả làm?', 'Khó kiểm soát biến động tài sản', 'Dễ phát hiện mọi sai phạm', 'Xóa bỏ xung đột lợi ích', 'Tăng niềm tin ngay lập tức'],
    ['Hạn chế trong phát hiện tham nhũng thể hiện ở?', 'Phát hiện chưa kịp thời, hiệu quả', 'Tố cáo luôn được bảo vệ tuyệt đối', 'Mọi vụ việc đều bị xử lý ngay', 'Không cần thanh tra'],
    ['Cơ chế bảo vệ người tố cáo chưa tốt dẫn đến?', 'Người dân e ngại tố cáo tham nhũng', 'Tố cáo tăng không giới hạn', 'Không ảnh hưởng việc phát hiện', 'Giảm nhu cầu bảo vệ'],
    ['Xử lý tham nhũng không nghiêm minh có thể?', 'Làm giảm tác dụng răn đe', 'Tăng tính răn đe', 'Xóa nguyên nhân tham nhũng', 'Tăng minh bạch tự động'],
    ['Việc xử lý chậm, kéo dài các vụ việc tham nhũng dễ gây?', 'Dư luận nghi ngờ và giảm niềm tin', 'Tăng hiệu quả phòng ngừa', 'Công khai tốt hơn', 'Không ảnh hưởng xã hội'],
    ['Một nguyên nhân thuộc nhận thức, tư tưởng cán bộ là?', 'Chủ nghĩa cá nhân, vụ lợi', 'Tôn trọng pháp luật', 'Tinh thần trách nhiệm cao', 'Lối sống liêm chính'],
    ['Sự suy thoái đạo đức, lối sống của một bộ phận cán bộ có thể?', 'Thúc đẩy hành vi tham nhũng', 'Loại bỏ sách nhiễu', 'Nâng uy tín cơ quan', 'Tăng công bằng'],
    ['Bổ nhiệm, luân chuyển cán bộ không tốt có thể dẫn đến?', 'Người không đủ phẩm chất vẫn có quyền lực', 'Mọi cán bộ được giám sát tốt hơn', 'Giảm nguy cơ lợi dụng chức vụ', 'Tăng trách nhiệm rõ ràng'],
    ['Hoạt động tuyên truyền PCTN chỉ trong nội bộ cơ quan là hạn chế về?', 'Phạm vi thực hiện', 'Tác hại kinh tế', 'Cấp vốn đầu tư', 'Thuế'],
    ['Hình thức tuyên truyền đơn điệu, chỉ thuyết trình thường dẫn đến?', 'Nhàm chán, khó tiếp thu', 'Thu hút mọi tầng lớp', 'Tăng hiệu quả ngay', 'Bảo vệ người tố cáo'],
    ['Nội dung tuyên truyền nặng lý thuyết, không phù hợp từng nhóm đối tượng sẽ?', 'Làm hiệu quả tuyên truyền hạn chế', 'Tăng khả năng tham gia', 'Tăng tính sinh động', 'Không ảnh hưởng nhận thức'],
    ['Thiếu thông tin về cơ chế bảo vệ người tố cáo khiến xã hội?', 'Khó huy động người dân phát hiện, tố cáo', 'Tố cáo trở nên dễ hơn', 'Không cần bảo vệ người tố cáo', 'Giảm vai trò người dân'],
    ['Tác hại chính trị trực tiếp nổi bật của tham nhũng là?', 'Làm giảm lòng tin của nhân dân', 'Tăng uy tín nhà nước', 'Tăng đoàn kết xã hội', 'Tăng sức chiến đấu'],
    ['Tham nhũng cản trở việc thực hiện?', 'Chủ trương, chính sách của Đảng và Nhà nước', 'Các giá trị đạo đức bị suy giảm', 'Hoạt động giải trí', 'Thời tiết thuận lợi'],
    ['Lợi dụng chính sách hỗ trợ người nghèo để chiếm đoạt gây?', 'Bất bình trong nhân dân', 'Phân phối công bằng hơn', 'Tăng hiệu quả chính sách', 'Tăng niềm tin'],
    ['Tham nhũng có thể làm xói mòn lòng tin vào?', 'Đội ngũ cán bộ, đảng viên và bộ máy nhà nước', 'Khoa học kỹ thuật', 'Khí hậu', 'Hoạt động thể thao'],
    ['Tài liệu nhận định tham nhũng có thể tiềm ẩn?', 'Xung đột lợi ích và phản kháng xã hội', 'Tăng đồng thuận xã hội', 'Xóa khoảng cách giàu nghèo', 'Tăng phúc lợi tự động'],
    ['Tham nhũng làm tăng thêm?', 'Khoảng cách giàu nghèo', 'Sự công bằng xã hội', 'Niềm tin của nhà đầu tư', 'Chất lượng công trình'],
    ['Trên trường quốc tế, tham nhũng có thể làm?', 'Giảm uy tín quốc gia', 'Tăng lòng tin nhà tài trợ', 'Tăng hấp dẫn đầu tư', 'Tăng hiệu quả viện trợ'],
    ['Khi nguồn viện trợ bị thất thoát do tham nhũng, hệ quả là?', 'Hiệu quả nguồn tài chính, tín dụng thấp', 'Hiệu quả viện trợ cao hơn', 'Nhà tài trợ tin tưởng hơn', 'Nguồn lực được dùng đúng hơn'],
    ['Nhũng nhiễu trong cấp phép khiến nhà đầu tư nước ngoài?', 'Mất lòng tin, nản chí', 'Dễ đầu tư hơn', 'Không bị ảnh hưởng', 'Tăng đầu tư ngay'],
    ['Việc tạo đặc quyền, đặc lợi cho cá nhân và gia đình gây?', 'Ảnh hưởng xấu đời sống chính trị', 'Tăng công bằng', 'Nâng uy tín quốc gia', 'Tăng hiệu quả chính sách'],
    ['Tác hại kinh tế của tham nhũng trong xây dựng cơ bản là?', 'Thất thoát tiền qua chi phí tiêu cực', 'Giảm mọi chi phí', 'Tăng chất lượng mặc định', 'Tăng nguồn thu thuế'],
    ['Tham ô, lạm dụng chức vụ để chiếm đoạt gây?', 'Thất thoát tài sản nhà nước', 'Tăng tài sản công', 'Bảo toàn ngân sách', 'Tăng cạnh tranh'],
    ['Do hối lộ, doanh nghiệp nộp thuế ít hơn thực tế gây?', 'Thất thu ngân sách nhà nước', 'Tăng thu ngân sách', 'Tăng công bằng thuế', 'Không ảnh hưởng ngân sách'],
    ['Hối lộ trong hoàn thuế, miễn giảm thuế gây?', 'Thất thoát nguồn thu công', 'Tăng thu phí hợp pháp', 'Nâng chất lượng dịch vụ', 'Không tác động ngân sách'],
    ['Khi tài sản công bị biến thành tài sản tư, đó là tác hại?', 'Tổn thất kinh tế và tài sản nhà nước', 'Tăng phúc lợi chung', 'Tăng tài sản công', 'Tăng niềm tin xã hội'],
    ['Tham nhũng trong xây dựng có thể làm công trình?', 'Kém chất lượng', 'Luôn bền vững hơn', 'Không ảnh hưởng an toàn', 'Tự động giảm chi phí'],
    ['Công trình kém chất lượng do tham nhũng đe dọa?', 'Cuộc sống, an toàn của người dân', 'Chỉ hoạt động văn hóa', 'Thời tiết', 'Không có ai bị ảnh hưởng'],
    ['Tham nhũng tác động thế nào đến môi trường kinh doanh?', 'Làm giảm năng lực cạnh tranh', 'Tăng cạnh tranh lành mạnh', 'Giảm chi phí giao dịch', 'Tăng minh bạch'],
    ['Hối lộ giúp doanh nghiệp không đủ thực lực giành hợp đồng sẽ?', 'Làm méo mó cạnh tranh', 'Tăng cạnh tranh công bằng', 'Nâng chất lượng bảo đảm', 'Giảm rủi ro xã hội'],
    ['Thủ tục hành chính kéo dài vì sách nhiễu làm?', 'Đình trệ sản xuất, kinh doanh', 'Tăng năng suất tức thì', 'Giảm chi phí cho dân', 'Tăng niềm tin'],
    ['Người dân phải đưa hối lộ trong thủ tục hành chính sẽ?', 'Thiệt hại tiền bạc', 'Được giảm mọi chi phí', 'Không mất thời gian', 'Tăng quyền lợi công'],
    ['Tác hại xã hội của tham nhũng là làm ảnh hưởng đến?', 'Giá trị, chuẩn mực đạo đức và pháp luật', 'Khí hậu toàn cầu', 'Tốc độ internet', 'Lễ hội truyền thống'],
    ['Một biểu hiện suy thoái đạo đức do tham nhũng là?', 'Coi thường pháp luật để đòi hối lộ', 'Tôn trọng nghĩa vụ nghề nghiệp', 'Bảo vệ lợi ích công', 'Thực thi đúng quy định'],
    ['Khi cán bộ tham nhũng trong thực thi công vụ, hoạt động có xu hướng phục vụ?', 'Lợi ích cá nhân và người đưa hối lộ', 'Lợi ích chung của xã hội', 'Quyền lợi người yếu thế', 'Phát triển bền vững'],
    ['Tham nhũng gây xáo trộn?', 'Trật tự xã hội', 'Quy luật tự nhiên', 'Mùa vụ', 'Địa hình'],
    ['Tham nhũng trong giáo dục, y tế, văn hóa đặc biệt nguy hại vì?', 'Xâm hại giá trị đạo đức, xã hội truyền thống', 'Không tác động xã hội', 'Chỉ tác động ngân sách', 'Làm tăng niềm tin'],
    ['Tài liệu tổng kết tham nhũng gây hậu quả nghiêm trọng trên các mặt?', 'Chính trị, kinh tế và xã hội', 'Thể thao, du lịch, giải trí', 'Khí hậu, thời tiết, địa lý', 'Văn học, âm nhạc, hội họa'],
    ['Việc pháp luật không điều chỉnh đầy đủ lĩnh vực tư nhân có thể?', 'Tạo khoảng trống cho hành vi tham nhũng', 'Loại trừ mọi hối lộ', 'Tăng kiểm soát tự động', 'Không có ảnh hưởng'],
    ['Hạn chế trong quản lý tài chính, đất đai, nhà cửa, đấu thầu là?', 'Quy định bất cập, thiếu công khai', 'Quy định luôn minh bạch', 'Không cần hướng dẫn', 'Không liên quan tham nhũng'],
    ['Khi chính sách hỗ trợ cần “môi giới” mới tiếp cận được, rủi ro là?', 'Phát sinh chi phí, thỏa thuận tiêu cực', 'Mọi người được hỗ trợ bình đẳng', 'Thủ tục đơn giản hơn', 'Tăng minh bạch'],
    ['Hành vi sử dụng tài sản công trái mục đích là hệ quả của?', 'Quản lý, giám sát tài sản công yếu', 'Kiểm toán nghiêm túc', 'Trách nhiệm rõ ràng', 'Công khai đầy đủ'],
    ['Không xác định rõ chức năng, nhiệm vụ, quyền hạn cơ quan sẽ?', 'Tạo chồng chéo, phân tán trách nhiệm', 'Tăng phối hợp rõ ràng', 'Giảm nguy cơ lợi dụng', 'Tăng hiệu quả giám sát'],
    ['Quản lý kinh tế chậm theo kịp phát triển dễ tạo?', 'Sơ hở, bất cập', 'Cơ chế hoàn thiện tuyệt đối', 'Không có nguy cơ tham nhũng', 'Giám sát tự động'],
    ['Một tác dụng của phát hiện, xử lý tham nhũng kịp thời là?', 'Tăng khả năng răn đe', 'Làm giảm niềm tin', 'Khuyến khích che giấu', 'Tăng đặc quyền'],
    ['Nếu người tố cáo bị đe dọa hoặc trù dập, điều gì bị ảnh hưởng?', 'Việc phát hiện tham nhũng', 'Chất lượng công trình', 'Thu ngân sách tự động', 'Khí hậu'],
    ['Nhận thức không đúng về quyền lực công có thể dẫn tới?', 'Lạm dụng chức vụ vì vụ lợi', 'Phục vụ công bằng hơn', 'Tăng trách nhiệm', 'Nâng đạo đức công vụ'],
    ['Chủ nghĩa cá nhân trong cán bộ, công chức trái với?', 'Tinh thần phục vụ lợi ích chung', 'Mục tiêu vụ lợi', 'Đặc quyền cá nhân', 'Lợi ích nhóm'],
    ['Tuyên truyền không sâu rộng đến nhân dân khiến?', 'Hiểu biết về nguyên nhân, tác hại chưa được cải thiện', 'Mọi người hiểu rõ pháp luật hơn', 'Tố cáo tăng tự động', 'Không ảnh hưởng nhận thức'],
    ['Nội dung truyền thông phù hợp cần có đặc điểm?', 'Dễ hiểu, dễ nhớ, phù hợp đối tượng', 'Chỉ nặng lý thuyết', 'Càng khó hiểu càng tốt', 'Không cần sáng tạo'],
    ['Chuyển thể tuyên truyền thành kịch, video, áp-phích nhằm?', 'Tăng sức hấp dẫn và thu hút tham gia', 'Làm nội dung khó tiếp thu', 'Thu hẹp phạm vi tuyên truyền', 'Thay thế hoàn toàn pháp luật'],
    ['Tham nhũng là vật cản lớn đối với?', 'Thành công của công cuộc đổi mới', 'Sự phát triển đạo đức', 'Hoạt động thể thao', 'Sự thay đổi thời tiết'],
    ['Tham nhũng đe dọa điều gì theo phần tác hại chính trị?', 'Sự tồn vong của chế độ', 'Hoạt động du lịch', 'Mùa màng hằng năm', 'Địa hình quốc gia'],
    ['Bất bình trong nhân dân là hệ quả rõ của?', 'Chính sách bị lợi dụng để tư lợi', 'Thực hiện chính sách công bằng', 'Công khai ngân sách', 'Xử lý nghiêm minh'],
    ['Tham nhũng làm giảm hiệu quả của?', 'Các chính sách kinh tế, chính trị, xã hội tốt đẹp', 'Các quy luật tự nhiên', 'Hoạt động nghệ thuật', 'Thể thao học đường'],
    ['Nguyên nhân khiến nhà đầu tư nước ngoài nản chí được tài liệu nêu là?', 'Khó khăn, nhũng nhiễu từ cấp phép đến hoạt động', 'Chất lượng dịch vụ minh bạch', 'Cạnh tranh bình đẳng', 'Giảm mọi chi phí'],
    ['Đầu tư bằng vốn ngân sách chỉ nhằm lợi ích cá nhân gây?', 'Thất thoát ngân sách', 'Tăng lợi ích xã hội', 'Tăng hiệu quả đầu tư công', 'Giảm rủi ro'],
    ['Nhập máy móc lạc hậu vì lợi ích nhóm có thể?', 'Gây lãng phí và thất thoát lớn', 'Nâng hiệu quả sản xuất', 'Giảm tiêu hao nhiên liệu', 'Bảo vệ môi trường hơn'],
    ['Tham nhũng làm chi phí doanh nghiệp tăng sẽ?', 'Làm chậm tăng trưởng kinh tế', 'Tăng năng lực cạnh tranh', 'Giảm giá thành tự động', 'Không ảnh hưởng đầu tư'],
    ['Khi doanh nghiệp làm ăn chính đáng mất niềm tin, nguyên nhân là?', 'Hợp đồng bị chi phối bởi hối lộ', 'Đấu thầu minh bạch', 'Cạnh tranh công bằng', 'Quy trình rõ ràng'],
    ['Nhũng nhiễu hành chính gây mất thời gian và tiền của của?', 'Người dân và doanh nghiệp', 'Chỉ cán bộ vi phạm', 'Chỉ nhà đầu tư nước ngoài', 'Không ai'],
    ['Tham nhũng làm suy thoái phẩm chất của?', 'Một bộ phận cán bộ, công chức, viên chức', 'Mọi hoạt động kinh tế hợp pháp', 'Thiên nhiên', 'Công nghệ'],
    ['Hành vi nhận hối lộ của người thực thi công vụ làm công vụ?', 'Không còn hướng chủ yếu đến lợi ích công', 'Phục vụ tốt hơn lợi ích công', 'Minh bạch hơn', 'Bình đẳng hơn'],
    ['Tham nhũng xảy ra ở nhiều lĩnh vực đời sống sẽ?', 'Cản trở phát triển lành mạnh của đất nước', 'Tăng trật tự xã hội', 'Tăng đạo đức nghề nghiệp', 'Không tác động phát triển'],
    ['Dư luận xã hội bị ảnh hưởng thế nào bởi tham nhũng?', 'Dễ phát sinh bức xúc và dư luận xấu', 'Luôn đồng thuận hơn', 'Không phản ứng', 'Chỉ quan tâm giải trí'],
    ['Theo tài liệu, nguyên nhân chính sách–pháp luật cần chú ý nhất là?', 'Thiếu đồng bộ, sơ hở, chậm sửa đổi', 'Quá nhiều minh bạch', 'Kiểm tra quá thường xuyên', 'Trách nhiệm quá rõ'],
    ['Nguyên nhân quản lý–điều hành thường liên quan đến?', 'Cơ chế quản lý bất cập, thiếu công khai', 'Chỉ thay đổi thời tiết', 'Chỉ sở thích cá nhân', 'Hoạt động văn nghệ'],
    ['Nguyên nhân phát hiện–xử lý yếu làm hành vi tham nhũng?', 'Khó bị ngăn chặn, răn đe', 'Tự động biến mất', 'Không cần tố cáo', 'Dễ được phát hiện hơn'],
    ['Nguyên nhân về nhận thức, tư tưởng liên quan trực tiếp đến?', 'Phẩm chất đạo đức và động cơ vụ lợi', 'Chất lượng đường sá', 'Nguồn điện', 'Thiết kế đô thị'],
    ['Nguyên nhân tuyên truyền yếu liên quan trực tiếp đến?', 'Sự hiểu biết và tham gia của người dân', 'Sản lượng nông nghiệp', 'Khí hậu', 'Giá nhiên liệu'],
    ['Nhóm tác hại nào phản ánh việc giảm lòng tin vào Nhà nước?', 'Tác hại về chính trị', 'Tác hại về thời tiết', 'Tác hại về giải trí', 'Tác hại về thể thao'],
    ['Nhóm tác hại nào bao gồm thất thu thuế và thất thoát tài sản công?', 'Tác hại về kinh tế', 'Tác hại về văn hóa riêng lẻ', 'Tác hại về thời tiết', 'Tác hại về địa lý'],
    ['Nhóm tác hại nào bao gồm xuống cấp đạo đức và xáo trộn trật tự?', 'Tác hại về xã hội', 'Tác hại về khí hậu', 'Tác hại về công nghệ', 'Tác hại về thể thao'],
    ['Việc tham ô chính sách dành cho người có công ảnh hưởng trước hết đến?', 'Tính công bằng khi thực hiện chính sách', 'Khí hậu', 'Chất lượng internet', 'Số lượng lễ hội'],
    ['Một hậu quả chung cuối cùng của tham nhũng là?', 'Ảnh hưởng xấu đến phát triển kinh tế – xã hội', 'Bảo đảm phát triển bền vững', 'Tăng công bằng tuyệt đối', 'Tăng uy tín tự động'],
    ['Kẽ hở trong thực thi chính sách thường bị lợi dụng để?', 'Mưu lợi cho cá nhân và gia đình', 'Bảo đảm công bằng tuyệt đối', 'Tăng hiệu quả giám sát', 'Bảo vệ tài sản công'],
    ['Việc không công khai cơ chế phân bổ vốn đầu tư tạo nguy cơ?', 'Đòi hối lộ để được cấp kinh phí', 'Giảm hoàn toàn chi phí', 'Tăng tính cạnh tranh công bằng', 'Không có ảnh hưởng'],
    ['Không kiểm soát chặt chẽ tài sản công có thể dẫn đến?', 'Biến tài sản công thành tài sản riêng', 'Tăng bảo toàn tài sản', 'Giảm mọi sai phạm', 'Tăng minh bạch'],
    ['Tham nhũng trong lĩnh vực đất đai, đầu tư xây dựng có thể làm?', 'Gây hậu quả xấu trên nhiều mặt', 'Tăng chất lượng quản lý', 'Tăng lòng tin xã hội', 'Giảm thất thoát'],
    ['Tác hại kinh tế của chi phí hối lộ đối với doanh nghiệp là?', 'Làm tăng chi phí hoạt động', 'Làm giảm mọi chi phí', 'Tăng lợi nhuận chắc chắn', 'Không ảnh hưởng cạnh tranh'],
    ['Tham nhũng làm người dân bức xúc vì?', 'Quyền lực công bị dùng để phục vụ lợi ích riêng', 'Công vụ luôn công bằng hơn', 'Thủ tục luôn nhanh hơn', 'Tài sản công được bảo vệ hơn'],
    ['Sự xuống cấp đạo đức do tham nhũng làm một số người?', 'Sẵn sàng làm trái lương tâm và nghĩa vụ nghề nghiệp', 'Tôn trọng pháp luật hơn', 'Đặt lợi ích chung lên đầu', 'Không chịu ảnh hưởng'],
  ];

  const RELATED_DISTRACTORS = [
    'Thiếu công khai, minh bạch',
    'Chồng chéo quyền hạn, trách nhiệm',
    'Kiểm tra, giám sát chưa nghiêm',
    'Phát hiện, xử lý chưa kịp thời',
    'Suy thoái đạo đức, lối sống',
    'Tuyên truyền còn hình thức',
    'Làm giảm lòng tin của nhân dân',
    'Cản trở thực hiện chính sách',
    'Thất thoát tài sản công',
    'Thất thu ngân sách nhà nước',
    'Làm méo mó cạnh tranh',
    'Làm tăng chi phí giao dịch',
    'Giảm uy tín của quốc gia',
    'Xáo trộn trật tự xã hội',
    'Xâm hại chuẩn mực đạo đức',
    'Tạo đặc quyền, đặc lợi',
    'Kéo dài thủ tục hành chính',
    'Làm giảm chất lượng công trình',
    'Cản trở phát triển kinh tế – xã hội',
    'Khó huy động người dân tố cáo',
  ];

  const ANSWER_CONTEXTS = [
    'đây là một nội dung cần được lưu ý',
    'đây là một khía cạnh cần nhận diện trong thực tiễn',
    'đây là vấn đề cần được quan tâm trong quá trình thực thi công vụ',
    'đây là nội dung cần được xem xét cẩn trọng trong công tác phòng, chống tham nhũng',
    'đây là một vấn đề cần được nhận diện, đánh giá và chủ động phòng ngừa trong thực tế',
  ];
  const ANSWER_ENDINGS = ['', ' trong thực tế', ' một cách phù hợp', ' ở từng tình huống'];

  const chooseDistractors = (correct, index) => {
    const choices = [];
    for (let offset = 1; choices.length < 3; offset += 1) {
      const candidate = RELATED_DISTRACTORS[(index * 3 + offset) % RELATED_DISTRACTORS.length];
      if (candidate !== correct && !choices.includes(candidate)) choices.push(candidate);
    }
    return choices;
  };

  const addAnswerContext = (choice, targetLength, questionIndex, answerIndex) => {
    const requiredContextLength = targetLength - choice.length;
    const context = ANSWER_CONTEXTS.reduce((closest, candidate) => (
      Math.abs(candidate.length - requiredContextLength) < Math.abs(closest.length - requiredContextLength) ? candidate : closest
    ));
    const ending = ANSWER_ENDINGS[(questionIndex * 7 + answerIndex * 5) % ANSWER_ENDINGS.length];
    return `${choice} — ${context}${ending}.`;
  };

  // Fixed shuffled slots keep the correct choice evenly distributed without a pattern players can memorize.
  const ANSWER_SLOTS = Array.from({ length: 25 }, () => [0, 1, 2, 3]).flat();
  let slotSeed = 7919;
  for (let index = ANSWER_SLOTS.length - 1; index > 0; index -= 1) {
    slotSeed = (slotSeed * 16807) % 2147483647;
    const swapIndex = slotSeed % (index + 1);
    [ANSWER_SLOTS[index], ANSWER_SLOTS[swapIndex]] = [ANSWER_SLOTS[swapIndex], ANSWER_SLOTS[index]];
  }

  const PCTN_QUIZ_QUESTIONS = PCTN_QUESTIONS.map(([text, correct], index) => {
    const correctIndex = ANSWER_SLOTS[index];
    const answers = chooseDistractors(correct, index);
    answers.splice(correctIndex, 0, correct);
    const targetAnswerLength = Math.max(...answers.map((answer) => answer.length)) + 55;
    return {
      id: `pctn-${index + 1}`,
      text,
      answers: answers.map((answer, answerIndex) => addAnswerContext(answer, targetAnswerLength, index, answerIndex)),
      correctIndex,
      difficulty: index % 2 === 0 ? 'easy' : 'hard',
    };
  });

  const DIFFICULTIES = {
    easy: { label: 'Dễ', selectionCount: 1, pointsPerMatch: 1 },
    hard: { label: 'Khó', selectionCount: 3, pointsPerMatch: 1.5 },
  };

  const createTurnState = () => ({ difficulty: null, answered: false, correct: false, symbols: [] });

  const CONFIG = {
    previewCost: 15,
    difficulties: DIFFICULTIES,
    symbols: [
      { id: 'bau', label: 'Bầu' },
      { id: 'cua', label: 'Cua' },
      { id: 'tom', label: 'Tôm' },
      { id: 'ca', label: 'Cá' },
      { id: 'ga', label: 'Gà' },
      { id: 'nai', label: 'Nai' },
    ],
    questions: PCTN_QUIZ_QUESTIONS,
  };

  function createSession(names) {
    const cleanNames = names.map((name) => String(name).trim()).filter(Boolean);
    if (cleanNames.length < 1) throw new Error('Cần có ít nhất một người chơi.');
    const questionLimit = Math.min(...Object.keys(DIFFICULTIES).map((difficulty) => CONFIG.questions.filter((question) => question.difficulty === difficulty).length));
    if (cleanNames.length > questionLimit) throw new Error('Số người chơi vượt quá số câu hỏi của một mức.');
    return {
      players: cleanNames.map((name, id) => ({ id, name, score: 0, correctAnswers: 0, correctAnswerTimeMs: 0, drawUsed: false })),
      round: null,
      nextRoundNumber: 1,
    };
  }

  function startRound(session, random = Math.random) {
    if (!session || !session.players) throw new Error('Phiên chơi không hợp lệ.');
    session.round = {
      number: session.nextRoundNumber++,
      dice: null,
      order: session.players.map((player) => player.id),
      turnIndex: 0,
      previewBuyerId: null,
      usedQuestionIds: [],
      question: null,
      turnState: createTurnState(),
      bets: [],
      phase: 'intro',
      previewPayload: null,
      random,
    };
    return session.round;
  }

  function rollDice(session) {
    if (!session?.round || session.round.dice) return session?.round?.dice || null;
    session.round.dice = Array.from({ length: 3 }, () => CONFIG.symbols[Math.floor(session.round.random() * CONFIG.symbols.length)].id);
    return session.round.dice;
  }

  function currentPlayer(session) {
    if (!session?.round || session.round.phase !== 'betting') return null;
    const id = session.round.order[session.round.turnIndex];
    return session.players.find((player) => player.id === id) || null;
  }

  function openBetting(session) {
    if (!session?.round || session.round.phase !== 'intro') return false;
    session.round.phase = 'betting';
    return true;
  }

  function getCurrentQuestion(session) {
    const round = session?.round;
    if (!round || round.phase !== 'betting') return null;
    if (round.question) return round.question;
    const difficulty = round.turnState.difficulty;
    if (!difficulty) return null;
    const choices = CONFIG.questions.filter((question) => question.difficulty === difficulty && !round.usedQuestionIds.includes(question.id));
    if (!choices.length) throw new Error('Đã dùng hết câu hỏi cho vòng này.');
    round.question = choices[Math.floor(round.random() * choices.length)];
    return round.question;
  }

  function chooseDifficulty(session, difficulty) {
    const turn = session?.round?.turnState;
    if (!currentPlayer(session) || !DIFFICULTIES[difficulty] || turn.difficulty) throw new Error('Không thể chọn mức câu hỏi cho lượt này.');
    turn.difficulty = difficulty;
    return getCurrentQuestion(session);
  }

  function advanceTurn(session) {
    if (!session?.round || session.round.phase !== 'betting') return false;
    session.round.question = null;
    session.round.turnState = createTurnState();
    session.round.turnIndex += 1;
    if (session.round.turnIndex >= session.round.order.length) session.round.phase = 'revealing';
    return true;
  }

  function buyPreview(session) {
    const player = currentPlayer(session);
    if (!player || session.round.previewBuyerId !== null || player.balance < CONFIG.previewCost) return false;
    player.balance -= CONFIG.previewCost;
    session.round.previewBuyerId = player.id;
    session.round.previewPayload = [...session.round.dice];
    const [buyerId] = session.round.order.splice(session.round.turnIndex, 1);
    session.round.order.push(buyerId);
    return true;
  }

  function consumePreview(session) {
    if (!session?.round || !session.round.previewPayload) return null;
    const payload = session.round.previewPayload;
    session.round.previewPayload = null;
    return payload;
  }

  function submitAnswer(session, answerIndex, responseTimeMs = 0) {
    const turn = session?.round?.turnState;
    if (!currentPlayer(session) || !turn?.difficulty || turn.answered) throw new Error('Không có lượt trả lời hợp lệ.');
    const question = getCurrentQuestion(session);
    session.round.usedQuestionIds.push(question.id);
    const correct = Number(answerIndex) === question.correctIndex;
    turn.answered = true;
    turn.correct = correct;
    if (correct) {
      const player = currentPlayer(session);
      player.correctAnswers += 1;
      player.correctAnswerTimeMs += Math.min(20000, Math.max(0, Number(responseTimeMs) || 0));
    }
    return { correct, question };
  }

  function toggleBetSymbol(session, symbol) {
    const turn = session?.round?.turnState;
    if (!currentPlayer(session) || !turn?.answered || !turn.correct) throw new Error('Bạn chưa trả lời đúng để chọn ô cược.');
    if (!CONFIG.symbols.some((item) => item.id === symbol)) throw new Error('Ô cược không hợp lệ.');
    const selectedIndex = turn.symbols.indexOf(symbol);
    if (selectedIndex >= 0) turn.symbols.splice(selectedIndex, 1);
    else {
      const limit = DIFFICULTIES[turn.difficulty].selectionCount;
      if (turn.symbols.length >= limit) throw new Error(`Mức ${DIFFICULTIES[turn.difficulty].label} chỉ được chọn ${limit} ô.`);
      turn.symbols.push(symbol);
    }
    return [...turn.symbols];
  }

  function endTurn(session) {
    const player = currentPlayer(session);
    const turn = session?.round?.turnState;
    if (!player || !turn?.answered) return false;
    if (turn.correct) {
      const rule = DIFFICULTIES[turn.difficulty];
      if (turn.symbols.length !== rule.selectionCount) return false;
      session.round.bets.push({ playerId: player.id, difficulty: turn.difficulty, symbols: [...turn.symbols], pointsPerMatch: rule.pointsPerMatch });
    }
    return advanceTurn(session);
  }

  function beginReveal(session) {
    if (!session?.round || session.round.phase !== 'revealing') return false;
    session.round.phase = 'revealing-animation';
    return true;
  }

  function settleRound(session) {
    if (!session?.round || session.round.phase !== 'revealing-animation') throw new Error('Chưa thể công bố kết quả.');
    const counts = Object.fromEntries(CONFIG.symbols.map((symbol) => [symbol.id, 0]));
    session.round.dice.forEach((symbol) => { counts[symbol] += 1; });
    const payouts = Object.fromEntries(session.players.map((player) => [player.id, 0]));
    session.round.bets.forEach((bet) => { payouts[bet.playerId] += bet.amount * counts[bet.symbol]; });
    session.players.forEach((player) => { player.balance += payouts[player.id]; });
    session.round.phase = 'settled';
    return { counts, payouts };
  }

  function pointRanking(session) { return [...session.players].sort((a, b) => b.balance - a.balance || a.id - b.id); }
  function knowledgeRanking(session) { return [...session.players].sort((a, b) => b.correctAnswers - a.correctAnswers || a.correctAnswerTimeMs - b.correctAnswerTimeMs || a.id - b.id); }
  function drawPenalty(session, playerId) {
    const player = session.players.find((item) => item.id === Number(playerId));
    if (!player || player.drawUsed) return null;
    const lost = player.balance; player.balance = 0; player.drawUsed = true; return lost;
  }

  function symbolSvg(id, className = '') {
    return `<img class="folk-image ${className}" src="assets/generated/${id}-v2.png" alt="" aria-hidden="true">`;
  }

  function dieSvg(id, className = '') {
    return `<span class="game-die ${className}" aria-label="${symbolByIdForSvg(id).label}">${symbolSvg(id)}</span>`;
  }

  function symbolByIdForSvg(id) { return CONFIG.symbols.find((symbol) => symbol.id === id) || CONFIG.symbols[0]; }

  function initGame() {
    if (!global.document) return;
    const $ = (id) => document.getElementById(id);
    const dom = {
      setup: $('setup-screen'), game: $('game-screen'), playerList: $('player-list'), addPlayer: $('add-player'), start: $('start-game'), setupError: $('setup-error'), music: $('game-music'),
      round: $('round-number'), turn: $('turn-label'), balance: $('current-balance'), queue: $('queue'),
      grid: $('symbol-grid'), amount: $('bet-amount'), betForm: $('bet-form'), betError: $('bet-error'), preview: $('preview-button'), endTurn: $('end-turn'), reveal: $('reveal-button'), statuses: $('player-statuses'), status: $('status'), newRound: $('new-round'),
      questionDialog: $('question-dialog'), questionText: $('question-text'), questionTimer: $('question-timer'), answers: $('answer-options'), previewDialog: $('preview-dialog'), previewResult: $('preview-result-dice'), previewClose: $('preview-close'), resultDialog: $('result-dialog'), resultDice: $('result-dice'), settlement: $('settlement'), resultNext: $('result-next-round'), stage: $('round-stage'), stageDice: $('stage-dice'), stageCopy: $('stage-copy'), stageBowl: $('stage-bowl'), stageContinue: $('stage-continue'),
      endSession: $('end-session'), summaryDialog: $('summary-dialog'), summaryList: $('summary-list'), summaryContinue: $('summary-continue'), drawDialog: $('draw-dialog'), drawScene: $('draw-scene'), drawUrn: $('draw-urn-button'), drawReveal: $('draw-reveal'), drawResult: $('draw-result'), drawConfirm: $('draw-confirm'), legalDialog: $('legal-dialog'), knowledgeShow: $('knowledge-show'), knowledgeDialog: $('knowledge-dialog'), knowledgeList: $('knowledge-list'),
    };
    let names = ['Người chơi 1', 'Người chơi 2'];
    let session = null;
    let selectedSymbol = null;
    let audioContext = null;
    let questionTimerId = null;
    let questionStartedAt = 0;
    let questionDeadlineAt = 0;
    let questionLocked = false;
    const questionDurationMs = 20000;
    const money = (value) => `${Number(value).toLocaleString('vi-VN')} ⭐`;
    const formatQuizTime = (timeMs) => `${(Number(timeMs) / 1000).toFixed(1).replace('.', ',')} giây`;
    const now = () => global.performance?.now?.() ?? Date.now();
    const symbolById = (id) => CONFIG.symbols.find((symbol) => symbol.id === id);
    const setStatus = (message) => { dom.status.textContent = message; };
    const showSummary = () => { dom.summaryList.innerHTML = pointRanking(session).map((p, i) => `<p><strong>Hạng ${i + 1}. ${p.name}</strong> — ${money(p.balance)} ${p.drawUsed ? '✓ Đã rút' : `<button class="draw-player" data-id="${p.id}" type="button"><img src="assets/generated/fortune-stick-icon.png" alt=""> Bốc thăm</button>`}</p>`).join(''); dom.summaryList.querySelectorAll('.draw-player').forEach((button) => button.addEventListener('click', () => { dom.drawUrn.dataset.id = button.dataset.id; dom.drawScene.className = 'draw-scene'; dom.drawReveal.hidden = true; dom.drawUrn.disabled = false; dom.drawResult.textContent = 'Chạm vào ống thăm để bắt đầu.'; dom.drawConfirm.hidden = true; dom.drawDialog.showModal(); })); };

    function clearQuestionTimer() {
      if (questionTimerId !== null) global.clearInterval(questionTimerId);
      questionTimerId = null;
      questionStartedAt = 0;
      questionDeadlineAt = 0;
      dom.questionTimer.classList.remove('is-urgent');
    }

    function updateQuestionTimer() {
      const seconds = Math.max(0, Math.ceil((questionDeadlineAt - now()) / 1000));
      dom.questionTimer.querySelector('strong').textContent = `${seconds} giây`;
      dom.questionTimer.classList.toggle('is-urgent', seconds <= 5);
    }

    function startQuestionTimer() {
      clearQuestionTimer();
      questionStartedAt = now();
      questionDeadlineAt = questionStartedAt + questionDurationMs;
      updateQuestionTimer();
      questionTimerId = global.setInterval(() => {
        if (now() >= questionDeadlineAt) answerQuestion(-1, true);
        else updateQuestionTimer();
      }, 200);
    }

    async function playShakeSound() {
      const AudioContext = global.AudioContext || global.webkitAudioContext;
      if (!AudioContext) return;
      audioContext ||= new AudioContext();
      await audioContext.resume();
      const startAt = audioContext.currentTime + 0.04;
      for (let beat = 0; beat < 5; beat += 1) {
        const noise = audioContext.createBufferSource();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.16, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < data.length; index += 1) data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
        const filter = audioContext.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 650; filter.Q.value = 1.4;
        const gain = audioContext.createGain(); const at = startAt + beat * 0.42; gain.gain.setValueAtTime(0.8, at); gain.gain.exponentialRampToValueAtTime(0.01, at + 0.2);
        noise.buffer = buffer; noise.connect(filter).connect(gain).connect(audioContext.destination); noise.start(at);
        const knock = audioContext.createOscillator(); knock.type = 'triangle'; knock.frequency.setValueAtTime(165, at); knock.frequency.exponentialRampToValueAtTime(75, at + 0.12); knock.connect(gain); knock.start(at); knock.stop(at + 0.13);
      }
    }

    function renderSetup() {
      dom.playerList.innerHTML = '';
      names.forEach((name, index) => {
        const row = document.createElement('div'); row.className = 'player-entry';
        row.innerHTML = `<span>${index + 1}</span><input aria-label="Tên người chơi ${index + 1}" value="${name.replace(/"/g, '&quot;')}" /><button class="remove-player" type="button" aria-label="Xóa người chơi ${index + 1}">×</button>`;
        row.querySelector('input').addEventListener('input', (event) => { names[index] = event.target.value; });
        row.querySelector('button').addEventListener('click', () => { if (names.length > 1) { names.splice(index, 1); renderSetup(); } });
        dom.playerList.append(row);
      });
    }

    function renderBoard() {
      dom.grid.innerHTML = '';
      const bets = session.round.bets;
      CONFIG.symbols.forEach((symbol) => {
        const button = document.createElement('button'); button.type = 'button'; button.className = `symbol-cell${selectedSymbol === symbol.id ? ' selected' : ''}`;
        const total = bets.filter((bet) => bet.symbol === symbol.id).reduce((sum, bet) => sum + bet.amount, 0);
        button.disabled = session.round.phase !== 'betting';
        button.innerHTML = `${total ? `<span class="bet-chip">${money(total)}</span>` : ''}<span class="icon">${symbolSvg(symbol.id)}</span><span class="label">${symbol.label}</span>`;
        button.addEventListener('click', () => { selectedSymbol = symbol.id; dom.betError.textContent = ''; renderBoard(); });
        dom.grid.append(button);
      });
    }

    function render() {
      const round = session.round;
      const player = currentPlayer(session);
      const betting = round.phase === 'betting';
      dom.round.textContent = round.number;
      dom.turn.textContent = player ? player.name : round.phase === 'revealing' ? 'Chuẩn bị mở bát' : 'Vòng đã kết thúc';
      dom.balance.textContent = player ? money(player.balance) : '—';
      dom.queue.textContent = betting ? `Thứ tự còn lại: ${round.order.slice(round.turnIndex).map((id) => session.players[id].name).join(' → ')}` : 'Đã hoàn tất mọi lượt cược.';
      dom.preview.disabled = !betting || round.previewBuyerId !== null || !player || player.balance < CONFIG.previewCost;
      dom.amount.disabled = !betting;
      dom.betForm.querySelector('button').disabled = !betting;
      dom.newRound.hidden = round.phase !== 'settled';
      dom.endTurn.hidden = round.phase !== 'betting';
      dom.reveal.hidden = round.phase !== 'revealing';
      renderBoard();
      dom.statuses.innerHTML = '';
      session.players.forEach((item) => {
        const betsText = round.bets.filter((bet) => bet.playerId === item.id).map((bet) => `${symbolById(bet.symbol).label} ${money(bet.amount)}`).join(', ');
        const card = document.createElement('div'); card.className = `player-status${player?.id === item.id ? ' active' : ''}`;
        card.innerHTML = `<strong>${item.name}</strong><span id="balance-${item.id}">${money(item.balance)}</span><small>${betsText || 'Chưa có cược'}</small>`;
        dom.statuses.append(card);
      });
      if (player && round.previewBuyerId === player.id && round.previewPayload && !dom.previewDialog.open) {
        dom.previewResult.innerHTML = round.previewPayload.map((id) => `<div class="result-die">${dieSvg(id)}<small>${symbolById(id).label}</small></div>`).join('');
        dom.previewDialog.showModal();
      }
    }

    function openQuestion() {
      const player = currentPlayer(session); const amount = Number(dom.amount.value);
      if (!selectedSymbol) { dom.betError.textContent = 'Hãy chọn một ô trên bàn cược.'; return; }
      if (!Number.isInteger(amount) || amount < CONFIG.minimumBet) { dom.betError.textContent = `Mức cược tối thiểu là ${money(CONFIG.minimumBet)}.`; return; }
      if (amount > player.balance) { dom.betError.textContent = 'Số dư không đủ cho mức cược này.'; return; }
      const question = getCurrentQuestion(session);
      dom.questionText.textContent = question.text; dom.answers.innerHTML = '';
      question.answers.forEach((answer, index) => {
        const option = document.createElement('button'); option.type = 'button'; option.className = 'answer-option'; option.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        option.addEventListener('click', () => answerQuestion(index)); dom.answers.append(option);
      });
      dom.questionDialog.showModal();
      questionLocked = false;
      startQuestionTimer();
    }

    function answerQuestion(index, timedOut = false) {
      if (questionLocked) return;
      questionLocked = true;
      const responseTimeMs = questionStartedAt ? Math.min(questionDurationMs, Math.max(0, now() - questionStartedAt)) : 0;
      clearQuestionTimer();
      const result = submitBet(session, { symbol: selectedSymbol, amount: Number(dom.amount.value) }, index, responseTimeMs);
      dom.questionText.textContent = result.correct ? 'Chính xác! Cược của bạn đã được ghi nhận.' : timedOut ? `Hết giờ! Bạn bị trừ ${money(dom.amount.value)} và lượt cược này bị vô hiệu hóa.` : `Chưa đúng! Bạn bị trừ ${money(dom.amount.value)} và lượt cược này bị vô hiệu hóa.`;
      dom.answers.innerHTML = '';
      global.setTimeout(() => { dom.questionDialog.close(); selectedSymbol = null; questionLocked = false; setStatus(result.correct ? 'Đã ghi nhận cược.' : timedOut ? 'Hết giờ: lượt cược đã bị vô hiệu hóa.' : 'Trả lời sai: lượt cược đã bị vô hiệu hóa.'); render(); }, 1100);
    }

    function playIntro() {
      dom.stageBowl.style.transform = ''; dom.stage.hidden = false; dom.stage.className = 'round-stage is-shaking'; dom.stageCopy.textContent = 'Úp bát · lắc lắc · mở hội'; playShakeSound();
      dom.stageDice.innerHTML = ['bau', 'cua', 'tom'].map((id) => dieSvg(id)).join('');
      global.setTimeout(() => { rollDice(session); dom.stage.hidden = true; openBetting(session); setStatus('Đến lượt người chơi đầu tiên đặt cược.'); render(); }, 2600);
    }

    function reveal() {
      beginReveal(session); dom.stage.hidden = false; dom.stage.className = 'round-stage is-awaiting-open'; dom.stageCopy.textContent = 'Giữ bát và kéo sang phải để mở kết quả'; dom.stageContinue.hidden = true;
      dom.stageDice.innerHTML = session.round.dice.map((id) => dieSvg(id)).join('');
      let startX = null; let opened = false;
      const openBowl = () => { if (opened) return; opened = true; dom.stageCopy.textContent = 'Kết quả đã mở — bấm tiếp tục để thanh toán'; dom.stageContinue.hidden = false; };
      dom.stageBowl.onpointerdown = (event) => { startX = event.clientX; dom.stageBowl.setPointerCapture(event.pointerId); dom.stageBowl.classList.add('is-dragging'); };
      dom.stageBowl.onpointermove = (event) => { if (startX === null) return; const slide = Math.max(0, Math.min(340, event.clientX - startX)); dom.stageBowl.style.transform = `translateX(${slide}px)`; if (slide > 190) openBowl(); };
      dom.stageBowl.onpointerup = () => { startX = null; dom.stageBowl.classList.remove('is-dragging'); };
      dom.stageBowl.onkeydown = (event) => { if (event.key === 'Enter' || event.key === ' ') openBowl(); };
    }

    function beginRound() { selectedSymbol = null; dom.betError.textContent = ''; setStatus('Kết quả xúc xắc đang được khóa trong bát.'); startRound(session); render(); playIntro(); }
    dom.addPlayer.addEventListener('click', () => { if (names.length < CONFIG.questions.length) { names.push(`Người chơi ${names.length + 1}`); renderSetup(); } });
    dom.start.addEventListener('click', () => {
      try { session = createSession(names); dom.music.src = 'https://www.youtube.com/embed/pa-cRsAxPXA?autoplay=1&loop=1&playlist=pa-cRsAxPXA'; dom.setup.hidden = true; dom.game.hidden = false; beginRound(); }
      catch (error) { dom.setupError.textContent = error.message; }
    });
    dom.betForm.addEventListener('submit', (event) => { event.preventDefault(); openQuestion(); });
    dom.preview.addEventListener('click', () => { if (buyPreview(session)) { selectedSymbol = null; setStatus('Bạn đã trả phí xem trước và được chuyển xuống lượt cuối.'); render(); } });
    dom.previewClose.addEventListener('click', () => { consumePreview(session); dom.previewDialog.close(); setStatus('Đã đóng xem trước. Hãy chọn ô cược của bạn.'); render(); });
    dom.endTurn.addEventListener('click', () => { endTurn(session); selectedSymbol = null; setStatus('Đã kết thúc lượt.'); render(); });
    dom.reveal.addEventListener('click', reveal);
    dom.stageContinue.addEventListener('click', () => { const settlement = settleRound(session); dom.stage.hidden = true; dom.resultDice.innerHTML = session.round.dice.map((id) => `<div class="result-die">${dieSvg(id)}<small>${symbolById(id).label}</small></div>`).join(''); const lines = session.players.map((player) => `${player.name}: nhận ${money(settlement.payouts[player.id])} · còn ${money(player.balance)}`); dom.settlement.innerHTML = lines.join('<br>'); render(); dom.resultDialog.showModal(); });
    dom.newRound.addEventListener('click', beginRound);
    dom.resultNext.addEventListener('click', () => { dom.resultDialog.close(); beginRound(); });
    dom.endSession.addEventListener('click', () => { showSummary(); dom.summaryDialog.showModal(); });
    const revealDraw = () => { dom.drawScene.classList.remove('is-shaking'); dom.drawScene.classList.add('is-fading'); dom.drawReveal.hidden = false; global.setTimeout(() => { dom.drawScene.classList.add('is-revealed'); const lost = drawPenalty(session, dom.drawUrn.dataset.id); if (lost === null) return; dom.drawResult.textContent = `Cây thăm cảnh báo: bạn mất toàn bộ ${money(lost)} điểm mô phỏng.`; dom.drawConfirm.hidden = false; }, 1100); };
    dom.drawUrn.addEventListener('click', () => { if (dom.drawUrn.disabled) return; dom.drawUrn.disabled = true; dom.drawScene.classList.add('is-shaking'); global.setTimeout(revealDraw, 1100); });
    dom.drawConfirm.addEventListener('click', () => { dom.drawDialog.close(); showSummary(); });
    dom.summaryContinue.addEventListener('click', () => { dom.summaryDialog.close(); dom.legalDialog.showModal(); });
    dom.knowledgeShow.addEventListener('click', () => { dom.legalDialog.close(); dom.knowledgeList.innerHTML = knowledgeRanking(session).map((p, i) => `<p><strong>Hạng ${i + 1}. ${p.name}</strong> — ${p.correctAnswers} câu đúng · ${formatQuizTime(p.correctAnswerTimeMs)}</p>`).join(''); dom.knowledgeDialog.showModal(); });
    dom.questionDialog.addEventListener('cancel', (event) => event.preventDefault());
    renderSetup();
  }

  const api = { CONFIG, createSession, startRound, rollDice, openBetting, currentPlayer, getCurrentQuestion, chooseDifficulty, submitAnswer, toggleBetSymbol, advanceTurn, endTurn, buyPreview, consumePreview, beginReveal, settleRound, pointRanking, knowledgeRanking, drawPenalty, symbolSvg, dieSvg, initGame };
  global.BauCuaGame = api;
  if (typeof module !== 'undefined') module.exports = api;
  if (global.document) global.document.addEventListener('DOMContentLoaded', initGame);
}(typeof window !== 'undefined' ? window : globalThis));
