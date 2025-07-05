import React, { useState } from 'react';
import Button from '../components/Button';

const TestYourself = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Tests', icon: '📝' },
    { id: 'mathematics', name: 'Mathematics', icon: '🔢' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'english', name: 'English', icon: '📖' },
    { id: 'history', name: 'History', icon: '📚' },
    { id: 'computer-science', name: 'Computer Science', icon: '💻' },
  ];

  const tests = [
    {
      id: 1,
      title: 'Calculus Fundamentals Quiz',
      category: 'mathematics',
      questions: 25,
      timeLimit: '30 min',
      difficulty: 'Intermediate',
      attempts: 1247,
      avgScore: 78,
      description: 'Test your knowledge of calculus fundamentals including limits, derivatives, and integrals.',
    },
    {
      id: 2,
      title: 'Physics Mechanics Test',
      category: 'science',
      questions: 30,
      timeLimit: '45 min',
      difficulty: 'Advanced',
      attempts: 892,
      avgScore: 72,
      description: 'Comprehensive test covering mechanics, motion, forces, and energy principles.',
    },
    {
      id: 3,
      title: 'English Grammar Practice',
      category: 'english',
      questions: 20,
      timeLimit: '25 min',
      difficulty: 'Beginner',
      attempts: 1563,
      avgScore: 85,
      description: 'Practice essential English grammar rules and sentence structure.',
    },
    {
      id: 4,
      title: 'World History Timeline',
      category: 'history',
      questions: 35,
      timeLimit: '40 min',
      difficulty: 'Intermediate',
      attempts: 734,
      avgScore: 69,
      description: 'Test your knowledge of major historical events and their chronological order.',
    },
    {
      id: 5,
      title: 'Programming Basics Quiz',
      category: 'computer-science',
      questions: 28,
      timeLimit: '35 min',
      difficulty: 'Beginner',
      attempts: 2103,
      avgScore: 81,
      description: 'Fundamental programming concepts, algorithms, and problem-solving techniques.',
    },
    {
      id: 6,
      title: 'Chemistry Reactions Test',
      category: 'science',
      questions: 22,
      timeLimit: '30 min',
      difficulty: 'Intermediate',
      attempts: 567,
      avgScore: 75,
      description: 'Chemical reactions, balancing equations, and reaction mechanisms.',
    },
  ];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Yourself</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Challenge your knowledge with our comprehensive practice tests and quizzes. 
            Track your progress and identify areas for improvement.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search tests..."
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
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTests.length} of {tests.length} tests
          </p>
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <div key={test.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {test.category.charAt(0).toUpperCase() + test.category.slice(1)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(test.difficulty)}`}>
                    {test.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{test.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{test.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Questions:</span>
                    <span className="ml-1 font-medium text-gray-900">{test.questions}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <span className="ml-1 font-medium text-gray-900">{test.timeLimit}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Attempts:</span>
                    <span className="ml-1 font-medium text-gray-900">{test.attempts}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Score:</span>
                    <span className="ml-1 font-medium text-gray-900">{test.avgScore}%</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1">
                    Start Test
                  </Button>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tests found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Performance Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">15</div>
              <div className="text-sm text-gray-600">Tests Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">82%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">8h 45m</div>
              <div className="text-sm text-gray-600">Total Study Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-sm text-gray-600">Certificates Earned</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Challenge Yourself?</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Take our comprehensive practice tests to identify your strengths and areas for improvement.
            </p>
            <Button variant="primary" size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              Start Your First Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestYourself; 