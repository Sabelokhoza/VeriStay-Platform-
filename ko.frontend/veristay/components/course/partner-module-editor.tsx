'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { FileText, HelpCircle, Plus, Trash2, File } from 'lucide-react';
import { useState } from 'react';
import BasicInfo from '../coursemanagement/basicinfo';
import { useGetCourseModuleByIdQuery } from '@/app/errors/coursesApi';
import Loading from '@/app/(platform)/loading';
import ResourcesPage from '../coursemanagement/resourcesPage';
import TextContent from '../coursemanagement/text-content';
import ModuleQuizzes from '../coursemanagement/module-quizzes';
import ModuleVideos from '../coursemanagement/module-videos';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    contentType: z.enum(['video', 'text', 'quiz']),
    videoUrl: z.string().optional(),
    textContent: z.string().optional(),
    quizQuestions: z
        .array(
            z.object({
                question: z.string(),
                options: z.array(z.string()),
                correctAnswer: z.number(),
            })
        )
        .optional(),
    resources: z
        .array(
            z.object({
                title: z.string(),
                type: z.string(),
                url: z.string(),
            })
        )
        .optional(),
});

export type ModuleContent = {
    id: string;
    title: string;
    description: string;
    contentType: 'video' | 'text' | 'quiz';
    videoUrl?: string;
    textContent?: string;
    quizQuestions?: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
    resources?: {
        title: string;
        type: string;
        url: string;
    }[];
};

interface PartnerModuleEditorProps {
    initialData?: ModuleContent;
    onSave: (data: ModuleContent) => void;
    courseId: number;
    moduleId: number;
}

export function PartnerModuleEditor({ initialData, moduleId }: PartnerModuleEditorProps) {
    const [activeTab, setActiveTab] = useState('basic');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            title: '',
            description: '',
            contentType: 'text',
            resources: [],
        },
    });

    const contentType = form.watch('contentType');

    const { isLoading, data: moduleData, error } = useGetCourseModuleByIdQuery(moduleId);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">Error loading module data.</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {initialData ? 'Edit Module' : 'Create New Module'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Add content, quizzes, and resources to your course module
                    </p>
                </div>

                <Form {...form}>
                    <div className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-5 mb-6">
                                <TabsTrigger value="basic" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">Basic Info</span>
                                    <span className="sm:hidden">Info</span>
                                </TabsTrigger>
                                <TabsTrigger value="video" className="flex items-center gap-2">
                                    <span className="hidden sm:inline">Video</span>
                                    <span className="sm:hidden">Video</span>
                                </TabsTrigger>
                                <TabsTrigger value="text" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">Text</span>
                                    <span className="sm:hidden">Text</span>
                                </TabsTrigger>
                                <TabsTrigger value="resources" className="flex items-center gap-2">
                                    <File className="h-4 w-4" />
                                    <span className="hidden sm:inline">Resources</span>
                                    <span className="sm:hidden">Files</span>
                                </TabsTrigger>
                                <TabsTrigger value="quiz" className="flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="hidden sm:inline">Quiz</span>
                                    <span className="sm:hidden">Quiz</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Basic Information Tab */}
                            <TabsContent value="basic" className="space-y-6">
                                <BasicInfo module={moduleData} />
                            </TabsContent>

                            {/* Video Tab */}
                            <TabsContent value="video" className="space-y-6">
                                <ModuleVideos module_id={moduleId} />
                            </TabsContent>

                            {/* Text Tab */}
                            <TabsContent value="text" className="space-y-6">
                                <TextContent moduleId={moduleId} />
                            </TabsContent>

                            {/* Resources Tab */}
                            <TabsContent value="resources" className="space-y-6">
                                <ResourcesPage moduleId={moduleId} />
                            </TabsContent>

                            {/* Quiz Tab */}
                            <TabsContent value="quiz" className="space-y-6">
                                <ModuleQuizzes module_id={moduleId} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </Form>
            </div>
        </div>
    );
}
