import { useAddCourseModuleMutation } from '@/app/errors/coursesApi';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface AddCourseModuleDto {
    courseId: number;
    title: string;
    description: string;
    duration: number;
}

interface AddModuleModalProps {
    courseId: number;
    onSuccess?: () => void;
}

export function AddModuleModal({ courseId, onSuccess }: AddModuleModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [addCourseModule, { isLoading }] = useAddCourseModuleMutation();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState<AddCourseModuleDto>({
        courseId: courseId,
        title: '',
        description: '',
        duration: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            await addCourseModule(formData).unwrap();
            toast.success('Module added successfully');
            setIsOpen(false);
            setFormData({
                courseId: courseId,
                title: '',
                description: '',
                duration: 0,
            });
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            if (error?.data?.details && error.data.details.length > 0) {
                setErrors(error.data.details);
            } else {
                toast.error('Failed to add module. Please try again.');
            }
            console.error('Add module error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add Module</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Module</DialogTitle>
                        <DialogDescription>
                            Enter the module details below to create a new module record.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Display validation errors */}
                    {errors.length > 0 && (
                        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 mb-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <div className="mt-2">
                                        <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                className="col-span-3"
                                placeholder="Enter module title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="description" className="text-right pt-2">
                                Description
                            </Label>
                            <textarea
                                id="description"
                                rows={4}
                                className="col-span-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Enter module description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                                Duration (Days)
                            </Label>
                            <Input
                                id="duration"
                                type="number"
                                min="1"
                                className="col-span-3"
                                placeholder="Enter duration in days"
                                value={formData.duration || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        duration: parseInt(e.target.value) || 0,
                                    }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding Module...' : 'Add Module'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
