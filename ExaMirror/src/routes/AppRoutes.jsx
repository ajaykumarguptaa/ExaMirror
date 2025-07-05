import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Courses from '../pages/Courses';
import Dashboard from '../pages/Dashboard';
import Contact from '../pages/Contact';
import StudyMaterial from '../pages/StudyMaterial';
import TestYourself from '../pages/TestYourself';
import OTPDemo from '../pages/OTPDemo';
import AdminRoutes from './AdminRoutes';
import UserProtectedRoute from '../components/UserProtectedRoute';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 mb-8">Page Not Found</p>
    <a href="/" className="text-blue-500 hover:underline">Go Home</a>
  </div>
);

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* Admin Routes - No Navbar/Footer */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* Main App Routes - With Navbar/Footer */}
      <Route path="/*" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/study-material" element={<StudyMaterial />} />
              <Route path="/test-yourself" element={<TestYourself />} />
              {/* <Route path="/otp-demo" element={<OTPDemo />} /> */}
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <UserProtectedRoute>
                  <Dashboard />
                </UserProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  </Router>
);

export default AppRoutes; 