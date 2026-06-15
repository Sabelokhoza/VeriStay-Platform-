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
import { FileText, Save, Plus, Edit, Trash2 } from 'lucide-react';
import { Textarea } from '@heroui/react';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import {
    useGetTextByModuleIdQuery,
    useAddOrUpdateTextMaterialMutation,
    useDeleteTextMaterialMutation,
} from '@/app/errors/coursesApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    textContent: z.string().optional(),
});

interface TextContentProps {
    moduleId: number;
}

interface CourseMaterial {
    id: number;
    title: string;
    description: string;
    textContent?: string;
}

function TextContent({ moduleId }: TextContentProps) {
    const {
        data: textDataList,
        isLoading: isLoadingText,
        refetch,
    } = useGetTextByModuleIdQuery(moduleId);
    const [addOrUpdateTextMaterial, { isLoading: isSaving }] = useAddOrUpdateTextMaterialMutation();
    const [deleteTextMaterial, { isLoading: isDeleting }] = useDeleteTextMaterialMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CourseMaterial | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<CourseMaterial | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            textContent: '',
        },
    });

    // Reset form when modal closes
    useEffect(() => {
        if (!isModalOpen) {
            form.reset({
                title: '',
                description: '',
                textContent: '',
            });
            setEditingItem(null);
        }
    }, [isModalOpen, form]);

    // Populate form when editing
    useEffect(() => {
        if (editingItem) {
            form.setValue('title', editingItem.title || '');
            form.setValue('description', editingItem.description || '');
            form.setValue('textContent', editingItem.textContent || '');
        }
    }, [editingItem, form]);

    const handleOpenAddModal = () => {
        setEditingItem(null);
        form.reset({
            title: '',
            description: '',
            textContent: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (item: CourseMaterial) => {
        setEditingItem(item);
        setIsModalOpen(true);
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
                moduleId: moduleId,
                title: values.title,
                description: values.description,
                textContent: values.textContent || '',
            };

            console.log('Saving payload:', payload);
            await addOrUpdateTextMaterial(payload).unwrap();
            toast.success(
                editingItem
                    ? 'Text content updated successfully!'
                    : 'Text content added successfully!'
            );

            await refetch();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving text content:', error);
            toast.error(
                `Failed to save text content: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    const handleOpenDeleteDialog = (item: CourseMaterial) => {
        setItemToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;

        try {
            await deleteTextMaterial(itemToDelete.id).unwrap();
            toast.success('Text content deleted successfully!');
            await refetch();
            setIsDeleteDialogOpen(false);
            setItemToDelete(null);
        } catch (error: any) {
            console.error('Error deleting text content:', error);
            toast.error(
                `Failed to delete text content: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Text Content
                            </CardTitle>
                            <CardDescription>Manage lesson content for this module</CardDescription>
                        </div>
                        <Button onClick={handleOpenAddModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Content
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingText ? (
                        <div className="text-sm text-muted-foreground">Loading text content...</div>
                    ) : textDataList && textDataList.length > 0 ? (
                        <div className="space-y-4">
                            {textDataList.map((item: CourseMaterial) => (
                                <Card key={item.id} className="border-2">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    {item.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {item.description}
                                                </CardDescription>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleOpenEditModal(item)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
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
                                    {item.textContent && (
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                {item.textContent}
                                            </p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No text content available.</p>
                            <p className="text-sm">
                                Click "Add Content" to create your first lesson.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingItem ? 'Edit Text Content' : 'Add Text Content'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingItem
                                ? 'Update the lesson content below'
                                : 'Create new lesson content for this module'}
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
                                            <Input
                                                placeholder="e.g., Introduction to Personal Hygiene"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a clear and descriptive title for this lesson
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
                                                placeholder="e.g., Health rules to keep fit and healthy."
                                                className="min-h-[80px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Provide a brief overview of what this lesson covers
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="textContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lesson Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your detailed lesson content here..."
                                                className="min-h-[300px] resize-none font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Write comprehensive lesson content. Markdown supported.
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
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                                <Button type="button" onClick={handleSave} disabled={isSaving}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSaving ? 'Saving...' : editingItem ? 'Update' : 'Save'}
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
                        <DialogTitle>Delete Text Content</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{itemToDelete?.title}"? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default TextContent;
