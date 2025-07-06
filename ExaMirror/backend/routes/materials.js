import express from 'express';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course.js';
import { protect, authorize, isInstructorOrAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// @desc    Get materials for a course
// @route   GET /api/materials/course/:courseId
// @access  Public
router.get('/course/:courseId', asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  res.json({
    success: true,
    data: {
      materials: course.materials
    }
  });
}));

// @desc    Add material to course (Instructor/Admin only)
// @route   POST /api/materials/course/:courseId
// @access  Private/Instructor/Admin
router.post('/course/:courseId', [
  protect,
  isInstructorOrAdmin,
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  body('type')
    .isIn(['pdf', 'video', 'audio', 'link', 'other'])
    .withMessage('Invalid material type'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Invalid URL'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.courseId);
  
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
      message: 'You can only add materials to your own courses'
    });
  }

  const { title, type, url, filePath, size, description } = req.body;

  const material = {
    title,
    type,
    url,
    filePath,
    size,
    description
  };

  course.materials.push(material);
  await course.save();

  res.status(201).json({
    success: true,
    message: 'Material added successfully',
    data: {
      material: course.materials[course.materials.length - 1]
    }
  });
}));

// @desc    Update material (Instructor/Admin only)
// @route   PUT /api/materials/:courseId/:materialId
// @access  Private/Instructor/Admin
router.put('/:courseId/:materialId', [
  protect,
  isInstructorOrAdmin,
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('type')
    .optional()
    .isIn(['pdf', 'video', 'audio', 'link', 'other'])
    .withMessage('Invalid material type'),
  body('url')
    .optional()
    .isURL()
    .withMessage('Invalid URL'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.courseId);
  
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
      message: 'You can only update materials in your own courses'
    });
  }

  const material = course.materials.id(req.params.materialId);
  
  if (!material) {
    return res.status(404).json({
      success: false,
      message: 'Material not found'
    });
  }

  // Update material fields
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      material[key] = req.body[key];
    }
  });

  await course.save();

  res.json({
    success: true,
    message: 'Material updated successfully',
    data: {
      material
    }
  });
}));

// @desc    Delete material (Instructor/Admin only)
// @route   DELETE /api/materials/:courseId/:materialId
// @access  Private/Instructor/Admin
router.delete('/:courseId/:materialId', [
  protect,
  isInstructorOrAdmin
], asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  
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
      message: 'You can only delete materials from your own courses'
    });
  }

  const material = course.materials.id(req.params.materialId);
  
  if (!material) {
    return res.status(404).json({
      success: false,
      message: 'Material not found'
    });
  }

  material.remove();
  await course.save();

  res.json({
    success: true,
    message: 'Material deleted successfully'
  });
}));

export default router; 