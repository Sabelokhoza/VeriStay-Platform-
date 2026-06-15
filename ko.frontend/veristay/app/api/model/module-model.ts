interface ModuleModel {
    id: string;
    title: string;
    description: string;
    order: number;
    courseId: string;
}

interface ModuleEnrollment {
    id: string;
    moduleId: string;
    studentId: string;
    status: 'completed' | 'in-progress' | 'not-started';
    grade?: number;
}

export type { ModuleModel, ModuleEnrollment };
