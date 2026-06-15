import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
    useGetModuleResourcesByCourseMaterialIdQuery,
    useDeleteModuleResourceMutation,
} from '@/app/errors/coursesApi';
import Loading from '@/app/(platform)/loading';
import { Download, FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { AddModuleResourceModal } from './add-module-resource-modal';
import { useState } from 'react';
import { useLazyGetSignedUrlQuery } from '@/app/errors/filesApi';

interface ResourcesPageProps {
    moduleId?: number;
}

function ResourcesPage({ moduleId }: ResourcesPageProps) {
    const { isLoading, data, error, refetch } = useGetModuleResourcesByCourseMaterialIdQuery(
        moduleId ?? 0
    );
    const [deleteModuleResource, { isLoading: isDeleting }] = useDeleteModuleResourceMutation();
    const [getSignedUrl] = useLazyGetSignedUrlQuery();
    const [loadingResources, setLoadingResources] = useState<Set<string>>(new Set());

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error loading resources: {error.toString()}</div>;
    }

    const handleDownload = async (filePath: string) => {
        try {
            setLoadingResources((prev) => new Set(prev).add(filePath));
            const result = await getSignedUrl(filePath).unwrap();
            if (result) {
                console.log('Signed URL:', result);
                window.open(result, '_blank');
            }
        } catch (error) {
            console.error('Failed to get signed URL:', error);
            toast.error('Failed to download file');
        } finally {
            setLoadingResources((prev) => {
                const newSet = new Set(prev);
                newSet.delete(filePath);
                return newSet;
            });
        }
    };

    const handleDelete = async (resourceId: number) => {
        if (!confirm('Are you sure you want to delete this resource?')) {
            return;
        }

        try {
            await deleteModuleResource(resourceId).unwrap();
            toast.success('Resource deleted successfully');
            refetch();
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast.error('Failed to delete resource. Please try again.');
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
                                Additional Resources
                            </CardTitle>
                            <CardDescription>
                                Download supplementary materials for this module
                            </CardDescription>
                        </div>
                        <AddModuleResourceModal
                            modeleId={moduleId ?? 0}
                            onSuccess={() => refetch()}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {!data || data.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No resources available yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.map((resource) => (
                                <Card key={resource.id} className="border-2">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="text-muted-foreground">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">
                                                        {resource.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground uppercase">
                                                        PDF
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
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
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(resource.id)}
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default ResourcesPage;
