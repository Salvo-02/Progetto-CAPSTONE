import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ArchivedWorkoutsPage from "./pages/SavedWorkoutsPage";
import MuscleGroupPage from "./pages/MuscleGroupPage";
import PickExercisePage from "./pages/PickExercisePage";
import WorkoutCreatePage from "./pages/WorkoutCreatePage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminUsersPage from "./pages/AdminUsersPage";
import RequireAuth from "./components/RequireAuth";
import LibraryPage from "./pages/LibraryPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/muscle-groups"
          element={
            <RequireAuth>
              <MuscleGroupPage />
            </RequireAuth>
          }
        />

        <Route
          path="/pick-exercise"
          element={
            <RequireAuth>
              <PickExercisePage />
            </RequireAuth>
          }
        />

        <Route
          path="/workouts/new"
          element={
            <RequireAuth>
              <WorkoutCreatePage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
        <Route path="/workout/:id" element={<WorkoutCreatePage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;
