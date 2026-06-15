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
import { Plus } from 'lucide-react';
import { useAddModuleResourceMutation } from '@/app/errors/coursesApi';

interface AddModuleResourceModalProps {
    moduleId?: number;
    modeleId?: number; // Support the typo from parent component
    onSuccess?: () => void;
}

interface AddModuleResourceInput {
    title: string;
    type: string;
    moduleId: number;
    formFile: File | null;
}

export function AddModuleResourceModal({
    moduleId,
    modeleId,
    onSuccess,
}: AddModuleResourceModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [addModuleResource, { isLoading }] = useAddModuleResourceMutation();
    const [errors, setErrors] = useState<string[]>([]);

    // Handle both prop names (moduleId and modeleId typo from parent)
    const actualModuleId = moduleId ?? modeleId ?? 0;

    const [formData, setFormData] = useState<AddModuleResourceInput>({
        title: '',
        type: 'pdf',
        moduleId: actualModuleId,
        formFile: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData((prev) => ({ ...prev, formFile: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        // Validate moduleId exists
        if (!actualModuleId || actualModuleId === 0) {
            setErrors(['Module ID is required']);
            toast.error('Module ID is missing');
            return;
        }

        // Validate file is selected
        if (!formData.formFile) {
            setErrors(['Please select a file to upload']);
            return;
        }

        try {
            await addModuleResource({
                title: formData.title,
                type: formData.type,
                moduleId: actualModuleId,
                file: formData.formFile,
            }).unwrap();

            toast.success('Resource added successfully');
            setIsOpen(false);
            setFormData({
                title: '',
                type: 'pdf',
                moduleId: actualModuleId,
                formFile: null,
            });

            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            // Handle RTK Query error format
            if (error?.data?.details && error.data.details.length > 0) {
                setErrors(error.data.details);
            } else if (error?.data?.message) {
                setErrors([error.data.message]);
            } else {
                toast.error('Failed to add resource. Please try again.');
            }
            console.error('Add resource error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add PDF
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Resource</DialogTitle>
                        <DialogDescription>
                            Upload a PDF resource for this module.
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
                                Title *
                            </Label>
                            <Input
                                id="title"
                                className="col-span-3"
                                placeholder="e.g., Security Handbook"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type *
                            </Label>
                            <Input
                                id="type"
                                className="col-span-3"
                                placeholder="e.g., pdf"
                                value={formData.type}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="formFile" className="text-right">
                                File *
                            </Label>
                            <Input
                                id="formFile"
                                type="file"
                                className="col-span-3"
                                accept=".pdf"
                                onChange={handleFileChange}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding Resource...' : 'Add Resource'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
