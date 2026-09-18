# Democracy Quiz Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing 100-question anti-corruption bank with 14 balanced multiple-choice questions about democracy and socialist democracy, split into 7 Easy and 7 Extremely Hard questions.

**Architecture:** Store every question as an explicit object in `game.js` so its difficulty, four choices, and correct slot are reviewable together. Remove the generic distractor and answer-padding pipeline; keep the rest of the game consuming `CONFIG.questions` unchanged.

**Tech Stack:** Browser JavaScript, CommonJS-compatible module export, Node.js built-in test assertions.

## Global Constraints

- Keep exactly 14 questions: 7 `easy` and 7 `hard`.
- Keep the existing 10-second question timer.
- Easy questions test direct recognition or recall of one stated idea.
- Extremely Hard questions require combining ideas, distinguishing close concepts, following a logical chain, or applying theory to practice.
- Every question has exactly four grammatically parallel, semantically plausible choices of comparable length.
- Difficulty comes from question content, not obscure wording or weak distractors.
- Distribute correct choices nearly evenly among A–D without an obvious cycle.

---

### Task 1: Define the new question-bank contract

**Files:**
- Modify: `game.test.js:51-56`
- Modify: `game.test.js:255-276`
- Test: `game.test.js`

**Interfaces:**
- Consumes: `game.CONFIG.questions: Array<{id, text, answers, correctIndex, difficulty}>`
- Produces: Automated checks for count, difficulty split, IDs, answer shape, slot distribution, length camouflage, and removal of legacy topic text.

- [ ] **Step 1: Replace the old count assertions with the 7/7 contract**

```js
assert.equal(game.CONFIG.questions.filter((question) => question.difficulty === "easy").length, 7);
assert.equal(game.CONFIG.questions.filter((question) => question.difficulty === "hard").length, 7);
```

- [ ] **Step 2: Replace the legacy 100-question test with the new content contract**

```js
run("provides 14 balanced questions about democracy and socialist democracy", () => {
  assert.equal(game.CONFIG.questions.length, 14);
  assert.ok(game.CONFIG.questions.every((question) => /^democracy-/.test(question.id)));
  assert.ok(game.CONFIG.questions.every((question) => question.answers.length === 4));
  assert.ok(game.CONFIG.questions.every((question) => [0, 1, 2, 3].includes(question.correctIndex)));
  assert.deepEqual(
    [0, 1, 2, 3].map((slot) => game.CONFIG.questions.filter((question) => question.correctIndex === slot).length),
    [4, 4, 3, 3],
  );
  assert.ok(game.CONFIG.questions.every((question) => new Set(question.answers).size === 4));
  assert.ok(game.CONFIG.questions.every((question) => {
    const lengths = question.answers.map((answer) => answer.length);
    return Math.max(...lengths) - Math.min(...lengths) <= 45;
  }));
  assert.ok(game.CONFIG.questions.every((question) => !/tham nhũng|phòng, chống tham nhũng/i.test(`${question.text} ${question.answers.join(" ")}`)));
});
```

- [ ] **Step 3: Run the test and verify the contract fails against the old bank**

Run: `node game.test.js`

Expected: FAIL on the expected Easy/Hard counts and the expected total of 14.

### Task 2: Replace the generated legacy bank with 14 handcrafted questions

**Files:**
- Modify: `game.js:4-178`
- Test: `game.test.js`

**Interfaces:**
- Consumes: The approved presentation content and Task 1's `CONFIG.questions` contract.
- Produces: `DEMOCRACY_QUESTIONS`, directly assigned to `CONFIG.questions`.

- [ ] **Step 1: Remove the obsolete generated-question pipeline**

Delete `PCTN_QUESTIONS`, `RELATED_DISTRACTORS`, `ANSWER_CONTEXTS`, `ANSWER_ENDINGS`, `chooseDistractors`, `addAnswerContext`, `ANSWER_SLOTS`, and `PCTN_QUIZ_QUESTIONS`.

- [ ] **Step 2: Add the complete explicit 7 Easy + 7 Extremely Hard bank**

Use the following data exactly, then adjust only punctuation or an answer's wording if the automated length-camouflage check requires it:

```js
const DEMOCRACY_QUESTIONS = [
  {
    id: 'democracy-easy-1',
    text: '[DỄ] Hai thành tố Hy Lạp cổ đại “demos” và “kratos” lần lượt có nghĩa là gì?',
    answers: ['Công dân và pháp luật', 'Nhân dân và quyền lực cai trị', 'Cộng đồng và sự bình đẳng', 'Nhà nước và quyền tự do'],
    correctIndex: 1,
    difficulty: 'easy',
  },
  {
    id: 'democracy-easy-2',
    text: '[DỄ] Theo quan điểm Mác – Lênin, dân chủ được nhìn nhận trên ba phương diện nào?',
    answers: ['Một mô hình kinh tế, một hệ tư tưởng và một truyền thống văn hóa', 'Một quyền cá nhân, một phương thức sản xuất và một thiết chế pháp lý', 'Một giá trị đạo đức, một chế độ sở hữu và một phương thức bầu cử', 'Quyền lực thuộc về nhân dân, một thể chế nhà nước và một nguyên tắc tổ chức xã hội'],
    correctIndex: 3,
    difficulty: 'easy',
  },
  {
    id: 'democracy-easy-3',
    text: '[DỄ] Mốc nào đánh dấu nền dân chủ xã hội chủ nghĩa chính thức được xác lập?',
    answers: ['Cách mạng Tháng Mười Nga thắng lợi năm 1917', 'Công xã Paris được thành lập vào năm 1871', 'Dân chủ tư sản xuất hiện cuối thế kỷ XIV–XV', 'Xã hội công xã nguyên thủy hình thành dân chủ quân sự'],
    correctIndex: 0,
    difficulty: 'easy',
  },
  {
    id: 'democracy-easy-4',
    text: '[DỄ] Vì sao dân chủ, xét như một hình thức nhà nước, là một phạm trù lịch sử?',
    answers: ['Vì nội dung dân chủ chỉ thay đổi theo trình độ nhận thức của từng cộng đồng', 'Vì mọi kiểu dân chủ đều tồn tại ổn định dù cơ cấu giai cấp thay đổi', 'Vì dân chủ gắn với sự tồn tại của nhà nước và biến đổi theo điều kiện lịch sử', 'Vì dân chủ chỉ xuất hiện khi xã hội không còn nhà nước và phân chia giai cấp'],
    correctIndex: 2,
    difficulty: 'easy',
  },
  {
    id: 'democracy-easy-5',
    text: '[DỄ] Bản chất chính trị của nền dân chủ xã hội chủ nghĩa được khái quát đúng nhất thế nào?',
    answers: ['Quyền lực thuộc giai cấp tư sản và được thực hiện thông qua nhà nước tư sản', 'Mang bản chất giai cấp công nhân, do Đảng Cộng sản lãnh đạo và phục vụ nhân dân', 'Quyền lực tách khỏi mọi giai cấp và vận hành độc lập với lợi ích xã hội', 'Nhân dân trực tiếp quyết định mọi công việc mà không cần bất kỳ thiết chế đại diện nào'],
    correctIndex: 1,
    difficulty: 'easy',
  },
  {
    id: 'democracy-easy-6',
    text: '[DỄ] Cơ sở kinh tế chủ yếu của nền dân chủ xã hội chủ nghĩa là gì?',
    answers: ['Sở hữu xã hội đối với những tư liệu sản xuất chủ yếu', 'Sở hữu tư nhân đối với phần lớn tư liệu sản xuất chủ yếu', 'Sở hữu hỗn hợp nhưng ưu tiên tuyệt đối lợi ích của nhà đầu tư', 'Sở hữu nhà nước đối với mọi tư liệu sản xuất và tài sản cá nhân'],
    correctIndex: 0,
    difficulty: 'easy',
  },
  {
    id: 'democracy-easy-7',
    text: '[DỄ] Theo nội dung về Luật Thực hiện dân chủ ở cơ sở năm 2022, việc nào người dân có thể bàn và quyết định trực tiếp?',
    answers: ['Phương án quy hoạch đất đai thuộc thẩm quyền phê duyệt của cấp tỉnh', 'Dự toán thu chi ngân sách thuộc thẩm quyền quyết định của Hội đồng nhân dân', 'Kế hoạch đầu tư công thuộc thẩm quyền quyết định của cơ quan nhà nước', 'Mức đóng góp xây dựng cơ sở hạ tầng do cộng đồng dân cư thống nhất'],
    correctIndex: 3,
    difficulty: 'easy',
  },
  {
    id: 'democracy-hard-1',
    text: '[CỰC KHÓ] Chuỗi lập luận nào tái hiện đầy đủ nhất lý do dân chủ là một phạm trù lịch sử?',
    answers: ['Nhận thức xã hội đổi thay → quyền con người mở rộng → mọi kiểu nhà nước dần giống nhau → dân chủ ổn định', 'Lực lượng sản xuất phát triển → văn hóa nâng cao → khác biệt giai cấp tự mất đi → dân chủ trở nên bất biến', 'Điều kiện lịch sử đổi thay → cơ cấu giai cấp và nhà nước biến đổi → chủ thể, phạm vi, cách thực hiện dân chủ đổi theo', 'Hình thức bầu cử thay đổi → quyền lực nhà nước suy giảm → quan hệ sở hữu không còn tác động → dân chủ tự hoàn thiện'],
    correctIndex: 2,
    difficulty: 'hard',
  },
  {
    id: 'democracy-hard-2',
    text: '[CỰC KHÓ] Mệnh đề “dân chủ sẽ mất đi khi nhà nước tiêu vong” chỉ trực tiếp đúng với phương diện nào của dân chủ?',
    answers: ['Dân chủ với tư cách một hình thức hoặc thể chế nhà nước', 'Dân chủ với tư cách giá trị phản ánh các quyền cơ bản của con người', 'Dân chủ với tư cách nguyên tắc tổ chức và quản lý đời sống xã hội', 'Dân chủ với tư cách thành quả văn hóa được nhân loại kế thừa'],
    correctIndex: 0,
    difficulty: 'hard',
  },
  {
    id: 'democracy-hard-3',
    text: '[CỰC KHÓ] Một mô hình nhấn mạnh công hữu tư liệu sản xuất chủ yếu, phân phối theo kết quả lao động và bảo đảm lợi ích người lao động. Tổ hợp này trực tiếp chứng minh mặt bản chất nào?',
    answers: ['Bản chất chính trị, vì xác định lực lượng lãnh đạo và chủ thể quyền lực nhà nước', 'Bản chất xã hội, vì dung hòa lợi ích cá nhân, tập thể và lợi ích toàn xã hội', 'Bản chất tư tưởng, vì xác định nền tảng Mác – Lênin và các giá trị được kế thừa', 'Bản chất kinh tế, vì liên kết chế độ sở hữu, nguyên tắc phân phối và lợi ích lao động'],
    correctIndex: 3,
    difficulty: 'hard',
  },
  {
    id: 'democracy-hard-4',
    text: '[CỰC KHÓ] Chính quyền công khai quỹ đóng góp, cộng đồng biểu quyết mức đóng và Ban Giám sát đầu tư theo dõi công trình. Chuỗi quyền nào được thể hiện đúng thứ tự?',
    answers: ['Được biết → tham gia ý kiến → thụ hưởng kết quả', 'Được biết → quyết định trực tiếp → kiểm tra, giám sát', 'Tham gia ý kiến → ủy quyền quyết định → yêu cầu giải trình', 'Quyết định trực tiếp → được thông tin → phản biện xã hội'],
    correctIndex: 1,
    difficulty: 'hard',
  },
  {
    id: 'democracy-hard-5',
    text: '[CỰC KHÓ] Nhận định nào so sánh đầy đủ nhất bản chất dân chủ xã hội chủ nghĩa và dân chủ tư sản theo nội dung thuyết trình?',
    answers: ['Hai mô hình khác nhau về bản chất giai cấp, cơ sở sở hữu và lợi ích hướng tới, dù đều tổ chức quyền lực bằng thiết chế nhà nước', 'Hai mô hình chỉ khác về kỹ thuật bầu cử, còn bản chất giai cấp, cơ sở kinh tế và lợi ích phục vụ về cơ bản đồng nhất', 'Dân chủ xã hội chủ nghĩa xóa bỏ ngay nhà nước, còn dân chủ tư sản duy trì nhà nước để tổ chức quyền lực của toàn dân', 'Dân chủ tư sản không thừa nhận quyền công dân, còn dân chủ xã hội chủ nghĩa chỉ thực hiện quyền lực bằng hình thức trực tiếp'],
    correctIndex: 0,
    difficulty: 'hard',
  },
  {
    id: 'democracy-hard-6',
    text: '[CỰC KHÓ] Cách kết luận nào thận trọng và chính xác nhất khi đối chiếu ví dụ dân chủ cơ sở ở Việt Nam với vụ Citizens United tại Hoa Kỳ?',
    answers: ['Hai ví dụ đủ chứng minh toàn bộ ưu thế của một mô hình dân chủ so với mô hình còn lại', 'Hai ví dụ cho thấy Việt Nam chỉ có dân chủ trực tiếp, còn Hoa Kỳ chỉ có sự tham gia của doanh nghiệp', 'Hai ví dụ minh họa cách tham gia quyền lực khác nhau, nhưng phải đặt trong toàn bộ cơ cấu giai cấp, kinh tế và nhà nước để kết luận về bản chất', 'Hai ví dụ chứng minh hai mô hình có cùng bản chất vì hoạt động chính trị ở cả hai quốc gia đều được pháp luật điều chỉnh'],
    correctIndex: 2,
    difficulty: 'hard',
  },
  {
    id: 'democracy-hard-7',
    text: '[CỰC KHÓ] Một sinh viên phát hiện vấn đề chung nhưng thông tin chưa được kiểm chứng. Cách xử lý nào thể hiện đầy đủ nhất việc thực hành dân chủ có trách nhiệm?',
    answers: ['Đăng ngay thông tin lên mạng để tạo sức ép, sau đó mới tìm bằng chứng và xem xét nghĩa vụ pháp lý', 'Kiểm chứng thông tin, góp ý qua kênh phù hợp, đối thoại trên căn cứ pháp luật và chịu trách nhiệm về phát ngôn', 'Không nêu ý kiến vì quyền quyết định thuộc cơ quan quản lý, còn sinh viên chỉ có nghĩa vụ chấp hành', 'Chỉ trao đổi trong nhóm riêng để tránh trách nhiệm, đồng thời chờ người khác gửi kiến nghị đến cơ quan có thẩm quyền'],
    correctIndex: 1,
    difficulty: 'hard',
  },
];
```

- [ ] **Step 3: Assign the explicit bank to game configuration**

```js
const CONFIG = {
  difficulties: DIFFICULTIES,
  questionDurationMs: 10000,
  // existing symbols unchanged
  questions: DEMOCRACY_QUESTIONS,
};
```

- [ ] **Step 4: Run the focused automated test suite**

Run: `node game.test.js`

Expected: every test prints `PASS` and the command exits with status 0.

- [ ] **Step 5: Review question quality directly from exported data**

Run:

```powershell
node -e "const q=require('./game.js').CONFIG.questions; for(const x of q) console.log(x.difficulty.toUpperCase(), x.id, x.text, '\n', x.answers.map((a,i)=>String.fromCharCode(65+i)+'. '+a).join('\n'), '\nKEY', String.fromCharCode(65+x.correctIndex), '\n')"
```

Expected: the Easy prompts are visibly direct; the Hard prompts visibly demand comparison, inference, classification, or application; choices are parallel and no correct answer is consistently distinguished by length.

- [ ] **Step 6: Check the patch and commit the implementation**

Run: `git diff --check && git diff -- game.js game.test.js`

Expected: no whitespace errors and only the intended question-bank/test changes.

```bash
git add game.js game.test.js
git commit -m "feat: replace quiz with democracy questions"
```
