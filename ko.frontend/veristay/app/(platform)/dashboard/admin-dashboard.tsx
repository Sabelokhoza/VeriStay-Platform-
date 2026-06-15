'use client';

import * as React from 'react';
import Link from 'next/link';
import { Building2, Users, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminDashboardData } from '@/app/(platform)/data';

export function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                {Object.entries({
                    'Training Partners': {
                        icon: Building2,
                        ...adminDashboardData.stats.trainingPartners,
                    },
                    'Total Users': { icon: Users, ...adminDashboardData.stats.totalUsers },
                    'Active Courses': { icon: Shield, ...adminDashboardData.stats.activeCourses },
                    'Compliance Issues': {
                        icon: AlertTriangle,
                        ...adminDashboardData.stats.complianceIssues,
                    },
                }).map(([title, { icon: Icon, count, label }]) => (
                    <Card key={title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{title}</CardTitle>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Training Partners Overview */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Training Partners</h2>
                    <Link
                        href="/admin/partners"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        View all partners
                    </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    {adminDashboardData.trainingPartners.map((partner) => (
                        <Card key={partner.id}>
                            <CardHeader>
                                <CardTitle>{partner.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Active Students</p>
                                            <p className="font-medium">
                                                {partner.stats.activeStudents}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Active Courses</p>
                                            <p className="font-medium">
                                                {partner.stats.activeCourses}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Compliance Score
                                            </p>
                                            <p className="font-medium">
                                                {partner.stats.complianceScore}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Last Audit</p>
                                            <p className="font-medium">{partner.stats.lastAudit}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/admin/partners/${partner.id}`}
                                        className="inline-block text-sm text-primary hover:underline"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Recent Compliance Issues */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Compliance Issues</h2>
                    <span className="text-sm text-muted-foreground">
                        Requires immediate attention
                    </span>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {adminDashboardData.complianceIssues.map((issue) => (
                                <div key={issue.id} className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold">{issue.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {issue.partner}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/admin/compliance/${issue.id}`}
                                        className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Review
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Pending Approvals */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Pending Approvals</h2>
                    <span className="text-sm text-muted-foreground">Waiting for review</span>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {adminDashboardData.pendingApprovals.map((approval) => (
                                <div
                                    key={approval.id}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="font-semibold">{approval.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {approval.organization}
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
                                            Approve
                                        </button>
                                        <button className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:bg-destructive/90">
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
