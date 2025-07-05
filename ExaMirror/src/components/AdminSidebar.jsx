import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@examirror.com';

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/courses', label: 'Courses', icon: '📚' },
    { path: '/admin/materials', label: 'Study Materials', icon: '📖' },
    { path: '/admin/tests', label: 'Tests & Quizzes', icon: '✍️' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-8">Examirror Admin</h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Admin Info */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-gray-400 text-xs">{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 