interface CareerModel {
    id: string;
    name: string;
    description: string;
    courses: string[];
    trainingCenterId: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export type { CareerModel };
