'use client';

import {
    BadgeCheck,
    Building2,
    Calendar,
    Home,
    Mail,
    Phone,
    ShieldCheck,
    User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { userDto } from '@/app/api/dtos/dtos';

const BillingStudentCard = ({ student }: { student: userDto }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Student Information
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Full Name:
                        </span>
                        <span className="font-medium">
                            {student.firstName} {student.lastName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Student ID:
                        </span>
                        <span className="font-mono text-sm">{student.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Email:</span>
                        <span className="text-sm">{student.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">Phone:</span>
                        <span className="text-sm">{student.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Date of Birth:
                        </span>
                        <span className="text-sm">{student.dateOfBirth}</span>
                    </div>
                    {student.psiraNumber && (
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">
                                PSiRA Number:
                            </span>
                            <span className="font-mono text-sm">{student.psiraNumber}</span>
                        </div>
                    )}
                    {student.address && (
                        <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-muted-foreground">
                                Address:
                            </span>
                            <span className="text-sm">{student.address}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Training Center:
                        </span>
                        <span className="text-sm">{student.trainingCenterName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <BadgeCheck
                            className={`h-4 w-4 ${student.isActive ? 'text-green-500' : 'text-red-500'}`}
                        />
                        <span className="text-sm font-medium text-muted-foreground">Status:</span>
                        <span className="text-sm font-semibold">
                            {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BillingStudentCard;
