import { createApi } from '@reduxjs/toolkit/query/react';
import { ApiResponse, baseQueryWithErrorHandling } from '../api/baseApi';
import { addEnrollmentDto } from '../api/dtos/dtos';

export interface TrainingCentreEnrollmentsModel {
    userId: string;
    courseId: number;
    title: string;
    amount: string;
    status: string;
}

export interface TrainingCentreStudentModel {
    userId: string;
    fullName: string;
    coursesCount: number;
    psiraNo: string;
    enrollments: TrainingCentreEnrollmentsModel[];
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
/////////////

export interface AddCourseDto {
    title: string;
    description: string;
    durationHours: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    isActive: boolean;
    trainingCentreId: number;
    certificationId: number;
    price: string;
    duration: number;
}

export interface UpdateCourseDto {
    id: number;
    title: string;
    description: string;
    level: string;
    isActive: boolean;
    price: string;
}

export interface AddCourseModuleDto {
    courseId: number;
    title: string;
    description: string;
    duration: number;
}

export interface UpdateCourseModuleDto {
    id: number;
    title: string;
    description: string;
    courseId: number;
    duration: number;
}

export interface AddModuleResourceDto {
    title: string;
    type: string;
    moduleId: number;
    formFile: File;
}

export interface UpdateVideoMaterialDto {
    id: number;
    videoUrl: string;
    title: string;
    description: string;
    coursemoduleid?: number;
}

export interface StudentMarkDto {
    id: number;
    courseMaterialId: number;
    applicationUserId: string;
    score: number;
    isPass: boolean;
    dateCreated: string;
    dateModified: string;
    isCourseCompleted: boolean;
    courseMaterialTitle: string;
    studentName: string;
}

export interface TextContentDto {
    courseModuleId: number;
    textContent: string;
    title: string;
    description: string;
    id: number;
    dateCreated: string | null;
    dateModified: string | null;
}

export interface QuizSummaryDto {
    id: number;
    courseModuleId: number;
    contentType: string;
    description: string;
    qestionCount: number;
    dateCreated: string | null;
    dateModified: string | null;
    title: string;
}

export interface AddOrUpdateTextMaterialDto {
    id: number;
    moduleId: number;
    title: string;
    description: string;
    textContent: string;
}

export interface CourseModuleDto {
    eId: number;
    title: string;
    description: string;
    order: number;
    duration: number;
    courseId: number;
    id: number;
    dateCreated: string | null;
    dateModified: string | null;
}

export interface ModuleResourceDto {
    id: number;
    title: string;
    type: string;
    url: string;
}

export interface Certification {
    id: number;
    name: string;
    code: string;
    description: string;
    prerequisiteCertificationId: number | null;
    dateCreated: string;
    dateModified: string | null;
}

export interface ModuleVideoDto {
    courseModuleId: number;
    contentType: string;
    url: string | null;
    videoUrl: string;
    title: string;
    description: string;
    uploadedAt: string;
    id: number;
}

interface AddVideoMaterialDto {
    courseModuleId: number;
    videoUrl?: string;
    contentType?: string;
    title?: string;
    description?: string;
}

export const coursesApi = createApi({
    reducerPath: 'coursesApi',
    baseQuery: async (args, api, extraOptions) => {
        const customBaseQuery = baseQueryWithErrorHandling;
        return customBaseQuery(args, api, extraOptions);
    },
    endpoints: (builder) => ({
        addCourseEnrollment: builder.mutation<ApiResponse, addEnrollmentDto>({
            query: (enrollmentData) => {
                return {
                    url: 'CourseEnrollment/add',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: enrollmentData,
                };
            },
        }),
        addCourse: builder.mutation<ApiResponse, AddCourseDto>({
            query: (courseData) => {
                return {
                    url: 'Course/add',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: courseData,
                };
            },
        }),
        updateCourse: builder.mutation<ApiResponse, UpdateCourseDto>({
            query: (courseData) => {
                return {
                    url: `Course/update?id=${courseData.id}`,
                    method: 'PUT',
                    body: courseData,
                };
            },
        }),
        addCourseModule: builder.mutation<ApiResponse, AddCourseModuleDto>({
            query: (moduleData) => {
                return {
                    url: 'CourseModule/add',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: moduleData,
                };
            },
        }),
        updateCourseModule: builder.mutation<ApiResponse, UpdateCourseModuleDto>({
            query: (moduleData) => {
                return {
                    url: `CourseModule/update?id=${moduleData.id}`,
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: moduleData,
                };
            },
        }),
        addModuleResource: builder.mutation<
            ApiResponse,
            { title: string; type: string; moduleId: number; file: File }
        >({
            query: ({ title, type, moduleId, file }) => {
                const formData = new FormData();
                formData.append('formFile', file);

                return {
                    url: `ModuleResource/add?title=${encodeURIComponent(title)}&type=${encodeURIComponent(type)}&moduleId=${moduleId}`,
                    method: 'POST',
                    body: formData,
                };
            },
        }),
        deleteModuleResource: builder.mutation<ApiResponse, number>({
            query: (id) => {
                return {
                    url: `ModuleResource/remove?id=${id}`,
                    method: 'DELETE',
                };
            },
        }),
        updateVideoMaterial: builder.mutation<ApiResponse, UpdateVideoMaterialDto>({
            query: (videoData) => {
                return {
                    url: 'CourseMaterial/update-video-material',
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: videoData,
                };
            },
        }),
        addVideoMaterial: builder.mutation<ApiResponse, AddVideoMaterialDto>({
            query: (videoData) => {
                return {
                    url: 'CourseMaterial/add-video-material',
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: videoData,
                };
            },
        }),
        getOrAddDummyVideo: builder.query<ModuleVideoDto, number>({
            query: (moduleId) => {
                return {
                    url: `CourseMaterial/get-or-add-dummy-video?moduleId=${moduleId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
            transformResponse: (response: any) => {
                return response?.data || null;
            },
        }),
        getCourseModuleById: builder.query<CourseModuleDto, number>({
            query: (id) => {
                return {
                    url: `CourseModule/get-by-id?id=${id}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
            transformResponse: (response: any) => {
                return response?.data || null;
            },
        }),
        getModuleResourcesByCourseMaterialId: builder.query<ModuleResourceDto[], number>({
            query: (moduleId) => {
                return {
                    url: `ModuleResource/get-by-course-material-by-moduleid?moduleId=${moduleId}`,
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
        getAllCertifications: builder.query<Certification[], void>({
            query: () => {
                return {
                    url: 'Certification/get-all',
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
        addOrUpdateTextMaterial: builder.mutation<ApiResponse, AddOrUpdateTextMaterialDto>({
            query: (textData) => {
                return {
                    url: 'CourseMaterial/add-or-update-text-material',
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: textData,
                };
            },
        }),
        deleteTextMaterial: builder.mutation<ApiResponse, number>({
            query: (id) => {
                return {
                    url: `CourseMaterial/remove?id=${id}`,
                    method: 'DELETE',
                };
            },
        }),
        deleteVideoMaterial: builder.mutation<ApiResponse, number>({
            query: (id) => {
                return {
                    url: `CourseMaterial/remove?id=${id}`,
                    method: 'DELETE',
                };
            },
        }),
        getTextByModuleId: builder.query<TextContentDto[], number>({
            query: (moduleId) => {
                return {
                    url: `CourseMaterial/get-text-by-module-id?moduleId=${moduleId}`,
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                };
            },
            transformResponse: (response: any) => {
                return response?.data || null;
            },
        }),
        getQuizzesByModuleId: builder.query<QuizSummaryDto[], number>({
            query: (moduleId) => {
                return {
                    url: `CourseMaterial/get-quizzes-by-module-id?moduleId=${moduleId}`,
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
        getVideosByModuleId: builder.query<ModuleVideoDto[], number>({
            query: (moduleId) => ({
                url: `CourseMaterial/get-videos-by-module-id?moduleId=${moduleId}`,
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            transformResponse: (response: any) => {
                return response?.data || [];
            },
        }),
        getStudentMarks: builder.query<StudentMarkDto[], string>({
            query: (userId) => ({
                url: `StudentQuizAttempt/get-student-marks?userId=${userId}`,
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            }),
            transformResponse: (response: any) => {
                return response?.data || [];
            },
        }),
    }),
});

export const {
    useAddCourseEnrollmentMutation,
    useAddCourseMutation,
    useUpdateCourseMutation,
    useAddCourseModuleMutation,
    useUpdateCourseModuleMutation,
    useAddModuleResourceMutation,
    useDeleteModuleResourceMutation,
    useUpdateVideoMaterialMutation,
    useGetOrAddDummyVideoQuery,
    useGetCourseModuleByIdQuery,
    useGetModuleResourcesByCourseMaterialIdQuery,
    useGetAllCertificationsQuery,
    useGetTextByModuleIdQuery,
    useAddOrUpdateTextMaterialMutation,
    useDeleteTextMaterialMutation,
    useDeleteVideoMaterialMutation,
    useAddVideoMaterialMutation,
    useGetQuizzesByModuleIdQuery,
    useGetVideosByModuleIdQuery,
    useGetStudentMarksQuery,
} = coursesApi;
