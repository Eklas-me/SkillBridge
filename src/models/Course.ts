import mongoose, { Schema, Document } from "mongoose";

export interface ICourseDoc extends Document {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  instructor: mongoose.Types.ObjectId;
  duration: string;
  lessons: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourseDoc>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [250, "Short description cannot exceed 250 characters"],
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "UI/UX Design",
        "Cloud Computing",
        "Cyber Security",
        "Digital Marketing",
      ],
    },
    level: {
      type: String,
      required: [true, "Level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    image: {
      type: String,
      default: "https://placehold.co/800x450/4F46E5/ffffff?text=SkillBridge+Course",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    duration: {
      type: String,
      default: "10 hours",
    },
    lessons: {
      type: Number,
      default: 20,
    },
    language: {
      type: String,
      default: "English",
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
CourseSchema.index({ title: "text", shortDescription: "text" });
CourseSchema.index({ category: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ price: 1 });

const Course = mongoose.models.Course || mongoose.model<ICourseDoc>("Course", CourseSchema);

export default Course;
