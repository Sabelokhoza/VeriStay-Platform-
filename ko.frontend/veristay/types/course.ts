export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface CourseModule {
    id: string;
    title: string;
    description: string;
    contentType: 'video' | 'text' | 'quiz';
    videoUrl?: string;
    textContent?: string;
    quizQuestions?: QuizQuestion[];
    resources?: {
        title: string;
        type: string;
        url: string;
    }[];
    duration: number;
    order: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    modules: CourseModule[];
    instructor: {
        id: string;
        name: string;
        avatar: string;
    };
    price: number;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    duration: number;
    enrollments: number;
    rating: number;
    status: 'draft' | 'published' | 'archived';
    createdAt: string;
    updatedAt: string;
}
