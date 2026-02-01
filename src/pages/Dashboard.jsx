import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    if (user) fetchAttempts();
  }, [user]);

  async function fetchAttempts() {
    const { data } = await supabase
      .from("attempts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    setAttempts(data || []);
  }

  const chartData = attempts.map((attempt, index) => ({
    attempt: index + 1,
    score: attempt.score,
    ability: attempt.ability
  }));

  return (
    <div className="max-w-4xl mx-auto mt-10">

      <h2 className="text-3xl font-bold mb-8">
        Performance Dashboard
      </h2>

      {attempts.length === 0 && (
        <p className="text-gray-500">No attempts yet.</p>
      )}

      {attempts.length > 0 && (
        <div className="bg-white p-8 shadow rounded-lg mb-8">
          <h3 className="text-xl font-semibold mb-6">
            Score Progress
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attempt" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          className="bg-white shadow p-6 rounded-lg mb-4"
        >
          <p><strong>Score:</strong> {attempt.score}</p>
          <p><strong>Ability:</strong> {attempt.ability}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(attempt.created_at).toLocaleString()}
          </p>
        </div>
      ))}

    </div>
  );
}
