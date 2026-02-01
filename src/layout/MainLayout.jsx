import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import useDarkMode from "../lib/useDarkMode";

export default function MainLayout() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors">


      {/* Navbar */}
 <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center transition-colors">

  <Link to="/" className="text-xl font-bold text-blue-600">
    FMGE Prep
  </Link>

  <div className="flex items-center gap-6">

    <Link
      to="/exam"
      className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
    >
      Full Mock
    </Link>

    <Link
      to="/subjects"
      className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
    >
      Quizzes
    </Link>

    <Link
      to="/dashboard"
      className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
    >
      Dashboard
    </Link>

    {/* Dark Mode Toggle */}
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-3 py-2 rounded-lg border dark:border-gray-600 dark:text-gray-200"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>

    {user ? (
      <>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user.email}
        </span>

        <button
          onClick={signOut}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </>
    ) : (
      <button
        onClick={signInWithGoogle}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Login
      </button>
    )}

  </div>
</nav>


      {/* Page Content */}
      <div className="p-6">
        <Outlet />
      </div>

    </div>
  );
}
