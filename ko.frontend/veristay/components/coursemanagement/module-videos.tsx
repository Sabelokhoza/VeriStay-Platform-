import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Video, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import {
    ModuleVideoDto,
    useGetVideosByModuleIdQuery,
    useDeleteVideoMaterialMutation,
} from '@/app/errors/coursesApi';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '@/app/(platform)/loading';
import AddOrUpdateVideoModal from './addOrUpdateVideoModal';

interface ModuleVideosProps {
    module_id: number;
}

function ModuleVideos({ module_id }: ModuleVideosProps) {
    const { data: videos = [], isLoading, error, refetch } = useGetVideosByModuleIdQuery(module_id);

    const [deleteVideo, { isLoading: isDeleting }] = useDeleteVideoMaterialMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<ModuleVideoDto | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<ModuleVideoDto | null>(null);

    const openAddModal = () => {
        setSelectedVideo(null);
        setIsModalOpen(true);
    };

    const openEditModal = (video: ModuleVideoDto) => {
        setSelectedVideo(video);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!videoToDelete) return;

        try {
            await deleteVideo(videoToDelete.id).unwrap();
            toast.success('Video deleted successfully');
            await refetch();
            setIsDeleteDialogOpen(false);
            setVideoToDelete(null);
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to delete video');
        }
    };

    if (isLoading) return <Loading />;
    if (error) return <div>Error loading videos</div>;

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Video className="h-5 w-5" />
                                Videos
                            </CardTitle>
                            <CardDescription>Manage videos for this module</CardDescription>
                        </div>

                        <Button onClick={openAddModal}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Video
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {videos.length ? (
                        <div className="space-y-4">
                            {videos.map((video) => (
                                <Card key={video.id} className="border-2">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">
                                                    {video.title}
                                                </CardTitle>
                                                <CardDescription className="mt-1">
                                                    {video.description || 'No description'}
                                                </CardDescription>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditModal(video)}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit/Previw
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        setVideoToDelete(video);
                                                        setIsDeleteDialogOpen(true);
                                                    }}
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
                        <div className="text-center py-10 text-muted-foreground">
                            <Video className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No videos added yet.</p>
                            <p className="text-sm">
                                Click <strong>Add Video</strong> to get started.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddOrUpdateVideoModal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedVideo(null);
                }}
                moduleId={module_id}
                video={selectedVideo}
                onSaved={refetch}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Video</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{videoToDelete?.title}</strong>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isDeleting ? 'Deleting…' : 'Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ModuleVideos;
