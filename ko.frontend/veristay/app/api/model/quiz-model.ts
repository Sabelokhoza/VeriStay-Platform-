interface QuizContentModel {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    quizId: string;
}

interface QuizModel {
    id: string;
    title: string;
    description: string;
    moduleId: string;
    passingScore: number;
}

interface StudentQuizResult {
    id: string;
    score: number;
    passed: boolean;
    date: string;
    quizId: string;
    studentId: string;
}

export type { QuizModel, QuizContentModel, StudentQuizResult };
