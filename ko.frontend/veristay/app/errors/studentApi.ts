import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../api/baseApi';
import { StudentCoursesDashboardData, StudentQuizAttemptDto } from '../api/dtos/dtos';
import ApiResponse from '../api/model/apiResponse';
import { userDto } from '../api/dtos/dtos';

export interface CourseDataModel {
    id: number;
    title: string;
    description: string;
    duration: number;
    students: number;
    psiraLevel: string;
    price: string; // TODO: make decimal on db
    rating: number;
    reviews: number;
    level: string;
    instructor: string;
    prerequisites: Prerequisite[];
    trainingCenterId: number;
    modules: Module[];
    skills: string[];
    outcomes: string[];
    status: string;
    certification: Certification;
}

export interface Prerequisite {
    id: string;
    title: string;
    status: string;
}

export interface Module {
    id: number;
    title: string;
    description: string;
    duration: number; // in hours
    topics: string[];
    content?: ModuleContent[];
}

export interface ModuleContent {
    id: string;
    title: string;
    description: string;
    contentType: string; // 'video' | 'text' | 'quiz'
    videoUrl?: string;
    textContent?: string;
    quizQuestions?: QuizQuestion[];
    resources?: ModuleResource[];
}

export interface QuizQuestion {
    id: number;
    question: string;
    questionType: string; // 'MultipleChoice' | 'TrueFalse'
    correctAnswer?: boolean; // For True/False questions
    answers?: QuizAnswer[]; // For Multiple Choice questions
}

export interface QuizAnswer {
    id: number;
    answerText: string;
    isCorrect: boolean;
}

export interface ModuleResource {
    id: number;
    title: string;
    type: string;
    url: string;
}

export interface Certification {
    type: string;
    validity: string;
    requirements: string[];
}

//
export interface AddStudentQuizAttemptDto {
    courseMaterialId: number;
    applicationUserId: string;
    score: number;
    isPass: boolean;
}

//
export interface CourseEnrollmentPaymentModel {
    id: number;
    courseName: string;
    registrationDate: string;
    amount: string;
    status: string;
    method: string;
    isManualPayment: boolean;
    lastModifiedBy: string;
    lastModifiedDate: string | null;
}

export interface StudentBillingPageModel {
    enrollments: CourseEnrollmentPaymentModel[];
    student: userDto;
}

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: async (args, api, extraOptions) => {
        const customBaseQuery = baseQueryWithErrorHandling;
        return customBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        getUserById: builder.query({
            query: (userId) => {
                return {
                    url: `User/get-user-by-id?user_id=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        studentDashboardData: builder.query({
            query: (userId) => {
                return {
                    url: `User/student-dashboard-data?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        studentEnrollmentsData: builder.query<StudentCoursesDashboardData, string>({
            query: (userId) => {
                return {
                    url: `User/student-enrollments-data?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        studentEnrollments: builder.query({
            query: (userId) => {
                return {
                    url: `User/student-enrollments?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        studentCoursesData: builder.query({
            query: () => {
                return {
                    url: `User/courses-data`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        CoursesData: builder.query<ApiResponse<CourseDataModel[]>, void>({
            query: () => ({
                url: 'User/courses-data',
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }),
        }),
        learningPathsInfo: builder.query({
            query: () => {
                return {
                    url: `LearningPath/learningpaths-info`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        addStudentQuizAttempt: builder.mutation<
            ApiResponse<StudentQuizAttemptDto>,
            AddStudentQuizAttemptDto
        >({
            query: (data) => {
                return {
                    url: `StudentQuizAttempt/add`,
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: data,
                };
            },
        }),
        getUserCertificates: builder.query({
            query: (userId: string) => {
                return {
                    url: `UserCertification/get-user-certificates?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getUserCertificatesDashboardData: builder.query({
            query: (userId: string) => {
                return {
                    url: `UserCertification/get-user-certificates-dashboard-data?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getStudentBillingPageInfo: builder.query<ApiResponse<StudentBillingPageModel>, string>({
            query: (userId: string) => {
                return {
                    url: `CourseEnrollment/get-student-billing-page-info?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
    }),
});

export const {
    useGetUserByIdQuery,
    useStudentDashboardDataQuery,
    useStudentEnrollmentsDataQuery,
    useStudentEnrollmentsQuery,
    useStudentCoursesDataQuery,
    useLearningPathsInfoQuery,
    useAddStudentQuizAttemptMutation,
    useGetUserCertificatesQuery,
    useGetUserCertificatesDashboardDataQuery,
    useCoursesDataQuery,
    useGetStudentBillingPageInfoQuery,
} = studentApi;
