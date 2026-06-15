'use client';
import { useStudentCoursesData } from '@/app/(platform)/data';
import Loading from '@/app/(platform)/loading';
import { useAppSelector } from '@/app/store/store';
import { PartnerModuleEditor } from '@/components/course/partner-module-editor';
import { StudentModuleViewer } from '@/components/course/student-module-viewer';
import { Button } from '@/components/ui/button';
import { Role, useUser } from '@/hooks/use-user';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { use } from 'react';

export default function ModuleContentPage({
    params,
}: Readonly<{
    params: Promise<{ courseId: number; moduleId: number }>;
}>) {
    // Unwrap the params Promise
    const { courseId, moduleId } = use(params);

    const user = useUser();
    const router = useRouter();
    const { courses, isLoading, refetch } = useStudentCoursesData();

    if (isLoading) {
        return <Loading />;
    }
    const course = courses.find((c) => c.id == courseId);
    const courseModule = course?.modules.find((m) => m.id == moduleId);

    if (!course || !courseModule) {
        notFound();
    }

    const currentModuleIndex = course.modules.findIndex((m) => m.id == moduleId);
    const nextModule = course.modules[currentModuleIndex + 1];
    const previousModule = course.modules[currentModuleIndex - 1];

    // Mock progress - replace with actual progress tracking
    const progress = Number.parseFloat(
        (((currentModuleIndex + 1) / course.modules.length) * 100).toPrecision(4)
    );

    const isInstructor = user.role === Role.Partner || user.role === Role.Admin;

    const handleModuleSave = async (moduleData: any) => {
        // TODO: Implement module saving logic
        console.log('Saving module:', moduleData);
    };

    const handleModuleComplete = async () => {
        // TODO: Implement module completion logic
        console.log('Module completed');
    };

    const handleNext = () => {
        if (nextModule) {
            router.push(`/courses/${course.id}/content/${nextModule.id}`);
        }
    };

    const handlePrevious = () => {
        if (previousModule) {
            router.push(`/courses/${course.id}/content/${previousModule.id}`);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/courses`}>
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Course
                    </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                    Module {currentModuleIndex + 1} of {course.modules.length}
                </span>
            </div>
            {isInstructor ? (
                <PartnerModuleEditor
                    moduleId={moduleId}
                    initialData={courseModule.content[0]} //todo: adjust for multiple content items
                    onSave={handleModuleSave}
                    courseId={course.id}
                />
            ) : (
                <StudentModuleViewer
                    module={courseModule}
                    onNext={nextModule ? handleNext : undefined}
                    onPrevious={previousModule ? handlePrevious : undefined}
                    onComplete={handleModuleComplete}
                    progress={progress}
                    courseMaterialId={0}
                    applicationUserId={''}
                />
            )}
        </div>
    );
}
