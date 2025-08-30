import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Components
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import CategoryCards from "./components/CategoryCards";
import Footer from "./components/Footer";

// Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Practice from "./pages/Practice";

// User
import UserProfile from "./pages/User/UserProfile";
import UserSubmit from "./pages/User/UserSubmit";
import UserDashboard from "./pages/User/UserDashboard";

// Test
import TestHeatmap from "./pages/TestHeatmap";
import TestConnection from "./pages/TestConnection";

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageProblems from "./pages/Admin/ManageProblems";
import ManageTopics from "./pages/Admin/ManageTopics";
import CreateProblem from "./pages/Admin/CreateProblem";
import EditProblem from "./pages/Admin/EditProblem";
import CreateTopic from "./pages/Admin/CreateTopic";

// Problems
import ProblemsList from "./pages/Problems/ProblemsList";
import ProblemDetails from "./pages/Problems/ProblemDetails";

// Topics
import TopicsList from "./pages/Topics/TopicsList";

const App = () => {
  return (
    <AuthProvider>
      <div>
        {/* Navbar is always visible */}
        <Navbar />

        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <CategoryCards />
                <Footer />
              </>
            }
          />

          {/* Authentication */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Practice Page */}
          <Route path="/practice" element={<Practice />} />
          <Route path="/practice/:category" element={<Practice />} />

          {/* User Pages - Protected */}
          <Route 
            path="/user/profile/:id" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/dashboard/:id" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/submit" 
            element={
              <ProtectedRoute>
                <UserSubmit />
              </ProtectedRoute>
            } 
          />

          {/* Admin Pages - Protected with Admin Role */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/problems" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageProblems />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/topics" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageTopics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/problems/create" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateProblem />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/problems/edit/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <EditProblem />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/topics/create" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateTopic />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/topics/edit/:id" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateTopic />
              </ProtectedRoute>
            } 
          />

          {/* Profile Pages */}
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/dashboard/:id" element={<UserDashboard />} />

          {/* Test Pages */}
          <Route path="/test-heatmap" element={<TestHeatmap />} />
          <Route path="/test-connection" element={<TestConnection />} />

          {/* Problems Pages */}
          <Route path="/problems" element={<ProblemsList />} />
          <Route path="/problems/:id" element={<ProblemDetails />} />

          {/* Topics Pages */}
          <Route path="/topics" element={<TopicsList />} />

          {/* Catch-all Route */}
          <Route path="*" element={<h1 className="text-center mt-20">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
