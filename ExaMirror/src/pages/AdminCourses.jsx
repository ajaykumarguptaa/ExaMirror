import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseAPI, adminAPI } from '../services/api';
import Button from '../components/Button';
import { FaBook, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaDownload, FaUsers, FaCalendar } from 'react-icons/fa';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { user: currentUser } = useAuth();

  // Form state for add/edit course
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: 'beginner',
    price: 0,
    status: 'draft'
  });

  // Load courses and instructors on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load data from API
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [coursesResponse, instructorsResponse] = await Promise.all([
        courseAPI.getAllCourses(),
        adminAPI.getAllInstructors()
      ]);

      setCourses(coursesResponse.data.courses || []);
      setInstructors(instructorsResponse.data.instructors || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Data loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    const matchesInstructor = instructorFilter === 'all' || course.instructor?._id === instructorFilter;
    
    return matchesSearch && matchesStatus && matchesInstructor;
  });

  // Handle course actions
  const handleCourseAction = async (courseId, action) => {
    try {
      if (action === 'delete') {
        if (window.confirm('Are you sure you want to delete this course?')) {
          await courseAPI.deleteCourse(courseId);
          setCourses(courses.filter(course => course._id !== courseId));
        }
      } else if (action === 'edit') {
        const courseToEdit = courses.find(course => course._id === courseId);
        setEditingCourse(courseToEdit);
        setCourseForm({
          title: courseToEdit.title,
          description: courseToEdit.description,
          instructor: courseToEdit.instructor?._id || '',
          category: courseToEdit.category || '',
          level: courseToEdit.level || 'beginner',
          price: courseToEdit.price || 0,
          status: courseToEdit.status || 'draft'
        });
        setShowAddModal(true);
      } else if (action === 'view') {
        // Navigate to course detail page or show modal
        console.log('View course:', courseId);
      }
    } catch (err) {
      setError(err.message || 'Failed to perform course action');
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedCourses.length === 0) {
      setError('Please select courses to perform bulk action');
      return;
    }

    try {
      if (action === 'delete') {
        if (window.confirm(`Are you sure you want to delete ${selectedCourses.length} courses?`)) {
          await Promise.all(selectedCourses.map(courseId => courseAPI.deleteCourse(courseId)));
          setCourses(courses.filter(course => !selectedCourses.includes(course._id)));
          setSelectedCourses([]);
        }
      } else if (action === 'publish') {
        await Promise.all(selectedCourses.map(courseId => 
          courseAPI.updateCourse(courseId, { status: 'published' })
        ));
        setCourses(courses.map(course => 
          selectedCourses.includes(course._id) 
            ? { ...course, status: 'published' }
            : course
        ));
        setSelectedCourses([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to perform bulk action');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        // Update existing course
        const updatedCourse = await courseAPI.updateCourse(editingCourse._id, courseForm);
        
        // Update local state
        setCourses(courses.map(course => 
          course._id === editingCourse._id 
            ? { ...course, ...courseForm, instructor: instructors.find(i => i._id === courseForm.instructor) }
            : course
        ));
      } else {
        // Create new course
        const newCourse = await courseAPI.createCourse(courseForm);
        setCourses([...courses, newCourse.data.course]);
      }
      
      // Reset form and close modal
      setCourseForm({
        title: '',
        description: '',
        instructor: '',
        category: '',
        level: 'beginner',
        price: 0,
        status: 'draft'
      });
      setEditingCourse(null);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message || 'Failed to save course');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({
      ...courseForm,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  // Handle course selection
  const handleCourseSelect = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course._id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Course Management</h1>
              <p className="text-sm text-gray-600">Manage all courses in the system</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => handleBulkAction('delete')}
                disabled={selectedCourses.length === 0}
              >
                <FaTrash /> Delete Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => handleBulkAction('publish')}
                disabled={selectedCourses.length === 0}
              >
                <FaEye /> Publish Selected
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus /> Add Course
              </Button>
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

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Instructor Filter */}
            <select
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Instructors</option>
              {instructors.map(instructor => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name}
                </option>
              ))}
            </select>

            {/* Export */}
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <FaDownload /> Export
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course._id)}
                    onChange={() => handleCourseSelect(course._id)}
                    className="ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaUsers className="mr-2" />
                    <span>{course.enrolledStudents || 0} students</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendar className="mr-2" />
                    <span>{formatDate(course.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${course.price || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    by {course.instructor?.name || 'Unknown'}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCourseAction(course._id, 'view')}
                    className="flex-1 text-blue-600 hover:text-blue-900 text-sm font-medium"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleCourseAction(course._id, 'edit')}
                    className="flex-1 text-green-600 hover:text-green-900 text-sm font-medium"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleCourseAction(course._id, 'delete')}
                    className="flex-1 text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <FaBook className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || instructorFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by creating a new course.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={courseForm.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={courseForm.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instructor</label>
                  <select
                    name="instructor"
                    value={courseForm.instructor}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(instructor => (
                      <option key={instructor._id} value={instructor._id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={courseForm.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Level</label>
                    <select
                      name="level"
                      value={courseForm.level}
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={courseForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingCourse(null);
                      setCourseForm({
                        title: '',
                        description: '',
                        instructor: '',
                        category: '',
                        level: 'beginner',
                        price: 0,
                        status: 'draft'
                      });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {editingCourse ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses; 