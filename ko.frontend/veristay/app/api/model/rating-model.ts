import { RatingEnum } from './enums';

interface RatingModel {
    id: string;
    date: string;
    rating: RatingEnum;
    courseId: string;
    studentId: string;
}

export type { RatingModel };
