'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLazyGetSignedUrlQuery } from '@/app/errors/filesApi';
import { useAddStudentQuizAttemptMutation } from '@/app/errors/studentApi';
import { useAppSelector } from '@/app/store/store';
import { toast } from 'react-toastify';
import { CongratulationModal } from '../congatulation-modal';
import Loading from '@/app/(platform)/loading';

interface QuizQuestion {
    id: number;
    question: string;
    questionType: 'TrueFalse' | 'MultipleChoice';
    correctAnswer: boolean | null;
    answers?:
        | {
              id: number;
              answerText: string;
              isCorrect: boolean;
          }[]
        | null;
}

interface StudentModuleViewerProps {
    module: any;
    onNext?: () => void;
    onPrevious?: () => void;
    onComplete?: () => void;
    progress?: number;
    courseMaterialId: number;
    applicationUserId: string;
}

export function StudentModuleViewer({
    module,
    onNext,
    onPrevious,
    onComplete,
    progress = 0,
}: StudentModuleViewerProps) {
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [showingResults, setShowingResults] = useState(false);
    const [isCongratulationOpen, setIsCongratulationOpen] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [activeContentIndex, setActiveContentIndex] = useState(0);
    const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set());
    // Tracks the IDs of all quiz content items the student has passed
    const [passedQuizIds, setPassedQuizIds] = useState<Set<number>>(new Set());
    const userId = useAppSelector((state) => state.userAuthStore?.id);

    const PASS_MARK = 60;

    const [addQuizAttempt, { isLoading: isSubmittingQuiz }] = useAddStudentQuizAttemptMutation();
    const [getSignedUrl] = useLazyGetSignedUrlQuery();

    // Sort order: text → video → quiz
    const CONTENT_ORDER: Record<string, number> = { text: 0, video: 1, Video: 1, quiz: 2 };
    const sortedContent: any[] = [...(module.content ?? [])].sort(
        (a, b) => (CONTENT_ORDER[a.type] ?? 99) - (CONTENT_ORDER[b.type] ?? 99)
    );

    const currentContent = sortedContent[activeContentIndex];
    const isQuizContent = currentContent?.type === 'quiz';
    const isVideoContent = currentContent?.type === 'video' || currentContent?.type === 'Video';
    const isTextContent = currentContent?.type === 'text';

    // All content items that are quizzes
    const allQuizContents: any[] = sortedContent.filter((c: any) => c.type === 'quiz');

    // The student may proceed to the next module only when every quiz has been passed
    const allQuizzesPassed =
        allQuizContents.length > 0 && allQuizContents.every((c: any) => passedQuizIds.has(c.id));

    const handleAnswerSelect = (questionId: number, answer: any) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
    };

    const handleRestartQuiz = () => {
        setActiveQuestionIndex(0);
        setSelectedAnswers({});
        setQuizSubmitted(false);
        setShowingResults(false);
        setQuizScore(0);
    };

    const getEmbedUrl = (url: string) => {
        if (!url) return '';

        const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

        const vimeo = url.match(/vimeo\.com\/(\d+)/);
        if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

        return url;
    };

    const handleDownload = async (filePath: string) => {
        try {
            setLoadingResources((prev) => new Set(prev).add(filePath));
            const result = await getSignedUrl(filePath).unwrap();
            if (result) {
                window.open(result, '_blank');
            }
        } catch {
            toast.error('Failed to download file');
        } finally {
            setLoadingResources((prev) => {
                const newSet = new Set(prev);
                newSet.delete(filePath);
                return newSet;
            });
        }
    };

    const handleQuizSubmit = async () => {
        if (!currentContent?.quizQuestions) return;

        let correctAnswers = 0;

        currentContent.quizQuestions.forEach((question: QuizQuestion) => {
            const userAnswer = selectedAnswers[question.id];
            if (question.questionType === 'TrueFalse') {
                if (userAnswer === question.correctAnswer) correctAnswers++;
            } else if (question.questionType === 'MultipleChoice' && question.answers) {
                const correctOption = question.answers.find((a) => a.isCorrect);
                if (correctOption && userAnswer === correctOption.id) correctAnswers++;
            }
        });

        const totalQuestions = currentContent.quizQuestions.length;
        const score = (correctAnswers / totalQuestions) * 100;
        const isPass = score >= PASS_MARK;

        try {
            const { data } = await addQuizAttempt({
                courseMaterialId: currentContent.id,
                applicationUserId: userId,
                score: score,
                isPass: isPass,
            }).unwrap();

            setQuizSubmitted(true);
            setShowingResults(true);
            setQuizScore(score);

            // Mark this specific quiz as passed so we can track overall progress
            if (isPass) {
                setPassedQuizIds((prev) => new Set(prev).add(currentContent.id));
            }

            if (data?.isCourseCompleted) {
                setIsCongratulationOpen(true);
            }

            if (isPass) {
                toast.success(`Congratulations! You passed with a score of ${score.toFixed(1)}%.`);
            } else {
                toast.error(
                    `You scored ${score.toFixed(1)}%. Pass mark is ${PASS_MARK}%. Try again!`
                );
            }

            if (isPass) onComplete?.();
        } catch {
            toast.error('Failed to submit quiz');
        }
    };

    const renderQuizQuestion = (question: QuizQuestion) => {
        if (question.questionType === 'TrueFalse') {
            return (
                <div className="space-y-2">
                    <Button
                        variant={selectedAnswers[question.id] === true ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => handleAnswerSelect(question.id, true)}
                        disabled={quizSubmitted}
                    >
                        True
                    </Button>
                    <Button
                        variant={selectedAnswers[question.id] === false ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => handleAnswerSelect(question.id, false)}
                        disabled={quizSubmitted}
                    >
                        False
                    </Button>
                </div>
            );
        }

        if (question.questionType === 'MultipleChoice' && question.answers) {
            return (
                <div className="space-y-2">
                    {question.answers.map((answer) => (
                        <Button
                            key={answer.id}
                            variant={
                                selectedAnswers[question.id] === answer.id ? 'default' : 'outline'
                            }
                            className="w-full justify-start"
                            onClick={() => handleAnswerSelect(question.id, answer.id)}
                            disabled={quizSubmitted}
                        >
                            {answer.answerText}
                        </Button>
                    ))}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{module.title}</h2>
                <div className="flex items-center gap-2">
                    {onPrevious && (
                        <Button variant="outline" size="sm" onClick={onPrevious}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                    )}
                    {onNext && (
                        <Button variant="outline" size="sm" onClick={onNext}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Module Progress</span>
                    <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} />
            </div>

            {sortedContent.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={activeContentIndex === 0}
                        onClick={() => {
                            setActiveContentIndex((prev) => prev - 1);
                            handleRestartQuiz();
                        }}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous Content
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {activeContentIndex + 1} of {sortedContent.length}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={activeContentIndex === sortedContent.length - 1}
                        onClick={() => {
                            setActiveContentIndex((prev) => prev + 1);
                            handleRestartQuiz();
                        }}
                    >
                        Next Content
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <Tabs defaultValue="content" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                    {currentContent && (
                        <>
                            <h3 className="text-lg font-semibold">{currentContent.title}</h3>
                            <p className="text-muted-foreground">{currentContent.description}</p>

                            {isVideoContent && currentContent.videoUrl && (
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="aspect-video">
                                            <iframe
                                                src={getEmbedUrl(currentContent.videoUrl)}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                frameBorder="0"
                                                title="Video"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {isTextContent && currentContent.textContent && (
                                <Card>
                                    <CardContent className="p-6 prose max-w-none">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: currentContent.textContent,
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            )}

                            {isQuizContent && currentContent.quizQuestions && (
                                <Card>
                                    <CardContent className="p-6">
                                        {!quizSubmitted ? (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-lg font-medium">
                                                        Question {activeQuestionIndex + 1} of{' '}
                                                        {currentContent.quizQuestions.length}
                                                    </h3>
                                                    <Progress
                                                        value={
                                                            ((activeQuestionIndex + 1) /
                                                                currentContent.quizQuestions
                                                                    .length) *
                                                            100
                                                        }
                                                        className="w-32"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <p className="text-lg">
                                                        {
                                                            currentContent.quizQuestions[
                                                                activeQuestionIndex
                                                            ].question
                                                        }
                                                    </p>
                                                    {renderQuizQuestion(
                                                        currentContent.quizQuestions[
                                                            activeQuestionIndex
                                                        ]
                                                    )}
                                                </div>

                                                <div className="flex justify-between">
                                                    <Button
                                                        variant="outline"
                                                        disabled={activeQuestionIndex === 0}
                                                        onClick={() =>
                                                            setActiveQuestionIndex(
                                                                (prev) => prev - 1
                                                            )
                                                        }
                                                    >
                                                        Previous Question
                                                    </Button>

                                                    {activeQuestionIndex ===
                                                    currentContent.quizQuestions.length - 1 ? (
                                                        <Button
                                                            onClick={handleQuizSubmit}
                                                            disabled={
                                                                Object.keys(selectedAnswers)
                                                                    .length !==
                                                                    currentContent.quizQuestions
                                                                        .length || isSubmittingQuiz
                                                            }
                                                        >
                                                            {isSubmittingQuiz
                                                                ? 'Submitting...'
                                                                : 'Submit Quiz'}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={() =>
                                                                setActiveQuestionIndex(
                                                                    (prev) => prev + 1
                                                                )
                                                            }
                                                        >
                                                            Next Question
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <h3 className="text-lg font-medium">
                                                    Quiz Results
                                                </h3>

                                                {currentContent.quizQuestions.map(
                                                    (question: QuizQuestion) => {
                                                        const userAnswer =
                                                            selectedAnswers[question.id];
                                                        let isCorrect = false;
                                                        let correctAnswerText = '';
                                                        let userAnswerText = '';

                                                        if (question.questionType === 'TrueFalse') {
                                                            isCorrect =
                                                                userAnswer ===
                                                                question.correctAnswer;
                                                            correctAnswerText =
                                                                question.correctAnswer
                                                                    ? 'True'
                                                                    : 'False';
                                                            userAnswerText = userAnswer
                                                                ? 'True'
                                                                : 'False';
                                                        } else if (
                                                            question.questionType ===
                                                                'MultipleChoice' &&
                                                            question.answers
                                                        ) {
                                                            const correctOption =
                                                                question.answers.find(
                                                                    (a) => a.isCorrect
                                                                );
                                                            const userOption =
                                                                question.answers.find(
                                                                    (a) => a.id === userAnswer
                                                                );
                                                            isCorrect =
                                                                correctOption?.id === userAnswer;
                                                            correctAnswerText =
                                                                correctOption?.answerText || '';
                                                            userAnswerText =
                                                                userOption?.answerText || '';
                                                        }

                                                        return (
                                                            <div
                                                                key={question.id}
                                                                className={`p-4 rounded-lg ${
                                                                    isCorrect
                                                                        ? 'bg-green-50'
                                                                        : 'bg-red-50'
                                                                }`}
                                                            >
                                                                <p className="font-medium">
                                                                    {question.question}
                                                                </p>
                                                                <p className="text-sm mt-2">
                                                                    Your answer: {userAnswerText}
                                                                </p>
                                                                <p className="text-sm mt-1">
                                                                    Correct answer:{' '}
                                                                    {correctAnswerText}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                )}

                                                {/* Restart button when this quiz was failed */}
                                                {quizScore < PASS_MARK && (
                                                    <div className="flex justify-center mt-6">
                                                        <Button
                                                            variant="destructive"
                                                            onClick={handleRestartQuiz}
                                                        >
                                                            Restart Quiz
                                                        </Button>
                                                    </div>
                                                )}

                                                {/*
                                                 * "Next Module" is shown only when:
                                                 *   1. The current quiz was just passed, AND
                                                 *   2. Every quiz content item in this module
                                                 *      has been passed at least once.
                                                 */}
                                                {quizScore >= PASS_MARK &&
                                                    allQuizzesPassed &&
                                                    onNext && (
                                                        <div className="flex justify-center mt-6">
                                                            <Button onClick={onNext}>
                                                                Next Module
                                                                <ChevronRight className="h-4 w-4 ml-2" />
                                                            </Button>
                                                        </div>
                                                    )}

                                                {/*
                                                 * Prompt the student to complete remaining quizzes
                                                 * when this quiz passed but others are still pending.
                                                 */}
                                                {quizScore >= PASS_MARK && !allQuizzesPassed && (
                                                    <p className="text-center text-sm text-muted-foreground mt-4">
                                                        Great work! Complete the remaining{' '}
                                                        {allQuizContents.length -
                                                            passedQuizIds.size}{' '}
                                                        quiz
                                                        {allQuizContents.length -
                                                            passedQuizIds.size >
                                                        1
                                                            ? 'zes'
                                                            : ''}{' '}
                                                        in this module to continue.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="resources" className="space-y-4">
                    {sortedContent
                        .flatMap((c: any) => c.resources ?? [])
                        .map((resource: any, index: number) => (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium">{resource.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {resource.type.toUpperCase()} Resource
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDownload(resource.url)}
                                            disabled={loadingResources.has(resource.url)}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            {loadingResources.has(resource.url)
                                                ? 'Loading...'
                                                : 'Download'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </TabsContent>
            </Tabs>

            <CongratulationModal
                isOpen={isCongratulationOpen}
                onClose={() => setIsCongratulationOpen(false)}
                courseTitle={module.title}
                score={quizScore}
                onNavigate={onComplete}
            />
        </div>
    );
}
