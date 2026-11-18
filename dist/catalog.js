// Unit positions and question positions within a topic are persistent lesson IDs.
// Add new material at the end of its unit list or grammar topic.
const catalog = {};
function makeCatalog() {
  for (const [level, base] of Object.entries(window.courses)) {
    const tracks = {};
    for (const skill of ["vocab", "grammar", "writing", "listen"]) {
      tracks[skill] = [{ id: skill, title: base.english, detail: base.title }];
    }
    tracks.speaking = [];
    for (const [index, row] of window.units[level].entries()) {
      const [
        title,
        word,
        ipa,
        meaning,
        example,
        transcript,
        question,
        answer,
        wrong1,
        wrong2,
        writing,
        picture,
      ] = row;
      const id = index + 1;
      const unit = {
        title,
        word,
        ipa,
        meaning,
        example,
        transcript,
        question,
        answer,
        wrong1,
        wrong2,
        writing,
        picture,
        number: id,
      };
      for (const skill of ["vocab", "listen", "writing"]) {
        tracks[skill].push({
          id: skill + "-" + id,
          title: skill === "vocab" ? word : title,
          detail:
            skill === "vocab"
              ? meaning
              : skill === "writing"
                ? writing
                : question,
          unit,
        });
      }
      tracks.speaking.push({
        id: "speaking-" + id,
        title,
        detail: window.dialogues[level][index][0],
        turns: window.dialogues[level][index],
      });
    }
    for (const topic of window.grammarBank.filter((t) => t.level === level)) {
      topic.questions.forEach((q, i) => {
        tracks.grammar.push({
          id: "g-" + topic.id + "-" + (i + 1),
          title: topic.title + " · " + (i + 1),
          detail: q.prompt,
          topic,
          questionIndex: i,
        });
      });
    }
    for (const book of (window.writingBook || []).filter(
      (b) => b.level === level,
    )) {
      tracks.writing.push({
        id: book.id,
        title: book.title,
        detail: "Writing 1 · " + book.prompt,
        book,
      });
    }
    for (const story of window.readings.filter((r) => r.level === level)) {
      tracks.listen.push({
        id: "story-" + story.id,
        title: story.title,
        detail: "Đọc và nghe · " + story.vi,
        story,
      });
    }
    catalog[level] = tracks;
  }
}
function courseCounts(level, completed) {
  const learned = new Set(completed);
  return Object.fromEntries(
    Object.entries(catalog[level]).map(([skill, lessons]) => [
      skill,
      {
        done: lessons.filter((l) => learned.has(l.id)).length,
        total: lessons.length,
      },
    ]),
  );
}
function kidPicture(level, unit) {
  return "art/words/" + level + "-" + unit.number + ".webp";
}
makeCatalog();
