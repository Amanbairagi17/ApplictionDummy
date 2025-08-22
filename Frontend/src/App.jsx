import React from "react";
import { Routes, Route } from "react-router-dom";

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

// Admin
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageProblems from "./pages/Admin/ManageProblems";
import ManageTopics from "./pages/Admin/ManageTopics";

// Problems
import ProblemsList from "./pages/Problems/ProblemsList";
import ProblemDetails from "./pages/Problems/ProblemDetails";

// Topics
import TopicsList from "./pages/Topics/TopicsList";

const App = () => {
  return (
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

        {/* User Pages */}
        <Route path="/user/profile/:id" element={<UserProfile />} />
        <Route path="/user/submit" element={<UserSubmit />} />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/problems" element={<ManageProblems />} />
        <Route path="/admin/topics" element={<ManageTopics />} />

        {/* Problems Pages */}
        <Route path="/problems" element={<ProblemsList />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />

        {/* Topics Pages */}
        <Route path="/topics" element={<TopicsList />} />

        {/* Catch-all Route */}
        <Route path="*" element={<h1 className="text-center mt-20">404 - Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
