import express from 'express';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { protect, authorize, isInstructorOrAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = { status: 'published' };
  
  // Apply filters
  if (req.query.category) filter.category = req.query.category;
  if (req.query.level) filter.level = req.query.level;
  if (req.query.instructor) filter.instructor = req.query.instructor;
  if (req.query.isFree !== undefined) filter.isFree = req.query.isFree === 'true';
  if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const courses = await Course.find(filter)
    .populate('instructor', 'firstName lastName email avatar')
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

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const courses = await Course.findFeatured()
    .populate('instructor', 'firstName lastName email avatar')
    .limit(limit);

  res.json({
    success: true,
    data: {
      courses
    }
  });
}));

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'firstName lastName email avatar profile')
    .populate('ratings.user', 'firstName lastName avatar');

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check if user is enrolled (if authenticated)
  let isEnrolled = false;
  let userProgress = null;
  
  if (req.user) {
    const enrollment = course.enrolledStudents.find(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );
    
    if (enrollment) {
      isEnrolled = true;
      userProgress = {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        lastAccessed: enrollment.lastAccessed
      };
    }
  }

  res.json({
    success: true,
    data: {
      course,
      isEnrolled,
      userProgress
    }
  });
}));

// @desc    Create course (Instructor/Admin only)
// @route   POST /api/courses
// @access  Private/Instructor/Admin
router.post('/', [
  protect,
  isInstructorOrAdmin,
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['mathematics', 'science', 'literature', 'history', 'geography', 'computer-science', 'languages', 'arts', 'business', 'other'])
    .withMessage('Invalid category'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid level'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const courseData = {
    ...req.body,
    instructor: req.user._id,
    isFree: req.body.price === 0 || !req.body.price
  };

  const course = await Course.create(courseData);

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: {
      course
    }
  });
}));

// @desc    Update course (Instructor/Admin only)
// @route   PUT /api/courses/:id
// @access  Private/Instructor/Admin
router.put('/:id', [
  protect,
  isInstructorOrAdmin,
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['mathematics', 'science', 'literature', 'history', 'geography', 'computer-science', 'languages', 'arts', 'business', 'other'])
    .withMessage('Invalid category'),
  body('level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid level'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 minute'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
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

  // Check if user is the instructor or admin
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own courses'
    });
  }

  // Update course
  Object.keys(req.body).forEach(key => {
    if (key !== 'instructor') { // Prevent changing instructor
      course[key] = req.body[key];
    }
  });

  course.isFree = req.body.price === 0 || !req.body.price;
  await course.save();

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: {
      course
    }
  });
}));

// @desc    Delete course (Instructor/Admin only)
// @route   DELETE /api/courses/:id
// @access  Private/Instructor/Admin
router.delete('/:id', [
  protect,
  isInstructorOrAdmin
], asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check if user is the instructor or admin
  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own courses'
    });
  }

  await Course.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
}));

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (course.status !== 'published') {
    return res.status(400).json({
      success: false,
      message: 'Course is not available for enrollment'
    });
  }

  // Check if already enrolled
  const existingEnrollment = course.enrolledStudents.find(
    enrollment => enrollment.student.toString() === req.user._id.toString()
  );

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'You are already enrolled in this course'
    });
  }

  // Enroll student
  await course.enrollStudent(req.user._id);

  // Send enrollment email
  const instructor = await User.findById(course.instructor);
  await sendEmail({
    email: req.user.email,
    template: 'courseEnrollment',
    data: {
      studentName: req.user.firstName,
      courseTitle: course.title,
      instructorName: instructor.fullName,
      duration: `${course.duration} minutes`,
      level: course.level,
      description: course.description,
      courseUrl: `${process.env.FRONTEND_URL}/courses/${course._id}`
    }
  });

  res.json({
    success: true,
    message: 'Successfully enrolled in course'
  });
}));

// @desc    Rate course
// @route   POST /api/courses/:id/rate
// @access  Private
router.post('/:id/rate', [
  protect,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('review')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review cannot exceed 500 characters')
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

  // Check if user is enrolled
  const isEnrolled = course.enrolledStudents.some(
    enrollment => enrollment.student.toString() === req.user._id.toString()
  );

  if (!isEnrolled) {
    return res.status(400).json({
      success: false,
      message: 'You must be enrolled in the course to rate it'
    });
  }

  const { rating, review } = req.body;

  // Add rating
  await course.addRating(req.user._id, rating, review);

  res.json({
    success: true,
    message: 'Rating submitted successfully'
  });
}));

// @desc    Get user's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Private
router.get('/enrolled', protect, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const courses = await Course.find({
    'enrolledStudents.student': req.user._id
  })
    .populate('instructor', 'firstName lastName email avatar')
    .sort({ 'enrolledStudents.lastAccessed': -1 })
    .skip(skip)
    .limit(limit);

  const total = await Course.countDocuments({
    'enrolledStudents.student': req.user._id
  });

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

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor
// @access  Private/Instructor
router.get('/instructor', [
  protect,
  authorize('instructor', 'admin')
], asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const courses = await Course.find({ instructor: req.user._id })
    .populate('instructor', 'firstName lastName email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Course.countDocuments({ instructor: req.user._id });

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

export default router; 