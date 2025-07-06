import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Test from '../models/Test.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply admin authentication to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', asyncHandler(async (req, res) => {
  // Get user statistics
  const userStats = await User.getUserStats();
  
  // Get course statistics
  const courseStats = await Course.aggregate([
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        publishedCourses: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        draftCourses: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
        featuredCourses: { $sum: { $cond: ['$isFeatured', 1, 0] } },
        totalEnrollments: { $sum: { $size: '$enrolledStudents' } },
        averageRating: { $avg: { $avg: '$ratings.rating' } }
      }
    }
  ]);

  // Get test statistics
  const testStats = await Test.aggregate([
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        activeTests: { $sum: { $cond: ['$isActive', 1, 0] } },
        publishedTests: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        totalAttempts: { $sum: { $size: '$attempts' } },
        averageScore: { $avg: '$statistics.averageScore' },
        averagePassRate: { $avg: '$statistics.passRate' }
      }
    }
  ]);

  // Get recent activities
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('firstName lastName email role createdAt');

  const recentCourses = await Course.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('instructor', 'firstName lastName')
    .select('title instructor status createdAt');

  const recentTests = await Test.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('course', 'title')
    .populate('instructor', 'firstName lastName')
    .select('title course instructor status createdAt');

  // Get registration trend (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const registrationTrend = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Get course enrollment trend
  const enrollmentTrend = await Course.aggregate([
    {
      $unwind: '$enrolledStudents'
    },
    {
      $match: {
        'enrolledStudents.enrolledAt': { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$enrolledStudents.enrolledAt' }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  res.json({
    success: true,
    data: {
      userStats: userStats[0] || {},
      courseStats: courseStats[0] || {},
      testStats: testStats[0] || {},
      recentUsers,
      recentCourses,
      recentTests,
      registrationTrend,
      enrollmentTrend
    }
  });
}));

// @desc    Get system overview
// @route   GET /api/admin/system
// @access  Private/Admin
router.get('/system', asyncHandler(async (req, res) => {
  const systemInfo = {
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: {
      systemInfo
    }
  });
}));

// @desc    Get all courses with admin view
// @route   GET /api/admin/courses
// @access  Private/Admin
router.get('/courses', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  
  // Apply filters
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.instructor) filter.instructor = req.query.instructor;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const courses = await Course.find(filter)
    .populate('instructor', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Course.countDocuments(filter);

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Get all tests with admin view
// @route   GET /api/admin/tests
// @access  Private/Admin
router.get('/tests', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  
  // Apply filters
  if (req.query.status) filter.status = req.query.status;
  if (req.query.course) filter.course = req.query.course;
  if (req.query.instructor) filter.instructor = req.query.instructor;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const tests = await Test.find(filter)
    .populate('course', 'title category')
    .populate('instructor', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Test.countDocuments(filter);

  res.json({
    success: true,
    data: {
      tests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// @desc    Update course status (Admin only)
// @route   PUT /api/admin/courses/:id/status
// @access  Private/Admin
router.put('/courses/:id/status', [
  body('status')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  course.status = req.body.status;
  await course.save();

  res.json({
    success: true,
    message: 'Course status updated successfully',
    data: {
      course
    }
  });
}));

// @desc    Update test status (Admin only)
// @route   PUT /api/admin/tests/:id/status
// @access  Private/Admin
router.put('/tests/:id/status', [
  body('status')
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Invalid status')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const test = await Test.findById(req.params.id);
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  test.status = req.body.status;
  await test.save();

  res.json({
    success: true,
    message: 'Test status updated successfully',
    data: {
      test
    }
  });
}));

// @desc    Feature/unfeature course (Admin only)
// @route   PUT /api/admin/courses/:id/feature
// @access  Private/Admin
router.put('/courses/:id/feature', [
  body('isFeatured')
    .isBoolean()
    .withMessage('isFeatured must be a boolean')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  course.isFeatured = req.body.isFeatured;
  await course.save();

  res.json({
    success: true,
    message: `Course ${req.body.isFeatured ? 'featured' : 'unfeatured'} successfully`,
    data: {
      course
    }
  });
}));

// @desc    Get admin analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
router.get('/analytics', asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period));

  // User analytics
  const userAnalytics = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        newUsers: { $sum: 1 },
        students: { $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] } },
        instructors: { $sum: { $cond: [{ $eq: ['$role', 'instructor'] }, 1, 0] } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Course analytics
  const courseAnalytics = await Course.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        newCourses: { $sum: 1 },
        publishedCourses: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        totalEnrollments: { $sum: { $size: '$enrolledStudents' } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Test analytics
  const testAnalytics = await Test.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        newTests: { $sum: 1 },
        publishedTests: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        totalAttempts: { $sum: { $size: '$attempts' } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Top performing courses
  const topCourses = await Course.aggregate([
    {
      $match: { status: 'published' }
    },
    {
      $addFields: {
        enrollmentCount: { $size: '$enrolledStudents' },
        averageRating: { $avg: '$ratings.rating' }
      }
    },
    {
      $sort: { enrollmentCount: -1 }
    },
    {
      $limit: 10
    },
    {
      $project: {
        title: 1,
        instructor: 1,
        enrollmentCount: 1,
        averageRating: 1,
        category: 1
      }
    }
  ]);

  // Top performing tests
  const topTests = await Test.aggregate([
    {
      $match: { status: 'published' }
    },
    {
      $addFields: {
        attemptCount: { $size: '$attempts' }
      }
    },
    {
      $sort: { attemptCount: -1 }
    },
    {
      $limit: 10
    },
    {
      $project: {
        title: 1,
        course: 1,
        instructor: 1,
        attemptCount: 1,
        averageScore: '$statistics.averageScore'
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      userAnalytics,
      courseAnalytics,
      testAnalytics,
      topCourses,
      topTests
    }
  });
}));

export default router; 