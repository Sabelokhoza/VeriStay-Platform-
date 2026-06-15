'use client';

import { CourseCard } from '@/components/course/course-card';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import EnrollmentCurrent from '@/components/enrollment/enrollment-current';
import { EnrollmentModal } from '@/components/enrollment/enrollment-modal';
import { LearningPathCard } from '@/components/learning-path/learning-path-card';
import { LearningPathModal } from '@/components/learning-path/learning-path-modal';
import Header from '@/components/shared/header';
import SharedCard from '@/components/shared/shared-card';
import Subheading from '@/components/shared/subheading';

import { BookIcon, BookOpen, Clock, GraduationCap } from 'lucide-react';
import { useState } from 'react';
import { useAppSelector } from '@/app/store/store';
import { useStudentEnrollmentsQuery } from '@/app/errors/studentApi';
import Loading from '../loading';

const StudentEnrollmentPage = () => {
    const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState<(typeof learningPaths)[0] | null>(null);

    const courses = useAppSelector((state) => state.coursesStore.courses);
    const learningPaths = useAppSelector((state) => state.learningPathsStore.learningPaths);
    const trainingCenters = useAppSelector((state) => state.trainingCentreStore.trainingCentres);
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const { data: enrollmentsData, isLoading, error } = useStudentEnrollmentsQuery(userId);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading enrollments: {JSON.stringify(error)}</div>;
    }

    const activeCourses = enrollmentsData?.data?.activeCourse ?? null;

    const handleEnroll = (courseId: string) => {
        setSelectedCourse(Number(courseId));
        setIsEnrollmentModalOpen(true);
    };

    const handleViewPath = (path: (typeof learningPaths)[0]) => {
        setSelectedPath(path);
    };

    const selectedCourseData = selectedCourse
        ? courses.find((course) => course.id === selectedCourse)
        : null;

    // Calculate student statistics
    const totalEnrollments = enrollmentsData.data?.totalEnrollments || 0;
    const activeEnrollments = activeCourses ? 1 : 0;
    const completedCourses = enrollmentsData.data?.certificationEarned || 0;
    const averageProgress = enrollmentsData.data?.averageProgress || 0;
    const hasActiveCourse = enrollmentsData.data?.hasActiveCourse ? 1 : 0;

    return (
        <div className="space-y-8">
            {/* Student Progress Overview */}
            <Header
                title="Enrollments"
                description="Track your progress and explore new learning opportunities"
            />

            {/* Statistics Cards */}
            <SharedCard
                title={'Enrollment Statistics'}
                description={'Overview of your enrollment status'}
                className="grid gap-4 md:grid-cols-4 mb-8"
            >
                <EnrollmentCard
                    title="Total Enrollments"
                    totalNumber={totalEnrollments}
                    icon={BookIcon}
                    color={'blue'}
                />
                <EnrollmentCard
                    title="Active Courses"
                    totalNumber={hasActiveCourse}
                    icon={BookOpen}
                    color={'yellow'}
                />
                <EnrollmentCard
                    title="Completed Courses"
                    totalNumber={completedCourses}
                    icon={GraduationCap}
                    color={'green'}
                />
                <EnrollmentCard
                    title="Average Progress"
                    totalNumber={averageProgress.toPrecision(4)}
                    icon={Clock}
                    color={'red'}
                />
            </SharedCard>

            {/* Current Enrollments */}
            <section>
                <Subheading
                    title={'Current Enrollments'}
                    description={'Continue your active courses and track your progress'}
                />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activeCourses && (
                        <EnrollmentCurrent
                            key={activeCourses?.id}
                            courseName={activeCourses?.courseName || 'N/A'}
                            status={'paid'}
                            amount={activeCourses?.price || 0}
                            progress={averageProgress}
                        />
                    )}
                </div>
            </section>
            {/* Learning Paths */}
            <section id="learning-paths">
                <Subheading
                    title={'Available Learning Paths'}
                    description={'Discover structured paths to achieve your learning goals'}
                />

                <SharedCard
                    title={'Learning Paths'}
                    description={'Explore curated learning paths to guide your studies'}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {learningPaths.map((path) => (
                        <LearningPathCard
                            key={path.id}
                            path={path}
                            courses={courses}
                            onViewPath={handleViewPath}
                        />
                    ))}
                </SharedCard>
            </section>

            {/* Individual Courses */}
            <section id="courses">
                <Subheading
                    title={'Available Enrollments'}
                    description={'Select courses to enhance your skills and knowledge'}
                />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const center = trainingCenters.find(
                            (c) => c.id === course.trainingCenterId
                        );
                        return (
                            <CourseCard
                                key={course.id}
                                course={{
                                    ...course,
                                    id: course.id.toString(),
                                    trainingCenter: center!,
                                }}
                                onEnroll={handleEnroll}
                            />
                        );
                    })}
                </div>
            </section>
            {selectedCourseData && (
                <EnrollmentModal
                    isOpen={isEnrollmentModalOpen}
                    onClose={() => setIsEnrollmentModalOpen(false)}
                    course={{
                        ...selectedCourseData,
                        id: selectedCourseData.id.toString(),
                        trainingCenter: trainingCenters.find(
                            (c) => c.id === selectedCourseData.trainingCenterId
                        )!,
                    }}
                />
            )}

            {selectedPath && (
                <LearningPathModal
                    isOpen={true}
                    onClose={() => setSelectedPath(null)}
                    path={selectedPath}
                    allCourses={courses}
                    onConfirm={function (selectedCourses: number[]): void {
                        throw new Error('Function not implemented.');
                    }}
                />
            )}
        </div>
    );
};

export default StudentEnrollmentPage;
