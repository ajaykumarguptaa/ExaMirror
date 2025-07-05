import React, { useState } from 'react';
import Button from '../components/Button';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'computer-science', name: 'Computer Science' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      category: 'mathematics',
      instructor: 'Dr. Sarah Johnson',
      duration: '12 weeks',
      level: 'Advanced',
      rating: 4.8,
      students: 1247,
      price: '$99',
      image: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Math',
      description: 'Master advanced mathematical concepts including calculus, linear algebra, and statistics.',
    },
    {
      id: 2,
      title: 'Physics Fundamentals',
      category: 'science',
      instructor: 'Prof. Michael Chen',
      duration: '10 weeks',
      level: 'Intermediate',
      rating: 4.6,
      students: 892,
      price: '$79',
      image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Physics',
      description: 'Learn the fundamental principles of physics through interactive experiments and problem-solving.',
    },
    {
      id: 3,
      title: 'English Literature',
      category: 'english',
      instructor: 'Dr. Emily Davis',
      duration: '8 weeks',
      level: 'Beginner',
      rating: 4.7,
      students: 1563,
      price: '$69',
      image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=English',
      description: 'Explore classic and contemporary literature with critical analysis and writing skills.',
    },
    {
      id: 4,
      title: 'World History',
      category: 'history',
      instructor: 'Prof. Robert Wilson',
      duration: '14 weeks',
      level: 'Intermediate',
      rating: 4.5,
      students: 734,
      price: '$89',
      image: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=History',
      description: 'Journey through world history from ancient civilizations to modern times.',
    },
    {
      id: 5,
      title: 'Programming Fundamentals',
      category: 'computer-science',
      instructor: 'Dr. Alex Kumar',
      duration: '16 weeks',
      level: 'Beginner',
      rating: 4.9,
      students: 2103,
      price: '$119',
      image: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Programming',
      description: 'Learn programming basics with Python, JavaScript, and web development fundamentals.',
    },
    {
      id: 6,
      title: 'Chemistry Essentials',
      category: 'science',
      instructor: 'Prof. Lisa Thompson',
      duration: '11 weeks',
      level: 'Intermediate',
      rating: 4.4,
      students: 567,
      price: '$84',
      image: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Chemistry',
      description: 'Understand chemical reactions, molecular structures, and laboratory techniques.',
    },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Courses</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from hundreds of courses designed to help you succeed in your academic journey.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">{course.level}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({course.students} students)</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{course.price}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>By {course.instructor}</span>
                  <span>{course.duration}</span>
                </div>
                
                <Button variant="primary" className="w-full">
                  Enroll Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 