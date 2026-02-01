import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Exam from "./pages/Exam";
import Quiz from "./pages/Quiz";
import Subjects from "./pages/Subjects";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./lib/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* Main Layout Wrapper */}
        <Route path="/" element={<MainLayout />}>

          {/* Home */}
          <Route index element={<Home />} />

          {/* Full Mock Exam */}
          <Route
            path="exam"
            element={
              <ProtectedRoute>
                <Exam />
              </ProtectedRoute>
            }
          />

          {/* Subject List */}
          <Route
            path="subjects"
            element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            }
          />

          {/* Subject Quiz */}
          <Route
            path="quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </Router>
  );
}

export default App;
