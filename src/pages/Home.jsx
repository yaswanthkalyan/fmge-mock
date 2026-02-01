import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto mt-20 text-center text-gray-900 dark:text-gray-100 transition-colors">

      <h1 className="text-5xl font-bold mb-6">
        Crack FMGE with Adaptive Intelligence
      </h1>

      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
        AI-powered adaptive mock exams tailored to your weaknesses.
      </p>

      <Link to="/exam">
        <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-blue-700 transition">
          Start Adaptive Exam
        </button>
      </Link>
    </div>
  );
}
