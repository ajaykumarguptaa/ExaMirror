const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    localStorage.removeItem('token');
  }

  // Get headers for API requests
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          this.removeAuthToken();
          window.location.href = '/login';
          throw new Error('Authentication failed. Please login again.');
        }

        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, includeAuth = true) {
    return this.request(endpoint, {
      method: 'GET',
      includeAuth,
    });
  }

  // POST request
  async post(endpoint, data, includeAuth = true) {
    return this.request(endpoint, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data, includeAuth = true) {
    return this.request(endpoint, {
      method: 'PUT',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint, includeAuth = true) {
    return this.request(endpoint, {
      method: 'DELETE',
      includeAuth,
    });
  }

  // PATCH request
  async patch(endpoint, data, includeAuth = true) {
    return this.request(endpoint, {
      method: 'PATCH',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    });
  }
}

// Create API service instance
const apiService = new ApiService();

// Auth API methods
export const authAPI = {
  register: (userData) => apiService.post('/auth/register', userData, false),
  login: (credentials) => apiService.post('/auth/login', credentials, false),
  logout: () => apiService.post('/auth/logout'),
  getCurrentUser: () => apiService.get('/auth/me'),
  verifyEmail: (token) => apiService.post('/auth/verify-email', { token }, false),
  forgotPassword: (email) => apiService.post('/auth/forgot-password', { email }, false),
  resetPassword: (token, password) => apiService.post('/auth/reset-password', { token, password }, false),
  resendVerification: (email) => apiService.post('/auth/resend-verification', { email }, false),
};

// User API methods
export const userAPI = {
  getProfile: () => apiService.get('/users/profile'),
  updateProfile: (profileData) => apiService.put('/users/profile', profileData),
  changePassword: (passwordData) => apiService.put('/users/change-password', passwordData),
  resendVerification: () => apiService.post('/users/resend-verification'),
  // Admin methods
  getAllUsers: (params = {}) => apiService.get(`/users?${new URLSearchParams(params)}`),
  getUserById: (id) => apiService.get(`/users/${id}`),
  updateUser: (id, userData) => apiService.put(`/users/${id}`, userData),
  deleteUser: (id) => apiService.delete(`/users/${id}`),
  getUserStats: () => apiService.get('/users/stats/overview'),
};

// Course API methods
export const courseAPI = {
  getAllCourses: (params = {}) => apiService.get(`/courses?${new URLSearchParams(params)}`),
  getFeaturedCourses: (limit = 6) => apiService.get(`/courses/featured?limit=${limit}`),
  getCourseById: (id) => apiService.get(`/courses/${id}`),
  createCourse: (courseData) => apiService.post('/courses', courseData),
  updateCourse: (id, courseData) => apiService.put(`/courses/${id}`, courseData),
  deleteCourse: (id) => apiService.delete(`/courses/${id}`),
  enrollInCourse: (id) => apiService.post(`/courses/${id}/enroll`),
  rateCourse: (id, ratingData) => apiService.post(`/courses/${id}/rate`, ratingData),
  getEnrolledCourses: (params = {}) => apiService.get(`/courses/enrolled?${new URLSearchParams(params)}`),
  getInstructorCourses: (params = {}) => apiService.get(`/courses/instructor?${new URLSearchParams(params)}`),
};

// Test API methods
export const testAPI = {
  getAllTests: (params = {}) => apiService.get(`/tests?${new URLSearchParams(params)}`),
  getTestById: (id) => apiService.get(`/tests/${id}`),
  createTest: (testData) => apiService.post('/tests', testData),
  updateTest: (id, testData) => apiService.put(`/tests/${id}`, testData),
  deleteTest: (id) => apiService.delete(`/tests/${id}`),
  startTest: (id, password = null) => apiService.post(`/tests/${id}/start`, password ? { password } : {}),
  submitTest: (id, submissionData) => apiService.post(`/tests/${id}/submit`, submissionData),
  getTestResults: (id) => apiService.get(`/tests/${id}/results`),
  getInstructorTests: (params = {}) => apiService.get(`/tests/instructor?${new URLSearchParams(params)}`),
  getTestAnalytics: (id) => apiService.get(`/tests/${id}/analytics`),
};

// Material API methods
export const materialAPI = {
  getCourseMaterials: (courseId) => apiService.get(`/materials/course/${courseId}`),
  addMaterial: (courseId, materialData) => apiService.post(`/materials/course/${courseId}`, materialData),
  updateMaterial: (courseId, materialId, materialData) => apiService.put(`/materials/${courseId}/${materialId}`, materialData),
  deleteMaterial: (courseId, materialId) => apiService.delete(`/materials/${courseId}/${materialId}`),
};

// Admin API methods
export const adminAPI = {
  getDashboard: () => apiService.get('/admin/dashboard'),
  getSystemInfo: () => apiService.get('/admin/system'),
  getAllUsers: (params = {}) => apiService.get(`/admin/users?${new URLSearchParams(params)}`),
  getAllCourses: (params = {}) => apiService.get(`/admin/courses?${new URLSearchParams(params)}`),
  getAllTests: (params = {}) => apiService.get(`/admin/tests?${new URLSearchParams(params)}`),
  getAllInstructors: (params = {}) => apiService.get(`/admin/instructors?${new URLSearchParams(params)}`),
  createUser: (userData) => apiService.post('/admin/users', userData),
  createCourse: (courseData) => apiService.post('/admin/courses', courseData),
  createTest: (testData) => apiService.post('/admin/tests', testData),
  updateUser: (id, userData) => apiService.put(`/admin/users/${id}`, userData),
  updateCourse: (id, courseData) => apiService.put(`/admin/courses/${id}`, courseData),
  updateTest: (id, testData) => apiService.put(`/admin/tests/${id}`, testData),
  updateCourseStatus: (id, status) => apiService.put(`/admin/courses/${id}/status`, { status }),
  updateTestStatus: (id, status) => apiService.put(`/admin/tests/${id}/status`, { status }),
  featureCourse: (id, isFeatured) => apiService.put(`/admin/courses/${id}/feature`, { isFeatured }),
  getAnalytics: (period = 30) => apiService.get(`/admin/analytics?period=${period}`),
  deleteUser: (id) => apiService.delete(`/admin/users/${id}`),
  deleteCourse: (id) => apiService.delete(`/admin/courses/${id}`),
  deleteTest: (id) => apiService.delete(`/admin/tests/${id}`),
};

// Health check
export const healthAPI = {
  check: () => apiService.get('/health', false),
};

// Export the main API service
export default apiService; 