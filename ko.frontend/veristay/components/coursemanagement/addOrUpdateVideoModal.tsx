import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Video, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
    ModuleVideoDto,
    useAddVideoMaterialMutation,
    useUpdateVideoMaterialMutation,
} from '@/app/errors/coursesApi';

const videoFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    videoUrl: z.string().url('Enter a valid URL'),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

interface AddOrUpdateVideoModalProps {
    open: boolean;
    onClose: () => void;
    moduleId: number;
    video?: ModuleVideoDto | null;
    onSaved: () => void;
}

export default function AddOrUpdateVideoModal({
    open,
    onClose,
    moduleId,
    video,
    onSaved,
}: AddOrUpdateVideoModalProps) {
    const [addVideo, { isLoading: isAdding }] = useAddVideoMaterialMutation();
    const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMaterialMutation();

    const form = useForm<VideoFormValues>({
        resolver: zodResolver(videoFormSchema),
        defaultValues: {
            title: '',
            description: '',
            videoUrl: '',
        },
    });

    useEffect(() => {
        if (video) {
            form.reset({
                title: video.title || '',
                description: video.description || '',
                videoUrl: video.videoUrl || video.url || '',
            });
        } else {
            form.reset({
                title: '',
                description: '',
                videoUrl: '',
            });
        }
    }, [video, form, open]);

    const onSubmit = async (values: VideoFormValues) => {
        try {
            if (video?.id) {
                await updateVideo({
                    id: video.id,
                    title: values.title,
                    description: values.description,
                    videoUrl: values.videoUrl,
                }).unwrap();

                toast.success('Video updated successfully');
            } else {
                await addVideo({
                    courseModuleId: moduleId,
                    contentType: 'Video',
                    title: values.title,
                    description: values.description,
                    videoUrl: values.videoUrl,
                }).unwrap();

                toast.success('Video added successfully');
            }

            onSaved();
            onClose();
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to save video');
        }
    };

    const videoUrl = form.watch('videoUrl');

    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
        const vimeo = url.match(/vimeo\.com\/(\d+)/);
        if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
        return url;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        {video ? 'Edit Video' : 'Add Video'}
                    </DialogTitle>
                    <DialogDescription>
                        {video ? 'Update video details' : 'Add a new video to this module'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Video title" {...field} />
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
                                        <Input placeholder="Short description" {...field} />
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
                                        <Input placeholder="https://youtube.com/..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        YouTube, Vimeo, or direct video URL
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {videoUrl && (
                            <div className="aspect-video rounded overflow-hidden border">
                                <iframe
                                    src={getEmbedUrl(videoUrl)}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title="Video preview"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isAdding || isUpdating}>
                                <Save className="h-4 w-4 mr-2" />
                                {isAdding || isUpdating ? 'Saving…' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
