'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CertificationFormValues, certificationSchema } from './admin-manage-page';

export default function StudentManagePage() {
    const [isUploading, setIsUploading] = useState(false);
    const [certificates, setCertificates] = useState<CertificationFormValues[]>([]);

    const form = useForm({
        resolver: zodResolver(certificationSchema),
        defaultValues: {
            psiraGrade: 'A' as const,
            issueDate: '',
            certificateNumber: '',
            issuer: '',
            file: undefined,
        },
    });

    async function onSubmit(data: CertificationFormValues) {
        try {
            setIsUploading(true);
            // TODO: Implement certificate upload logic
            setCertificates([...certificates, data]);
            toast({
                title: 'Success',
                description: 'Certificate uploaded successfully',
            });
            form.reset();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to upload certificate',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="space-y-8">
            <section>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">My Certifications</h1>
                    <p className="mt-2 text-muted-foreground">
                        Upload and manage your certifications
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Certificate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="psiraGrade"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>PSIRA Grade</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select grade" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="A">Grade A</SelectItem>
                                                        <SelectItem value="B">Grade B</SelectItem>
                                                        <SelectItem value="C">Grade C</SelectItem>
                                                        <SelectItem value="D">Grade D</SelectItem>
                                                        <SelectItem value="E">Grade E</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="issueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Issue Date</FormLabel>
                                                <Input type="date" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="certificateNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate Number</FormLabel>
                                                <Input {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="issuer"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Issuer</FormLabel>
                                                <Input {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="file"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Certificate File</FormLabel>
                                                <FileUpload
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={field.onChange}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isUploading}>
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Certificate
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Certificates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {certificates.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No certificates uploaded yet
                                    </p>
                                ) : (
                                    certificates.map((cert, index) => (
                                        <div
                                            key={cert.certificateNumber}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div>
                                                <h3 className="font-medium">
                                                    PSIRA Grade {cert.psiraGrade}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Certificate #{cert.certificateNumber}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Issued by {cert.issuer} on{' '}
                                                    {new Date(cert.issueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Download
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
