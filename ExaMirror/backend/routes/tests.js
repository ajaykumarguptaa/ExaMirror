import express from 'express';
import { body, validationResult } from 'express-validator';
import Test from '../models/Test.js';
import Course from '../models/Course.js';
import { protect, authorize, isInstructorOrAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get all active tests
// @route   GET /api/tests
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { status: 'published', isActive: true };
  
  // Apply filters
  if (req.query.course) filter.course = req.query.course;
  if (req.query.instructor) filter.instructor = req.query.instructor;
  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const tests = await Test.find(filter)
    .populate('course', 'title category')
    .populate('instructor', 'firstName lastName email avatar')
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

// @desc    Get test by ID
// @route   GET /api/tests/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
    .populate('course', 'title category')
    .populate('instructor', 'firstName lastName email avatar');

  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  // Check if user is enrolled in the course (if authenticated)
  let isEnrolled = false;
  let userAttempts = [];
  
  if (req.user) {
    const course = await Course.findById(test.course);
    if (course) {
      const enrollment = course.enrolledStudents.find(
        enrollment => enrollment.student.toString() === req.user._id.toString()
      );
      isEnrolled = enrollment ? true : false;
    }
    
    // Get user's attempts for this test
    userAttempts = test.attempts.filter(
      attempt => attempt.student.toString() === req.user._id.toString()
    );
  }

  res.json({
    success: true,
    data: {
      test,
      isEnrolled,
      userAttempts
    }
  });
}));

// @desc    Create test (Instructor/Admin only)
// @route   POST /api/tests
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
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('course')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('questions.*.question')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  body('questions.*.type')
    .isIn(['multiple-choice', 'true-false', 'fill-in-blank', 'essay'])
    .withMessage('Invalid question type'),
  body('questions.*.points')
    .isInt({ min: 1 })
    .withMessage('Points must be at least 1'),
  body('settings.timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be at least 1 minute'),
  body('settings.passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('settings.maxAttempts')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attempts must be at least 1')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Verify course exists and user is the instructor
  const course = await Course.findById(req.body.course);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only create tests for your own courses'
    });
  }

  const testData = {
    ...req.body,
    instructor: req.user._id
  };

  const test = await Test.create(testData);

  res.status(201).json({
    success: true,
    message: 'Test created successfully',
    data: {
      test
    }
  });
}));

// @desc    Update test (Instructor/Admin only)
// @route   PUT /api/tests/:id
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
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('questions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  body('settings.timeLimit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Time limit must be at least 1 minute'),
  body('settings.passingScore')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('settings.maxAttempts')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max attempts must be at least 1')
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

  // Check if user is the instructor or admin
  if (test.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only update your own tests'
    });
  }

  // Update test
  Object.keys(req.body).forEach(key => {
    if (key !== 'instructor' && key !== 'course') { // Prevent changing instructor and course
      test[key] = req.body[key];
    }
  });

  await test.save();

  res.json({
    success: true,
    message: 'Test updated successfully',
    data: {
      test
    }
  });
}));

// @desc    Delete test (Instructor/Admin only)
// @route   DELETE /api/tests/:id
// @access  Private/Instructor/Admin
router.delete('/:id', [
  protect,
  isInstructorOrAdmin
], asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  // Check if user is the instructor or admin
  if (test.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only delete your own tests'
    });
  }

  await Test.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Test deleted successfully'
  });
}));

// @desc    Start test attempt
// @route   POST /api/tests/:id/start
// @access  Private
router.post('/:id/start', protect, asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  if (!test.isCurrentlyActive) {
    return res.status(400).json({
      success: false,
      message: 'Test is not currently available'
    });
  }

  // Check if user is enrolled in the course
  const course = await Course.findById(test.course);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const isEnrolled = course.enrolledStudents.some(
    enrollment => enrollment.student.toString() === req.user._id.toString()
  );

  if (!isEnrolled) {
    return res.status(400).json({
      success: false,
      message: 'You must be enrolled in the course to take this test'
    });
  }

  // Check password if required
  if (test.settings.requirePassword) {
    const { password } = req.body;
    if (password !== test.settings.password) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect test password'
      });
    }
  }

  // Start attempt
  await test.startAttempt(req.user._id, req.ip, req.get('User-Agent'));

  // Get questions (shuffle if enabled)
  let questions = test.questions;
  if (test.settings.shuffleQuestions) {
    questions = [...test.questions].sort(() => Math.random() - 0.5);
  }

  // Remove correct answers for security
  const sanitizedQuestions = questions.map(q => ({
    _id: q._id,
    question: q.question,
    type: q.type,
    options: q.options.map(opt => ({ text: opt.text })),
    points: q.points,
    difficulty: q.difficulty,
    tags: q.tags
  }));

  res.json({
    success: true,
    message: 'Test started successfully',
    data: {
      testId: test._id,
      title: test.title,
      timeLimit: test.settings.timeLimit,
      questions: sanitizedQuestions,
      totalQuestions: test.totalQuestions,
      totalPoints: test.totalPoints
    }
  });
}));

// @desc    Submit test attempt
// @route   POST /api/tests/:id/submit
// @access  Private
router.post('/:id/submit', [
  protect,
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive number')
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

  const { answers, timeSpent } = req.body;

  // Submit attempt
  await test.submitAttempt(req.user._id, answers, timeSpent);

  // Get the submitted attempt
  const attempt = test.attempts.find(
    attempt => attempt.student.toString() === req.user._id.toString() && attempt.completedAt
  );

  res.json({
    success: true,
    message: 'Test submitted successfully',
    data: {
      score: attempt.score,
      maxScore: attempt.maxScore,
      percentage: attempt.percentage,
      passed: attempt.passed,
      timeSpent: attempt.timeSpent,
      answers: test.settings.showResults ? attempt.answers : undefined
    }
  });
}));

// @desc    Get test results
// @route   GET /api/tests/:id/results
// @access  Private
router.get('/:id/results', protect, asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  // Get user's attempts
  const userAttempts = test.attempts.filter(
    attempt => attempt.student.toString() === req.user._id.toString()
  );

  if (userAttempts.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No attempts found for this test'
    });
  }

  // Get best attempt
  const bestAttempt = test.getBestAttempt(req.user._id);

  res.json({
    success: true,
    data: {
      attempts: userAttempts,
      bestAttempt,
      testStatistics: test.statistics
    }
  });
}));

// @desc    Get instructor's tests
// @route   GET /api/tests/instructor
// @access  Private/Instructor
router.get('/instructor', [
  protect,
  authorize('instructor', 'admin')
], asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const tests = await Test.find({ instructor: req.user._id })
    .populate('course', 'title category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Test.countDocuments({ instructor: req.user._id });

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

// @desc    Get test analytics (Instructor only)
// @route   GET /api/tests/:id/analytics
// @access  Private/Instructor
router.get('/:id/analytics', [
  protect,
  authorize('instructor', 'admin')
], asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
    .populate('attempts.student', 'firstName lastName email');
  
  if (!test) {
    return res.status(404).json({
      success: false,
      message: 'Test not found'
    });
  }

  // Check if user is the instructor or admin
  if (test.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You can only view analytics for your own tests'
    });
  }

  // Calculate question-wise analytics
  const questionAnalytics = test.questions.map(question => {
    const questionAttempts = test.attempts.filter(attempt => 
      attempt.completedAt && attempt.answers.some(answer => 
        answer.question.toString() === question._id.toString()
      )
    );

    const correctAnswers = questionAttempts.filter(attempt => {
      const answer = attempt.answers.find(a => a.question.toString() === question._id.toString());
      return answer && answer.isCorrect;
    }).length;

    return {
      questionId: question._id,
      question: question.question,
      type: question.type,
      totalAttempts: questionAttempts.length,
      correctAnswers,
      accuracy: questionAttempts.length > 0 ? (correctAnswers / questionAttempts.length) * 100 : 0
    };
  });

  res.json({
    success: true,
    data: {
      test,
      analytics: {
        totalAttempts: test.statistics.totalAttempts,
        averageScore: test.statistics.averageScore,
        passRate: test.statistics.passRate,
        averageTime: test.statistics.averageTime,
        questionAnalytics
      }
    }
  });
}));

export default router; 