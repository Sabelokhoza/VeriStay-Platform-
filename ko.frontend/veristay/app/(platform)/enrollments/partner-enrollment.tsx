'use client';

import EnrollmentCard from '@/components/enrollment/enrollment-card';
import PartnerEnrollmentCard from '@/components/enrollment/partner-enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Component, Eye, FileText, GraduationCap, TrendingUp, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAppSelector } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import BaseCard from '@/components/shared/base-card';
import { useGetCourseEnrollmentStatisticsQuery } from '@/app/errors/trainingCenterApi';
import Loading from '../loading';
import { useAddCourseEnrollmentMutation } from '@/app/errors/coursesApi';
import { toast } from 'react-toastify';
import { addEnrollmentDto, StudentDetailsModel } from '@/app/api/dtos/dtos';

const PartnerEnrollmentPage = () => {
    const router = useRouter();
    const courses = useAppSelector((state) => state.coursesStore.courses);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentDetailsModel | null>(null);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [addCourseEnrollment, { isLoading: isAddingEnrollment }] =
        useAddCourseEnrollmentMutation();

    const selectedCentreId = useAppSelector((state) => state.trainingCentreStore?.selectedCentreId);
    const { data, isLoading, error, refetch } = useGetCourseEnrollmentStatisticsQuery(
        selectedCentreId || 0
    );

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500">Error loading data.</div>;
    }

    const enrollmentStats = data?.data || {
        totalStudents: 0,
        activeStudents: 0,
        completionRate: 0,
        totalEnrollments: 0,
        courseEnrollmentStatistics: [],
        students: [],
    };

    // Filter students for this partner (in a real app, this would be based on the partner's institution)
    const partnerStudents = enrollmentStats?.students || [];

    // Filter students based on search
    const filteredStudents = partnerStudents.filter(
        (student) =>
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.psiraNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEnrollStudent = async (studentId: string, courseId: number) => {
        console.log(`Enrolling student ${studentId} in course ${courseId}`);
        try {
            const enrollmentData: addEnrollmentDto = {
                applicationUserId: studentId,
                courseId: courseId,
            };

            const result = await addCourseEnrollment(enrollmentData).unwrap();

            // Success handling
            if (result.success) {
                toast.success('Successfully enrolled in the course!');
                refetch();
            }
        } catch (error: any) {
            // Error handling
            console.error('Enrollment failed:', error);
            const errorMessage =
                error?.data?.message || 'Failed to enroll in course. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleViewProfile = (studentId: string) => {
        router.push(`/student/${studentId}`);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <section>
                <Header
                    title={'Institution Enrollment Management'}
                    description={"Manage institution's student enrollments and course assignments"}
                />

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <EnrollmentCard
                        title={'Total Students'}
                        totalNumber={enrollmentStats.totalStudents || 0}
                        icon={Users}
                        color={'blue'}
                    />
                    <EnrollmentCard
                        title={'Active Students'}
                        totalNumber={enrollmentStats.activeStudents || 0}
                        icon={GraduationCap}
                        color={'green'}
                    />
                    <EnrollmentCard
                        title={'Completion Rate'}
                        totalNumber={enrollmentStats.completionRate || 0}
                        icon={TrendingUp}
                        color={'red'}
                    />
                    <EnrollmentCard
                        title={'Total Enrollments'}
                        totalNumber={enrollmentStats.totalEnrollments || 0}
                        icon={Component}
                        color={'yellow'}
                    />
                </div>
            </section>

            {/* Course Enrollment Statistics */}
            <section>
                <BaseCard>
                    <Subheading
                        title={'Course Enrollment Statistics'}
                        description={'Overview of enrollment status for each course'}
                    />

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {enrollmentStats.courseEnrollmentStatistics?.map((course) => (
                            <PartnerEnrollmentCard key={course.courseId} course={course} />
                        ))}
                    </div>
                </BaseCard>
            </section>

            {/* Student Management */}
            <section>
                <Subheading
                    title={'Student Management'}
                    description={'View and manage student enrollments'}
                />

                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    {/* Students List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Your Students
                                </div>
                                <Link href="/student">
                                    <Button size="sm">
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Add Student
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Search by name, ID or PSiRA number"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredStudents.map((student) => (
                                        <button
                                            key={student.userId}
                                            className={`w-full p-3 rounded-lg border cursor-pointer transition-colors text-left ${
                                                selectedStudent?.userId === student.userId
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        {student.fullName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        ID: {student.userId}
                                                    </p>
                                                    {student.psiraNo && (
                                                        <p className="text-sm text-muted-foreground">
                                                            PSiRA: {student.psiraNo}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge variant="outline">
                                                    {student.coursesCount} course
                                                    {student.coursesCount !== 1 ? 's' : ''}
                                                </Badge>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student Details */}
                    {selectedStudent ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{selectedStudent.fullName}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Student ID: {selectedStudent.userId} | PSiRA:{' '}
                                        {selectedStudent.psiraNo}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewProfile(selectedStudent.userId)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Profile
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Enroll in New Course */}
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-3">Enroll in New Course</h4>
                                        <div className="flex gap-2">
                                            <Select
                                                value={selectedCourseId}
                                                onValueChange={setSelectedCourseId}
                                            >
                                                <SelectTrigger className="flex-1">
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {courses.map((course) => (
                                                        <SelectItem
                                                            key={course.id}
                                                            value={course.id.toString()}
                                                        >
                                                            {course.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                onClick={() => {
                                                    if (selectedCourseId) {
                                                        handleEnrollStudent(
                                                            selectedStudent.userId,
                                                            parseInt(selectedCourseId)
                                                        );
                                                        setSelectedCourseId(''); // Reset after enrollment
                                                    }
                                                }}
                                                disabled={!selectedCourseId}
                                            >
                                                {isAddingEnrollment ? 'Enrolling...' : 'Enroll'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Current Enrollments */}
                                    <div>
                                        <h4 className="font-medium mb-3">Current Enrollments</h4>
                                        <div className="space-y-3">
                                            {selectedStudent.enrollments?.map((enrollment) => (
                                                <div
                                                    key={enrollment.courseId}
                                                    className="p-3 border rounded-lg"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">
                                                                {enrollment.title}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                PSiRA Grade | Amount: R
                                                                {enrollment.amount}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={
                                                                    enrollment.status === 'pending'
                                                                        ? 'secondary'
                                                                        : enrollment.status ===
                                                                            'paid'
                                                                          ? 'default'
                                                                          : 'destructive'
                                                                }
                                                            >
                                                                {enrollment.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                                <FileText className="h-8 w-8 mb-4" />
                                <h3 className="font-medium mb-2">No Student Selected</h3>
                                <p className="text-sm">
                                    Select a student from the list to view their enrollment details
                                    and manage their courses.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PartnerEnrollmentPage;
