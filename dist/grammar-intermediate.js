window.grammarBank.push(
  {
    level: "B1",
    id: "present-perfect-result",
    title: "Hiện tại hoàn thành và kết quả",
    rule: "Dùng have hoặc has với phân từ quá khứ khi nhìn một kết quả từ hiện tại. Với thời điểm đã kết thúc như last Friday, dùng quá khứ đơn.",
    questions: [
      {
        prompt: "The gallery opened on Monday. So far, 300 people ___ it.",
        answer: "have visited",
        why: "So far tính từ lúc mở cửa đến bây giờ. Chủ ngữ 300 people đi với have.",
        others: ["visit yesterday", "had visited before Monday"],
      },
      {
        prompt:
          "Mai is at the airport. She ___ her boarding pass, so she can go straight to security.",
        answer: "has already printed",
        why: "Thẻ lên máy bay đã sẵn sàng. Sau has dùng phân từ printed.",
        others: ["already print", "has already printing"],
      },
      {
        prompt:
          "Complete with the past participle of “choose”. We have ___ a room with a balcony.",
        answer: "chosen",
        why: "Choose đổi thành chosen sau have. Chose là dạng quá khứ đơn.",
      },
      {
        prompt:
          "We delivered the posters last Friday. Which verb completes the report? We ___ them at noon that day.",
        answer: "delivered",
        why: "That day chỉ một ngày đã kết thúc nên dùng quá khứ đơn.",
        others: ["have delivered", "have been delivering"],
      },
      {
        prompt:
          "Finish the question with “see” in the present perfect. How many plays ___ you ___ this season? Write both missing words in order.",
        answer: "have seen",
        why: "How many hỏi số vở kịch đã xem tính đến hiện tại, với you dùng have và phân từ seen.",
      },
    ],
  },
  {
    level: "B1",
    id: "present-perfect-continuous",
    title: "Hiện tại hoàn thành tiếp diễn",
    rule: "Dùng have hoặc has been + V-ing để nhấn mạnh một hoạt động kéo dài đến hiện tại, hoặc vừa dừng và còn dấu hiệu.",
    questions: [
      {
        prompt: "The dough is still on her hands. Linh ___ bread all morning.",
        answer: "has been making",
        why: "Bột còn dính trên tay là dấu hiệu hiện tại của hoạt động làm bánh kéo dài.",
        others: ["had been making tomorrow", "is make"],
      },
      {
        prompt:
          "Complete the verb in the present perfect continuous. The twins ___ (practise) their duet since lunch.",
        answer: "have been practising",
        why: "The twins là số nhiều nên dùng have been. Cả practising và practicing đều đúng.",
        also: ["have been practicing"],
      },
      {
        prompt: "How long ___ the mechanic been checking the brakes?",
        answer: "has",
        why: "The mechanic là chủ ngữ số ít. Câu hỏi đảo has lên trước chủ ngữ.",
        others: ["have", "is"],
      },
      {
        prompt:
          "We can smell fresh paint because the neighbours ___ their gate.",
        answer: "have been painting",
        why: "Mùi sơn là dấu hiệu của việc sơn vừa diễn ra. Sau been dùng painting.",
        others: ["have been paint", "are been painting"],
      },
      {
        prompt:
          "Complete with “wait” in the present perfect continuous. I ___ outside for twenty minutes and the door is still locked.",
        answer: "have been waiting",
        why: "For twenty minutes chỉ khoảng thời gian chờ vẫn đang tiếp diễn.",
      },
    ],
  },
  {
    level: "B1",
    id: "past-perfect",
    title: "Quá khứ hoàn thành",
    rule: "Dùng had + phân từ quá khứ khi nhìn lại một hành động đã hoàn tất trước một mốc khác trong quá khứ.",
    questions: [
      {
        prompt:
          "When I opened the gift box, I realised someone ___ the price tag inside.",
        answer: "had left",
        why: "Nhãn giá đã bị để quên trước khi người kể mở hộp.",
        others: ["has leave", "will leave"],
      },
      {
        prompt:
          "Complete with the past perfect of “eat”. By the time the picnic started, the dog ___ our sandwiches.",
        answer: "had eaten",
        why: "Việc con chó ăn bánh xảy ra trước lúc buổi dã ngoại bắt đầu. Phân từ của eat là eaten.",
      },
      {
        prompt:
          "It was Kim's first ballet class. She ___ ballet before that afternoon.",
        answer: "had never tried",
        why: "Mốc so sánh là buổi học trong quá khứ. Never đứng giữa had và tried.",
        others: ["has never tried", "will never try"],
      },
      {
        prompt:
          "Which question asks about an earlier event? ___ the guests already left when you reached the hall?",
        answer: "Had",
        why: "Reached đặt mốc trong quá khứ. Câu hỏi về việc rời đi trước đó bắt đầu bằng Had.",
        others: ["Have", "Do"],
      },
      {
        prompt:
          "Complete with the past participle of “write”. The label was hard to read because someone had ___ it in pencil.",
        answer: "written",
        why: "Sau had dùng written. Việc viết bằng bút chì giải thích tình trạng của nhãn lúc đó.",
      },
    ],
  },
  {
    level: "B1",
    id: "future-simple",
    title: "Tương lai đơn với will",
    rule: "Dùng will + động từ nguyên mẫu cho dự đoán, lời hứa hoặc quyết định ngay lúc nói. Dùng won’t cho dạng phủ định.",
    questions: [
      {
        prompt: "The intercom is ringing. “Stay here. I ___ it.”",
        answer: "will answer",
        why: "Người nói quyết định trả lời chuông ngay khi nghe thấy.",
        others: ["am answered", "have been answered"],
      },
      {
        prompt:
          "Complete this promise using “will” and “return”. I ___ your umbrella before dinner.",
        answer: "will return",
        why: "Đây là lời hứa. Return giữ nguyên sau will.",
        also: ["'ll return"],
      },
      {
        prompt:
          "Choose the negative prediction. If the cafe stays this quiet, we ___ enough coffee today.",
        answer: "won't sell",
        why: "Sau won’t phải dùng nguyên mẫu sell.",
        others: ["won't sold", "won't selling"],
      },
      {
        prompt:
          "Which word starts a request? “___ you help me carry this speaker upstairs?”",
        answer: "Will",
        why: "Will you help… dùng để nhờ người khác giúp.",
        others: ["Have", "Did been"],
      },
      {
        prompt:
          "Complete with the base form of “be”. The river will ___ higher after the storm.",
        answer: "be",
        why: "Sau will dùng be cho mọi chủ ngữ, kể cả the river.",
      },
    ],
  },
  {
    level: "B1",
    id: "future-continuous",
    title: "Tương lai tiếp diễn",
    rule: "Dùng will be + V-ing để nhìn một hoạt động đang diễn ra tại thời điểm xác định trong tương lai.",
    questions: [
      {
        prompt:
          "The boat race lasts from two until four tomorrow. At three, the crews ___ on the lake.",
        answer: "will be racing",
        why: "Ba giờ nằm giữa khoảng thi đấu nên nhìn hoạt động lúc đang diễn ra.",
        others: ["will have finish", "are race"],
      },
      {
        prompt:
          "Use the future continuous of “drive”. Please text instead of calling at six. I ___ home then.",
        answer: "will be driving",
        why: "Then chỉ đúng thời điểm người nói đang lái xe về.",
      },
      {
        prompt:
          "Complete the question. Will you ___ using the projector during lunch?",
        answer: "be",
        why: "Cấu trúc nghi vấn là will + chủ ngữ + be + V-ing.",
        others: ["been", "being"],
      },
      {
        prompt:
          "At midnight our overnight train will still be ___ through the mountains.",
        answer: "travelling",
        why: "Still gợi ý hành trình vẫn đang diễn ra. Sau will be cần V-ing.",
        others: ["travelled", "travels"],
      },
      {
        prompt:
          "Use the future continuous of “interview”. At ten tomorrow morning, the editor ___ a local artist on air.",
        answer: "will be interviewing",
        why: "Công việc phỏng vấn đang diễn ra vào đúng mười giờ sáng mai.",
      },
    ],
  },
  {
    level: "B1",
    id: "first-conditional",
    title: "Điều kiện có thể xảy ra",
    rule: "Điều kiện thực trong tương lai thường dùng if + hiện tại đơn. Mệnh đề kết quả có thể dùng will, động từ khuyết thiếu hoặc câu mệnh lệnh.",
    questions: [
      {
        prompt: "If the parcel ___ before noon, I'll bring it to your flat.",
        answer: "arrives",
        why: "The parcel là số ít nên arrive thêm s trong mệnh đề if.",
        others: ["will arrives", "arrive"],
      },
      {
        prompt:
          "Complete with “miss” in the present simple. If we ___ the last ferry, we'll stay on the island.",
        answer: "miss",
        why: "Trong mệnh đề if, chủ ngữ we đi với miss nguyên dạng.",
      },
      {
        prompt:
          "Take a spare battery ___ the shop is closed when we get there.",
        answer: "in case",
        why: "In case chỉ biện pháp đề phòng khả năng cửa hàng đóng cửa.",
        others: ["because of", "despite"],
      },
      {
        prompt:
          "You won't see the private album ___ the owner sends you an invitation.",
        answer: "unless",
        why: "Unless diễn tả ngoại lệ. Lời mời là điều kiện để xem được album.",
        others: ["despite", "because of"],
      },
      {
        prompt: "If the red light comes on, ___ the machine immediately.",
        answer: "stop",
        why: "Mệnh đề kết quả là một chỉ dẫn trực tiếp, dùng mệnh lệnh với stop.",
        others: ["stops", "to stop"],
      },
    ],
  },
  {
    level: "B1",
    id: "second-conditional",
    title: "Điều kiện giả định hiện tại",
    rule: "Dùng if + quá khứ đơn để tưởng tượng tình huống khác hiện tại. Kết quả thường dùng would + nguyên mẫu.",
    questions: [
      {
        prompt:
          "I don't own a car. If I ___ one, I would visit my grandparents more often.",
        answer: "owned",
        why: "Người nói tưởng tượng mình có xe ở hiện tại nên dùng owned.",
        others: ["had owned last year", "will own"],
      },
      {
        prompt:
          "Complete with “take” after would. If the bus were cheaper, more people would ___ it.",
        answer: "take",
        why: "Sau would dùng động từ nguyên mẫu take.",
      },
      {
        prompt: "If our kitchen were larger, we ___ a proper dining table.",
        answer: "would buy",
        why: "Việc mua bàn là kết quả của một điều kiện giả định ở hiện tại.",
        others: ["will bought", "would buying"],
      },
      {
        prompt:
          "Use the past simple of “live”. If they ___ nearer the coast, they could sail every weekend.",
        answer: "lived",
        why: "Lived đánh dấu giả định về nơi ở hiện nay.",
      },
      {
        prompt:
          "Which question asks about an imagined job? What ___ you do if you ran a small bakery?",
        answer: "would",
        why: "Would kết hợp với do để hỏi người nghe sẽ làm gì trong tình huống giả định.",
        others: ["are", "did have"],
      },
    ],
  },
  {
    level: "B1",
    id: "defining-relatives",
    title: "Mệnh đề quan hệ xác định",
    rule: "Dùng mệnh đề quan hệ để xác định người hoặc vật. Who chỉ người, which hoặc that chỉ vật, whose diễn tả sở hữu và where chỉ nơi chốn.",
    questions: [
      {
        prompt:
          "The nurse ___ showed me the entrance was wearing a blue jacket.",
        answer: "who",
        why: "Đại từ thay cho the nurse và làm chủ ngữ của showed.",
        others: ["which", "whose"],
      },
      {
        prompt: "I need a cable ___ fits this old camera.",
        answer: "that",
        why: "Cable là vật. That làm chủ ngữ cho động từ fits.",
        others: ["who", "where"],
      },
      {
        prompt:
          "Fill the gap with a possessive relative word. Is that the cyclist ___ helmet we found?",
        answer: "whose",
        why: "Chiếc mũ thuộc về người đi xe đạp nên dùng whose trước helmet.",
      },
      {
        prompt: "This is the courtyard ___ we held the festival.",
        answer: "where",
        why: "Cần một từ chỉ địa điểm để nói lễ hội diễn ra ở đó.",
        others: ["which it", "who"],
      },
      {
        prompt: "Which sentence can omit the relative pronoun?",
        answer: "The film that we watched was funny.",
        why: "Trong we watched, we đã là chủ ngữ. That thay tân ngữ của watched nên có thể lược bỏ.",
        others: [
          "The film that won was funny.",
          "The actor who waved was smiling.",
        ],
      },
    ],
  },
  {
    level: "B1",
    id: "cause-result-purpose",
    title: "Nguyên nhân, kết quả và mục đích",
    rule: "Because đi với mệnh đề, because of đi với cụm danh từ. So đưa ra kết quả. To + động từ và so that + mệnh đề diễn tả mục đích.",
    questions: [
      {
        prompt: "The pavement was slippery ___ the overnight frost.",
        answer: "because of",
        why: "The overnight frost là cụm danh từ chỉ nguyên nhân.",
        others: ["because", "so that"],
      },
      {
        prompt:
          "We lowered the microphone ___ the younger children could reach it.",
        answer: "so that",
        why: "The younger children could reach it là mệnh đề chỉ mục đích.",
        others: ["because of", "in order to"],
      },
      {
        prompt:
          "The printer ran out of ink, ___ I sent the invitations by email.",
        answer: "so",
        why: "Việc gửi email là kết quả của việc hết mực.",
        others: ["although", "despite"],
      },
      {
        prompt:
          "Complete with the missing word in “in order to”. I booked an early train in ___ to see the opening ceremony.",
        answer: "order",
        why: "In order to see nêu mục đích đặt chuyến tàu sớm.",
      },
      {
        prompt:
          "I stayed near the exit ___ I needed to leave before the last song.",
        answer: "because",
        why: "Sau chỗ trống là mệnh đề có chủ ngữ I và động từ needed, giải thích lý do.",
        others: ["because of", "despite"],
      },
    ],
  },
  {
    level: "B2",
    id: "past-perfect-continuous",
    title: "Quá khứ hoàn thành tiếp diễn",
    rule: "Dùng had been + V-ing để diễn tả hoạt động kéo dài đến một mốc quá khứ hoặc để giải thích dấu hiệu lúc đó.",
    questions: [
      {
        prompt:
          "Before the rescue boat arrived, the swimmers ___ for nearly an hour.",
        answer: "had been floating",
        why: "Khoảng thời gian trôi trên nước kết thúc tại mốc chiếc thuyền đến trong quá khứ.",
        others: ["have been floating", "will be floating"],
      },
      {
        prompt:
          "Complete with the past perfect continuous of “dig”. His boots were covered in mud because he ___ in the garden.",
        answer: "had been digging",
        why: "Bùn trên ủng là dấu hiệu của việc đào đất trước thời điểm được kể.",
      },
      {
        prompt:
          "Which word is missing? How long had the engine ___ running before you noticed the smoke?",
        answer: "been",
        why: "Câu hỏi vẫn giữ chuỗi had + chủ ngữ + been + running.",
        others: ["be", "being"],
      },
      {
        prompt:
          "The dance floor was wet when we arrived. Water ___ through the roof all night.",
        answer: "had been dripping",
        why: "All night cho biết thời gian nước nhỏ xuống trước lúc đến.",
        others: ["will have dripped", "is dripping tomorrow"],
      },
      {
        prompt:
          "Complete with the -ing form of “tie”. Before help came, Jo had been ___ branches together to build a shelter.",
        answer: "tying",
        why: "Tie đổi ie thành y trước đuôi ing, tạo thành tying.",
      },
    ],
  },
  {
    level: "B2",
    id: "future-perfect",
    title: "Tương lai hoàn thành",
    rule: "Dùng will have + phân từ quá khứ khi nhìn từ một mốc tương lai về việc sẽ hoàn tất trước hoặc ngay tại mốc ấy.",
    questions: [
      {
        prompt:
          "By the time the archive opens next June, volunteers ___ all sixty boxes.",
        answer: "will have sorted",
        why: "Nhìn từ thời điểm mở cửa, việc phân loại sáu mươi hộp sẽ hoàn tất.",
        others: ["will have sorting", "will has sorted"],
      },
      {
        prompt:
          "Use the future perfect of “repay”. By my final payday in March, I ___ the loan in full.",
        answer: "will have repaid",
        why: "Repay có phân từ repaid. In full cho thấy kết quả là trả xong toàn bộ.",
      },
      {
        prompt:
          "Choose the missing participle. By winter, the birds will have ___ south.",
        answer: "flown",
        why: "Sau will have cần phân từ flown của fly.",
        others: ["flew", "flying"],
      },
      {
        prompt:
          "Will the orchestra ___ finished rehearsing by the time the doors open?",
        answer: "have",
        why: "Trong câu hỏi, have giữ nguyên sau chủ ngữ the orchestra.",
        others: ["has", "having"],
      },
      {
        prompt:
          "Complete with “see” in the future perfect. By Sunday evening, the critics ___ every film in the competition.",
        answer: "will have seen",
        why: "By Sunday evening là hạn cuối. Seen là phân từ của see.",
      },
    ],
  },
  {
    level: "B2",
    id: "future-perfect-continuous",
    title: "Tương lai hoàn thành tiếp diễn",
    rule: "Dùng will have been + V-ing để nhấn mạnh thời lượng hoạt động tính đến một thời điểm trong tương lai.",
    questions: [
      {
        prompt: "By next April, Bao ___ night shifts for exactly a decade.",
        answer: "will have been working",
        why: "For exactly a decade nhấn mạnh thời gian làm ca đêm tính đến tháng Tư tới.",
        others: ["will have been work", "will has worked"],
      },
      {
        prompt:
          "Use the future perfect continuous of “teach”. At the end of this term, I ___ here for fifteen years.",
        answer: "will have been teaching",
        why: "Thời lượng giảng dạy được tính đến cuối học kỳ.",
      },
      {
        prompt:
          "Complete the question. By noon, how long will the divers have ___ searching the wreck?",
        answer: "been",
        why: "Sau will have dùng been để nối với searching.",
        others: ["be", "being"],
      },
      {
        prompt:
          "Which ending stresses the duration up to 8 p.m.? At eight, the crew will have been ___ signals for ten hours.",
        answer: "monitoring",
        why: "Will have been monitoring nhấn mạnh mười giờ theo dõi tín hiệu.",
        others: ["monitored", "monitor"],
      },
      {
        prompt:
          "Use the future perfect continuous of “wait”. By the time the clinic opens, we ___ outside for ninety minutes.",
        answer: "will have been waiting",
        why: "Ninety minutes là tổng thời gian chờ khi phòng khám mở cửa.",
      },
    ],
  },
  {
    level: "B2",
    id: "third-conditional",
    title: "Điều kiện trái với quá khứ",
    rule: "Dùng if + had + phân từ và would have + phân từ để hình dung điều kiện cùng kết quả khác với việc đã xảy ra.",
    questions: [
      {
        prompt:
          "If the goalkeeper ___ the warning, she would have moved earlier.",
        answer: "had heard",
        why: "Giả định nghe được lời cảnh báo trong trận đấu đã kết thúc.",
        others: ["has heard", "would hear"],
      },
      {
        prompt:
          "Use the past perfect of “keep”. If we ___ the receipt, we would have received a refund.",
        answer: "had kept",
        why: "Keep có phân từ kept. Việc giữ hóa đơn là điều kiện giả định trong quá khứ.",
      },
      {
        prompt:
          "They missed the interview. If they had checked the address, they ___ on time.",
        answer: "would have arrived",
        why: "Kết quả giả định trong quá khứ cần would have arrived.",
        others: ["would have arriving", "will have arrive"],
      },
      {
        prompt:
          "Complete with the participle of “take”. We would have ___ the lift if the stairs had been closed.",
        answer: "taken",
        why: "Trong would have taken, taken là phân từ của take.",
      },
      {
        prompt:
          "The cake collapsed. It wouldn't have collapsed if I ___ the oven door so early.",
        answer: "hadn't opened",
        why: "Người kể đã mở cửa lò. Hadn’t opened đảo ngược sự việc đó trong giả định.",
        others: ["haven't opened", "wouldn't opening"],
      },
    ],
  },
  {
    level: "B2",
    id: "mixed-conditional",
    title: "Câu điều kiện hỗn hợp",
    rule: "Chọn thì ở từng vế theo thời điểm của điều kiện và kết quả. Một quyết định trong quá khứ có thể ảnh hưởng đến hiện tại.",
    questions: [
      {
        prompt:
          "If Hana had accepted the transfer last year, she ___ in Seoul now.",
        answer: "would be living",
        why: "Last year là thời điểm quyết định. Now chuyển kết quả giả định sang hiện tại.",
        others: ["would have lived last year", "will have lived yesterday"],
      },
      {
        prompt:
          "Kai still doesn't speak Italian. If he spoke Italian, he ___ yesterday's phone call without help.",
        answer: "could have handled",
        why: "Điều kiện là khả năng ngôn ngữ hiện tại. Cuộc gọi lại thuộc về hôm qua.",
        others: ["could handles", "will be handling"],
      },
      {
        prompt:
          "Complete with the past perfect of “study”. If I ___ design at college, I might be an illustrator now.",
        answer: "had studied",
        why: "Quyết định học ở đại học trong quá khứ tác động đến nghề nghiệp hiện tại.",
      },
      {
        prompt:
          "If the river had not flooded last week, the bridge ___ open today.",
        answer: "would be",
        why: "Today cho biết kết quả giả định ở hiện tại nên dùng would be.",
        others: ["would have be", "will have being"],
      },
      {
        prompt: "Select the sentence with a past cause and a present result.",
        answer: "If I had packed my glasses, I could read the sign now.",
        why: "Had packed đặt nguyên nhân trong quá khứ. Now đặt kết quả ở hiện tại.",
        others: [
          "If I pack my glasses, I can read on the train.",
          "If I had packed my glasses, I could have read the menu yesterday.",
        ],
      },
    ],
  },
  {
    level: "B2",
    id: "non-defining-relatives",
    title: "Mệnh đề quan hệ bổ sung",
    rule: "Mệnh đề bổ sung dùng dấu phẩy để thêm thông tin. Dùng who cho người, which cho vật, whose cho sở hữu. Which cũng có thể thay cho cả ý trước.",
    questions: [
      {
        prompt: "My aunt Lina, ___ restores old clocks, has moved to Hue.",
        answer: "who",
        why: "Thông tin giữa hai dấu phẩy bổ sung cho một người đã xác định.",
        others: ["that", "which"],
      },
      {
        prompt:
          "The waterwheel, ___ is over a century old, still turns each morning.",
        answer: "which",
        why: "The waterwheel là vật. Mệnh đề bổ sung bắt đầu bằng which.",
        others: ["that", "whose"],
      },
      {
        prompt:
          "Fill the possessive relative word. Minh, ___ studio overlooks the docks, paints fishing boats.",
        answer: "whose",
        why: "Phòng vẽ thuộc về Minh. Whose nối Minh với studio.",
      },
      {
        prompt:
          "The rehearsal finished early, ___ meant we caught the last bus.",
        answer: "which",
        why: "Which thay cho toàn bộ sự việc buổi tập kết thúc sớm.",
        others: ["what", "that"],
      },
      {
        prompt:
          "Choose the sentence that presents the museum's age as extra information.",
        answer:
          "The town museum, which opened in 1890, is closing for repairs.",
        why: "Hai dấu phẩy cho thấy năm mở cửa là chi tiết bổ sung về bảo tàng đã xác định.",
        others: [
          "The town museum that opened in 1890 is closing for repairs.",
          "The town museum which opened in 1890 is closing for repairs.",
        ],
      },
    ],
  },
  {
    level: "B2",
    id: "contrast-concession",
    title: "Đối lập và nhượng bộ",
    rule: "Although và whereas đi với mệnh đề. Despite và in spite of đi với cụm danh từ hoặc V-ing. However có thể nối hai câu độc lập.",
    questions: [
      {
        prompt:
          "___ the narrow staircase, the movers carried the piano upstairs.",
        answer: "Despite",
        why: "The narrow staircase là cụm danh từ nên dùng despite.",
        others: ["Although", "Whereas"],
      },
      {
        prompt: "The harbour stayed open ___ the sea was unusually rough.",
        answer: "even though",
        why: "The sea was unusually rough là mệnh đề mang ý nhượng bộ.",
        others: ["despite", "in spite of"],
      },
      {
        prompt:
          "The north wing gets direct sunlight, ___ the south wing stays cool.",
        answer: "whereas",
        why: "Whereas đối chiếu hai đặc điểm qua hai mệnh đề có động từ.",
        others: ["despite", "in spite of"],
      },
      {
        prompt:
          "Complete the fixed phrase. In spite ___ losing her notes, the speaker gave a clear talk.",
        answer: "of",
        why: "Cụm cố định là in spite of, theo sau được bởi losing her notes.",
      },
      {
        prompt:
          "The proposal was cheaper. ___, it offered fewer evening sessions.",
        answer: "However",
        why: "However đứng đầu câu độc lập mới và theo sau là dấu phẩy.",
        others: ["Although", "Despite"],
      },
    ],
  },
  {
    level: "B2",
    id: "modal-deduction",
    title: "Suy luận về quá khứ",
    rule: "Must have + phân từ diễn tả suy luận mạnh. Might have thể hiện khả năng. Can’t have loại trừ một cách giải thích dựa trên bằng chứng.",
    questions: [
      {
        prompt:
          "I saw Noor in Hanoi at noon, so she ___ been at the London meeting at that exact moment.",
        answer: "can't have",
        why: "Hai địa điểm ở rất xa nhau giúp loại trừ việc Noor có mặt ở London cùng lúc.",
        others: ["must have", "should to have"],
      },
      {
        prompt:
          "The lock is intact and only Arun has a key. He ___ opened the box.",
        answer: "must have",
        why: "Các dấu hiệu dẫn đến suy luận mạnh rằng Arun đã mở hộp.",
        others: ["can't have", "ought opening"],
      },
      {
        prompt:
          "Choose the form that expresses uncertainty. I don't know where my pass is. I ___ left it at reception.",
        answer: "might have",
        why: "Might have diễn tả một giả thuyết khi người nói chưa chắc chắn.",
        others: ["must to have", "can't to have"],
      },
      {
        prompt:
          "Complete with the participle of “forget”. The guests might have ___ the new starting time.",
        answer: "forgotten",
        why: "Sau might have cần phân từ forgotten.",
      },
      {
        prompt:
          "The lights are still on. Which sentence presents a possible explanation without certainty?",
        answer: "Someone may have stayed late.",
        why: "May have stayed trình bày một khả năng rồi để ngỏ các cách giải thích khác.",
        others: [
          "Everyone definitely stayed late.",
          "Nobody could possibly have stayed late.",
        ],
      },
    ],
  },
);
