import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminCourses from '../pages/AdminCourses';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public login route */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected admin routes */}
      <Route path="/*" element={
        <ProtectedRoute>
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 ml-64">
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/users" element={<AdminUsers />} />
                <Route path="/courses" element={<AdminCourses />} />
                <Route path="/materials" element={<div className="p-8">Study Materials Management - Coming Soon</div>} />
                <Route path="/tests" element={<div className="p-8">Tests & Quizzes Management - Coming Soon</div>} />
                <Route path="/analytics" element={<div className="p-8">Analytics - Coming Soon</div>} />
                <Route path="/settings" element={<div className="p-8">Settings - Coming Soon</div>} />
              </Routes>
            </div>
          </div>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AdminRoutes; 