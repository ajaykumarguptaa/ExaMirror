import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Course description cannot exceed 1000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['mathematics', 'science', 'literature', 'history', 'geography', 'computer-science', 'languages', 'arts', 'business', 'other']
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Course duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  isFree: {
    type: Boolean,
    default: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  banner: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }],
  sections: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    order: {
      type: Number,
      required: true
    },
    lessons: [{
      title: {
        type: String,
        required: true,
        trim: true
      },
      description: String,
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment'],
        default: 'text'
      },
      content: String, // URL for video, text content, or quiz data
      duration: Number, // in minutes
      order: {
        type: Number,
        required: true
      },
      isFree: {
        type: Boolean,
        default: true
      }
    }]
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  materials: [{
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['pdf', 'video', 'audio', 'link', 'other'],
      required: true
    },
    url: String,
    filePath: String,
    size: Number, // in bytes
    description: String
  }],
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    lastAccessed: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'en'
  },
  certificate: {
    isAvailable: {
      type: Boolean,
      default: false
    },
    requirements: {
      minProgress: {
        type: Number,
        default: 80,
        min: 0,
        max: 100
      },
      minScore: {
        type: Number,
        default: 70,
        min: 0,
        max: 100
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
courseSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  
  const totalRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
  return Math.round((totalRating / this.ratings.length) * 10) / 10;
});

// Virtual for total students
courseSchema.virtual('totalStudents').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for total lessons
courseSchema.virtual('totalLessons').get(function() {
  return this.sections.reduce((total, section) => total + section.lessons.length, 0);
});

// Indexes for better query performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ status: 1, isFeatured: 1 });
courseSchema.index({ 'enrolledStudents.student': 1 });

// Pre-save middleware to update short description
courseSchema.pre('save', function(next) {
  if (this.description && !this.shortDescription) {
    this.shortDescription = this.description.substring(0, 200);
  }
  next();
});

// Static method to find published courses
courseSchema.statics.findPublished = function() {
  return this.find({ status: 'published' });
};

// Static method to find featured courses
courseSchema.statics.findFeatured = function() {
  return this.find({ status: 'published', isFeatured: true });
};

// Static method to find courses by category
courseSchema.statics.findByCategory = function(category) {
  return this.find({ status: 'published', category });
};

// Static method to search courses
courseSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { status: 'published' },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  });
};

// Method to add student enrollment
courseSchema.methods.enrollStudent = function(studentId) {
  const existingEnrollment = this.enrolledStudents.find(
    enrollment => enrollment.student.toString() === studentId.toString()
  );
  
  if (!existingEnrollment) {
    this.enrolledStudents.push({
      student: studentId,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: [],
      lastAccessed: new Date()
    });
  }
  
  return this.save();
};

// Method to update student progress
courseSchema.methods.updateStudentProgress = function(studentId, lessonId, progress) {
  const enrollment = this.enrolledStudents.find(
    enrollment => enrollment.student.toString() === studentId.toString()
  );
  
  if (enrollment) {
    enrollment.progress = Math.min(100, Math.max(0, progress));
    enrollment.lastAccessed = new Date();
    
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }
  }
  
  return this.save();
};

// Method to add rating
courseSchema.methods.addRating = function(userId, rating, review = '') {
  // Remove existing rating by this user
  this.ratings = this.ratings.filter(r => r.user.toString() !== userId.toString());
  
  // Add new rating
  this.ratings.push({
    user: userId,
    rating,
    review,
    createdAt: new Date()
  });
  
  return this.save();
};

const Course = mongoose.model('Course', courseSchema);

export default Course; 