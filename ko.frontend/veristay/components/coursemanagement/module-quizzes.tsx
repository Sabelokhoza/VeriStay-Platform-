import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form,
} from '../ui/form';
import {
    FileText,
    Save,
    Plus,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    HelpCircle,
} from 'lucide-react';
import { Textarea } from '@heroui/react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { QuizSummaryDto, useGetQuizzesByModuleIdQuery } from '@/app/errors/coursesApi';
import {
    useGetQuizQuestionsInfoByMaterialIdQuery,
    useAddTrueFalseQuestionMutation,
    useAddMultipleChoiceQuestionMutation,
    useDeleteQuizQuestionMutation,
    useUpdateQuizDetailsMutation,
    useAddQuizMutation,
    useDeleteQuizMutation,
} from '@/app/errors/trainingCenterApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/app/(platform)/loading';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
});

interface ModuleQuizzesProps {
    module_id: number;
}

interface Quiz {
    id: number;
    courseModuleId: number;
    contentType: string;
    title: string;
    description: string;
    questionCount: number;
    dateCreated: string | null;
    dateModified: string | null;
}

function ModuleQuizzes({ module_id }: ModuleQuizzesProps) {
    const {
        data: quizzesList,
        isLoading: isLoadingQuizzes,
        error,
        refetch,
    } = useGetQuizzesByModuleIdQuery(module_id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
    const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
    const [isAddMultipleChoiceModalOpen, setIsAddMultipleChoiceModalOpen] = useState(false);
    const [isDeleteQuestionDialogOpen, setIsDeleteQuestionDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<QuizSummaryDto | null>(null);
    const [viewingQuizId, setViewingQuizId] = useState<number | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<QuizSummaryDto | null>(null);
    const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

    // Add true/false question form state
    const [questionText, setQuestionText] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState<string>('true');

    // Add multiple choice question form state
    const [mcQuestionText, setMcQuestionText] = useState('');
    const [mcAnswers, setMcAnswers] = useState<Array<{ answer: string; isCorrect: boolean }>>([
        { answer: '', isCorrect: true },
        { answer: '', isCorrect: false },
        { answer: '', isCorrect: false },
    ]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
        },
    });

    // Fetch questions for the selected quiz
    const {
        data: questions,
        isLoading: isLoadingQuestions,
        error: questionsError,
        refetch: refetchQuestions,
    } = useGetQuizQuestionsInfoByMaterialIdQuery(viewingQuizId!, {
        skip: !viewingQuizId,
    });

    const [addTrueFalseQuestion, { isLoading: isAddingQuestion }] =
        useAddTrueFalseQuestionMutation();
    const [addMultipleChoiceQuestion, { isLoading: isAddingMcQuestion }] =
        useAddMultipleChoiceQuestionMutation();
    const [deleteQuizQuestion, { isLoading: isDeletingQuestion }] = useDeleteQuizQuestionMutation();
    const [updateQuizDetails, { isLoading: isUpdatingQuiz }] = useUpdateQuizDetailsMutation();
    const [addQuiz, { isLoading: isAddingQuiz }] = useAddQuizMutation();
    const [deleteQuiz, { isLoading: isDeletingQuiz }] = useDeleteQuizMutation();

    // Reset form when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            form.reset({
                title: '',
                description: '',
            });
            setEditingItem(null);
        }
    }, [isModalOpen, form]);

    // Populate form when editing
    useEffect(() => {
        if (editingItem) {
            form.setValue('title', editingItem.title || '');
            form.setValue('description', editingItem.description || '');
        }
    }, [editingItem, form]);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        form.reset({
            title: '',
            description: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: QuizSummaryDto) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleOpenQuestionsModal = (item: QuizSummaryDto) => {
        setViewingQuizId(item.id);
        setIsQuestionsModalOpen(true);
    };

    const handleOpenAddQuestionModal = () => {
        setQuestionText('');
        setCorrectAnswer('true');
        setIsAddQuestionModalOpen(true);
    };

    const handleOpenAddMultipleChoiceModal = () => {
        setMcQuestionText('');
        setMcAnswers([
            { answer: '', isCorrect: true },
            { answer: '', isCorrect: false },
            { answer: '', isCorrect: false },
        ]);
        setIsAddMultipleChoiceModalOpen(true);
    };

    const handleAddMcAnswer = () => {
        setMcAnswers([...mcAnswers, { answer: '', isCorrect: false }]);
    };

    const handleRemoveMcAnswer = (index: number) => {
        if (mcAnswers.length > 2) {
            setMcAnswers(mcAnswers.filter((_, i) => i !== index));
        }
    };

    const handleMcAnswerChange = (index: number, value: string) => {
        const newAnswers = [...mcAnswers];
        newAnswers[index].answer = value;
        setMcAnswers(newAnswers);
    };

    const handleMcCorrectChange = (index: number) => {
        const newAnswers = mcAnswers.map((ans, i) => ({
            ...ans,
            isCorrect: i === index,
        }));
        setMcAnswers(newAnswers);
    };

    const handleAddQuestion = async () => {
        if (!questionText.trim()) {
            toast.error('Please enter a question');
            return;
        }

        if (!viewingQuizId) {
            toast.error('No quiz selected');
            return;
        }

        try {
            await addTrueFalseQuestion({
                question: questionText,
                correctAnswer: correctAnswer === 'true',
                courseMaterialId: viewingQuizId,
            }).unwrap();

            toast.success('Question added successfully!');
            await refetchQuestions();
            await refetch();
            setIsAddQuestionModalOpen(false);
            setQuestionText('');
            setCorrectAnswer('true');
        } catch (error: any) {
            console.error('Error adding question:', error);
            toast.error(
                `Failed to add question: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    const handleAddMultipleChoiceQuestion = async () => {
        if (!mcQuestionText.trim()) {
            toast.error('Please enter a question');
            return;
        }

        if (!viewingQuizId) {
            toast.error('No quiz selected');
            return;
        }

        // Validate at least 2 answers
        if (mcAnswers.length < 2) {
            toast.error('Please provide at least 2 answers');
            return;
        }

        // Validate all answers have text
        const emptyAnswers = mcAnswers.some((ans) => !ans.answer.trim());
        if (emptyAnswers) {
            toast.error('Please fill in all answer options');
            return;
        }

        // Validate exactly one correct answer
        const correctCount = mcAnswers.filter((ans) => ans.isCorrect).length;
        if (correctCount !== 1) {
            toast.error('Please select exactly one correct answer');
            return;
        }

        try {
            await addMultipleChoiceQuestion({
                question: mcQuestionText,
                courseMaterialId: viewingQuizId,
                answers: mcAnswers,
            }).unwrap();

            toast.success('Multiple choice question added successfully!');
            await refetchQuestions();
            await refetch();
            setIsAddMultipleChoiceModalOpen(false);
            setMcQuestionText('');
            setMcAnswers([
                { answer: '', isCorrect: true },
                { answer: '', isCorrect: false },
                { answer: '', isCorrect: false },
            ]);
        } catch (error: any) {
            console.error('Error adding multiple choice question:', error);
            toast.error(
                `Failed to add question: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    const handleOpenDeleteQuestionDialog = (questionId: number) => {
        setQuestionToDelete(questionId);
        setIsDeleteQuestionDialogOpen(true);
    };

    const handleDeleteQuestion = async () => {
        if (!questionToDelete) return;

        try {
            await deleteQuizQuestion(questionToDelete).unwrap();
            toast.success('Question deleted successfully!');
            await refetchQuestions();
            await refetch();
            setIsDeleteQuestionDialogOpen(false);
            setQuestionToDelete(null);
        } catch (error: any) {
            console.error('Error deleting question:', error);
            toast.error(
                `Failed to delete question: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    const handleSave = async () => {
        try {
            const isValid = await form.trigger();
            if (!isValid) {
                toast.error('Please fill in all required fields');
                return;
            }

            const values = form.getValues();

            if (editingItem) {
                // Update existing quiz
                await updateQuizDetails({
                    quizId: editingItem.id,
                    title: values.title,
                    description: values.description,
                }).unwrap();
                toast.success('Quiz updated successfully!');
            } else {
                // Add new quiz
                await addQuiz({
                    title: values.title,
                    description: values.description,
                    courseModuleId: module_id,
                }).unwrap();
                toast.success('Quiz created successfully!');
            }

            await refetch();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving quiz:', error);
            toast.error(
                `Failed to save quiz: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    const handleOpenDeleteDialog = (item: QuizSummaryDto) => {
        setItemToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteQuiz(itemToDelete.id).unwrap();
            toast.success('Quiz deleted successfully!');
            await refetch();
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error: any) {
            console.error('Error deleting quiz:', error);
            toast.error(
                `Failed to delete quiz: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    if (isLoadingQuizzes) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading quiz data: {error.toString()}</div>;
    }

    const trueOrFalseQuestions = questions?.filter((q: any) => q.isTrueOrFalse === true) || [];
    const multipleChoiceQuestions = questions?.filter((q: any) => q.isTrueOrFalse === false) || [];

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Quizzes
                            </CardTitle>
                            <CardDescription>Manage quizzes for this module</CardDescription>
                        </div>
                        <Button onClick={handleOpenAddModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Quiz
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {quizzesList && quizzesList.length > 0 ? (
                        <div className="space-y-4">
                            {quizzesList.map((item: QuizSummaryDto) => (
                                <Card key={item.id} className="border-2">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    Quiz : {item.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {item.description}
                                                </CardDescription>
                                                <div className="mt-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">
                                                        {item.qestionCount}
                                                    </span>{' '}
                                                    {item.qestionCount === 1
                                                        ? 'question'
                                                        : 'questions'}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenEditModal(item)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Description
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenQuestionsModal(item)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    View/Edit Questions
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleOpenDeleteDialog(item)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No quizzes available.</p>
                            <p className="text-sm">Click "Add Quiz" to create your first quiz.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Quiz Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? 'Edit Quiz' : 'Add Quiz'}</DialogTitle>
                        <DialogDescription>
                            {editingItem
                                ? 'Update the quiz details below'
                                : 'Create a new quiz for this module'}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <div className="space-y-4 py-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Khoza Quiz" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a clear title for this quiz
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., Assessment based on hygiene and appearance standards."
                                                className="min-h-[100px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a description of what this quiz covers
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isUpdatingQuiz || isAddingQuiz}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={isUpdatingQuiz || isAddingQuiz}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {isUpdatingQuiz || isAddingQuiz ? 'Saving...' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* View/Edit Questions Modal */}
            <Dialog open={isQuestionsModalOpen} onOpenChange={setIsQuestionsModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Quiz Questions</DialogTitle>
                        <DialogDescription>
                            View and manage questions for this quiz
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {isLoadingQuestions ? (
                            <Loading />
                        ) : questionsError ? (
                            <div className="text-red-500">
                                Error loading questions: {questionsError.toString()}
                            </div>
                        ) : (
                            <Tabs defaultValue="true-false" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger
                                        value="true-false"
                                        className="flex items-center gap-2"
                                    >
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

                                <TabsContent value="true-false" className="space-y-4 mt-4">
                                    <div className="flex justify-end mb-4">
                                        <Button onClick={handleOpenAddQuestionModal} size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Question
                                        </Button>
                                    </div>

                                    {trueOrFalseQuestions.length === 0 ? (
                                        <Card>
                                            <CardContent className="py-8 text-center text-muted-foreground">
                                                No true/false questions available.
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        trueOrFalseQuestions.map((question: any, index: number) => (
                                            <Card key={question.questionId}>
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
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant={
                                                                    question.correctAnswer ===
                                                                    'true'
                                                                        ? 'default'
                                                                        : 'destructive'
                                                                }
                                                                className="flex items-center gap-1"
                                                            >
                                                                {question.correctAnswer ===
                                                                'true' ? (
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3" />
                                                                )}
                                                                {question.correctAnswer === 'true'
                                                                    ? 'True'
                                                                    : 'False'}
                                                            </Badge>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleOpenDeleteQuestionDialog(
                                                                        question.questionId
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                        ))
                                    )}
                                </TabsContent>

                                <TabsContent value="multiple-choice" className="space-y-4 mt-4">
                                    <div className="flex justify-end mb-4">
                                        <Button
                                            onClick={handleOpenAddMultipleChoiceModal}
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Question
                                        </Button>
                                    </div>

                                    {multipleChoiceQuestions.length === 0 ? (
                                        <Card>
                                            <CardContent className="py-8 text-center text-muted-foreground">
                                                No multiple choice questions available.
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        multipleChoiceQuestions.map(
                                            (question: any, index: number) => (
                                                <Card key={question.questionId}>
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
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleOpenDeleteQuestionDialog(
                                                                        question.questionId
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                                <span>Correct Answer:</span>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-sm"
                                                            >
                                                                {question.correctAnswer}
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )
                                    )}
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsQuestionsModalOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add True/False Question Modal */}
            <Dialog open={isAddQuestionModalOpen} onOpenChange={setIsAddQuestionModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add True/False Question</DialogTitle>
                        <DialogDescription>
                            Create a new true or false question for this quiz
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input
                                id="question"
                                placeholder="e.g., Is Sabelo Joe?"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="true" id="true" />
                                    <Label
                                        htmlFor="true"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        True
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="false" id="false" />
                                    <Label
                                        htmlFor="false"
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        False
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddQuestionModalOpen(false)}
                                disabled={isAddingQuestion}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleAddQuestion}
                                disabled={isAddingQuestion}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isAddingQuestion ? 'Adding...' : 'Add Question'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Multiple Choice Question Modal */}
            <Dialog
                open={isAddMultipleChoiceModalOpen}
                onOpenChange={setIsAddMultipleChoiceModalOpen}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Multiple Choice Question</DialogTitle>
                        <DialogDescription>
                            Create a new multiple choice question with answer options
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="mc-question">Question</Label>
                            <Input
                                id="mc-question"
                                placeholder="e.g., What is my name?"
                                value={mcQuestionText}
                                onChange={(e) => setMcQuestionText(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Answer Options</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddMcAnswer}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Answer
                                </Button>
                            </div>

                            {mcAnswers.map((answer, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <RadioGroup
                                        value={mcAnswers.findIndex((a) => a.isCorrect).toString()}
                                        onValueChange={(val) =>
                                            handleMcCorrectChange(parseInt(val))
                                        }
                                    >
                                        <RadioGroupItem
                                            value={index.toString()}
                                            id={`answer-${index}`}
                                        />
                                    </RadioGroup>
                                    <Input
                                        placeholder={`Answer ${index + 1}`}
                                        value={answer.answer}
                                        onChange={(e) =>
                                            handleMcAnswerChange(index, e.target.value)
                                        }
                                        className="flex-1"
                                    />
                                    {answer.isCorrect && (
                                        <Badge variant="default" className="whitespace-nowrap">
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                            Correct
                                        </Badge>
                                    )}
                                    {mcAnswers.length > 2 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveMcAnswer(index)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <p className="text-xs text-muted-foreground">
                                Click the radio button next to an answer to mark it as correct
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddMultipleChoiceModalOpen(false)}
                                disabled={isAddingMcQuestion}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleAddMultipleChoiceQuestion}
                                disabled={isAddingMcQuestion}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {isAddingMcQuestion ? 'Adding...' : 'Add Question'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Question Confirmation Dialog */}
            <Dialog open={isDeleteQuestionDialogOpen} onOpenChange={setIsDeleteQuestionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Question</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this question? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteQuestionDialogOpen(false)}
                            disabled={isDeletingQuestion}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDeleteQuestion}
                            disabled={isDeletingQuestion}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeletingQuestion ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Quiz Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Quiz</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this quiz? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeletingQuiz}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeletingQuiz}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeletingQuiz ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ModuleQuizzes;
