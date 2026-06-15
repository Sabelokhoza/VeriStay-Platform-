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
import { FileText, Save, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Textarea } from '@heroui/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import {
    QuizSummaryDto,
    useGetQuizzesByModuleIdQuery,
    //useAddOrUpdateQuizMutation,
    // useDeleteQuizMutation,
} from '@/app/errors/coursesApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/app/(platform)/loading';
import QuizQuestionsView from './quiz-questions-view';

const formSchema = z.object({
    description: z.string().min(1, 'Description is required'),
});

interface ModuleQuizzesProps {
    module_id: number;
}

interface Quiz {
    id: number;
    courseModuleId: number;
    contentType: string;
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
    //  const [addOrUpdateQuiz, { isLoading: isSaving }] = useAddOrUpdateQuizMutation();
    // const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<QuizSummaryDto | null>(null);
    const [viewingQuiz, setViewingQuiz] = useState<QuizSummaryDto | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<QuizSummaryDto | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: '',
        },
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            form.reset({
                description: '',
            });
            setEditingItem(null);
        }
    }, [isModalOpen, form]);

    // Populate form when editing
    useEffect(() => {
        if (editingItem) {
            form.setValue('description', editingItem.description || '');
        }
    }, [editingItem, form]);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        form.reset({
            description: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: QuizSummaryDto) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleViewQuestions = (item: QuizSummaryDto) => {
        setViewingQuiz(item);
    };

    const handleBackToList = () => {
        setViewingQuiz(null);
    };

    const handleSave = async () => {
        try {
            const isValid = await form.trigger();
            if (!isValid) {
                toast.error('Please fill in all required fields');
                return;
            }

            const values = form.getValues();

            const payload = {
                id: editingItem?.id || 0,
                moduleId: module_id,
                description: values.description,
            };

            console.log('Saving payload:', payload);
            //await addOrUpdateQuiz(payload).unwrap();
            toast.success(editingItem ? 'Quiz updated successfully!' : 'Quiz added successfully!');

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
            // await deleteQuiz(itemToDelete.id).unwrap();
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

    // If viewing a quiz, show the questions view
    if (viewingQuiz) {
        return (
            <QuizQuestionsView
                quizId={viewingQuiz.id}
                quizDescription={viewingQuiz.description}
                onBack={handleBackToList}
            />
        );
    }

    if (isLoadingQuizzes) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading quiz data: {error.toString()}</div>;
    }

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
                                                    Quiz #{item.id}
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
                                                    onClick={() => handleViewQuestions(item)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Questions
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

            {/* Add/Edit Modal */}
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
                                    //  disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button type="button" onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
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
                            //          disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            //  disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ModuleQuizzes;
