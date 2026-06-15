import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Certification } from '../data/mock';

interface StudentListProps {
    certifications: Certification[];
    selectedStudentId: string | null;
    onStudentSelect: (studentId: string | null) => void;
}

export function StudentList({
    certifications,
    selectedStudentId,
    onStudentSelect,
}: StudentListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Students</span>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            placeholder="Search by name or ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="space-y-2">
                            {Array.from(new Set(certifications.map((cert) => cert.studentId)))
                                .filter((studentId) => {
                                    if (!studentId) return false;
                                    const student = certifications.find(
                                        (c) => c.studentId === studentId
                                    );
                                    return (
                                        student?.studentName
                                            ?.toLowerCase()
                                            .includes(searchTerm.toLowerCase()) ||
                                        studentId.toLowerCase().includes(searchTerm.toLowerCase())
                                    );
                                })
                                .map((studentId) => {
                                    if (!studentId) return null;
                                    const studentCerts = certifications.filter(
                                        (c) => c.studentId === studentId
                                    );
                                    if (!studentCerts.length || !studentCerts[0].studentName)
                                        return null;

                                    return (
                                        <button
                                            key={studentId}
                                            type="button"
                                            onClick={() => onStudentSelect(studentId)}
                                            className={`w-full p-3 text-left rounded-lg border transition-colors ${
                                                selectedStudentId === studentId
                                                    ? 'bg-primary/5 border-primary'
                                                    : 'hover:bg-muted/50 border-muted'
                                            }`}
                                        >
                                            <div className="font-medium">
                                                {studentCerts[0].studentName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                ID: {studentId} • {studentCerts.length}{' '}
                                                certification(s)
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Certifications Overview</CardTitle>
                    {selectedStudentId && (
                        <p className="text-sm text-muted-foreground">
                            {
                                certifications.find((c) => c.studentId === selectedStudentId)
                                    ?.studentName
                            }
                            &apos;s certifications
                        </p>
                    )}
                </CardHeader>
                <CardContent>
                    {selectedStudentId ? (
                        <div className="grid gap-4">
                            {certifications
                                .filter((cert) => cert.studentId === selectedStudentId)
                                .map((cert) => (
                                    <Card key={cert.id}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between text-base">
                                                {cert.title}
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        {
                                                            active: 'bg-green-100 text-green-800',
                                                            expired: 'bg-red-100 text-red-800',
                                                            pending:
                                                                'bg-yellow-100 text-yellow-800',
                                                        }[cert.status]
                                                    }`}
                                                >
                                                    {cert.status.charAt(0).toUpperCase() +
                                                        cert.status.slice(1)}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <dl className="space-y-2 text-sm">
                                                <div>
                                                    <dt className="text-muted-foreground">
                                                        PSiRA Number
                                                    </dt>
                                                    <dd className="font-medium">
                                                        {cert.psiraNumber}
                                                    </dd>
                                                </div>
                                                <div>
                                                    <dt className="text-muted-foreground">Level</dt>
                                                    <dd className="font-medium">{cert.level}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-muted-foreground">
                                                        Issue Date
                                                    </dt>
                                                    <dd className="font-medium">
                                                        {new Date(
                                                            cert.issueDate
                                                        ).toLocaleDateString()}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                            <h3 className="font-medium mb-2">No Student Selected</h3>
                            <p className="text-sm">
                                Click on a student to view their certification details.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
