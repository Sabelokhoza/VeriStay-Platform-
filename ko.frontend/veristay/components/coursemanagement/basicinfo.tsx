import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import { CourseModuleDto, useUpdateCourseModuleMutation } from '@/app/errors/coursesApi';
import { toast } from 'react-toastify';

interface BasicInfoProps {
    module: CourseModuleDto | undefined;
}

function BasicInfo({ module }: BasicInfoProps) {
    const [updateCourseModule, { isLoading }] = useUpdateCourseModuleMutation();

    const form = useForm({
        defaultValues: {
            title: module?.title || '',
            description: module?.description || '',
            duration: module?.duration || 0,
        },
    });

    useEffect(() => {
        if (module) {
            form.reset({
                title: module.title || '',
                description: module.description || '',
                duration: module.duration || 0,
            });
        }
    }, [module, form]);

    async function handleSubmit(values: { title: string; description: string; duration: number }) {
        if (!module?.id || !module?.courseId) {
            toast.error('Module ID or Course ID is missing');
            return;
        }

        try {
            const result = await updateCourseModule({
                id: module.id,
                courseId: module.courseId,
                title: values.title,
                description: values.description,
                duration: values.duration,
            }).unwrap();

            toast.success('Successfully updated module basic info');

            console.log('Module updated successfully:', result);
        } catch (error) {
            console.error('Error updating module:', error);
            toast.error('Failed to update module. Please try again.');
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Module Information</CardTitle>
                        <CardDescription>Update the basic details for your module</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Module Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Introduction to Security Services"
                                            {...field}
                                            className="text-lg"
                                        />
                                    </FormControl>
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
                                            placeholder="Describe what students will learn in this module..."
                                            className="min-h-[120px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Provide a clear overview of the module content
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Duration (hours)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="e.g., 8"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(parseInt(e.target.value) || 0)
                                            }
                                            min="1"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Estimated time to complete this module (in hours)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Module'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default BasicInfo;
