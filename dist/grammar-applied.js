window.grammarBank.push(
  {
    level: "IELTS",
    id: "contrast",
    title: "Đối chiếu và nhượng bộ",
    rule: "Although và whereas mở đầu mệnh đề. Despite đi với danh từ hoặc cụm V-ing. Chọn từ nối dựa vào cả ý nghĩa và cấu trúc.",
    questions: [
      {
        prompt:
          "___ the pilot was small, its findings were consistent across all three schools.",
        answer: "Although",
        others: ["Despite", "During"],
        why: "Sau chỗ trống là mệnh đề có chủ ngữ và động từ. Although nhấn mạnh kết quả nhất quán dù quy mô nhỏ.",
        also: ["Though", "Even though"],
      },
      {
        prompt:
          "Cycling increased in the north, ___ the figures for the south remained stable.",
        answer: "whereas",
        others: ["despite", "because of"],
        why: "Hai mệnh đề đối chiếu hai vùng. Whereas diễn đạt sự tương phản.",
        also: ["while"],
      },
      {
        prompt: "___ the drop in prices, demand did not recover until June.",
        answer: "Despite",
        why: "Sau chỗ trống là cụm danh từ the drop in prices nên dùng despite.",
        also: ["In spite of"],
      },
      {
        prompt:
          "Public transport became cheaper. ___, fewer people used it that winter.",
        answer: "Nevertheless",
        others: ["Therefore", "For instance"],
        why: "Việc ít người sử dụng trái với kỳ vọng khi giá giảm. Nevertheless nối hai câu theo quan hệ nhượng bộ.",
        also: ["However", "Nonetheless"],
      },
      {
        prompt:
          "Complete the comparison with one word. The second survey was less extensive ___ the first.",
        answer: "than",
        why: "Mẫu so sánh hơn với less là less + tính từ + than.",
      },
    ],
  },
  {
    level: "IELTS",
    id: "time-evidence",
    title: "Mốc thời gian trong báo cáo",
    rule: "Quá khứ đơn dùng với giai đoạn đã kết thúc. Hiện tại hoàn thành nối quá khứ với hiện tại. Quá khứ hoàn thành làm rõ hành động xảy ra trước một mốc quá khứ.",
    questions: [
      {
        prompt:
          "Use the past simple of rise. Between 2011 and 2014, the number of visitors ___ from 300 to 480.",
        answer: "rose",
        why: "Khoảng thời gian đã kết thúc. Quá khứ đơn của rise là rose.",
      },
      {
        prompt:
          "Since the new line opened, the number of weekly bus trips ___ by a third.",
        answer: "has fallen",
        others: ["fell by now", "were falling"],
        why: "Since đưa ra mốc bắt đầu kéo dài tới hiện tại. Chủ ngữ the number ở số ít.",
      },
      {
        prompt:
          "By the time the 2010 census began, many families ___ out of the district.",
        answer: "had moved",
        others: ["have moved", "will move"],
        why: "Việc chuyển nhà đã xảy ra trước cuộc điều tra năm 2010.",
      },
      {
        prompt:
          "Use the past simple passive of record. In 2018, most of the growth ___ in coastal towns.",
        answer: "was recorded",
        why: "Growth là danh từ số ít và là đối tượng được ghi nhận. Mốc 2018 yêu cầu quá khứ đơn.",
      },
      {
        prompt:
          "The graph ends in 2020. Which caption reports an observation rather than a prediction?",
        answer: "Sales peaked in 2020.",
        others: ["Sales will peak in 2020.", "Sales may peak next year."],
        why: "Peaked tường thuật kết quả tại một mốc đã qua. Will và may trong hai phương án kia diễn tả dự đoán.",
      },
    ],
  },
  {
    level: "IELTS",
    id: "relative-precision",
    title: "Mệnh đề quan hệ trong lập luận",
    rule: "Dùng who với người, which với vật và whose để chỉ sở hữu. Giữ giới từ khi nó cần thiết cho nghĩa của mệnh đề.",
    questions: [
      {
        prompt:
          "The smallest sample contained only twelve households, ___ limits the conclusions we can draw.",
        answer: "which",
        others: ["who", "whose"],
        why: "Which sau dấu phẩy có thể thay cho cả ý rằng mẫu chỉ gồm mười hai hộ.",
      },
      {
        prompt:
          "Participants ___ first language was not English could request a translated form.",
        answer: "whose",
        why: "Chỗ trống chỉ quan hệ sở hữu giữa participants và first language.",
      },
      {
        prompt:
          "The two districts in ___ the trial took place later adopted different policies.",
        answer: "which",
        others: ["that", "where"],
        why: "Sau giới từ in cần đại từ quan hệ which. Where đã mang nghĩa nơi chốn.",
      },
      {
        prompt:
          "The schools, ___ were selected at random, submitted their results in May.",
        answer: "which",
        others: ["that", "what"],
        why: "Đây là mệnh đề quan hệ bổ sung giữa hai dấu phẩy. Dùng which cho schools.",
      },
      {
        prompt:
          "For the pattern people + relative pronoun, complete the sentence. The volunteers, ___ worked in pairs, visited each house twice.",
        answer: "who",
        why: "Đại từ làm chủ ngữ của worked và thay cho volunteers trong mệnh đề bổ sung.",
      },
    ],
  },
  {
    level: "IELTS",
    id: "conditions",
    title: "Điều kiện và mức độ chắc chắn",
    rule: "Phân biệt điều kiện có thể xảy ra, giả định hiện tại và giả định trái thực tế trong quá khứ. Dùng động từ khuyết thiếu để thể hiện độ chắc chắn của bằng chứng.",
    questions: [
      {
        prompt:
          "If annual emissions continue to rise, the city ___ its 2030 target.",
        answer: "may miss",
        others: ["would have missed", "had missed"],
        why: "If + hiện tại và may + động từ nguyên mẫu nêu một hệ quả tương lai có thể xảy ra.",
      },
      {
        prompt:
          "Use the past form of be for a formal hypothetical. If clean power ___ cheaper, more factories might switch to it.",
        answer: "were",
        why: "Đây là giả định về hiện tại. Trong văn phong trang trọng, dùng were trong mệnh đề if.",
      },
      {
        prompt:
          "If the sample had included rural households, the result ___ different.",
        answer: "might have been",
        others: ["might be yesterday", "will have being"],
        why: "Had included báo hiệu giả định trái với quá khứ. Kết quả dùng might have + phân từ.",
      },
      {
        prompt:
          "Use one word meaning if not. ___ the authority publishes its method, readers cannot reproduce the estimate.",
        answer: "Unless",
        why: "Unless the authority publishes có nghĩa là nếu cơ quan đó không công bố.",
      },
      {
        prompt:
          "The study reports a correlation but does not establish causation. Which conclusion matches the evidence?",
        answer: "Longer commutes may be associated with lower satisfaction.",
        others: [
          "Longer commutes must cause lower satisfaction.",
          "Longer commutes always reduce satisfaction.",
        ],
        why: "May be associated with giữ đúng mức độ chắc chắn và không khẳng định nguyên nhân.",
      },
    ],
  },
  {
    level: "Office",
    id: "email-links",
    title: "Nối ý trong email",
    rule: "Dùng because cho nguyên nhân, so cho hệ quả, although cho nhượng bộ và so that cho mục đích. Kiểm tra thứ tự ý trước khi gửi email.",
    questions: [
      {
        prompt:
          "The invoice has the wrong tax code, ___ I have returned it for correction.",
        answer: "so",
        others: ["although", "unless"],
        why: "Ý sau là hành động phát sinh từ lỗi trên hóa đơn. So nối nguyên nhân với hệ quả.",
      },
      {
        prompt:
          "Please attach the spreadsheet ___ Finance can check the totals.",
        answer: "so that",
        others: ["despite", "as a result of"],
        why: "Mệnh đề sau nêu mục đích của yêu cầu đính kèm tệp.",
        also: ["in order that"],
      },
      {
        prompt:
          "___ our usual courier is unavailable, we will collect the samples ourselves. Choose a conjunction that gives the reason.",
        answer: "Because",
        others: ["Although", "Unless"],
        why: "Việc đơn vị giao hàng vắng mặt là lý do nhóm tự đi lấy mẫu.",
        also: ["Since", "As"],
      },
      {
        prompt:
          "Complete the fixed phrase. Please label each file in ___ to avoid confusion.",
        answer: "order",
        why: "In order to + động từ nguyên mẫu diễn đạt mục đích.",
      },
      {
        prompt: "Our support desk is open today ___ the public holiday.",
        answer: "despite",
        others: ["although", "even though"],
        why: "The public holiday là cụm danh từ. Despite đứng trước cụm này.",
        also: ["in spite of"],
      },
    ],
  },
  {
    level: "Office",
    id: "project-times",
    title: "Cập nhật tiến độ đúng thì",
    rule: "Phân biệt kế hoạch, việc đang diễn ra, việc đã xong và mốc thời gian quá khứ trong báo cáo công việc.",
    questions: [
      {
        prompt:
          "Use the past simple of send. I ___ the revised quote to Mira yesterday.",
        answer: "sent",
        why: "Yesterday xác định mốc đã kết thúc. Send có dạng quá khứ là sent.",
      },
      {
        prompt:
          "We started the migration at nine and it is still running. We ___ the files since nine.",
        answer: "have been moving",
        others: ["had moved", "move yesterday"],
        why: "Have been moving nhấn mạnh hoạt động bắt đầu lúc chín giờ và vẫn tiếp tục.",
      },
      {
        prompt: "When I called at noon, the technicians ___ the backup system.",
        answer: "were testing",
        others: ["will test", "have tested tomorrow"],
        why: "Việc thử hệ thống đang diễn ra tại thời điểm cuộc gọi trong quá khứ.",
      },
      {
        prompt:
          "Use the future perfect of finish. By the time you arrive on Friday, we ___ the audit.",
        answer: "will have finished",
        why: "Future perfect dùng cho công việc dự kiến hoàn thành trước một mốc tương lai.",
      },
      {
        prompt: "The printer is making copies right now. Which update fits?",
        answer: "It is printing the handouts.",
        others: [
          "It prints the handouts yesterday.",
          "It has print the handouts.",
        ],
        why: "Right now chỉ hành động đang diễn ra. Dùng is + printing.",
      },
    ],
  },
  {
    level: "Office",
    id: "polite-requests",
    title: "Đề nghị và câu hỏi gián tiếp",
    rule: "Sau could hoặc would là động từ nguyên mẫu. Với câu hỏi gián tiếp, giữ thứ tự chủ ngữ rồi đến động từ.",
    questions: [
      {
        prompt: "Could you tell me when ___ available?",
        answer: "the meeting room is",
        others: ["is the meeting room", "does the meeting room be"],
        why: "Sau could you tell me when, dùng trật tự câu kể the meeting room is.",
      },
      {
        prompt: "Would you mind ___ the call by ten minutes?",
        answer: "delaying",
        others: ["delay", "to delay"],
        why: "Would you mind đi với động từ dạng -ing.",
      },
      {
        prompt:
          "Use one word. Would it ___ possible to send the slides before noon?",
        answer: "be",
        why: "Sau would cần động từ nguyên mẫu. Cụm đúng là would it be possible.",
      },
      {
        prompt: "Please let me know ___ you need a visitor badge or not.",
        answer: "whether",
        others: ["what", "which"],
        why: "Whether đưa ra hai khả năng có hoặc không cần thẻ.",
        also: ["if"],
      },
      {
        prompt:
          "Complete the request with the base form of check. Could someone ___ the delivery address before dispatch?",
        answer: "check",
        why: "Sau could và chủ ngữ someone, động từ chính giữ dạng nguyên mẫu.",
      },
    ],
  },
  {
    level: "Office",
    id: "handover",
    title: "Bàn giao và xử lý tình huống",
    rule: "Khi bàn giao, dùng điều kiện để chỉ khi nào cần hành động, câu bị động cho quy trình và mệnh đề quan hệ để xác định đúng người hoặc tài liệu.",
    questions: [
      {
        prompt: "If a customer ___ about a refund, send them the new form.",
        answer: "asks",
        others: ["will asks", "asking"],
        why: "Sau if dùng hiện tại đơn cho tình huống có thể xảy ra. A customer đi với asks.",
      },
      {
        prompt:
          "Each outgoing parcel ___ by a supervisor before it leaves the warehouse.",
        answer: "is checked",
        others: ["checks itself by", "is check"],
        why: "Kiện hàng được người giám sát kiểm tra nên dùng bị động hiện tại đơn.",
      },
      {
        prompt:
          "Use the relative word for possession. Contact the colleague ___ name appears on the rota.",
        answer: "whose",
        why: "Tên thuộc về người đồng nghiệp. Whose liên kết colleague với name.",
      },
      {
        prompt:
          "Do not close the ticket ___ the customer confirms that the issue is resolved.",
        answer: "until",
        others: ["while since", "because of"],
        why: "Until đặt mốc để kết thúc việc chờ xác nhận.",
      },
      {
        prompt:
          "Use the past simple of receive. The analyst who ___ the original request will handle the follow-up.",
        answer: "received",
        why: "Received là động từ của mệnh đề quan hệ who received the original request.",
      },
    ],
  },
  {
    level: "Kids6",
    id: "am-is-are",
    title: "Am, is và are",
    rule: "I đi với am. Một người hoặc một vật đi với is. You, we, they và nhiều người hoặc nhiều vật đi với are.",
    questions: [
      {
        prompt: "I ___ six years old.",
        answer: "am",
        others: ["is", "are"],
        why: "I luôn đi với am trong câu giới thiệu này.",
      },
      {
        prompt: "My kite ___ blue.",
        answer: "is",
        others: ["am", "are"],
        why: "Chỉ có một chiếc diều nên dùng is.",
      },
      {
        prompt: "We ___ in the garden.",
        answer: "are",
        why: "We có nghĩa là chúng mình và đi với are.",
      },
      {
        prompt: "The two frogs ___ green.",
        answer: "are",
        others: ["is", "am"],
        why: "Two frogs là hai con ếch nên dùng are.",
      },
      {
        prompt: "My little sister ___ happy today.",
        answer: "is",
        why: "My little sister chỉ một người nên dùng is.",
      },
    ],
  },
  {
    level: "Kids6",
    id: "these-those",
    title: "Chỉ đồ vật ở gần và xa",
    rule: "This và these chỉ đồ ở gần. That và those chỉ đồ ở xa. This và that dùng cho một vật.",
    questions: [
      {
        prompt: "I am holding one shell. ___ shell is pink.",
        answer: "This",
        others: ["These", "Those"],
        why: "Một chiếc vỏ sò đang ở trong tay, ngay gần người nói.",
      },
      {
        prompt: "The mountains are far away. Look at ___ mountains!",
        answer: "those",
        others: ["this", "that"],
        why: "Nhiều ngọn núi ở xa nên dùng those.",
      },
      {
        prompt: "I have three crayons in my hand. ___ crayons are new.",
        answer: "These",
        why: "Nhiều bút màu ở ngay trong tay nên dùng these.",
      },
      {
        prompt: "One balloon is far away in the sky. ___ balloon is tiny.",
        answer: "That",
        others: ["Those", "These"],
        why: "Chỉ có một quả bóng ở xa nên dùng that.",
      },
      {
        prompt: "Choose the sentence about two flowers right beside you.",
        answer: "These flowers are yellow.",
        others: ["This flowers are yellow.", "Those flower is yellow."],
        why: "Hai bông hoa ở gần đi với these và danh từ số nhiều flowers.",
      },
    ],
  },
  {
    level: "Kids6",
    id: "can-cannot",
    title: "Nói về khả năng với can",
    rule: "Can đi với động từ nguyên mẫu. Dùng cannot hoặc can’t khi nói điều ai đó chưa làm được.",
    questions: [
      {
        prompt: "A fish can ___ in water.",
        answer: "swim",
        others: ["swims", "swimming"],
        why: "Sau can, giữ động từ nguyên mẫu swim.",
      },
      {
        prompt: "I cannot skate yet. Which sentence says the same thing?",
        answer: "I can't skate yet.",
        others: ["I can skate now.", "I am skating now."],
        why: "Can't là dạng viết ngắn của cannot.",
      },
      {
        prompt: "Use the verb jump. My rabbit can ___ very high.",
        answer: "jump",
        why: "Sau can dùng jump cho cả một hay nhiều con thỏ.",
      },
      {
        prompt: "Which question asks about an ability?",
        answer: "Can you ride a bike?",
        others: ["You ride can a bike?", "Can bike you a ride?"],
        why: "Đưa can lên trước you để hỏi bạn có thể làm gì.",
      },
      {
        prompt: "Can Pia draw a star? Yes, she ___.",
        answer: "can",
        why: "Câu trả lời ngắn dùng lại can theo mẫu Yes, she can.",
      },
    ],
  },
  {
    level: "Kids6",
    id: "every-day",
    title: "Việc làm mỗi ngày",
    rule: "Trong hiện tại đơn, he và she thường thêm -s hoặc -es vào động từ. I, we và they giữ dạng nguyên mẫu.",
    questions: [
      {
        prompt: "Every morning, Ben ___ his teeth.",
        answer: "brushes",
        others: ["brush", "is brush"],
        why: "Ben là một người. Động từ brush thêm -es thành brushes.",
      },
      {
        prompt: "I ___ a story before bed.",
        answer: "read",
        others: ["reads", "reading is"],
        why: "Chủ ngữ I dùng động từ read ở dạng nguyên mẫu trong câu kể.",
      },
      {
        prompt: "Use the verb play. My friends ___ football after school.",
        answer: "play",
        why: "My friends là nhiều người. Dùng play không thêm -s.",
      },
      {
        prompt: "Lila ___ to school with her dad every Monday.",
        answer: "goes",
        others: ["go", "going"],
        why: "Lila đi với goes, dạng hiện tại đơn của go cho một người.",
      },
      {
        prompt: "Choose the sentence about a habit.",
        answer: "She feeds her cat every day.",
        others: [
          "She feed her cat every day.",
          "She feeding her cat every day.",
        ],
        why: "She cần động từ feeds và every day cho biết đây là thói quen.",
      },
    ],
  },
  {
    level: "IELTS",
    id: "noun-quantities",
    title: "Định lượng và hòa hợp chủ ngữ",
    rule: "Xác định danh từ có đếm được hay không và tìm chủ ngữ chính trước khi chọn lượng từ hoặc động từ.",
    questions: [
      {
        prompt:
          "A large amount of household waste ___ sent to landfill each year.",
        answer: "is",
        others: ["are", "have"],
        why: "Waste là danh từ không đếm được nên dùng is trong câu bị động.",
      },
      {
        prompt:
          "Use fewer or less. The second survey recorded ___ complaints than the first.",
        answer: "fewer",
        why: "Complaints đếm được ở số nhiều nên dùng fewer.",
      },
      {
        prompt:
          "The percentage of students travelling by bus ___ from 18 to 26 last year.",
        answer: "increased",
        others: ["increase every day", "has increase"],
        why: "Last year chỉ năm đã qua. Increased là quá khứ đơn.",
      },
      {
        prompt:
          "Use much or many. How ___ reliable evidence does the report provide?",
        answer: "much",
        why: "Evidence không đếm được nên câu hỏi dùng how much.",
      },
      {
        prompt:
          "Neither of the two proposals ___ the question of long-term funding. Choose the standard singular verb.",
        answer: "addresses",
        others: ["addressing", "have addressed"],
        why: "Neither là chủ ngữ số ít trong cách dùng trang trọng. Dùng addresses.",
      },
    ],
  },
  {
    level: "IELTS",
    id: "reporting-verbs",
    title: "Tường thuật kết quả nghiên cứu",
    rule: "Chọn cấu trúc theo động từ tường thuật. Suggest thường đi với mệnh đề hoặc V-ing. Attribute dùng với to.",
    questions: [
      {
        prompt:
          "The researchers attributed the fall in noise ___ the new speed limit.",
        answer: "to",
        why: "Cụm cố định là attribute a change to a cause.",
      },
      {
        prompt:
          "The panel recommended ___ ticket prices before the trial began.",
        answer: "reviewing",
        others: ["to review it", "reviewed"],
        why: "Recommend có thể đi với V-ing để đề nghị một hành động.",
      },
      {
        prompt:
          "According to the figures, commuting times appear ___ slightly longer in winter.",
        answer: "to be",
        others: ["being to", "been"],
        why: "Sau appear, dùng to + động từ nguyên mẫu.",
      },
      {
        prompt:
          "The authors warned that the results ___ apply to other age groups.",
        answer: "might not",
        others: ["not might", "did not might"],
        why: "Might not giảm mức độ chắc chắn và đứng trước động từ nguyên mẫu apply.",
      },
      {
        prompt:
          "Use one word to finish the fixed phrase. The rise in cycling was linked ___ safer routes.",
        answer: "to",
        why: "Link one thing to another chuyển sang bị động thành be linked to.",
      },
    ],
  },
  {
    level: "Office",
    id: "agenda-sequence",
    title: "Sắp xếp cuộc họp",
    rule: "Dùng before, after và once để xác định thứ tự các bước. Trong mệnh đề chỉ thời gian tương lai, dùng hiện tại đơn.",
    questions: [
      {
        prompt: "Please send the agenda before the meeting ___.",
        answer: "starts",
        others: ["will starts", "starting"],
        why: "Sau before, dùng hiện tại đơn starts cho thời điểm tương lai.",
      },
      {
        prompt:
          "Once the chair ___ the minutes, we will share them with the team.",
        answer: "approves",
        others: ["will approve", "approving"],
        why: "Once mở mệnh đề thời gian. The chair đi với approves.",
      },
      {
        prompt: "We will pause ___ everyone has joined the call.",
        answer: "until",
        others: ["during", "because of"],
        why: "Until + mệnh đề diễn tả việc chờ cho tới khi mọi người tham gia.",
      },
      {
        prompt:
          "Use the -ing form of book. Before ___ the room, check its seating capacity.",
        answer: "booking",
        why: "Khi bỏ chủ ngữ sau before, dùng dạng V-ing.",
      },
      {
        prompt:
          "Which instruction puts the vote first and the announcement second?",
        answer: "After we vote, we will announce the result.",
        others: [
          "We will vote after announcing the result.",
          "Before we vote, we will announce the result.",
        ],
        why: "After we vote đứng trước bước công bố kết quả.",
      },
    ],
  },
  {
    level: "Office",
    id: "obligation",
    title: "Nghĩa vụ và quyền lựa chọn",
    rule: "Must và have to chỉ yêu cầu. Must not là cấm, còn do not have to là không bắt buộc. Should thường dùng để khuyên.",
    questions: [
      {
        prompt: "Staff ___ disclose customer passwords. Our policy forbids it.",
        answer: "must not",
        others: ["do not have to", "might choose to"],
        why: "Forbids cho biết đây là lệnh cấm. Dùng must not.",
      },
      {
        prompt:
          "The training is optional. You ___ attend if you already know the system.",
        answer: "do not have to",
        others: ["must not under any circumstances", "are required to"],
        why: "Optional nghĩa là tùy chọn. Do not have to diễn đạt không bắt buộc.",
      },
      {
        prompt:
          "Complete the fixed phrase. All visitors have ___ sign in at reception.",
        answer: "to",
        why: "Have to + động từ nguyên mẫu nêu quy định.",
      },
      {
        prompt: "The deadline is tomorrow. Which sentence gives advice?",
        answer: "You should send a reminder today.",
        others: ["You sent a reminder yesterday.", "You have sent a reminder."],
        why: "Should + động từ nguyên mẫu diễn đạt lời khuyên cho hiện tại.",
      },
      {
        prompt:
          "We ___ wear badges at the old office, but the new building uses phone passes. Use the past form of have to.",
        answer: "had to",
        why: "At the old office chỉ quy định trước đây. Quá khứ của have to là had to.",
      },
    ],
  },
  {
    level: "Kids6",
    id: "where-things-are",
    title: "Đồ vật ở đâu?",
    rule: "In là ở trong, on là ở trên mặt và under là ở dưới. Behind là ở phía sau, next to là ở ngay bên cạnh.",
    questions: [
      {
        prompt: "The toy is inside the box. It is ___ the box.",
        answer: "in",
        others: ["on", "under"],
        why: "Inside có nghĩa là bên trong. Dùng in.",
      },
      {
        prompt: "The cup rests on the top of the table. It is ___ the table.",
        answer: "on",
        why: "Cái cốc nằm trên mặt bàn, vì vậy dùng on.",
      },
      {
        prompt: "The ball rolls beneath the chair. Where is it?",
        answer: "Under the chair.",
        others: ["On the chair.", "Inside the chair."],
        why: "Beneath và under đều có nghĩa là ở phía dưới.",
      },
      {
        prompt: "The cat hides at the back of the door. It is ___ the door.",
        answer: "behind",
        others: ["above", "inside"],
        why: "At the back of the door nghĩa là phía sau cánh cửa.",
      },
      {
        prompt:
          "Our two desks touch at the sides. My desk is next ___ your desk.",
        answer: "to",
        why: "Cụm next to có nghĩa là ngay bên cạnh.",
      },
    ],
  },
  {
    level: "Kids6",
    id: "possessives",
    title: "Đồ vật của ai?",
    rule: "My là của mình, your là của bạn, his và her là của một bạn nam hoặc nữ. Our và their chỉ đồ vật của một nhóm.",
    questions: [
      {
        prompt: "I have a pencil. This is ___ pencil.",
        answer: "my",
        others: ["I", "me"],
        why: "Trước pencil dùng my để nói bút thuộc về mình.",
      },
      {
        prompt: "The twins have a dog. It is ___ dog.",
        answer: "their",
        others: ["them", "they"],
        why: "The twins là nhiều người. Their đứng trước danh từ dog.",
      },
      {
        prompt: "You have a red bag. Is this ___ bag?",
        answer: "your",
        why: "Your đứng trước bag và có nghĩa là của bạn.",
      },
      {
        prompt:
          "Linh says, “My brother and I share this bike.” Which word fits? It is ___ bike.",
        answer: "our",
        others: ["we", "us"],
        why: "Khi Linh nói về đồ của hai anh em, bạn ấy dùng our.",
      },
      {
        prompt: "Tom has a cap. This is ___ cap.",
        answer: "his",
        why: "His đứng trước cap và chỉ chiếc mũ của Tom.",
      },
    ],
  },
  {
    level: "Kids3",
    id: "one-many",
    title: "Một và nhiều",
    rule: "Đọc nguyên câu tiếng Anh rồi cho bé chỉ nhóm đồ vật đúng số lượng.",
    questions: [
      {
        prompt: "Người lớn đọc “I see one apple.” Bé chỉ hình phù hợp.",
        answer: "🍎",
        others: ["🍎🍎", "🍌🍌"],
        why: "One apple là một quả táo.",
      },
      {
        prompt: "Người lớn đọc “Here are two cats.” Bé chỉ hình phù hợp.",
        answer: "🐱🐱",
        others: ["🐱", "🐶🐶"],
        why: "Two cats chỉ hai bạn mèo.",
      },
      {
        prompt: "Người lớn đọc “Give me three pears.” Bé chỉ hình phù hợp.",
        answer: "🍐🍐🍐",
        others: ["🍐", "🍐🍐"],
        why: "Three pears là ba quả lê.",
      },
      {
        prompt: "Người lớn đọc “Look at one star.” Bé chỉ hình phù hợp.",
        answer: "⭐",
        others: ["⭐⭐", "🌙🌙"],
        why: "One star chỉ một ngôi sao.",
      },
      {
        prompt:
          "Người lớn đọc “Show me two red balloons.” Bé chỉ hình phù hợp.",
        answer: "🎈🎈",
        others: ["🎈", "🎈🎈🎈"],
        why: "Two red balloons là hai quả bóng đỏ.",
      },
    ],
  },
  {
    level: "Kids3",
    id: "my-actions",
    title: "Nghe hành động",
    rule: "Đọc câu có is + V-ing. Cho bé chọn hình minh họa hành động đang diễn ra.",
    questions: [
      {
        prompt: "Người lớn đọc “The baby is sleeping.” Bé chỉ hình phù hợp.",
        answer: "😴",
        others: ["🏃", "🏊"],
        why: "Is sleeping là đang ngủ.",
      },
      {
        prompt: "Người lớn đọc “The child is swimming.” Bé chỉ hình phù hợp.",
        answer: "🏊",
        others: ["😴", "💃"],
        why: "Is swimming là đang bơi.",
      },
      {
        prompt: "Người lớn đọc “The girl is dancing.” Bé chỉ hình phù hợp.",
        answer: "💃",
        others: ["🧘", "🛌"],
        why: "Is dancing là đang nhảy múa.",
      },
      {
        prompt: "Người lớn đọc “The boy is running.” Bé chỉ hình phù hợp.",
        answer: "🏃",
        others: ["🧑‍🍳", "🧑‍🎨"],
        why: "Is running là đang chạy.",
      },
      {
        prompt:
          "Người lớn đọc “The child is reading a book.” Bé chỉ hình phù hợp.",
        answer: "📖",
        others: ["⚽", "🎸"],
        why: "Is reading a book là đang đọc sách.",
      },
    ],
  },
  {
    level: "Kids3",
    id: "colour-words",
    title: "Màu sắc đứng trước đồ vật",
    rule: "Đọc cụm màu sắc + tên đồ vật rồi để bé chỉ hình có đúng màu và đúng đồ vật.",
    questions: [
      {
        prompt:
          "Người lớn đọc “Point to the blue square.” Bé chỉ hình phù hợp.",
        answer: "🟦",
        others: ["🟥", "🔵"],
        why: "Blue square là hình vuông màu xanh dương.",
      },
      {
        prompt: "Người lớn đọc “Show me the red circle.” Bé chỉ hình phù hợp.",
        answer: "🔴",
        others: ["🔵", "🟥"],
        why: "Red circle là hình tròn màu đỏ.",
      },
      {
        prompt: "Người lớn đọc “Touch the green heart.” Bé chỉ hình phù hợp.",
        answer: "💚",
        others: ["💛", "🟩"],
        why: "Green heart là hình trái tim màu xanh lá.",
      },
      {
        prompt:
          "Người lớn đọc “Where is the yellow square?” Bé chỉ hình phù hợp.",
        answer: "🟨",
        others: ["🟪", "🟡"],
        why: "Yellow square là hình vuông màu vàng.",
      },
      {
        prompt: "Người lớn đọc “Find the purple circle.” Bé chỉ hình phù hợp.",
        answer: "🟣",
        others: ["🟪", "🔴"],
        why: "Purple circle là hình tròn màu tím.",
      },
    ],
  },
  {
    level: "Kids3",
    id: "can-do",
    title: "Con gì có thể làm gì?",
    rule: "Đọc câu có can rồi cho bé chỉ con vật được nhắc đến. Cùng bé bắt chước hành động.",
    questions: [
      {
        prompt: "Người lớn đọc “A bird can fly.” Bé chỉ hình phù hợp.",
        answer: "🐦",
        others: ["🐢", "🐟"],
        why: "Chim có thể bay. Can fly nghĩa là có thể bay.",
      },
      {
        prompt: "Người lớn đọc “A frog can jump.” Bé chỉ hình phù hợp.",
        answer: "🐸",
        others: ["🐟", "🐌"],
        why: "Ếch có thể nhảy. Can jump nghĩa là có thể nhảy.",
      },
      {
        prompt: "Người lớn đọc “A fish can swim.” Bé chỉ hình phù hợp.",
        answer: "🐟",
        others: ["🐝", "🐔"],
        why: "Cá có thể bơi. Can swim nghĩa là có thể bơi.",
      },
      {
        prompt: "Người lớn đọc “A snake can slide.” Bé chỉ hình phù hợp.",
        answer: "🐍",
        others: ["🐥", "🦋"],
        why: "Rắn có thể trườn. Can slide diễn tả khả năng di chuyển này.",
      },
      {
        prompt: "Người lớn đọc “A bee can buzz.” Bé chỉ hình phù hợp.",
        answer: "🐝",
        others: ["🐈", "🐄"],
        why: "Ong có thể kêu vo ve. Can buzz diễn tả âm thanh này.",
      },
    ],
  },
  {
    level: "Kids3",
    id: "yes-and-no",
    title: "Nghe từ not",
    rule: "Đọc câu nhỏ nhẹ, nhấn not. Bé chọn hình phù hợp với cả hai ý.",
    questions: [
      {
        prompt: "Người lớn đọc “It is a dog, not a cat.” Bé chỉ hình phù hợp.",
        answer: "🐶",
        others: ["🐱", "🐰"],
        why: "Câu nói đây là chó và phủ định mèo.",
      },
      {
        prompt:
          "Người lớn đọc “It is a banana, not an apple.” Bé chỉ hình phù hợp.",
        answer: "🍌",
        others: ["🍎", "🍐"],
        why: "Đồ vật được nhắc ở vế khẳng định là quả chuối.",
      },
      {
        prompt:
          "Người lớn đọc “It is raining, not snowing.” Bé chỉ hình phù hợp.",
        answer: "🌧️",
        others: ["🌨️", "☀️"],
        why: "Raining là trời mưa. Not snowing là không có tuyết rơi.",
      },
      {
        prompt:
          "Người lớn đọc “It is a spoon, not a fork.” Bé chỉ hình phù hợp.",
        answer: "🥄",
        others: ["🍴", "🥣"],
        why: "Spoon là cái thìa. Not a fork loại chiếc nĩa.",
      },
      {
        prompt:
          "Người lớn đọc “It is a bus, not a train.” Bé chỉ hình phù hợp.",
        answer: "🚌",
        others: ["🚆", "🚲"],
        why: "Bus là xe buýt. Câu sau not loại tàu hỏa.",
      },
    ],
  },
  {
    level: "Kids3",
    id: "orders",
    title: "Làm theo lời mời",
    rule: "Đọc câu yêu cầu bắt đầu bằng động từ. Để bé chọn vật hoặc hành động hợp với lời mời.",
    questions: [
      {
        prompt: "Người lớn đọc “Clap your hands.” Bé chỉ hình phù hợp.",
        answer: "👏",
        others: ["👣", "👂"],
        why: "Clap your hands là vỗ tay.",
      },
      {
        prompt: "Người lớn đọc “Wave goodbye.” Bé chỉ hình phù hợp.",
        answer: "👋",
        others: ["👏", "🦶"],
        why: "Wave goodbye là vẫy tay tạm biệt.",
      },
      {
        prompt: "Người lớn đọc “Touch your nose.” Bé chỉ hình phù hợp.",
        answer: "👃",
        others: ["👂", "👄"],
        why: "Nose là mũi. Touch your nose mời bé chạm vào mũi.",
      },
      {
        prompt: "Người lớn đọc “Show me your ear.” Bé chỉ hình phù hợp.",
        answer: "👂",
        others: ["👁️", "👃"],
        why: "Ear là tai. Show me mời bé chỉ cho người lớn xem.",
      },
      {
        prompt: "Người lớn đọc “Open your mouth.” Bé chỉ hình phù hợp.",
        answer: "👄",
        others: ["🦶", "🖐️"],
        why: "Mouth là miệng. Open your mouth mời bé há miệng.",
      },
    ],
  },
);
