import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { calculateScore } from "../adaptive/engine";
import { useAuth } from "../lib/AuthContext";

export default function Exam() {
  const TOTAL_QUESTIONS = 150;
  const EXAM_DURATION = 9000;

  const { user } = useAuth();

  const [examQuestions, setExamQuestions] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // 🔥 Fetch Mixed Questions
  useEffect(() => {
    async function fetchMixedQuestions() {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .limit(TOTAL_QUESTIONS);

      if (error) {
        console.error(error);
        setExamQuestions([]);
        return;
      }

      setExamQuestions(data);
    }

    fetchMixedQuestions();
  }, []);

  // 🔥 TIMER
  useEffect(() => {
    if (finished) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [finished]);

  async function saveAttempt(score) {
    if (!user) return;

    await supabase.from("attempts").insert([
      {
        user_id: user.id,
        score,
        ability: 0,
        total_questions: examQuestions.length
      }
    ]);
  }

  async function finishExam() {
    const score = calculateScore(examQuestions, responses);
    setFinalScore(score);
    setFinished(true);
    await saveAttempt(score);
  }

  function handleAnswer(optionIndex) {
    setResponses({
      ...responses,
      [currentIndex]: optionIndex
    });
  }
  function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
 }

  if (examQuestions === null) {
    return <div className="p-10">Loading Full Mock...</div>;
  }

  if (examQuestions.length === 0) {
    return <div className="p-10">No questions found.</div>;
  }

  if (finished) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white dark:bg-gray-800 dark:text-white p-10 shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Exam Finished</h2>
        <p>Final Score: {finalScore}</p>
        <p>
          Attempted: {Object.keys(responses).length} / {examQuestions.length}
        </p>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentIndex];

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow">
        <h2 className="font-semibold">
          Question {currentIndex + 1} / {examQuestions.length}
        </h2>

        <div className="bg-red-100 dark:bg-red-800 text-red-600 dark:text-white px-4 py-2 rounded-lg font-semibold">
          ⏱ {formatTime(timeLeft)}
        </div>

      </div>

      <div className="flex flex-1">

        {/* LEFT SIDE QUESTION */}
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

          <div className="grid grid-cols-6 gap-2">
            {examQuestions.map((_, index) => (
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
            onClick={finishExam}
            className="mt-8 w-full bg-red-500 text-white py-3 rounded-lg"
          >
            Submit Exam
          </button>
        </div>

      </div>
    </div>
  );
}
