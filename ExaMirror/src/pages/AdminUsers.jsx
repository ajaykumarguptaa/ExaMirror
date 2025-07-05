import React, { useState } from 'react';
import Button from '../components/Button';
import { FaUsers, FaBook, FaChartLine, FaMoneyBillWave, FaUserPlus, FaPlus, FaDownload } from 'react-icons/fa';

const stats = [
  { title: 'Total Users', value: '12,847', icon: <FaUsers />, color: 'bg-blue-500' },
  { title: 'Active Courses', value: '156', icon: <FaBook />, color: 'bg-green-500' },
  { title: 'Revenue', value: '$45,230', icon: <FaMoneyBillWave />, color: 'bg-purple-500' },
  { title: 'Enrollments', value: '8,934', icon: <FaChartLine />, color: 'bg-orange-500' },
];

const recentUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2024-01-14' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'pending', joinDate: '2024-01-13' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', status: 'active', joinDate: '2024-01-12' },
];

const recentCourses = [
  { id: 1, title: 'Advanced Mathematics', instructor: 'Dr. Sarah Johnson', students: 1247, status: 'active' },
  { id: 2, title: 'Physics Fundamentals', instructor: 'Prof. Michael Chen', students: 892, status: 'active' },
  { id: 3, title: 'English Literature', instructor: 'Dr. Emily Davis', students: 1563, status: 'draft' },
  { id: 4, title: 'Programming Basics', instructor: 'Dr. Alex Kumar', students: 2103, status: 'active' },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'draft': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Admin Dashboard</h1>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" className="flex items-center gap-2"><FaDownload /> Export</Button>
            <Button variant="primary" size="sm" className="flex items-center gap-2"><FaPlus /> Add New</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'users', 'courses', 'analytics', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
                  <div className="space-y-3">
                    {recentUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          <span className="text-xs text-gray-500">{user.joinDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Courses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
                  <div className="space-y-3">
                    {recentCourses.map(course => (
                      <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-600">by {course.instructor}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{course.students} students</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <Button variant="primary" size="sm" className="flex items-center gap-2"><FaUserPlus /> Add User</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
                  <Button variant="primary" size="sm" className="flex items-center gap-2"><FaPlus /> Add Course</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentCourses.map(course => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.students}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                              {course.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center text-gray-500 py-12">
                <p>Analytics dashboard coming soon...</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center text-gray-500 py-12">
                <p>Settings page coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 