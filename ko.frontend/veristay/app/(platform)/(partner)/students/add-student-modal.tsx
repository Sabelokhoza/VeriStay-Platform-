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
import { DatePicker } from '@heroui/react';
import { useState } from 'react';
import { useAddStudentMutation } from '@/app/errors/trainingCenterApi';
import { toast } from 'react-toastify';
import { CreateStudentInput } from '@/types/student';

interface AddStudentModalProps {
    onSuccess?: () => void;
}

export function AddStudentModal({ onSuccess }: AddStudentModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [citizenship, setCitizenship] = useState('south-african');
    const [addStudent, { isLoading }] = useAddStudentMutation();
    const [errors, setErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState<CreateStudentInput>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        psiraNumber: '',
        idNumber: '',
        dateOfBirth: '',
        isSouthAfrican: true,
        address: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        const submitData = {
            ...formData,
            isSouthAfrican: citizenship === 'south-african',
            dateOfBirth: citizenship === 'south-african' ? '0001-01-01' : formData.dateOfBirth,
        };

        try {
            const response = await addStudent(submitData).unwrap();
            toast.success('Student added successfully');
            setIsOpen(false);
            setCitizenship('south-african');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                psiraNumber: '',
                idNumber: '',
                dateOfBirth: '',
                isSouthAfrican: true,
                address: '',
                password: '',
            });
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            if (error?.data?.details && error.data.details.length > 0) {
                setErrors(error.data.details);
            } else {
                toast.error('Failed to add student. Please try again.');
            }
            console.error('Add student error:', error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Add Student</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                        <DialogDescription>
                            Enter the student's details below to create a new student record.
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
                        <div className="space-y-2">
                            <Label className="block">Citizenship</Label>
                            <RadioGroup
                                value={citizenship}
                                onValueChange={(value) => setCitizenship(value)}
                                className="flex space-x-4"
                                disabled={isLoading}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="south-african"
                                        id="modal-south-african"
                                    />
                                    <Label htmlFor="modal-south-african">South African</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="modal-other" />
                                    <Label htmlFor="modal-other">Other</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="idNumber" className="text-right">
                                ID/Passport
                            </Label>
                            <Input
                                id="idNumber"
                                className="col-span-3"
                                placeholder="Enter ID or passport number"
                                value={formData.idNumber}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, idNumber: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                className="col-span-3"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                className="col-span-3"
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        {citizenship === 'other' && (
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dateOfBirth" className="text-right">
                                    Date of Birth
                                </Label>
                                <div className="col-span-3">
                                    <DatePicker
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        isDisabled={isLoading}
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                dateOfBirth: value?.toString() || '',
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="address" className="text-right pt-2">
                                Address
                            </Label>
                            <textarea
                                id="address"
                                rows={3}
                                className="col-span-3 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                placeholder="Enter full address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                className="col-span-3"
                                placeholder="Enter phone number"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        phoneNumber: e.target.value,
                                    }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="col-span-3"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="psiraNumber" className="text-right">
                                PSiRA Number
                            </Label>
                            <Input
                                id="psiraNumber"
                                className="col-span-3"
                                placeholder="Enter PSiRA number (optional)"
                                value={formData.psiraNumber}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        psiraNumber: e.target.value,
                                    }))
                                }
                                disabled={isLoading}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                className="col-span-3"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                    }))
                                }
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding Student...' : 'Add Student'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
