import Image from "next/image";
import Link from "next/link";
import { FiStar, FiUsers, FiClock, FiBarChart } from "react-icons/fi";
import { ICourse } from "@/types";

interface Props {
  course: ICourse;
}

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "badge-secondary",
  Intermediate: "badge-accent",
  Advanced: "badge-primary",
};

export default function CourseCard({ course }: Props) {
  const instructor = typeof course.instructor === "object" ? course.instructor : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden card-hover flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={course.image || "https://placehold.co/800x450/4F46E5/ffffff?text=SkillBridge"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 left-3">
          <span className={`badge ${LEVEL_COLOR[course.level] || "badge-primary"}`}>
            <FiBarChart className="mr-1 text-xs" /> {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="badge badge-accent">৳{course.price}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide mb-1">
          {course.category}
        </span>
        <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
          {course.shortDescription}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <FiStar className="text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700">{course.rating?.toFixed(1) || "0.0"}</span>
            <span>({course.totalReviews || 0})</span>
          </span>
          <span className="flex items-center gap-1">
            <FiUsers className="text-slate-400" /> {course.totalStudents || 0} students
          </span>
          <span className="flex items-center gap-1">
            <FiClock className="text-slate-400" /> {course.duration || "10h"}
          </span>
        </div>

        {/* Instructor */}
        {instructor && (
          <p className="text-xs text-slate-400 mb-4">
            by <span className="font-medium text-slate-600">{instructor.name}</span>
          </p>
        )}

        {/* CTA */}
        <Link
          href={`/courses/${course._id}`}
          id={`course-card-view-${course._id}`}
          className="w-full py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
