import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Review from "@/models/Review";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "seedskillbridge2024") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    await dbConnect();

  // Clear existing
  await User.deleteMany({});
  await Course.deleteMany({});
  await Review.deleteMany({});

  // Create users
  const passwordUser = await bcrypt.hash("User@123", 12);
  const passwordAdmin = await bcrypt.hash("Admin@123", 12);

  const [userDoc, adminDoc, instructor1, instructor2] = await User.insertMany([
    { name: "Demo User", email: "user@skillbridge.com", password: passwordUser, role: "user" },
    { name: "Admin User", email: "admin@skillbridge.com", password: passwordAdmin, role: "admin" },
    { name: "Sarah Johnson", email: "sarah@skillbridge.com", password: passwordUser, role: "user" },
    { name: "James Lee", email: "james@skillbridge.com", password: passwordUser, role: "user" },
  ]);

  const COURSES = [
    {
      title: "Complete React Developer Course 2024",
      shortDescription: "Master React.js from scratch to advanced. Build real-world projects with hooks, Redux, and Next.js.",
      fullDescription: "In this comprehensive course, you will learn everything about modern React development. Starting from the fundamentals of components and JSX, we will progress through hooks (useState, useEffect, useContext, useReducer), state management with Redux Toolkit, routing with React Router, and full-stack development with Next.js.\n\nYou will build 5 real-world projects including a social media app, e-commerce platform, and dashboard application. Each project comes with full source code and step-by-step explanations.\n\nPrerequisites: Basic HTML, CSS, and JavaScript knowledge.\n\nWhat you'll learn:\n• React fundamentals and JSX\n• Hooks (useState, useEffect, useContext, useReducer, useRef)\n• Redux Toolkit and Zustand\n• React Router v6\n• Next.js 14 App Router\n• Testing with React Testing Library\n• Performance optimization",
      price: 1499,
      category: "Web Development",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
      rating: 4.8, totalReviews: 234, totalStudents: 3421,
      instructor: instructor1._id, duration: "32 hours", lessons: 180, language: "English",
    },
    {
      title: "Python for Data Science and Machine Learning",
      shortDescription: "Learn Python, NumPy, Pandas, Matplotlib, Scikit-Learn and TensorFlow for data science careers.",
      fullDescription: "This course is your complete guide to data science and machine learning using Python. You will start with Python fundamentals and progress to advanced ML algorithms.\n\nThe course covers:\n• Python programming essentials\n• NumPy for numerical computing\n• Pandas for data manipulation\n• Matplotlib and Seaborn for visualization\n• Scikit-Learn for machine learning\n• TensorFlow and Keras for deep learning\n• Real-world projects: Stock prediction, image classification, NLP sentiment analysis\n\nBy the end, you'll have a portfolio of data science projects and be ready for industry roles.",
      price: 1999,
      category: "Data Science",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      rating: 4.9, totalReviews: 312, totalStudents: 5102,
      instructor: instructor2._id, duration: "40 hours", lessons: 220, language: "English",
    },
    {
      title: "Full Stack Web Development Bootcamp",
      shortDescription: "Become a full-stack developer with HTML, CSS, JavaScript, Node.js, Express, MongoDB and React.",
      fullDescription: "The most comprehensive full-stack web development bootcamp. Learn everything you need to become a full-stack developer from scratch.\n\nFrontend: HTML5, CSS3, JavaScript ES6+, React.js\nBackend: Node.js, Express.js, RESTful APIs\nDatabase: MongoDB, Mongoose, SQL basics\nDeployment: Vercel, Heroku, MongoDB Atlas\n\nYou'll build 10+ projects and graduate with a professional portfolio ready to land your first dev job.",
      price: 2499,
      category: "Web Development",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=450&fit=crop",
      rating: 4.7, totalReviews: 189, totalStudents: 2890,
      instructor: instructor1._id, duration: "50 hours", lessons: 280, language: "English",
    },
    {
      title: "Flutter Mobile App Development",
      shortDescription: "Build beautiful iOS and Android apps with Flutter and Dart. Master state management and Firebase.",
      fullDescription: "Flutter is Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.\n\nIn this course you'll learn:\n• Dart programming language\n• Flutter widgets and layouts\n• State management (Provider, Riverpod, BLoC)\n• Firebase integration (Auth, Firestore, Storage)\n• REST API integration\n• Publishing to App Store and Play Store\n\nBuild 4 complete apps: To-Do app, Weather app, Chat app, E-commerce app.",
      price: 1799,
      category: "Mobile Development",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
      rating: 4.8, totalReviews: 156, totalStudents: 2103,
      instructor: instructor2._id, duration: "28 hours", lessons: 160, language: "English",
    },
    {
      title: "UI/UX Design Masterclass with Figma",
      shortDescription: "Learn UI/UX design principles, user research, wireframing and prototyping using Figma.",
      fullDescription: "This comprehensive UI/UX design course will take you from zero to a professional designer. You'll learn how to create beautiful, user-centered designs using industry-standard tools and methodologies.\n\nTopics covered:\n• Design thinking and principles\n• User research and persona creation\n• Information architecture\n• Wireframing and prototyping\n• Figma mastery — components, auto-layout, variants\n• Design systems creation\n• Usability testing\n• Portfolio building\n\nPerfect for beginners and developers looking to transition into design.",
      price: 999,
      category: "UI/UX Design",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop",
      rating: 4.9, totalReviews: 278, totalStudents: 4231,
      instructor: instructor1._id, duration: "24 hours", lessons: 130, language: "English",
    },
    {
      title: "AWS Cloud Practitioner & Solutions Architect",
      shortDescription: "Master Amazon Web Services from scratch. Prepare for AWS certifications with hands-on labs.",
      fullDescription: "Get certified in AWS and launch your cloud career. This course covers everything from basic cloud concepts to architecting scalable, fault-tolerant systems on AWS.\n\nWhat you'll learn:\n• Cloud computing fundamentals\n• Core AWS services: EC2, S3, RDS, Lambda\n• Networking: VPC, Route 53, CloudFront\n• Security: IAM, KMS, Shield\n• Serverless architecture\n• Auto Scaling and Load Balancing\n• Exam preparation for AWS Cloud Practitioner and Solutions Architect\n\n100+ hands-on labs included.",
      price: 2999,
      category: "Cloud Computing",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop",
      rating: 4.7, totalReviews: 143, totalStudents: 1876,
      instructor: instructor2._id, duration: "36 hours", lessons: 200, language: "English",
    },
    {
      title: "Machine Learning with Python — From Zero to Expert",
      shortDescription: "Learn supervised and unsupervised learning, neural networks, and deploy ML models to production.",
      fullDescription: "A comprehensive machine learning course covering all major algorithms and techniques. Learn to build and deploy ML models from scratch.\n\nCourse curriculum:\n• Linear and logistic regression\n• Decision trees and random forests\n• Support Vector Machines\n• K-Means and DBSCAN clustering\n• Neural networks with PyTorch\n• Computer vision with CNNs\n• NLP and transformers\n• Model deployment with FastAPI\n\nIncludes 8 hands-on projects with real datasets.",
      price: 1599,
      category: "Machine Learning",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop",
      rating: 4.8, totalReviews: 198, totalStudents: 3102,
      instructor: instructor1._id, duration: "44 hours", lessons: 240, language: "English",
    },
    {
      title: "Digital Marketing Complete Course 2024",
      shortDescription: "Master SEO, Google Ads, Facebook Ads, email marketing and social media marketing.",
      fullDescription: "The most comprehensive digital marketing course that covers every aspect of online marketing. Learn from industry experts and run real campaigns.\n\nTopics included:\n• SEO fundamentals and advanced techniques\n• Google Ads (Search, Display, Shopping)\n• Facebook and Instagram advertising\n• Email marketing with Mailchimp\n• Content marketing strategy\n• Social media management\n• Analytics and conversion optimization\n• Influencer marketing\n\nPractical assignments for each module with real-world case studies.",
      price: 799,
      category: "Digital Marketing",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
      rating: 4.6, totalReviews: 321, totalStudents: 5891,
      instructor: instructor2._id, duration: "20 hours", lessons: 110, language: "English",
    },
    {
      title: "TypeScript Advanced Patterns and Architecture",
      shortDescription: "Deep dive into TypeScript generics, decorators, design patterns, and enterprise architecture.",
      fullDescription: "Take your TypeScript skills to the next level with advanced patterns and architectural concepts used in enterprise applications.\n\nWhat you'll master:\n• Advanced generics and conditional types\n• Mapped and template literal types\n• Decorators and metadata\n• Design patterns: Factory, Observer, Strategy, Command\n• SOLID principles in TypeScript\n• Domain-Driven Design\n• Building scalable APIs with NestJS\n• Monorepo architecture with Nx\n\nIdeal for developers with 1+ year of TypeScript experience.",
      price: 1299,
      category: "Web Development",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?w=800&h=450&fit=crop",
      rating: 4.9, totalReviews: 87, totalStudents: 1204,
      instructor: instructor1._id, duration: "22 hours", lessons: 120, language: "English",
    },
    {
      title: "Ethical Hacking and Cyber Security",
      shortDescription: "Learn penetration testing, network security, web app security, and prepare for CEH certification.",
      fullDescription: "Become a certified ethical hacker and learn to protect organizations from cyber threats.\n\nCourse content:\n• Introduction to ethical hacking\n• Networking fundamentals\n• Footprinting and reconnaissance\n• Network scanning and enumeration\n• Vulnerability assessment\n• System hacking techniques\n• Web application security (OWASP Top 10)\n• SQL injection and XSS\n• Wireless network security\n• CEH exam preparation\n\nAll exercises done in legal, isolated lab environments.",
      price: 2199,
      category: "Cyber Security",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=800&h=450&fit=crop",
      rating: 4.7, totalReviews: 134, totalStudents: 1987,
      instructor: instructor2._id, duration: "38 hours", lessons: 210, language: "English",
    },
    {
      title: "React Native — Build Mobile Apps with JavaScript",
      shortDescription: "Create cross-platform iOS and Android apps using React Native, Expo, and JavaScript.",
      fullDescription: "Learn to build native mobile applications using your existing JavaScript and React skills with React Native.\n\nYou'll cover:\n• React Native fundamentals and components\n• Navigation with React Navigation v6\n• State management with Zustand and React Query\n• Expo SDK and EAS Build\n• Camera, location, and notifications\n• Offline storage with AsyncStorage and SQLite\n• Push notifications\n• App Store submission process\n\nBuild 3 complete apps: Social Media App, Food Delivery App, Fitness Tracker.",
      price: 1399,
      category: "Mobile Development",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=450&fit=crop",
      rating: 4.8, totalReviews: 167, totalStudents: 2456,
      instructor: instructor1._id, duration: "30 hours", lessons: 165, language: "English",
    },
    {
      title: "Node.js and Express — Complete Backend Development",
      shortDescription: "Build scalable REST APIs with Node.js, Express, MongoDB, JWT authentication, and testing.",
      fullDescription: "Master backend development with Node.js and build production-ready APIs.\n\nTopics:\n• Node.js fundamentals and event loop\n• Express.js routing and middleware\n• RESTful API design principles\n• MongoDB with Mongoose\n• Authentication with JWT and bcrypt\n• File uploads with Multer\n• Rate limiting and security\n• Unit and integration testing with Jest\n• API documentation with Swagger\n• Deployment to cloud platforms\n\nEnd with a complete project: full REST API for an e-commerce platform.",
      price: 1199,
      category: "Web Development",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
      rating: 4.7, totalReviews: 201, totalStudents: 3345,
      instructor: instructor2._id, duration: "26 hours", lessons: 145, language: "English",
    },
  ];

  const createdCourses = await Course.insertMany(COURSES);

  // Create reviews
  const reviewData = createdCourses.slice(0, 6).map((course) => ({
    user: userDoc._id,
    course: course._id,
    rating: 5,
    comment: "Absolutely fantastic course! The instructor explains everything so clearly. I learned more in a week than I did in months of self-study. Highly recommended!",
  }));

  await Review.insertMany(reviewData);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        users: 4,
        courses: createdCourses.length,
        reviews: reviewData.length,
        credentials: {
          user: { email: "user@skillbridge.com", password: "User@123" },
          admin: { email: "admin@skillbridge.com", password: "Admin@123" },
        },
      },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database. Check Vercel logs or environment variables.",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
