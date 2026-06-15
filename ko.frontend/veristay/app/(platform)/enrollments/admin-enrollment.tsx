'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Users, GraduationCap, BookOpen, TrendingUp, UserPlus, Eye, UserMinus } from 'lucide-react';
import { CoursePayment, mockStudents } from '../billing/data';

import Link from 'next/link';
import { useAppSelector } from '@/app/store/store';
import { StudentModel } from '@/app/api/model/students-model';

const AdminEnrollmentPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<StudentModel | null>(null);
    const courses = useAppSelector((state) => state.coursesStore.courses);

    // Calculate statistics
    const totalStudents = mockStudents.length;
    const activeStudents = mockStudents.filter((s) =>
        s.coursePayments.some((p: { status: string }) => p.status === 'paid')
    ).length;
    const totalEnrollments = mockStudents.reduce(
        (sum, student) => sum + student.coursePayments.length,
        0
    );
    const completionRate = Math.round(
        (mockStudents.filter((s) =>
            s.coursePayments.some((p: { status: string }) => p.status === 'paid')
        ).length /
            totalStudents) *
            100
    ).toPrecision(4);

    // Filter students based on search
    const filteredStudents = mockStudents.filter(
        (student) =>
            student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.psiraNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEnrollStudent = (studentId: string, courseId: number) => {
        console.log(`Enrolling student ${studentId} in course ${courseId}`);
        // In a real app, this would make an API call
    };

    const handleRemoveStudent = (studentId: string) => {
        console.log(`Removing student ${studentId}`);
        // In a real app, this would make an API call
    };

    const handleViewProfile = (studentId: string) => {
        window.open(`/students/${studentId}`, '_blank');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">
                        System Enrollment Management
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Manage all student enrollments and course assignments across the platform
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Students
                                    </p>
                                    <p className="text-2xl font-bold">{totalStudents}</p>
                                </div>
                                <div className="ml-auto p-2 bg-blue-50 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Active Students
                                    </p>
                                    <p className="text-2xl font-bold">{activeStudents}</p>
                                </div>
                                <div className="ml-auto p-2 bg-green-50 rounded-lg">
                                    <GraduationCap className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Enrollments
                                    </p>
                                    <p className="text-2xl font-bold">{totalEnrollments}</p>
                                </div>
                                <div className="ml-auto p-2 bg-purple-50 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Completion Rate
                                    </p>
                                    <p className="text-2xl font-bold">{completionRate}%</p>
                                </div>
                                <div className="ml-auto p-2 bg-orange-50 rounded-lg">
                                    <TrendingUp className="h-5 w-5 text-orange-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Student Management */}
            <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Student Management</h2>
                    <p className="mt-2 text-muted-foreground">
                        View all students and manage their course enrollments
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    {/* Students List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    All Students
                                </div>
                                <Link href="/admin/students/new">
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
                                            key={student.id}
                                            className={`w-full p-3 rounded-lg border cursor-pointer transition-colors text-left ${
                                                selectedStudent?.id === student.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                            onClick={() => setSelectedStudent(student)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">
                                                        {student.firstName} {student.lastName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        ID: {student.id}
                                                    </p>
                                                    {student.psiraNumber && (
                                                        <p className="text-sm text-muted-foreground">
                                                            PSiRA: {student.psiraNumber}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge variant="outline">
                                                    {student.coursePayments.length} course
                                                    {student.coursePayments.length !== 1 ? 's' : ''}
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
                                    <CardTitle>
                                        {selectedStudent.firstName} {selectedStudent.lastName}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Student ID: {selectedStudent.id} | PSiRA:{' '}
                                        {selectedStudent.psiraNumber}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleViewProfile(selectedStudent.id)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Profile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveStudent(selectedStudent.id)}
                                    >
                                        <UserMinus className="h-4 w-4 mr-2" />
                                        Remove
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Enroll in New Course */}
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium mb-3">Enroll in New Course</h4>
                                        <div className="flex gap-2">
                                            <Select>
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
                                                onClick={() =>
                                                    handleEnrollStudent(
                                                        selectedStudent.id,
                                                        courses[0]?.id //todo: whats this?
                                                    )
                                                }
                                            >
                                                Enroll
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Current Enrollments */}
                                    <div>
                                        <h4 className="font-medium mb-3">Current Enrollments</h4>
                                        <div className="space-y-3">
                                            {selectedStudent.coursePayments.map(
                                                (payment: CoursePayment) => (
                                                    <div
                                                        key={payment.id}
                                                        className="p-3 border rounded-lg"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">
                                                                    {payment.courseName}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    PSiRA Grade | Amount: R
                                                                    {payment.amount}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {(() => {
                                                                    let variant:
                                                                        | 'default'
                                                                        | 'secondary'
                                                                        | 'destructive' = 'default';
                                                                    if (
                                                                        payment.status === 'pending'
                                                                    )
                                                                        variant = 'secondary';
                                                                    else if (
                                                                        payment.status !== 'paid'
                                                                    )
                                                                        variant = 'destructive';
                                                                    return (
                                                                        <Badge variant={variant}>
                                                                            {payment.status}
                                                                        </Badge>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                                <Users className="h-8 w-8 mb-4" />
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

export default AdminEnrollmentPage;
