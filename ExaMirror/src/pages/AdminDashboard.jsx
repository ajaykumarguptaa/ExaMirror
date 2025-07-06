import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import Button from '../components/Button';
import { FaUsers, FaBook, FaChartLine, FaMoneyBillWave, FaPlus, FaDownload, FaEdit, FaTrash, FaEye, FaUserPlus, FaGraduationCap, FaFileAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalCourses: 0,
      totalTests: 0,
      totalEnrollments: 0
    },
    recentUsers: [],
    recentCourses: [],
    recentTests: []
  });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('');
  const { user } = useAuth();

  // Form states for different add types
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    confirmPassword: ''
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: 'beginner',
    price: 0,
    status: 'draft'
  });

  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    course: '',
    duration: 60,
    passingScore: 70,
    status: 'draft'
  });

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [dashboardResponse, usersResponse, coursesResponse, testsResponse] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAllUsers(),
        adminAPI.getAllCourses(),
        adminAPI.getAllTests()
      ]);

      setDashboardData(dashboardResponse.data);
      setUsers(usersResponse.data.users || []);
      setCourses(coursesResponse.data.courses || []);
      setTests(testsResponse.data.tests || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Export data functionality
  const exportData = async (type) => {
    try {
      setError('');
      let data = [];
      let filename = '';
      let contentType = '';

      switch (type) {
        case 'users':
          data = users.map(user => ({
            Name: user.name,
            Email: user.email,
            Role: user.role,
            Status: user.status || 'active',
            'Join Date': new Date(user.createdAt).toLocaleDateString()
          }));
          filename = 'users-export.csv';
          contentType = 'text/csv';
          break;

        case 'courses':
          data = courses.map(course => ({
            Title: course.title,
            Description: course.description,
            Instructor: course.instructor?.name || 'Unknown',
            Category: course.category || '',
            Level: course.level,
            Price: course.price || 0,
            Status: course.status,
            'Enrolled Students': course.enrolledStudents || 0,
            'Created Date': new Date(course.createdAt).toLocaleDateString()
          }));
          filename = 'courses-export.csv';
          contentType = 'text/csv';
          break;

        case 'tests':
          data = tests.map(test => ({
            Title: test.title,
            Description: test.description,
            Course: test.course?.title || 'No Course',
            Duration: `${test.duration} minutes`,
            'Passing Score': `${test.passingScore}%`,
            Status: test.status,
            'Question Count': test.questions?.length || 0,
            'Created Date': new Date(test.createdAt).toLocaleDateString()
          }));
          filename = 'tests-export.csv';
          contentType = 'text/csv';
          break;

        case 'dashboard':
          data = [
            {
              Metric: 'Total Users',
              Value: dashboardData.stats.totalUsers,
              Date: new Date().toLocaleDateString()
            },
            {
              Metric: 'Total Courses',
              Value: dashboardData.stats.totalCourses,
              Date: new Date().toLocaleDateString()
            },
            {
              Metric: 'Total Tests',
              Value: dashboardData.stats.totalTests,
              Date: new Date().toLocaleDateString()
            },
            {
              Metric: 'Total Enrollments',
              Value: dashboardData.stats.totalEnrollments,
              Date: new Date().toLocaleDateString()
            }
          ];
          filename = 'dashboard-stats.csv';
          contentType = 'text/csv';
          break;

        default:
          throw new Error('Invalid export type');
      }

      // Convert to CSV
      const csvContent = convertToCSV(data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      setError(err.message || 'Failed to export data');
    }
  };

  // Convert data to CSV format
  const convertToCSV = (data) => {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  };

  // Handle "Add New" functionality
  const handleAddNew = (type) => {
    setAddType(type);
    setShowAddModal(true);
    
    // Reset forms based on type
    switch (type) {
      case 'user':
        setUserForm({
          name: '',
          email: '',
          role: 'student',
          password: '',
          confirmPassword: ''
        });
        break;
      case 'course':
        setCourseForm({
          title: '',
          description: '',
          instructor: '',
          category: '',
          level: 'beginner',
          price: 0,
          status: 'draft'
        });
        break;
      case 'test':
        setTestForm({
          title: '',
          description: '',
          course: '',
          duration: 60,
          passingScore: 70,
          status: 'draft'
        });
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      switch (addType) {
        case 'user':
          if (userForm.password !== userForm.confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          const newUser = await adminAPI.createUser(userForm);
          setUsers([...users, newUser.data.user]);
          break;

        case 'course':
          const newCourse = await adminAPI.createCourse(courseForm);
          setCourses([...courses, newCourse.data.course]);
          break;

        case 'test':
          const newTest = await adminAPI.createTest(testForm);
          setTests([...tests, newTest.data.test]);
          break;
      }
      
      setShowAddModal(false);
      setAddType('');
      // Reload dashboard data to update stats
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to create item');
    }
  };

  // Handle form input changes
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    
    switch (formType) {
      case 'user':
        setUserForm(prev => ({ ...prev, [name]: value }));
        break;
      case 'course':
        setCourseForm(prev => ({ 
          ...prev, 
          [name]: name === 'price' ? parseFloat(value) || 0 : value 
        }));
        break;
      case 'test':
        setTestForm(prev => ({ 
          ...prev, 
          [name]: ['duration', 'passingScore'].includes(name) ? parseInt(value) || 0 : value 
        }));
        break;
    }
  };

  // Handle user actions
  const handleUserAction = async (userId, action) => {
    try {
      if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this user?')) {
          await adminAPI.deleteUser(userId);
          setUsers(users.filter(user => user._id !== userId));
        }
      } else if (action === 'edit') {
        // Navigate to edit user page or open modal
        console.log('Edit user:', userId);
      }
    } catch (err) {
      setError(err.message || 'Failed to perform user action');
    }
  };

  // Handle course actions
  const handleCourseAction = async (courseId, action) => {
    try {
      if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this course?')) {
          await adminAPI.deleteCourse(courseId);
          setCourses(courses.filter(course => course._id !== courseId));
        }
      } else if (action === 'edit') {
        // Navigate to edit course page or open modal
        console.log('Edit course:', courseId);
      }
    } catch (err) {
      setError(err.message || 'Failed to perform course action');
    }
  };

  // Handle test actions
  const handleTestAction = async (testId, action) => {
    try {
      if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this test?')) {
          await adminAPI.deleteTest(testId);
          setTests(tests.filter(test => test._id !== testId));
        }
      } else if (action === 'edit') {
        // Navigate to edit test page or open modal
        console.log('Edit test:', testId);
      }
    } catch (err) {
      setError(err.message || 'Failed to perform test action');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'pending':
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'inactive':
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const stats = [
    { 
      title: 'Total Users', 
      value: dashboardData.stats.totalUsers.toLocaleString(), 
      icon: <FaUsers />, 
      color: 'bg-blue-500',
      change: '+12%'
    },
    { 
      title: 'Active Courses', 
      value: dashboardData.stats.totalCourses.toLocaleString(), 
      icon: <FaBook />, 
      color: 'bg-green-500',
      change: '+8%'
    },
    { 
      title: 'Total Tests', 
      value: dashboardData.stats.totalTests.toLocaleString(), 
      icon: <FaChartLine />, 
      color: 'bg-purple-500',
      change: '+15%'
    },
    { 
      title: 'Enrollments', 
      value: dashboardData.stats.totalEnrollments.toLocaleString(), 
      icon: <FaMoneyBillWave />, 
      color: 'bg-orange-500',
      change: '+23%'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative group">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FaDownload /> Export Data
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={() => exportData('dashboard')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard Stats
                  </button>
                  <button
                    onClick={() => exportData('users')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Users Data
                  </button>
                  <button
                    onClick={() => exportData('courses')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Courses Data
                  </button>
                  <button
                    onClick={() => exportData('tests')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Tests Data
                  </button>
                </div>
              </div>
            </div>
            <div className="relative group">
              <Button variant="primary" size="sm" className="flex items-center gap-2">
                <FaPlus /> Add New
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <button
                    onClick={() => handleAddNew('user')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaUserPlus /> New User
                  </button>
                  <button
                    onClick={() => handleAddNew('course')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaGraduationCap /> New Course
                  </button>
                  <button
                    onClick={() => handleAddNew('test')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaFileAlt /> New Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'users', 'courses', 'tests', 'analytics'].map((tab) => (
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
                    {dashboardData.recentUsers?.slice(0, 5).map(user => (
                      <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status || 'active')}`}>
                            {user.status || 'active'}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(user.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                    {(!dashboardData.recentUsers || dashboardData.recentUsers.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No recent users</p>
                    )}
                  </div>
                </div>

                {/* Recent Courses */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Courses</h3>
                  <div className="space-y-3">
                    {dashboardData.recentCourses?.slice(0, 5).map(course => (
                      <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-600">by {course.instructor?.name || 'Unknown'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{course.enrolledStudents || 0} students</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                            {course.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(!dashboardData.recentCourses || dashboardData.recentCourses.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No recent courses</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => handleAddNew('user')}>
                    <FaUserPlus /> Add User
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.slice(0, 10).map(user => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status || 'active')}`}>
                              {user.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleUserAction(user._id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEye />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user._id, 'edit')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleUserAction(user._id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No users found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
                  <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => handleAddNew('course')}>
                    <FaGraduationCap /> Add Course
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {courses.slice(0, 10).map(course => (
                        <tr key={course._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor?.name || 'Unknown'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.enrolledStudents || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(course.status)}`}>
                              {course.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(course.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleCourseAction(course._id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEye />
                              </button>
                              <button 
                                onClick={() => handleCourseAction(course._id, 'edit')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleCourseAction(course._id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {courses.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No courses found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Test Management</h3>
                  <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => handleAddNew('test')}>
                    <FaFileAlt /> Add Test
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tests.slice(0, 10).map(test => (
                        <tr key={test._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.course?.title || 'No Course'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.questions?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(test.status)}`}>
                              {test.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(test.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleTestAction(test._id, 'view')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FaEye />
                              </button>
                              <button 
                                onClick={() => handleTestAction(test._id, 'edit')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <FaEdit />
                              </button>
                              <button 
                                onClick={() => handleTestAction(test._id, 'delete')}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tests.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No tests found</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">User Growth</h4>
                    <p className="text-gray-500">Analytics charts will be implemented here</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Course Performance</h4>
                    <p className="text-gray-500">Analytics charts will be implemented here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {addType === 'user' && 'Add New User'}
                {addType === 'course' && 'Add New Course'}
                {addType === 'test' && 'Add New Test'}
              </h3>
              
              {addType === 'user' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userForm.name}
                      onChange={(e) => handleInputChange(e, 'user')}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userForm.email}
                      onChange={(e) => handleInputChange(e, 'user')}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={(e) => handleInputChange(e, 'user')}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={(e) => handleInputChange(e, 'user')}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={userForm.confirmPassword}
                      onChange={(e) => handleInputChange(e, 'user')}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Create User
                    </button>
                  </div>
                </form>
              )}

              {addType === 'course' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={courseForm.title}
                      onChange={(e) => handleInputChange(e, 'course')}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={courseForm.description}
                      onChange={(e) => handleInputChange(e, 'course')}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={courseForm.category}
                      onChange={(e) => handleInputChange(e, 'course')}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Level</label>
                      <select
                        name="level"
                        value={courseForm.level}
                        onChange={(e) => handleInputChange(e, 'course')}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={courseForm.price}
                        onChange={(e) => handleInputChange(e, 'course')}
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Create Course
                    </button>
                  </div>
                </form>
              )}

              {addType === 'test' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={testForm.title}
                      onChange={(e) => handleInputChange(e, 'test')}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={testForm.description}
                      onChange={(e) => handleInputChange(e, 'test')}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                      <input
                        type="number"
                        name="duration"
                        value={testForm.duration}
                        onChange={(e) => handleInputChange(e, 'test')}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                      <input
                        type="number"
                        name="passingScore"
                        value={testForm.passingScore}
                        onChange={(e) => handleInputChange(e, 'test')}
                        min="0"
                        max="100"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Create Test
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 