import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithErrorHandling } from '../api/baseApi';
import ApiResponse from '../api/model/apiResponse';

export interface TrainingCentreEnrollmentsModel {
    userId: string;
    courseId: number;
    title: string;
    amount: string;
    status: string;
}
export interface UpdateQuizDetailsDto {
    quizId: number;
    title: string;
    description: string;
}
export interface TrainingCentreStudentModel {
    userId: string;
    fullName: string;
    coursesCount: number;
    psiraNo: string;
    enrollments: TrainingCentreEnrollmentsModel[];
}

export interface AddTrainingCentreDto {
    name: string;
    provinceId: number;
    address: string;
    contactEmail: string;
    contactPhone: string;
    accreditationNumber: string;
}

interface AddQuizRequest {
    description: string;
    title: string;
    courseModuleId: number;
}

export interface CourseEnrollmentStatisticsModel {
    tittle: string;
    enrolled: number;
    courseId: number;
    capacity: number;
    available: number;
}

export interface TrainingCentreEnrollmentModel {
    totalStudents: number;
    activeStudents: number;
    completionRate: number;
    totalEnrollments: number;
    courseEnrollmentStatistics: CourseEnrollmentStatisticsModel[];
    students: TrainingCentreStudentModel[];
}

export interface GetUserCertificationDto {
    id: number;
    title: string;
    psiraNumber: string;
    issueDate: string;
    expiryDate: string | null;
    level: string;
    status: string;
    authority: string;
    studentId: string | null;
    studentName: string | null;
}

export interface StudentCertificationsSummary {
    userid: string;
    fullName: string;
    certificationCount: number;
}

export interface GradesSummary {
    tittle: string;
    count: number;
}

export interface TrainingCenterCertificationsModel {
    gradesSummaries: GradesSummary[];
    studentCertificcationsSummaries: StudentCertificationsSummary[];
    certifications: GetUserCertificationDto[];
}

export interface StudentModuleMarks {
    modeuleName: string;
    moduleResult: number;
}

export interface GeCentretUserCertificationDto {
    id: number;
    title: string;
    psiraNumber: string;
    issueDate: string;
    expiryDate: string;
    level: string;
    status: string;
    authority: string;
    studentId: string | null;
    studentName: string | null;
}

export interface StudentEnrollmentsStatsDto {
    courseId: number;
    courseName: string;
    dateStarted: string;
    dateCompleted: string;
    isCompleted: boolean;
    progress: number;
    currentModule: string;
    studentModuleMarks: StudentModuleMarks[];
    completedModules: number;
}

export interface AddMultipleChoiceQuestionDto {
    question: string;
    courseMaterialId: number;
    answers: Array<{
        answer: string;
        isCorrect: boolean;
    }>;
}

export interface StudentStatsDto {
    averageProgress: number;
    activeCourses: number;
    completedCourses: number;
    completedCertificates: number;
}

export interface ProfileDto {
    id: string;
    idNumber: string;
    firstName: string;
    lastName: string;
    address: string;
    phoneNumber: string;
    dateOfBirth: string;
    email: string;
    password: string;
    registrationType: string;
    assistantName: string;
    psiraNumber: string;
    trainingCenterName: string;

    isActive: boolean;
    dateCreated: string | null;
    dateModified: string | null;
    isSouthAfrican: boolean;
}

export interface CenterStudentModel {
    profile: ProfileDto;
    summary: StudentStatsDto;
    enrollments: StudentEnrollmentsStatsDto[];
    certificates: GeCentretUserCertificationDto[] | null;
}

export interface QuizQuestionInfoDto {
    questionId: number;
    courseMaterialId: number;
    question: string;
    isTrueOrFalse: boolean;
    correctAnswer: string;
}
export interface AddTrueFalseQuestionDto {
    question: string;
    correctAnswer: boolean;
    courseMaterialId: number;
}

export const trainingCenterApi = createApi({
    reducerPath: 'trainingCenterApi',
    baseQuery: async (args, api, extraOptions) => {
        const customBaseQuery = baseQueryWithErrorHandling;
        return customBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        getAllTrainingCentres: builder.query({
            query: () => {
                return {
                    url: 'TrainingCentre/get-all',
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getCentreAdminByCentre: builder.query({
            query: (selectedCentreId) => {
                return {
                    url: `CentreAdmin/get-by-centre/${selectedCentreId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        deactivateOrActivateCentreAdmin: builder.mutation({
            query: (userId) => ({
                url: `CentreAdmin/deactivate-or-activate/${userId}`,
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                },
            }),
        }),
        getCentreDashboardData: builder.query({
            query: (userId) => {
                return {
                    url: `TrainingCentre/get-centre-dashboarddata?userId=${userId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getCentreCoursesData: builder.query({
            query: (centreId) => {
                return {
                    url: `TrainingCentre/get-centre-coursesdata?centreId=${centreId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getCentreStudentsDetails: builder.query({
            query: (centreId) => {
                return {
                    url: `CentreStudent/get-centre-students-details?centreId=${centreId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getStudentInformation: builder.query<ApiResponse<CenterStudentModel>, string>({
            query: (studentId) => ({
                url: `Course/get-student-information?studentId=${studentId}`,
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }),
        }),
        getTrainingCenterCertificationsSummary: builder.query<
            ApiResponse<TrainingCenterCertificationsModel>,
            number
        >({
            query: (centerId) => {
                return {
                    url: `UserCertification/get-training-center-cetifications-summary?centerId=${centerId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getCourseEnrollmentStatistics: builder.query<
            ApiResponse<TrainingCentreEnrollmentModel>, // Changed from array to single object
            number
        >({
            query: (centreId) => {
                return {
                    url: `CourseEnrollment/get-course-enrollment-statistics?centreId=${centreId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        addStudent: builder.mutation({
            query: (studentData) => {
                return {
                    url: 'Auth/add-student',
                    method: 'POST',
                    body: studentData,
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
        }),
        getQuizQuestionsInfoByMaterialId: builder.query<QuizQuestionInfoDto[], number>({
            query: (courseMaterialId) => {
                return {
                    url: `QuizQuestion/get-questions-info-by-material-id?courseMaterialId=${courseMaterialId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
            transformResponse: (response: any) => {
                return response?.data || [];
            },
        }),
        addTrueFalseQuestion: builder.mutation<ApiResponse, AddTrueFalseQuestionDto>({
            query: (questionData) => {
                return {
                    url: 'QuizQuestion/add-true-false-question',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: questionData,
                };
            },
        }),
        addMultipleChoiceQuestion: builder.mutation<ApiResponse, AddMultipleChoiceQuestionDto>({
            query: (questionData) => {
                return {
                    url: 'QuizQuestion/add-multiple-choice-question',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: questionData,
                };
            },
        }),
        deleteQuizQuestion: builder.mutation<ApiResponse, number>({
            query: (id) => {
                return {
                    url: `QuizQuestion/remove?id=${id}`,
                    method: 'DELETE',
                };
            },
        }),
        addQuiz: builder.mutation<void, AddQuizRequest>({
            query: (body) => ({
                url: '/CourseMaterial/add-quizz',
                method: 'POST',
                body,
            }),
        }),
        updateQuizDetails: builder.mutation<ApiResponse, UpdateQuizDetailsDto>({
            query: (quizData) => {
                return {
                    url: 'CourseMaterial/update-quizz-details',
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: quizData,
                };
            },
        }),
        addTrainingCentre: builder.mutation<ApiResponse, AddTrainingCentreDto>({
            query: (body) => ({
                url: 'TrainingCentre/add',
                method: 'POST',
                body,
                headers: {
                    'Content-type': 'application/json',
                },
            }),
        }),
        deleteQuiz: builder.mutation<void, number>({
            query: (id) => ({
                url: `/CourseMaterial/remove?id=${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllTrainingCentresQuery,
    useGetCentreAdminByCentreQuery,
    useGetCentreDashboardDataQuery,
    useGetCentreCoursesDataQuery,
    useGetCentreStudentsDetailsQuery,
    useGetStudentInformationQuery,
    useGetTrainingCenterCertificationsSummaryQuery,
    useGetCourseEnrollmentStatisticsQuery,
    useAddStudentMutation,
    useAddTrainingCentreMutation,
    useGetQuizQuestionsInfoByMaterialIdQuery,
    useAddTrueFalseQuestionMutation,
    useAddMultipleChoiceQuestionMutation,
    useDeleteQuizQuestionMutation,
    useUpdateQuizDetailsMutation,
    useAddQuizMutation,
    useDeactivateOrActivateCentreAdminMutation,
    useDeleteQuizMutation,
} = trainingCenterApi;
