// Generate full exam question set

export function generateExam(questions, totalQuestions) {
  const exam = [];

  for (let i = 0; i < totalQuestions; i++) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    exam.push(questions[randomIndex]);
  }

  return exam;
}

// Calculate final score
export function calculateScore(examQuestions, responses) {
  let score = 0;

  examQuestions.forEach((question, index) => {
    const selected = responses[index];

    if (selected === undefined) return;

    if (selected === question.correct) {
      score += 1;
    } else {
      score -= 0.25;
    }
  });

  return score;
}
