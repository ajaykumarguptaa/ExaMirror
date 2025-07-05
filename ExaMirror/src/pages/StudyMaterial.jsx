import React, { useState } from 'react';
import Button from '../components/Button';

const StudyMaterial = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Materials' },
    { id: 'notes', name: 'Study Notes' },
    { id: 'papers', name: 'Past Papers' },
    { id: 'guides', name: 'Study Guides' },
    { id: 'videos', name: 'Video Lectures' },
    { id: 'quizzes', name: 'Practice Quizzes' },
  ];

  const materials = [
    {
      id: 1,
      title: 'Advanced Calculus Notes',
      category: 'notes',
      subject: 'Mathematics',
      fileType: 'PDF',
      size: '2.3 MB',
      downloads: 1247,
      rating: 4.8,
      description: 'Comprehensive notes covering all calculus topics with examples and practice problems.',
    },
    {
      id: 2,
      title: 'Physics Past Papers (2020-2023)',
      category: 'papers',
      subject: 'Physics',
      fileType: 'PDF',
      size: '5.1 MB',
      downloads: 892,
      rating: 4.6,
      description: 'Collection of past examination papers with detailed solutions.',
    },
    {
      id: 3,
      title: 'English Literature Study Guide',
      category: 'guides',
      subject: 'English',
      fileType: 'PDF',
      size: '3.7 MB',
      downloads: 1563,
      rating: 4.7,
      description: 'Complete study guide for English literature with analysis and summaries.',
    },
    {
      id: 4,
      title: 'Chemistry Lab Manual',
      category: 'guides',
      subject: 'Chemistry',
      fileType: 'PDF',
      size: '4.2 MB',
      downloads: 567,
      rating: 4.5,
      description: 'Laboratory manual with experiments and safety guidelines.',
    },
    {
      id: 5,
      title: 'Programming Fundamentals Video Series',
      category: 'videos',
      subject: 'Computer Science',
      fileType: 'MP4',
      size: '156 MB',
      downloads: 2103,
      rating: 4.9,
      description: 'Complete video series covering programming basics and web development.',
    },
    {
      id: 6,
      title: 'Mathematics Practice Quiz Set',
      category: 'quizzes',
      subject: 'Mathematics',
      fileType: 'Interactive',
      size: 'N/A',
      downloads: 1892,
      rating: 4.4,
      description: 'Interactive quiz set with 100+ questions covering all math topics.',
    },
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Study Materials</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access comprehensive study materials, past papers, and resources to enhance your learning experience.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search materials..."
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
            Showing {filteredMaterials.length} of {materials.length} materials
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map(material => (
            <div key={material.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {material.category.charAt(0).toUpperCase() + material.category.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">{material.fileType}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{material.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{material.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({material.downloads} downloads)</span>
                  </div>
                  <span className="text-sm text-gray-500">{material.size}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded">{material.subject}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1">
                    Download
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
        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Premium Study Materials</h2>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              Unlock exclusive study materials, expert-curated content, and advanced practice tests.
            </p>
            <Button variant="primary" size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyMaterial; 