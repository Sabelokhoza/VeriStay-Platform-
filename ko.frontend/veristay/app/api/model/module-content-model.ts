import { ModuleContentType } from './enums';

interface BaseContentModel {
    id: string;
    title: string;
    order: number;
    type: ModuleContentType;
    moduleId: string;
}

interface ImageContentModel extends BaseContentModel {
    url: string;
}

interface PdfContentModel extends BaseContentModel {
    url: string;
}

interface TextContentModel extends BaseContentModel {
    content: string;
}

interface VideoContentModel extends BaseContentModel {
    durationMinutes: number;
    url: string;
}

export type { ImageContentModel, PdfContentModel, TextContentModel, VideoContentModel };
