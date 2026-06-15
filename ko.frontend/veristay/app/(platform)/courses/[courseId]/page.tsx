'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, BookOpen, Clock, FileText, Video, ClipboardList, Download } from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import Header from '@/components/shared/header';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AddModuleModal } from '../add-module-modal';
import { EditCourseModal } from '../edit-course-modal';
import { useCoursesDataQuery } from '@/app/errors/studentApi';
import Loading from '../../loading';
import { useStudentCoursesData } from '../../data';

export default function CoursePage() {
    const params = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const { data, error, isLoading, refetch } = useCoursesDataQuery();
    const {
        courses: dataCourses,
        isLoading: refetchLoading,
        refetch: refetchData,
    } = useStudentCoursesData();

    if (isLoading || refetchLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading courses.</div>;
    }

    // Guard clause to ensure data exists
    if (!data?.data) {
        return <div>No courses available.</div>;
    }

    const courses = data.data;

    const rawId = params.id || params.courseId || params['[id]'];
    const courseId = parseInt(rawId as string);
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
        return notFound();
    }

    // Extract content based on actual data structure
    const allContent = course.modules?.flatMap((m) => m.content || []) || [];

    const videos = allContent.filter((c) => c.contentType === 'video');
    const textContent = allContent.filter((c) => c.contentType === 'text');
    const quizzes = allContent.filter((c) => c.contentType === 'quiz');
    const documents = allContent.flatMap((c) => c.resources || []);
    const assignments: any[] = []; // Not in current data structure

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BookOpen },
        { id: 'videos', label: 'Videos', icon: Video, count: videos.length },
        { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
        { id: 'quizzes', label: 'Quizzes', icon: ClipboardList, count: quizzes.length },
        { id: 'assignments', label: 'Assignments', icon: BarChart, count: assignments.length },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
                <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="text-sm px-3 py-1">
                                    {course.level}
                                </Badge>
                                <div className="flex items-center text-muted-foreground text-sm">
                                    <Clock className="h-4 w-4 mr-1.5" />
                                    {course.duration} hours
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                                {course.title}
                            </h1>
                            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-3xl">
                                {course.description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 lg:items-end">
                            <EditCourseModal
                                course={course}
                                onSuccess={() => {
                                    refetch();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b bg-card">
                <div className="container mx-auto px-4 sm:px-6 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-background">
                            <div className="text-2xl font-bold text-primary">
                                {course.modules?.length || 0}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Modules</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-background">
                            <div className="text-2xl font-bold text-primary">{videos.length}</div>
                            <div className="text-sm text-muted-foreground mt-1">Videos</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-background">
                            <div className="text-2xl font-bold text-primary">
                                {documents.length}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Documents</div>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-background">
                            <div className="text-2xl font-bold text-primary">{quizzes.length}</div>
                            <div className="text-sm text-muted-foreground mt-1">Quizzes</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex gap-1 overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'border-primary text-primary font-medium'
                                            : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                    {tab.count !== undefined && (
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-lg border">
                            <h2 className="text-2xl font-bold mb-4">Course Overview</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        <div>
                            <Header
                                title="Manage Modules"
                                description="Add, edit, and manage course modules"
                            />
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between"></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-medium">Module List</h3>
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-sm text-muted-foreground">
                                                        View and manage course modules
                                                    </p>
                                                    <AddModuleModal
                                                        courseId={course.id}
                                                        onSuccess={() => {
                                                            refetch();
                                                            refetchData();
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {course.modules && course.modules.length > 0 && (
                                                <div className="bg-card p-6 rounded-lg border">
                                                    <h2 className="text-2xl font-bold mb-4">
                                                        Course Modules
                                                    </h2>
                                                    <div className="space-y-3">
                                                        {course.modules.map((module, index) => (
                                                            <Link
                                                                key={module.id}
                                                                href={`/courses/${course.id}/content/${module.id}`}
                                                                className="block p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
                                                            >
                                                                <div className="flex items-start gap-4">
                                                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                                        {index + 1}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <h3 className="font-semibold">
                                                                            {module.title}
                                                                        </h3>
                                                                        {module.description && (
                                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                                {module.description}
                                                                            </p>
                                                                        )}
                                                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="h-3 w-3" />
                                                                                {module.duration}{' '}
                                                                                hours
                                                                            </span>
                                                                            <span>
                                                                                {module.content
                                                                                    ?.length ||
                                                                                    0}{' '}
                                                                                items
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Video Lectures</h2>
                        {videos.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {videos.map((video) => (
                                    <div
                                        key={video.id}
                                        className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-video bg-muted flex items-center justify-center">
                                            <Video className="h-12 w-12 text-muted-foreground" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold line-clamp-2">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {video.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card border rounded-lg">
                                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No videos available yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Course Documents</h2>
                        {documents.length > 0 ? (
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded">
                                                    <FileText className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">{doc.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {doc.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" asChild>
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card border rounded-lg">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No documents available yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'quizzes' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Quizzes & Assessments</h2>
                        {quizzes.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {quizzes.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <ClipboardList className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg">
                                                    {quiz.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {quiz.description}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    {quiz.quizQuestions?.length || 0} questions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card border rounded-lg">
                                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No quizzes available yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'assignments' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Assignments</h2>
                        {assignments.length > 0 ? (
                            <div className="space-y-4">
                                {assignments.map((assignment, index) => (
                                    <div
                                        key={index}
                                        className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-primary/10 rounded-lg">
                                                    <BarChart className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {assignment.title ||
                                                            `Assignment ${index + 1}`}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Due: {assignment.dueDate || 'No deadline'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-card border rounded-lg">
                                <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">
                                    No assignments available yet
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
