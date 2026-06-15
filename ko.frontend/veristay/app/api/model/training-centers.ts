import { ProvinceEnum } from './enums';

interface TrainingCenterModel {
    id: string;
    name: string;
    province: ProvinceEnum;
    address: string;
    contactEmail: string;
    contactPhone: string;
    accreditationNumber: string;
}

export type { TrainingCenterModel };
