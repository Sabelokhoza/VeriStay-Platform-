'use client';

import { format } from 'date-fns';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { StudentModel } from '@/app/api/model/students-model';
import { CoursePayment } from '@/app/(platform)/billing/data';

// Register custom font
Font.register({
    family: 'OpenSans',
    src: 'https://fonts.gstatic.com/s/opensans/v28/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjB_mQ.woff',
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'OpenSans',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        borderBottomWidth: 2,
        borderBottomColor: '#1a365d',
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a365d',
        fontFamily: 'OpenSans',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    date: {
        fontSize: 10,
        color: '#666',
        textAlign: 'right',
    },
    summarySection: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a365d',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 5,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    statCard: {
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 4,
        width: '23%',
        textAlign: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a365d',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 20,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#f8fafc',
    },
    tableColHeader: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 8,
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 5,
    },
    tableCellHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1a365d',
    },
    tableCell: {
        fontSize: 9,
        color: '#374151',
    },
    statusPaid: {
        color: '#059669',
        fontWeight: 'bold',
    },
    statusPending: {
        color: '#d97706',
        fontWeight: 'bold',
    },
    statusOverdue: {
        color: '#dc2626',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#666',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
});

interface SummaryReportProps {
    students: StudentModel[];
    reportTitle: string;
    generatedBy: string;
    institutionDetails?: {
        name: string;
        registrationNumber: string;
        address: string;
        contactEmail: string;
        phone: string;
    };
}

export const SummaryReportPDF = ({
    students,
    reportTitle,
    generatedBy,
    institutionDetails,
}: SummaryReportProps) => {
    // Calculate statistics
    const allPayments = students.flatMap((s) => s.coursePayments);
    const totalRevenue = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidPayments = allPayments.filter((p) => p.status === 'paid');
    const pendingPayments = allPayments.filter((p) => p.status === 'pending');
    const overduePayments = allPayments.filter((p) => p.status === 'overdue');

    // Function to get status style
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'paid':
                return styles.statusPaid;
            case 'pending':
                return styles.statusPending;
            case 'overdue':
                return styles.statusOverdue;
            default:
                return {};
        }
    };

    // Group students by PSiRA grade
    const psiraGrades: { [key: string]: StudentModel[] } = {};
    students.forEach((student) => {
        student.coursePayments.forEach((payment: CoursePayment) => {
            const gradeRegex = /Grade [A-E]/;
            const gradeMatch = gradeRegex.exec(payment.courseName);
            const grade = gradeMatch ? gradeMatch[0] : 'Other';
            if (!psiraGrades[grade]) {
                psiraGrades[grade] = [];
            }
            if (!psiraGrades[grade].find((s) => s.id === student.id)) {
                psiraGrades[grade].push(student);
            }
        });
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>{reportTitle}</Text>
                            <Text style={styles.subtitle}>
                                {institutionDetails?.name || 'PSiRA Training Council'}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.date}>
                                Generated: {format(new Date(), 'dd/MM/yyyy HH:mm')}
                            </Text>
                            <Text style={styles.date}>By: {generatedBy}</Text>
                        </View>
                    </View>

                    {/* Summary Statistics */}
                    <View style={styles.summarySection}>
                        <Text style={styles.sectionTitle}>Payment Summary</Text>
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>
                                    R {totalRevenue.toLocaleString()}
                                </Text>
                                <Text style={styles.statLabel}>Total Revenue</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, styles.statusPaid]}>
                                    {paidPayments.length}
                                </Text>
                                <Text style={styles.statLabel}>Paid</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, styles.statusPending]}>
                                    {pendingPayments.length}
                                </Text>
                                <Text style={styles.statLabel}>Pending</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={[styles.statValue, styles.statusOverdue]}>
                                    {overduePayments.length}
                                </Text>
                                <Text style={styles.statLabel}>Overdue</Text>
                            </View>
                        </View>
                    </View>

                    {/* PSiRA Grades Breakdown */}
                    <View style={styles.summarySection}>
                        <Text style={styles.sectionTitle}>Students by PSiRA Grade</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>PSiRA Grade</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Students</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Total Revenue</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Paid</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Pending</Text>
                                </View>
                            </View>
                            {Object.entries(psiraGrades).map(([grade, gradeStudents]) => {
                                const gradePayments = gradeStudents.flatMap((s) =>
                                    s.coursePayments.filter(
                                        (p: { courseName: string | string[] }) =>
                                            p.courseName.includes(grade)
                                    )
                                );
                                const gradeRevenue = gradePayments.reduce(
                                    (sum, p) => sum + p.amount,
                                    0
                                );
                                const gradePaid = gradePayments.filter(
                                    (p) => p.status === 'paid'
                                ).length;
                                const gradePending = gradePayments.filter(
                                    (p) => p.status === 'pending'
                                ).length;

                                return (
                                    <View style={styles.tableRow} key={grade}>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>{grade}</Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>
                                                {gradeStudents.length}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={styles.tableCell}>
                                                R {gradeRevenue.toLocaleString()}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={[styles.tableCell, styles.statusPaid]}>
                                                {gradePaid}
                                            </Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={[styles.tableCell, styles.statusPending]}>
                                                {gradePending}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Detailed Student List */}
                    <View style={styles.summarySection}>
                        <Text style={styles.sectionTitle}>Detailed Student Payments</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableRow, styles.tableHeader]}>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Student Name</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Student ID</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Course</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Amount</Text>
                                </View>
                                <View style={styles.tableColHeader}>
                                    <Text style={styles.tableCellHeader}>Status</Text>
                                </View>
                            </View>
                            {students.slice(0, 20).map((student) =>
                                student.coursePayments.map(
                                    (payment: CoursePayment, index: number) => (
                                        <View
                                            style={styles.tableRow}
                                            key={`${student.id}-${payment.id}`}
                                        >
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>
                                                    {index === 0 ? student.firstName : ''}
                                                </Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>
                                                    {index === 0 ? student.id : ''}
                                                </Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>
                                                    {payment.courseName}
                                                </Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text style={styles.tableCell}>
                                                    R {payment.amount.toLocaleString()}
                                                </Text>
                                            </View>
                                            <View style={styles.tableCol}>
                                                <Text
                                                    style={[
                                                        styles.tableCell,
                                                        getStatusStyle(payment.status),
                                                    ]}
                                                >
                                                    {payment.status.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                    )
                                )
                            )}
                        </View>
                        {students.length > 20 && (
                            <Text
                                style={[styles.tableCell, { textAlign: 'center', marginTop: 10 }]}
                            >
                                ... and {students.length - 20} more students
                            </Text>
                        )}
                    </View>

                    {/* Footer */}
                    <Text style={styles.footer}>
                        This report was automatically generated by the PSiRA Training Council System
                        {institutionDetails &&
                            ` • ${institutionDetails.contactEmail} • ${institutionDetails.phone}`}
                    </Text>
                </View>
            </Page>
        </Document>
    );
};
