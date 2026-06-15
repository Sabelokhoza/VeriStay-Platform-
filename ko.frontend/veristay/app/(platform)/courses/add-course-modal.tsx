import { useAddCourseMutation, useGetAllCertificationsQuery } from '@/app/errors/coursesApi';
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
import { useState } from 'react';
import { toast } from 'react-toastify';
import Loading from '../loading';
import { useAppSelector } from '@/app/store/store';

interface AddCourseDto {
    title: string;
    description: string;
    durationHours: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    isActive: boolean;
    trainingCentreId: number;
    certificationId: number;
    price: string;
    duration: number;
}

interface AddCourseModalProps {
    onSuccess?: () => void;
}

export function AddCourseModal({ onSuccess }: AddCourseModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [addCourse, { isLoading }] = useAddCourseMutation();
    const [errors, setErrors] = useState<string[]>([]);
    const { data: certifications, isLoading: certificationsLoading } =
        useGetAllCertificationsQuery();
    const selectedCentreId = useAppSelector((state) => state.trainingCentreStore?.selectedCentreId);
    const [formData, setFormData] = useState<AddCourseDto>({
        title: '',
        description: '',
        durationHours: 0,
        level: 'Beginner',
        isActive: true,
        trainingCentreId: selectedCentreId || 0,
        certificationId: 0,
        price: '',
        duration: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            await addCourse(formData).unwrap();
            toast.success('Course added successfully');
            setIsOpen(false);
            setFormData({
                title: '',
                description: '',
                durationHours: 0,
                level: 'Beginner',
                isActive: true,
                trainingCentreId: 0,
                certificationId: 0,
                price: '',
                duration: 0,
            });
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            if (error?.data?.details && error.data.details.length > 0) {
                setErrors(error.data.details);
            } else {
                toast.error('Failed to add course. Please try again.');
            }
            console.error('Add course error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add Course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Course</DialogTitle>
                        <DialogDescription>
                            Enter the course details below to create a new course record.
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

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="durationHours" className="text-right">
                                Duration (Hours)
                            </Label>
                            <Input
                                id="durationHours"
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="1000"
                                className="col-span-3"
                                placeholder="Enter duration in hours"
                                value={formData.durationHours || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        durationHours: parseFloat(e.target.value) || 0,
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
                                    <RadioGroupItem value="Beginner" id="level-beginner" />
                                    <Label htmlFor="level-beginner">Beginner</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Intermediate" id="level-intermediate" />
                                    <Label htmlFor="level-intermediate">Intermediate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Advanced" id="level-advanced" />
                                    <Label htmlFor="level-advanced">Advanced</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="certificationId" className="text-right">
                                Certification
                            </Label>
                            <select
                                id="certificationId"
                                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.certificationId || ''}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        certificationId: parseInt(e.target.value) || 0,
                                    }))
                                }
                                disabled={isLoading || certificationsLoading}
                                required
                            >
                                <option value="">Select a certification</option>
                                {certificationsLoading ? (
                                    <option value="" disabled>
                                        Loading certifications...
                                    </option>
                                ) : (
                                    certifications?.map((cert) => (
                                        <option key={cert.id} value={cert.id}>
                                            {cert.name} ({cert.code})
                                        </option>
                                    ))
                                )}
                            </select>
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

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                                Duration (Days)
                            </Label>
                            <Input
                                id="duration"
                                type="number"
                                min="1"
                                max="365"
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
                                    <RadioGroupItem value="active" id="status-active" />
                                    <Label htmlFor="status-active">Active</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="inactive" id="status-inactive" />
                                    <Label htmlFor="status-inactive">Inactive</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding Course...' : 'Add Course'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
