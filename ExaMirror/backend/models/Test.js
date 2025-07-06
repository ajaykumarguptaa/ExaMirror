import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-blank', 'essay'],
    default: 'multiple-choice'
  },
  options: [{
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.type === 'fill-in-blank';
    }
  },
  points: {
    type: Number,
    default: 1,
    min: [1, 'Points must be at least 1']
  },
  explanation: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true
  }]
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Test title is required'],
    trim: true,
    maxlength: [100, 'Test title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Test description is required'],
    maxlength: [500, 'Test description cannot exceed 500 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  questions: [questionSchema],
  settings: {
    timeLimit: {
      type: Number, // in minutes
      default: 60,
      min: [1, 'Time limit must be at least 1 minute']
    },
    passingScore: {
      type: Number,
      default: 70,
      min: [0, 'Passing score cannot be negative'],
      max: [100, 'Passing score cannot exceed 100']
    },
    maxAttempts: {
      type: Number,
      default: 3,
      min: [1, 'Max attempts must be at least 1']
    },
    shuffleQuestions: {
      type: Boolean,
      default: true
    },
    showResults: {
      type: Boolean,
      default: true
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    requirePassword: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: function() {
        return this.settings.requirePassword;
      }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  attempts: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    answers: [{
      question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      selectedOptions: [{
        type: Number
      }],
      textAnswer: String,
      isCorrect: Boolean,
      pointsEarned: {
        type: Number,
        default: 0
      }
    }],
    score: {
      type: Number,
      default: 0
    },
    maxScore: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0
    },
    passed: {
      type: Boolean,
      default: false
    },
    timeSpent: {
      type: Number, // in minutes
      default: 0
    },
    ipAddress: String,
    userAgent: String
  }],
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total questions
testSchema.virtual('totalQuestions').get(function() {
  return this.questions.length;
});

// Virtual for total points
testSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Virtual for isExpired
testSchema.virtual('isExpired').get(function() {
  if (!this.endDate) return false;
  return new Date() > this.endDate;
});

// Virtual for isActive
testSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && 
         this.status === 'published' && 
         now >= this.startDate && 
         (!this.endDate || now <= this.endDate);
});

// Indexes for better query performance
testSchema.index({ course: 1, status: 1 });
testSchema.index({ instructor: 1 });
testSchema.index({ 'attempts.student': 1 });
testSchema.index({ startDate: 1, endDate: 1 });
testSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Pre-save middleware to calculate statistics
testSchema.pre('save', function(next) {
  if (this.attempts.length > 0) {
    const totalAttempts = this.attempts.length;
    const completedAttempts = this.attempts.filter(attempt => attempt.completedAt);
    const passedAttempts = completedAttempts.filter(attempt => attempt.passed);
    
    this.statistics.totalAttempts = totalAttempts;
    this.statistics.passRate = completedAttempts.length > 0 
      ? Math.round((passedAttempts.length / completedAttempts.length) * 100) 
      : 0;
    
    if (completedAttempts.length > 0) {
      const totalScore = completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
      const totalMaxScore = completedAttempts.reduce((sum, attempt) => sum + attempt.maxScore, 0);
      const totalTime = completedAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
      
      this.statistics.averageScore = Math.round((totalScore / totalMaxScore) * 100);
      this.statistics.averageTime = Math.round(totalTime / completedAttempts.length);
    }
  }
  next();
});

// Static method to find active tests
testSchema.statics.findActive = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    status: 'published',
    startDate: { $lte: now },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } }
    ]
  });
};

// Static method to find tests by course
testSchema.statics.findByCourse = function(courseId) {
  return this.find({ course: courseId, status: 'published' });
};

// Method to start test attempt
testSchema.methods.startAttempt = function(studentId, ipAddress = '', userAgent = '') {
  const existingAttempts = this.attempts.filter(
    attempt => attempt.student.toString() === studentId.toString()
  );
  
  if (existingAttempts.length >= this.settings.maxAttempts) {
    throw new Error('Maximum attempts reached for this test');
  }
  
  const attempt = {
    student: studentId,
    startedAt: new Date(),
    answers: [],
    score: 0,
    maxScore: this.totalPoints,
    percentage: 0,
    passed: false,
    timeSpent: 0,
    ipAddress,
    userAgent
  };
  
  this.attempts.push(attempt);
  return this.save();
};

// Method to submit test attempt
testSchema.methods.submitAttempt = function(studentId, answers, timeSpent) {
  const attempt = this.attempts.find(
    attempt => attempt.student.toString() === studentId.toString() && !attempt.completedAt
  );
  
  if (!attempt) {
    throw new Error('No active attempt found for this student');
  }
  
  // Calculate score
  let totalScore = 0;
  const processedAnswers = answers.map(answer => {
    const question = this.questions.id(answer.questionId);
    if (!question) return null;
    
    let isCorrect = false;
    let pointsEarned = 0;
    
    switch (question.type) {
      case 'multiple-choice':
        isCorrect = answer.selectedOptions.every(optionIndex => 
          question.options[optionIndex]?.isCorrect
        ) && answer.selectedOptions.length === question.options.filter(opt => opt.isCorrect).length;
        break;
      case 'true-false':
        isCorrect = answer.selectedOptions.length === 1 && 
                   question.options[answer.selectedOptions[0]]?.isCorrect;
        break;
      case 'fill-in-blank':
        isCorrect = answer.textAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
        break;
      case 'essay':
        // Essay questions need manual grading
        isCorrect = false;
        break;
    }
    
    if (isCorrect) {
      pointsEarned = question.points;
      totalScore += question.points;
    }
    
    return {
      question: answer.questionId,
      selectedOptions: answer.selectedOptions || [],
      textAnswer: answer.textAnswer || '',
      isCorrect,
      pointsEarned
    };
  }).filter(Boolean);
  
  // Update attempt
  attempt.answers = processedAnswers;
  attempt.score = totalScore;
  attempt.percentage = Math.round((totalScore / attempt.maxScore) * 100);
  attempt.passed = attempt.percentage >= this.settings.passingScore;
  attempt.completedAt = new Date();
  attempt.timeSpent = timeSpent;
  
  return this.save();
};

// Method to get student's best attempt
testSchema.methods.getBestAttempt = function(studentId) {
  const studentAttempts = this.attempts.filter(
    attempt => attempt.student.toString() === studentId.toString() && attempt.completedAt
  );
  
  if (studentAttempts.length === 0) return null;
  
  return studentAttempts.reduce((best, current) => 
    current.percentage > best.percentage ? current : best
  );
};

const Test = mongoose.model('Test', testSchema);

export default Test; 