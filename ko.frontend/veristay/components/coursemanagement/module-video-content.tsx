import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Form,
} from '../ui/form';
import { Input } from '../ui/input';
import { Video, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    useGetOrAddDummyVideoQuery,
    useUpdateVideoMaterialMutation,
    useDeleteVideoMaterialMutation,
    useAddVideoMaterialMutation,
} from '@/app/errors/coursesApi';
import Loading from '@/app/(platform)/loading';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface ModuleVideoContentProps {
    module_id: number;
}

const videoFormSchema = z.object({
    videoUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

function ModuleVideoContent({ module_id }: ModuleVideoContentProps) {
    const { data: moduleVideo, isLoading, error, refetch } = useGetOrAddDummyVideoQuery(module_id);
    const [updateVideoMaterial, { isLoading: isUpdating }] = useUpdateVideoMaterialMutation();
    const [deleteVideoMaterial, { isLoading: isDeleting }] = useDeleteVideoMaterialMutation();
    const [addVideoMaterial, { isLoading: isAdding }] = useAddVideoMaterialMutation();

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const form = useForm<VideoFormValues>({
        resolver: zodResolver(videoFormSchema),
        defaultValues: {
            videoUrl: '',
            title: '',
            description: '',
        },
    });

    // Populate form when moduleVideo data is loaded
    useEffect(() => {
        if (moduleVideo) {
            form.reset({
                videoUrl: moduleVideo.videoUrl || moduleVideo.url || '',
                title: moduleVideo.title || '',
                description: moduleVideo.description || '',
            });
        }
    }, [moduleVideo, form]);

    const onSubmit = async (data: VideoFormValues) => {
        console.log(moduleVideo);
        if (!moduleVideo?.id) {
            await addVideoMaterial({
                videoUrl: data.videoUrl || '',
                title: data.title || '',
                description: data.description || '',
                contentType: 'Video',
                courseModuleId: module_id,
            }).unwrap();

            toast.success('Video content added successfully');
            refetch();
            return;
        }

        try {
            await updateVideoMaterial({
                id: moduleVideo.id,
                videoUrl: data.videoUrl || '',
                title: data.title || '',
                description: data.description || '',
            }).unwrap();

            toast.success('Video updated successfully');
            await refetch();
        } catch (error) {
            toast.error('Failed to update video. Please try again.');
            console.error('Update error:', error);
        }
    };

    const handleDelete = async () => {
        if (!moduleVideo?.id) {
            toast.error('Video ID not found');
            return;
        }

        try {
            await deleteVideoMaterial(moduleVideo.id).unwrap();
            toast.success('Video deleted successfully');
            await refetch();
            setIsDeleteDialogOpen(false);

            // Reset form after deletion
            form.reset({
                videoUrl: '',
                title: '',
                description: '',
            });
        } catch (error: any) {
            console.error('Error deleting video:', error);
            toast.error(
                `Failed to delete video: ${error?.data?.message || error?.status || 'Unknown error'}`
            );
        }
    };

    // Helper function to convert YouTube URL to embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return '';

        // YouTube watch URL to embed
        const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
        const youtubeMatch = url.match(youtubeRegex);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        // Vimeo URL to embed
        const vimeoRegex = /vimeo\.com\/(\d+)/;
        const vimeoMatch = url.match(vimeoRegex);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        // Return original URL if it's already an embed or direct video
        return url;
    };

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading video data: {error.toString()}</div>;
    }

    const currentVideoUrl = form.watch('videoUrl');
    const embedUrl = getEmbedUrl(
        currentVideoUrl || moduleVideo?.videoUrl || moduleVideo?.url || ''
    );

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5" />
                                Video Content
                            </CardTitle>
                            <CardDescription>
                                Add video content for module {module_id}
                            </CardDescription>
                        </div>
                        {moduleVideo?.videoUrl && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                disabled={!moduleVideo?.id || moduleVideo.id === 0}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Video
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter video title..." {...field} />
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
                                        <FormLabel>Video Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter video description..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Video URL</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://youtube.com/watch?v=..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Supports YouTube, Vimeo, and direct video links
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {currentVideoUrl && (
                                <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                                    <div className="aspect-video bg-background rounded overflow-hidden">
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            frameBorder="0"
                                            title="Video Preview"
                                        />
                                    </div>
                                </div>
                            )}

                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating || isAdding ? 'Saving...' : 'Save Video'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Video</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{moduleVideo?.title}"? This action
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

export default ModuleVideoContent;
