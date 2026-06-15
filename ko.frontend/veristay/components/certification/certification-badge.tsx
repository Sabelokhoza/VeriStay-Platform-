'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Calendar, Hash, Clock, CheckCircle, FileCheck } from 'lucide-react';

interface CertificationBadgeProps {
    certification: {
        id: string;
        title: string;
        psiraNumber: string;
        issueDate: string;
        expiryDate?: string;
        level: string;
        status: 'active' | 'expired' | 'pending';
        validityPeriod: string;
        requirements: string[];
        authority: string;
        trainingHours: number;
    };
}

export function CertificationBadge({ certification }: CertificationBadgeProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'expired':
                return 'bg-red-500/10 text-red-600 border-red-500/20';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    return (
        <Card className="border-primary/10 hover:shadow-md transition-all duration-300">
            <CardHeader className="border-b bg-muted/50">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-semibold">
                            {certification.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{certification.authority}</p>
                    </div>
                    <Badge
                        variant={certification.status === 'active' ? 'default' : 'secondary'}
                        className={`${getStatusColor(certification.status)} flex items-center gap-1`}
                    >
                        {certification.status === 'active' && <CheckCircle className="h-3 w-3" />}
                        {certification.status === 'pending' && <Clock className="h-3 w-3" />}
                        {certification.status === 'expired' && <FileCheck className="h-3 w-3" />}
                        {certification.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">PSiRA Number</span>
                        <p className="font-medium flex items-center gap-2">
                            <Hash className="h-4 w-4 text-primary" />
                            {certification.psiraNumber}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">Level</span>
                        <p className="font-medium flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            {certification.level}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Validity Period</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                                {new Date(certification.issueDate).toLocaleDateString('en-ZA')}
                            </span>
                        </div>
                        {certification.expiryDate && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>
                                    {new Date(certification.expiryDate).toLocaleDateString('en-ZA')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Requirements ({certification.trainingHours} hours)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {certification.requirements.map((req) => (
                            <div
                                key={req}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                                <CheckCircle className="h-4 w-4 text-primary/60" />
                                <span>{req}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
