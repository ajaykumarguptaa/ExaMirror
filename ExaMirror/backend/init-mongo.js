// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the exambook database
db = db.getSiblingDB('exambook');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "role"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "must be a valid email address and is required"
        },
        role: {
          enum: ["student", "instructor", "admin"],
          description: "must be one of: student, instructor, admin"
        }
      }
    }
  }
});

db.createCollection('courses', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "instructor"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        instructor: {
          bsonType: "objectId",
          description: "must be a valid ObjectId and is required"
        }
      }
    }
  }
});

db.createCollection('tests', {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "instructor"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        instructor: {
          bsonType: "objectId",
          description: "must be a valid ObjectId and is required"
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "createdAt": 1 });

db.courses.createIndex({ "title": "text", "description": "text" });
db.courses.createIndex({ "instructor": 1 });
db.courses.createIndex({ "status": 1 });
db.courses.createIndex({ "isFeatured": 1 });
db.courses.createIndex({ "createdAt": 1 });

db.tests.createIndex({ "title": "text", "description": "text" });
db.tests.createIndex({ "instructor": 1 });
db.tests.createIndex({ "status": 1 });
db.tests.createIndex({ "createdAt": 1 });

// Create a default admin user
const adminUser = {
  name: "Admin User",
  email: "admin@exambook.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK8e", // password: admin123
  role: "admin",
  isEmailVerified: true,
  profile: {
    avatar: "",
    bio: "Default administrator account",
    phone: "",
    location: "",
    website: ""
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    theme: "light",
    language: "en"
  },
  statistics: {
    totalCourses: 0,
    totalTests: 0,
    totalStudents: 0,
    averageRating: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
};

// Insert admin user if it doesn't exist
const existingAdmin = db.users.findOne({ email: adminUser.email });
if (!existingAdmin) {
  db.users.insertOne(adminUser);
  print("Default admin user created: admin@exambook.com / admin123");
} else {
  print("Admin user already exists");
}

// Create sample categories
const categories = [
  { name: "Mathematics", description: "Math courses and tests", icon: "🧮" },
  { name: "Science", description: "Science courses and tests", icon: "🔬" },
  { name: "Language", description: "Language learning courses", icon: "📚" },
  { name: "Programming", description: "Programming and coding courses", icon: "💻" },
  { name: "Business", description: "Business and management courses", icon: "💼" },
  { name: "Arts", description: "Arts and creative courses", icon: "🎨" }
];

// Insert categories if they don't exist
categories.forEach(category => {
  const existingCategory = db.categories.findOne({ name: category.name });
  if (!existingCategory) {
    db.categories.insertOne({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
});

print("Database initialization completed successfully!"); 