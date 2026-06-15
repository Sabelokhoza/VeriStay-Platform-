import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle2, XCircle, HelpCircle, ArrowLeft, Plus } from 'lucide-react';
import Loading from '@/app/(platform)/loading';
import { useGetQuizQuestionsInfoByMaterialIdQuery } from '@/app/errors/trainingCenterApi';

interface QuizQuestionsViewProps {
    quizId: number;
    quizDescription?: string;
    onBack: () => void;
}

function QuizQuestionsView({ quizId, quizDescription, onBack }: QuizQuestionsViewProps) {
    const { data: questions, isLoading, error } = useGetQuizQuestionsInfoByMaterialIdQuery(quizId);

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
                    <Button variant="ghost" onClick={onBack} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Quizzes
                    </Button>
                    <div className="text-red-500">Error loading questions: {error.toString()}</div>
                </div>
            </div>
        );
    }

    const trueOrFalseQuestions = questions?.filter((q: any) => q.isTrueOrFalse === true) || [];
    const multipleChoiceQuestions = questions?.filter((q: any) => q.isTrueOrFalse === false) || [];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 py-6 max-w-5xl">
                {/* Header */}
                <div className="mb-6">
                    <Button variant="ghost" onClick={onBack} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Quizzes
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Quiz Questions</h1>
                    {quizDescription && (
                        <p className="text-muted-foreground mt-2">{quizDescription}</p>
                    )}
                </div>

                {!questions || questions.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                No questions available for this quiz.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs defaultValue="true-false" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="true-false" className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4" />
                                True/False ({trueOrFalseQuestions.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="multiple-choice"
                                className="flex items-center gap-2"
                            >
                                <HelpCircle className="h-4 w-4" />
                                Multiple Choice ({multipleChoiceQuestions.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="true-false" className="space-y-4">
                            {trueOrFalseQuestions.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No true/false questions available.
                                    </CardContent>
                                </Card>
                            ) : (
                                trueOrFalseQuestions.map((question: any, index: number) => (
                                    <Card key={question.questionId} className="border-2">
                                        <CardHeader>
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg font-medium">
                                                        Question {index + 1}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2 text-base text-foreground">
                                                        {question.question}
                                                    </CardDescription>
                                                </div>
                                                <Badge
                                                    variant={
                                                        question.correctAnswer === 'true'
                                                            ? 'default'
                                                            : 'destructive'
                                                    }
                                                    className="flex items-center gap-1 shrink-0"
                                                >
                                                    {question.correctAnswer === 'true' ? (
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    ) : (
                                                        <XCircle className="h-3 w-3" />
                                                    )}
                                                    {question.correctAnswer === 'true'
                                                        ? 'True'
                                                        : 'False'}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="multiple-choice" className="space-y-4">
                            {multipleChoiceQuestions.length === 0 ? (
                                <Card>
                                    <CardContent className="py-8 text-center text-muted-foreground">
                                        No multiple choice questions available.
                                    </CardContent>
                                </Card>
                            ) : (
                                multipleChoiceQuestions.map((question: any, index: number) => (
                                    <Card key={question.questionId} className="border-2">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-medium">
                                                Question {index + 1}
                                            </CardTitle>
                                            <CardDescription className="mt-2 text-base text-foreground">
                                                {question.question}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm font-medium">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    <span>Correct Answer:</span>
                                                </div>
                                                <Badge variant="outline" className="text-sm">
                                                    {question.correctAnswer}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}

export default QuizQuestionsView;
