import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useLocation } from "react-router-dom";
import { calculateScore } from "../adaptive/engine";

export default function Quiz() {
  const TOTAL_QUESTIONS = 20;
  const QUIZ_DURATION = 20 * 60; // 20 minutes

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const subject = params.get("subject");

  const [questions, setQuestions] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // 🔥 Fetch Subject Questions
  useEffect(() => {
    async function fetchSubjectQuestions() {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .ilike("subject", `%${subject}%`)
        .limit(TOTAL_QUESTIONS);

      if (error) {
        console.error(error);
        setQuestions([]);
        return;
      }

      setQuestions(data);
    }

    if (subject) {
      fetchSubjectQuestions();
    }
  }, [subject]);

  // 🔥 TIMER
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  function handleAnswer(optionIndex) {
    setResponses({
      ...responses,
      [currentIndex]: optionIndex
    });
  }

  function finishQuiz() {
    const score = calculateScore(questions, responses);
    setFinalScore(score);
    setFinished(true);
  }

  if (!subject) {
    return <div className="p-10">Select a subject first.</div>;
  }

  if (questions === null) {
    return <div className="p-10">Loading Quiz...</div>;
  }

  if (questions.length === 0) {
    return <div className="p-10">No questions found.</div>;
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white dark:bg-gray-800 dark:text-white p-10 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          {subject} Quiz Completed
        </h2>
        <p>Final Score: {finalScore}</p>
        <p>
          Attempted: {Object.keys(responses).length} / {questions.length}
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h2 className="font-semibold">
          {subject} — Question {currentIndex + 1} / {questions.length}
        </h2>

        <div className="bg-red-100 dark:bg-red-800 text-red-600 dark:text-white px-4 py-2 rounded-lg font-semibold">
          ⏱ {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="flex flex-1">

        {/* LEFT SIDE */}
        <div className="flex-1 p-8 bg-white dark:bg-gray-800 dark:text-white overflow-y-auto">
          <h3 className="text-lg font-medium mb-6">
            {currentQuestion.question}
          </h3>

          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`block w-full text-left mb-3 px-4 py-3 border rounded-lg transition
                ${
                  responses[currentIndex] === index
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="w-72 bg-gray-50 dark:bg-gray-700 p-6 overflow-y-auto">
          <h4 className="font-semibold mb-4">Question Palette</h4>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded text-sm font-semibold
                  ${
                    responses[index] !== undefined
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={finishQuiz}
            className="mt-8 w-full bg-red-500 text-white py-3 rounded-lg"
          >
            Submit Quiz
          </button>
        </div>

      </div>
    </div>
  );
}
