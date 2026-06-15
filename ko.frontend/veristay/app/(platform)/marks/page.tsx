'use client';

import { useAppSelector } from '@/app/store/store';
import EnrollmentCard from '@/components/enrollment/enrollment-card';
import Header from '@/components/shared/header';
import Subheading from '@/components/shared/subheading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Award,
    BookOpen,
    Calendar,
    CheckCircle2,
    ClipboardList,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import Loading from '../loading';
import { useGetStudentMarksQuery } from '@/app/errors/coursesApi';

export interface StudentMarkDto {
    id: number;
    courseMaterialId: number;
    applicationUserId: string;
    score: number;
    isPass: boolean;
    dateCreated: string;
    dateModified: string;
    isCourseCompleted: boolean;
    courseMaterialTitle: string;
    studentName: string;
}

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
};

const getScoreBadgeVariant = (
    score: number
): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
};

const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-400';
    return 'bg-red-500';
};

const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-ZA', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

const MarkCard = ({ mark }: { mark: StudentMarkDto }) => {
    const roundedScore = Math.round(mark.score * 10) / 10;

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 border border-border/60">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <ClipboardList className="h-4 w-4 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                            {mark.courseMaterialTitle}
                        </h3>
                    </div>
                    <Badge
                        variant={getScoreBadgeVariant(roundedScore)}
                        className="shrink-0 text-xs"
                    >
                        {roundedScore >= 60 ? 'Pass' : 'Fail'}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Score Display */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Score</p>
                        <p className={`text-3xl font-bold ${getScoreColor(roundedScore)}`}>
                            {roundedScore}
                            <span className="text-base font-normal text-muted-foreground">%</span>
                        </p>
                    </div>
                    {roundedScore >= 80 ? (
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-80" />
                    ) : roundedScore >= 60 ? (
                        <Award className="h-8 w-8 text-amber-500 opacity-80" />
                    ) : (
                        <XCircle className="h-8 w-8 text-red-400 opacity-80" />
                    )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(roundedScore)}`}
                            style={{ width: `${Math.min(roundedScore, 100)}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>Pass: 60%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-border/50">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(mark.dateCreated)}</span>
                    {mark.isCourseCompleted && (
                        <>
                            <span className="mx-1">·</span>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            <span className="text-emerald-600">Course Completed</span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const StudentMarks = () => {
    const userId = useAppSelector((state) => state.userAuthStore?.id);
    const { data: marks, isLoading, isError } = useGetStudentMarksQuery(userId ?? '');

    if (isLoading) return <Loading />;
    if (isError) return <div>Error loading marks</div>;

    const allMarks: StudentMarkDto[] = marks ?? [];

    // Statistics
    const totalAttempts = allMarks.length;
    const passedAttempts = allMarks.filter((m) => Math.round(m.score) >= 60).length;
    const avgScore =
        totalAttempts > 0
            ? Math.round(allMarks.reduce((sum, m) => sum + m.score, 0) / totalAttempts)
            : 0;
    const highestScore =
        totalAttempts > 0 ? Math.round(Math.max(...allMarks.map((m) => m.score))) : 0;

    // Group by quiz title to show latest attempt first per quiz
    const groupedByQuiz = allMarks.reduce<Record<string, StudentMarkDto[]>>((acc, mark) => {
        const key = mark.courseMaterialTitle;
        if (!acc[key]) acc[key] = [];
        acc[key].push(mark);
        return acc;
    }, {});

    // Unique quizzes (latest attempt)
    const latestAttempts = Object.values(groupedByQuiz).map(
        (attempts) =>
            attempts.sort(
                (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
            )[0]
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <Header
                title="My Marks"
                description="Track your quiz performance and academic progress"
            />

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <EnrollmentCard
                    title="Total Attempts"
                    totalNumber={totalAttempts}
                    icon={ClipboardList}
                    color="blue"
                />
                <EnrollmentCard
                    title="Quizzes Passed"
                    totalNumber={passedAttempts}
                    icon={CheckCircle2}
                    color="green"
                />
                <EnrollmentCard
                    title="Average Score"
                    totalNumber={avgScore}
                    icon={TrendingUp}
                    color="yellow"
                />
                <EnrollmentCard
                    title="Highest Score"
                    totalNumber={highestScore}
                    icon={Award}
                    color="green"
                />
            </div>

            {/* Latest Attempts Per Quiz */}
            <section>
                <Subheading
                    title="Quiz Results"
                    description="Your most recent attempt for each quiz"
                />
                {latestAttempts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {latestAttempts.map((mark) => (
                            <MarkCard key={`latest-${mark.courseMaterialId}`} mark={mark} />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                            <BookOpen className="h-12 w-12 mb-4 opacity-50" />
                            <h3 className="font-medium mb-2">No Quiz Attempts Yet</h3>
                            <p className="text-sm">
                                Complete quizzes in your enrolled courses to see your marks here.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* Full Attempt History */}
            {allMarks.length > 0 && (
                <section>
                    <Subheading
                        title="Attempt History"
                        description="All your quiz attempts in chronological order"
                    />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...allMarks]
                            .sort(
                                (a, b) =>
                                    new Date(b.dateCreated).getTime() -
                                    new Date(a.dateCreated).getTime()
                            )
                            .map((mark) => (
                                <MarkCard key={mark.id} mark={mark} />
                            ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default StudentMarks;
