window.grammarBank.push({
  level: "A1",
  id: "be-present",
  title: "Am, is, are",
  rule: "Chọn dạng của be theo chủ ngữ: I am, he/she/it is, we/you/they are.",
  questions: [
    {
      prompt: "I ___ new to this class. (be)",
      answer: "am",
      why: "I đi với am.",
    },
    {
      prompt: "My cousins ___ in the kitchen.",
      answer: "are",
      others: ["is", "am"],
      why: "My cousins chỉ nhiều người, nên dùng are.",
    },
    {
      prompt: "The shop ___ closed on Sundays. (be)",
      answer: "is",
      why: "The shop là danh từ số ít, đi với is.",
    },
    {
      prompt: "___ you ready for the game?",
      answer: "Are",
      others: ["Is", "Am"],
      why: "Câu hỏi với chủ ngữ you bắt đầu bằng Are.",
    },
    {
      prompt: "This room ___ very warm today.",
      answer: "is",
      others: ["are", "am"],
      why: "This room là một căn phòng, nên động từ là is.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "present-simple",
  title: "Hiện tại đơn và thói quen",
  rule: "Với he, she, it hoặc danh từ số ít, thêm -s/-es vào động từ. Sau does/doesn’t, dùng động từ nguyên mẫu.",
  questions: [
    {
      prompt: "Every Friday, Linh ___ to the art club. (walk)",
      answer: "walks",
      why: "Linh là một người và every Friday diễn tả thói quen, nên walk thành walks.",
    },
    {
      prompt: "My grandparents ___ dinner at six every evening.",
      answer: "eat",
      others: ["eats", "eating"],
      why: "My grandparents là chủ ngữ số nhiều, nên eat giữ nguyên.",
    },
    {
      prompt: "___ your brother play chess after school?",
      answer: "Does",
      others: ["Do", "Is"],
      why: "Câu hỏi hiện tại đơn với your brother cần Does trước chủ ngữ.",
    },
    {
      prompt: "Nora does not ___ milk in her tea. (like)",
      answer: "like",
      why: "Sau does not, động từ like ở nguyên mẫu.",
    },
    {
      prompt: "Our last bus ___ the village at eight each night. (leave)",
      answer: "leaves",
      why: "Our last bus là một chuyến xe, nên leave thêm -s.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "articles",
  title: "A, an và the",
  rule: "Dùng a/an khi giới thiệu một danh từ đếm được số ít. Chọn a/an theo âm đầu. Dùng the khi người nghe biết rõ đối tượng.",
  questions: [
    {
      prompt: "On my first day, I bought ___ umbrella.",
      answer: "an",
      others: ["a", "some"],
      why: "Umbrella bắt đầu bằng một nguyên âm và chỉ một chiếc ô mới được nhắc tới.",
    },
    {
      prompt: "I saw a dog at the gate. ___ dog had a red collar.",
      answer: "The",
      others: ["An", "Some"],
      why: "Lần thứ hai, người nghe đã biết đó là con chó nào, nên dùng The.",
    },
    {
      prompt: "She wants to be ___ pilot one day.",
      answer: "a",
      others: ["an", "some"],
      why: "Pilot là một nghề đếm được số ít, bắt đầu bằng âm phụ âm /p/.",
    },
    {
      prompt: "Fill in a or an: Dad packed ___ orange for me.",
      answer: "an",
      why: "Orange bắt đầu bằng một nguyên âm, nên chọn an.",
    },
    {
      prompt: "Fill in a or an: We need ___ uniform for this class.",
      answer: "a",
      why: "Uniform mở đầu bằng âm /j/ như đầu từ yes, nên dùng a.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "plural-nouns",
  title: "Danh từ số nhiều",
  rule: "Danh từ đếm được sau số lớn hơn một mang dạng số nhiều. Chú ý đuôi -es, -ies và các dạng bất quy tắc.",
  questions: [
    {
      prompt: "Four ___ are waiting outside the classroom. (child)",
      answer: "children",
      why: "Số nhiều của child là children.",
    },
    {
      prompt: "There are two ___ of books near the door.",
      answer: "boxes",
      others: ["boxs", "box"],
      why: "Box kết thúc bằng -x nên thêm -es thành boxes.",
    },
    {
      prompt: "Mia drew three ___ in her notebook. (leaf)",
      answer: "leaves",
      why: "Leaf đổi -f thành -ves ở dạng số nhiều.",
    },
    {
      prompt: "Both ___ are sleeping in the same room. (baby)",
      answer: "babies",
      why: "Baby kết thúc bằng phụ âm + y, nên đổi y thành ies.",
    },
    {
      prompt: "I need clean ___ for the picnic. (glass, nghĩa là chiếc cốc)",
      answer: "glasses",
      why: "Glass chỉ chiếc cốc là danh từ đếm được. Từ kết thúc bằng -ss nên thêm -es.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "object-pronouns",
  title: "Đại từ làm tân ngữ",
  rule: "Sau động từ hoặc giới từ dùng me, you, him, her, it, us, them để thay cho người hoặc vật đã nhắc tới.",
  questions: [
    {
      prompt: "Tom forgot his bag. Can you call ___?",
      answer: "him",
      others: ["he", "his"],
      why: "Tom nhận hành động call, nên dùng tân ngữ him.",
    },
    {
      prompt:
        "These postcards are for my sisters. Please give the cards to ___.",
      answer: "them",
      others: ["they", "their"],
      why: "My sisters là nhiều người. Sau to, dùng them.",
    },
    {
      prompt: "I cannot reach the shelf. Can you help ___?",
      answer: "me",
      others: ["I", "my"],
      why: "Người nói nhận sự giúp đỡ, nên chọn me sau help.",
    },
    {
      prompt: "This is our new teacher, Ms An. We like ___ a lot.",
      answer: "her",
      others: ["she", "hers"],
      why: "Ms An là người được nói tới sau like, nên dùng her.",
    },
    {
      prompt: "My brother and I are at the gate. Please wait for ___.",
      answer: "us",
      others: ["we", "our"],
      why: "My brother and I tương ứng với we. Dạng sau giới từ for là us.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "present-continuous",
  title: "Hiện tại tiếp diễn",
  rule: "Để diễn tả điều đang xảy ra, dùng am/is/are + động từ đuôi -ing.",
  questions: [
    {
      prompt: "Listen! The baby is ___. (cry)",
      answer: "crying",
      why: "Sau is dùng cry thêm -ing. Chữ y được giữ nguyên trong crying.",
    },
    {
      prompt: "Look through the window. The children ___ football right now.",
      answer: "are playing",
      others: ["is playing", "plays"],
      why: "The children là số nhiều và hành động đang diễn ra, nên dùng are playing.",
    },
    {
      prompt: "I cannot talk now. I ___ driving.",
      answer: "am",
      others: ["are", "is"],
      why: "Với chủ ngữ I, ta dùng am trước driving.",
    },
    {
      prompt: "Look! Sam is ___ to catch the bus. (run)",
      answer: "running",
      why: "Run có một âm tiết, kết thúc bằng nguyên âm ngắn + phụ âm. Gấp đôi n trước -ing.",
    },
    {
      prompt: "___ your friends waiting outside at the moment?",
      answer: "Are",
      others: ["Is", "Am"],
      why: "Đưa Are lên trước your friends để hỏi về hành động đang diễn ra.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "place-prepositions",
  title: "Giới từ chỉ vị trí",
  rule: "In chỉ bên trong, on chỉ trên bề mặt, under là phía dưới, between là ở giữa hai đối tượng và next to là ngay bên cạnh.",
  questions: [
    {
      prompt: "The coin is inside the closed box. It is ___ the box.",
      answer: "in",
      others: ["on", "under"],
      why: "Đồng xu nằm bên trong hộp, nên chọn in.",
    },
    {
      prompt:
        "My keys are resting on the top surface of the desk. They are ___ the desk.",
      answer: "on",
      others: ["in", "under"],
      why: "Mặt bàn đỡ chìa khóa, nên dùng on.",
    },
    {
      prompt:
        "The cat is on the floor directly below my chair. It is ___ the chair.",
      answer: "under",
      others: ["between", "in"],
      why: "Below my chair cho biết con mèo ở ngay dưới ghế.",
    },
    {
      prompt:
        "Our red house has the library on its left and the bank on its right. It stands ___ them.",
      answer: "between",
      others: ["on", "in"],
      why: "Nhà nằm ở giữa hai địa điểm đã nêu, nên dùng between.",
    },
    {
      prompt: "The bakery shares a wall with our shop. It is ___ our shop.",
      answer: "next to",
      others: ["inside", "under"],
      why: "Hai cửa tiệm sát vách nhau, phù hợp với next to.",
    },
  ],
});

window.grammarBank.push({
  level: "A1",
  id: "and-but-or",
  title: "Nối ý với and, but, or",
  rule: "And nối các ý bổ sung, but chỉ sự tương phản và or giới thiệu lựa chọn.",
  questions: [
    {
      prompt: "I chose both colours. I bought a blue pen ___ a green pen.",
      answer: "and",
      others: ["but", "or"],
      why: "Both cho biết người nói mua cả hai, nên dùng and.",
    },
    {
      prompt: "This bag is small, ___ it holds all my books.",
      answer: "but",
      others: ["or", "because"],
      why: "Túi nhỏ mà vẫn đựng đủ sách là hai ý tương phản.",
    },
    {
      prompt: "Choose just one drink. Would you like water ___ juice?",
      answer: "or",
      others: ["and", "but"],
      why: "Choose just one đặt hai thức uống thành lựa chọn thay thế.",
    },
    {
      prompt: "I can swim, ___ I cannot ride a bike.",
      answer: "but",
      others: ["or", "because"],
      why: "Hai khả năng trái ngược được nối bằng but.",
    },
    {
      prompt:
        "Điền and, but hoặc or: Do you want to sit inside ___ outside? Pick one.",
      answer: "or",
      why: "Pick one yêu cầu chọn một trong hai vị trí.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "past-simple",
  title: "Quá khứ đơn",
  rule: "Dùng quá khứ đơn cho việc đã kết thúc. Sau did/didn’t, động từ chính trở về nguyên mẫu.",
  questions: [
    {
      prompt: "Yesterday our class ___ the science museum. (visit)",
      answer: "visited",
      why: "Yesterday định vị chuyến thăm ở quá khứ, nên thêm -ed vào visit.",
    },
    {
      prompt: "I ___ my umbrella on the bus last night. (leave)",
      answer: "left",
      why: "Quá khứ bất quy tắc của leave là left.",
    },
    {
      prompt: "Where did you ___ that notebook?",
      answer: "buy",
      others: ["bought", "buying"],
      why: "Did đã thể hiện quá khứ, nên động từ chính là buy.",
    },
    {
      prompt: "We did not ___ the last bus yesterday. (miss)",
      answer: "miss",
      why: "Did not cần đi với động từ nguyên mẫu miss.",
    },
    {
      prompt: "The new student ___ beside me at lunch on Monday. (sit)",
      answer: "sat",
      why: "Quá khứ của sit là sat.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "past-continuous",
  title: "Quá khứ tiếp diễn",
  rule: "Dùng was/were + V-ing cho việc đang xảy ra tại một thời điểm trong quá khứ, nhất là khi bị việc khác xen vào.",
  questions: [
    {
      prompt: "I ___ my bike when a dog ran into the road.",
      answer: "was riding",
      others: ["were riding", "am riding"],
      why: "Việc đạp xe đang diễn ra thì con chó chạy ra đường. Với I, dùng was riding.",
    },
    {
      prompt: "At eight last night, my parents ___ watching a film.",
      answer: "were",
      others: ["was", "are"],
      why: "My parents là số nhiều. At eight last night xác định một thời điểm trong quá khứ.",
    },
    {
      prompt: "She was ___ the plants when the phone rang. (water)",
      answer: "watering",
      why: "Sau was, dùng watering để diễn tả việc đang diễn ra.",
    },
    {
      prompt:
        "Which question asks what was in progress? “What ___ you doing when I called?”",
      answer: "were",
      others: ["did", "was"],
      why: "Với you và doing, dạng câu hỏi đúng là were you doing.",
    },
    {
      prompt: "The shop assistant was ___ a box when I entered. (carry)",
      answer: "carrying",
      why: "Sau was dùng V-ing. Carry giữ y khi thêm -ing.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "going-to",
  title: "Kế hoạch với be going to",
  rule: "Dùng be going to + động từ nguyên mẫu cho dự định đã có hoặc dự đoán có dấu hiệu trước mắt.",
  questions: [
    {
      prompt:
        "We have bought the paint. We ___ going to paint the kitchen tomorrow.",
      answer: "are",
      others: ["is", "am"],
      why: "Kế hoạch đã chuẩn bị. Chủ ngữ we đi với are.",
    },
    {
      prompt: "After the exam, I am going to ___ my aunt in Hue. (visit)",
      answer: "visit",
      why: "Sau going to, động từ visit ở nguyên mẫu.",
    },
    {
      prompt: "Those black clouds are getting closer. It ___ going to rain.",
      answer: "is",
      others: ["are", "does"],
      why: "Dấu hiệu trước mắt dẫn tới dự đoán. It đi với is.",
    },
    {
      prompt: "___ your sister going to study abroad next year?",
      answer: "Is",
      others: ["Does", "Are"],
      why: "Chuyển is ra trước your sister để hỏi về dự định.",
    },
    {
      prompt:
        "The twins have tickets. They are going to ___ the match on Sunday.",
      answer: "watch",
      others: ["watching", "watched"],
      why: "Sau going to dùng watch, không thêm -ing hay -ed.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "present-perfect",
  title: "Hiện tại hoàn thành và trải nghiệm",
  rule: "Dùng have/has + phân từ hai cho trải nghiệm hoặc kết quả liên quan đến hiện tại. Dùng since với mốc thời gian và for với khoảng thời gian.",
  questions: [
    {
      prompt: "I have never ___ a camel before. (ride)",
      answer: "ridden",
      why: "Sau have never dùng phân từ hai của ride là ridden.",
    },
    {
      prompt: "My aunt ___ lived in this town since 2019.",
      answer: "has",
      others: ["have", "is"],
      why: "My aunt là chủ ngữ số ít, đi với has trong hiện tại hoàn thành.",
    },
    {
      prompt: "Have you ever ___ a meal for ten people? (cook)",
      answer: "cooked",
      why: "Ever hỏi về trải nghiệm. Phân từ hai của cook là cooked.",
    },
    {
      prompt: "We have known each other ___ five years.",
      answer: "for",
      others: ["since", "during last"],
      why: "Five years là khoảng thời gian, nên dùng for.",
    },
    {
      prompt: "He has worn glasses ___ his tenth birthday.",
      answer: "since",
      others: ["for", "at"],
      why: "His tenth birthday là một mốc bắt đầu, nên dùng since.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "comparisons",
  title: "So sánh hơn và nhất",
  rule: "So sánh hai đối tượng bằng dạng so sánh hơn + than. Để chỉ mức cao nhất trong một nhóm, dùng the + dạng so sánh nhất.",
  questions: [
    {
      prompt: "My new desk is ___ than my old one. (wide)",
      answer: "wider",
      why: "Wide kết thúc bằng -e, chỉ thêm -r trước than.",
    },
    {
      prompt: "Of the three routes, this one is the ___. (short)",
      answer: "shortest",
      why: "Of the three so sánh cả nhóm, nên dùng the shortest.",
    },
    {
      prompt: "This puzzle is ___ difficult than yesterday’s puzzle.",
      answer: "more",
      others: ["most", "many"],
      why: "Difficult là tính từ dài, dùng more difficult than.",
    },
    {
      prompt: "This soup tastes ___ than the one I made yesterday. (good)",
      answer: "better",
      why: "Dạng so sánh hơn bất quy tắc của good là better.",
    },
    {
      prompt: "Of all our bags, this suitcase is the ___. (heavy)",
      answer: "heaviest",
      why: "Cần so sánh nhất. Heavy đổi y thành i rồi thêm -est.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "quantity",
  title: "Số lượng và danh từ đếm được",
  rule: "Dùng many/a few với danh từ đếm được số nhiều; much/a little với danh từ không đếm được.",
  questions: [
    {
      prompt: "How ___ flour do we need for these pancakes?",
      answer: "much",
      others: ["many", "few"],
      why: "Flour là danh từ không đếm được, nên hỏi how much.",
    },
    {
      prompt: "How ___ chairs should I put round the table?",
      answer: "many",
      others: ["much", "little"],
      why: "Chairs đếm được và đang ở số nhiều, nên dùng how many.",
    },
    {
      prompt: "We still have ___ minutes before the bus leaves.",
      answer: "a few",
      others: ["a little", "much"],
      why: "Minutes là những đơn vị đếm được, nên dùng a few.",
    },
    {
      prompt: "There is ___ juice left: enough for one small glass.",
      answer: "a little",
      others: ["a few", "many"],
      why: "Juice không đếm được và vẫn còn một lượng nhỏ, nên dùng a little.",
    },
    {
      prompt: "I need two ___ of bread for my sandwich.",
      answer: "slices",
      others: ["loaf", "piece"],
      why: "Sau two cần danh từ số nhiều. Slices là đơn vị thích hợp cho bánh mì cắt lát.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "cause-time",
  title: "Mệnh đề nguyên nhân, kết quả và thời gian",
  rule: "Because giới thiệu lý do; so giới thiệu kết quả; when nói thời điểm; before và after cho biết thứ tự.",
  questions: [
    {
      prompt: "We ate indoors ___ the garden was too windy.",
      answer: "because",
      others: ["so", "although"],
      why: "Vế thứ hai giải thích lý do ăn trong nhà.",
    },
    {
      prompt: "The bridge was closed, ___ we took another road.",
      answer: "so",
      others: ["because", "although"],
      why: "Đi đường khác là hệ quả của việc cầu đóng.",
    },
    {
      prompt: "Call me ___ you arrive so I can meet you at the gate.",
      answer: "when",
      others: ["because", "although"],
      why: "Mệnh đề you arrive xác định thời điểm cần gọi.",
    },
    {
      prompt:
        "Wash your hands ___ you start cooking, not once the meal is ready.",
      answer: "before",
      others: ["after", "because"],
      why: "Cần rửa tay trước lúc bắt đầu nấu.",
    },
    {
      prompt:
        "We only opened our umbrellas ___ the rain started, never before.",
      answer: "after",
      others: ["before", "so"],
      why: "Never before cho biết mưa bắt đầu trước khi mọi người mở ô.",
    },
  ],
});

window.grammarBank.push({
  level: "A2",
  id: "modal-verbs",
  title: "Lời khuyên, nghĩa vụ và điều cấm",
  rule: "Should đưa lời khuyên, must/mustn’t nói quy định và điều cấm, don’t have to diễn tả sự không bắt buộc.",
  questions: [
    {
      prompt: "The sign says “No entry”. You ___ go through this door.",
      answer: "must not",
      others: ["do not have to", "should"],
      why: "No entry là lệnh cấm, nên dùng must not.",
    },
    {
      prompt: "The museum is free. Visitors ___ buy a ticket.",
      answer: "do not have to",
      others: ["must", "should always"],
      why: "Vào cửa miễn phí nghĩa là không bắt buộc mua vé.",
    },
    {
      prompt: "You look tired. My advice is: you ___ take a break.",
      answer: "should",
      others: ["must not", "cannot"],
      why: "My advice báo hiệu một lời khuyên, nên dùng should.",
    },
    {
      prompt: "All players must ___ a helmet on this course. (wear)",
      answer: "wear",
      why: "Sau động từ khuyết thiếu must, dùng động từ nguyên mẫu wear.",
    },
    {
      prompt: "You should ___ the address before you leave home. (check)",
      answer: "check",
      why: "Sau should giữ nguyên động từ check.",
    },
  ],
});
