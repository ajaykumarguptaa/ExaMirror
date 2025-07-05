import React from 'react';
import Button from '../components/Button';

const Dashboard = () => {
  const userStats = {
    enrolledCourses: 5,
    completedLessons: 23,
    totalStudyTime: '12h 30m',
    averageScore: 87,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'lesson',
      title: 'Completed Lesson 5: Advanced Calculus',
      course: 'Advanced Mathematics',
      time: '2 hours ago',
      icon: '✅',
    },
    {
      id: 2,
      type: 'quiz',
      title: 'Scored 92% on Physics Quiz',
      course: 'Physics Fundamentals',
      time: '1 day ago',
      icon: '📝',
    },
    {
      id: 3,
      type: 'enrollment',
      title: 'Enrolled in English Literature',
      course: 'English Literature',
      time: '3 days ago',
      icon: '📚',
    },
  ];

  const enrolledCourses = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      progress: 65,
      nextLesson: 'Lesson 6: Linear Algebra',
      instructor: 'Dr. Sarah Johnson',
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      progress: 40,
      nextLesson: 'Chapter 3: Mechanics',
      instructor: 'Prof. Michael Chen',
    },
    {
      id: 3,
      title: 'English Literature',
      progress: 20,
      nextLesson: 'Week 2: Shakespeare',
      instructor: 'Dr. Emily Davis',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Student!</h1>
          <p className="text-gray-600">Here's your learning progress and recent activities.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">📚</div>
              <div>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.enrolledCourses}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">✅</div>
              <div>
                <p className="text-sm text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.completedLessons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">⏱️</div>
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalStudyTime}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-4">📊</div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.averageScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrolled Courses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Courses</h2>
            <div className="space-y-4">
              {enrolledCourses.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <span className="text-sm text-blue-600 font-medium">{course.progress}%</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>Next: {course.nextLesson}</p>
                    <p>Instructor: {course.instructor}</p>
                  </div>
                  
                  <Button variant="primary" size="sm" className="w-full">
                    Continue Learning
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="text-xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.course}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📚</span>
              <span>Browse Courses</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">✍️</span>
              <span>Take a Quiz</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📖</span>
              <span>Study Materials</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 