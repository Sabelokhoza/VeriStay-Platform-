import { useUpdateCourseMutation } from '@/app/errors/coursesApi';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Pencil } from 'lucide-react';
import { CourseDataModel } from '@/app/errors/studentApi';

interface UpdateCourseDto {
    id: number;
    title: string;
    description: string;
    level: string;
    price: string;
    isActive: boolean;
}

interface EditCourseModalProps {
    course: CourseDataModel;
    onSuccess?: () => void;
}

export function EditCourseModal({ course, onSuccess }: EditCourseModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [updateCourse, { isLoading }] = useUpdateCourseMutation();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState<UpdateCourseDto>({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        price: course.price,
        isActive: course.status == 'Active' ? true : false,
    });

    // Update form data when course prop changes
    useEffect(() => {
        setFormData({
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            price: course.price,
            isActive: course.status == 'Active' ? true : false,
        });
    }, [course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        // Ensure all data types are correct before sending
        const submitData: UpdateCourseDto = {
            id: formData.id,
            title: formData.title,
            description: formData.description,
            level: formData.level,
            price: String(formData.price),
            isActive: formData.isActive,
        };

        try {
            await updateCourse(submitData).unwrap();
            toast.success('Course updated successfully');
            setIsOpen(false);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            if (error?.data?.details && error.data.details.length > 0) {
                setErrors(error.data.details);
            } else {
                toast.error('Failed to update course. Please try again.');
            }
            console.error('Update course error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="w-full lg:w-auto shadow-lg hover:shadow-xl transition-all"
                >
                    <Pencil className="h-5 w-5 mr-2" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>
                            Update the course details below to modify the course record.
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
                                placeholder="Enter course title"
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
                                placeholder="Enter course description"
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

                        <div className="space-y-2">
                            <Label className="block">Level</Label>
                            <RadioGroup
                                value={formData.level}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        level: value as 'Beginner' | 'Intermediate' | 'Advanced',
                                    }))
                                }
                                className="flex space-x-4"
                                disabled={isLoading}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Beginner" id="edit-level-beginner" />
                                    <Label htmlFor="edit-level-beginner">Beginner</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="Intermediate"
                                        id="edit-level-intermediate"
                                    />
                                    <Label htmlFor="edit-level-intermediate">Intermediate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Advanced" id="edit-level-advanced" />
                                    <Label htmlFor="edit-level-advanced">Advanced</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">
                                Price
                            </Label>
                            <Input
                                id="price"
                                type="text"
                                className="col-span-3"
                                placeholder="Enter price (e.g., 99.99)"
                                value={formData.price}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="block">Status</Label>
                            <RadioGroup
                                value={formData.isActive ? 'active' : 'inactive'}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        isActive: value === 'active',
                                    }))
                                }
                                className="flex space-x-4"
                                disabled={isLoading}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="active" id="edit-status-active" />
                                    <Label htmlFor="edit-status-active">Active</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="inactive" id="edit-status-inactive" />
                                    <Label htmlFor="edit-status-inactive">Inactive</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Updating Course...' : 'Update Course'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
