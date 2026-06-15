'use client';

import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Activity,
    BarChart,
    BarChart3,
    BookOpen,
    Clock,
    DollarSign,
    Eye,
    GraduationCap,
    Search,
    Settings,
    Trophy,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { CoursePayment, mockStudents } from '../billing/data';

import { useAppSelector } from '@/app/store/store';
import { enrollments } from '../data/enrollments';

const AdminCoursesPage = () => {
    const courses = useAppSelector((state) => state.coursesStore.courses);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'draft'>(
        'all'
    );
    const [levelFilter, setLevelFilter] = useState<
        'all' | 'beginner' | 'intermediate' | 'advanced'
    >('all');

    // Calculate comprehensive system-wide statistics
    const totalCourses = courses.length;
    const activeCourses = courses.filter((course) => course.status === 'published').length;
    const draftCourses = courses.filter((course) => course.status === 'draft').length;
    const totalStudents = mockStudents.length;
    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter((e) => e.status === 'active').length;
    const completedEnrollments = enrollments.filter((e) => e.status === 'completed').length;
    const averageProgress = Math.round(
        enrollments.reduce((acc, curr) => acc + curr.progress, 0) / (enrollments.length || 1)
    ).toPrecision(4);

    // Course completion and engagement rates
    const completionRate = Math.round((completedEnrollments / totalEnrollments) * 100).toPrecision(
        4
    );

    // Revenue and financial metrics (mock data)
    const totalRevenue = mockStudents.reduce(
        (sum, student) =>
            sum +
            student.coursePayments.reduce(
                (courseSum: number, payment: CoursePayment) => courseSum + payment.amount,
                0
            ),
        0
    );
    const averageRevenuePerStudent = Math.round(totalRevenue / totalStudents);

    // Course-specific detailed statistics
    const courseStats = courses.map((course) => {
        const courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
        const activeEnrollments = courseEnrollments.filter((e) => e.status === 'active');
        const completedEnrollments = courseEnrollments.filter((e) => e.status === 'completed');
        const avgProgress =
            courseEnrollments.length > 0
                ? Math.round(
                      courseEnrollments.reduce((acc, curr) => acc + curr.progress, 0) /
                          courseEnrollments.length
                  )
                : 0;

        // Calculate revenue for this course
        const courseRevenue = mockStudents.reduce((sum, student) => {
            return (
                sum +
                student.coursePayments
                    .filter((payment: CoursePayment) => payment.courseName.includes(course.title))
                    .reduce(
                        (paymentSum: number, payment: CoursePayment) => paymentSum + payment.amount,
                        0
                    )
            );
        }, 0);

        return {
            ...course,
            totalEnrollments: courseEnrollments.length,
            activeEnrollments: activeEnrollments.length,
            completedEnrollments: completedEnrollments.length,
            averageProgress: avgProgress,
            completionRate:
                courseEnrollments.length > 0
                    ? Math.round(
                          (completedEnrollments.length / courseEnrollments.length) * 100
                      ).toPrecision(4)
                    : 0,
            revenue: courseRevenue,
            averageRating: course.rating || 0,
            enrollmentTrend: '+12%', // Mock trend data
        };
    });

    // Filter courses based on search and filters
    const filteredCourses = courseStats.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
        const matchesLevel = levelFilter === 'all' || course.level.toLowerCase() === levelFilter;

        return matchesSearch && matchesStatus && matchesLevel;
    });

    const handleViewCourse = (courseId: number) => {
        window.open(`/courses/${courseId}`, '_blank');
    };

    const handleManageCourse = (courseId: number) => {
        console.log('Managing course:', courseId);
        // In a real app, this would open course management interface
    };

    const handleViewAnalytics = (courseId: number) => {
        console.log('Viewing analytics for course:', courseId);
        // In a real app, this would open detailed analytics
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <Header
                title="Course Management"
                description="Manage and analyze all platform courses"
            />
            {/* Primary Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <EnrollmentCard
                    title="Total Courses"
                    totalNumber={totalCourses}
                    icon={BookOpen}
                    color="blue"
                />
                <EnrollmentCard
                    title="Active Courses"
                    totalNumber={activeCourses}
                    icon={GraduationCap}
                    color="green"
                />
                <EnrollmentCard
                    title="Average Progress"
                    totalNumber={averageProgress}
                    icon={BarChart}
                    color="red"
                />
                <EnrollmentCard
                    title="Total Students"
                    totalNumber={totalStudents}
                    icon={Users}
                    color="purple"
                />
                <EnrollmentCard
                    title="Total Revenue"
                    totalNumber={totalRevenue}
                    icon={DollarSign}
                    color="orange"
                />
            </div>

            {/* Secondary Statistics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
                <EnrollmentCard
                    title="Active Enrollments"
                    totalNumber={activeEnrollments}
                    icon={Activity}
                    color="cyan"
                />
                <EnrollmentCard
                    title="Completion Rate"
                    totalNumber={completionRate}
                    icon={Trophy}
                    color="emerald"
                />
                <EnrollmentCard
                    title="Average Progress"
                    totalNumber={averageProgress}
                    icon={BarChart}
                    color="red"
                />
            </div>
            {/* Course Management */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Course Analytics & Management
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Detailed performance metrics and management tools for all courses
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={(value: any) => setStatusFilter(value)}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={levelFilter}
                            onValueChange={(value: any) => setLevelFilter(value)}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="relative">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg line-clamp-1">
                                            {course.title}
                                        </CardTitle>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline">{course.level}</Badge>
                                            <Badge
                                                variant={
                                                    course.status === 'published'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {course.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">
                                            R{course.revenue.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Revenue</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {course.description}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Enrollment Statistics */}
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <div className="text-center">
                                            <p className="font-medium">{course.totalEnrollments}</p>
                                            <p className="text-muted-foreground">Total</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">
                                                {course.activeEnrollments}
                                            </p>
                                            <p className="text-muted-foreground">Active</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-medium">
                                                {course.completedEnrollments}
                                            </p>
                                            <p className="text-muted-foreground">Completed</p>
                                        </div>
                                    </div>

                                    {/* Progress and Metrics */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Average Progress</span>
                                            <span>{course.averageProgress}%</span>
                                        </div>
                                        <Progress value={course.averageProgress} />

                                        <div className="flex justify-between text-sm">
                                            <span>Completion Rate</span>
                                            <span className="font-medium">
                                                {course.completionRate}%
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <span>Rating</span>
                                            <span className="font-medium">
                                                ★ {course.averageRating}/5
                                            </span>
                                        </div>
                                    </div>

                                    {/* Course Info */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-1" />
                                            {course.modules.length} Modules
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1" />
                                            {course.duration}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewCourse(course.id)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewAnalytics(course.id)}
                                        >
                                            <BarChart3 className="h-4 w-4 mr-1" />
                                            Analytics
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleManageCourse(course.id)}
                                        >
                                            <Settings className="h-4 w-4 mr-1" />
                                            Manage
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminCoursesPage;
