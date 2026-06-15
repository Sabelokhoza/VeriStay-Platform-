'use client';

import { StudentBillingDetails } from '@/app/api/model/billing-model';
import { StudentModel } from '@/app/api/model/students-model';
import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';

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
        position: 'relative',
    },
    watermarkBackground: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        fontSize: 100,
        color: '#1a365d05',
        fontWeight: 'bold',
        zIndex: -1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
    },
    headerRight: {
        width: 350,
        marginLeft: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a365d',
        fontFamily: 'OpenSans',
        marginBottom: 15,
        textAlign: 'right',
    },
    invoiceDetailsTable: {
        width: '100%',
        backgroundColor: '#f8fafc',
        borderRadius: 4,
        overflow: 'hidden',
    },
    invoiceDetailRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    invoiceDetailLabel: {
        fontSize: 11,
        color: '#64748b',
        fontFamily: 'OpenSans',
        padding: 12,
        width: '40%',
        backgroundColor: '#f1f5f9',
    },
    invoiceDetailValue: {
        fontSize: 11,
        color: '#1a365d',
        fontFamily: 'OpenSans',
        fontWeight: 'bold',
        padding: 12,
        width: '60%',
    },
    billTo: {
        marginTop: 30,
        marginBottom: 30,
    },
    billToTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2d3748',
        fontFamily: 'OpenSans',
        marginBottom: 8,
    },
    billToText: {
        fontSize: 10,
        color: '#4a5568',
        fontFamily: 'OpenSans',
        lineHeight: 1.6,
    },
    table: {
        flexDirection: 'column',
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#1a365d',
        padding: 8,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ffffff',
        fontFamily: 'OpenSans',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        padding: 8,
        fontSize: 10,
        color: '#4a5568',
        fontFamily: 'OpenSans',
    },
    courseCol: {
        flex: 2,
    },
    dateCol: {
        flex: 1,
    },
    amountCol: {
        flex: 1,
        textAlign: 'right',
    },
    statusCol: {
        flex: 1,
        textAlign: 'right',
    },
    methodCol: {
        flex: 1,
        textAlign: 'right',
    },
    summary: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summaryDetails: {
        width: '30%',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
    },
    summaryTitle: {
        fontSize: 10,
        color: '#4a5568',
        fontFamily: 'OpenSans',
    },
    summaryValue: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2d3748',
        fontFamily: 'OpenSans',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#1a365d10',
        marginTop: 8,
    },
    totalTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a365d',
        fontFamily: 'OpenSans',
    },
    totalValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1a365d',
        fontFamily: 'OpenSans',
    },
    termsContainer: {
        marginTop: 40,
        borderTop: 1,
        borderColor: '#e2e8f0',
        paddingTop: 10,
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 5,
    },
    termsText: {
        fontSize: 8,
        color: '#4a5568',
        lineHeight: 1.4,
    },
    paymentInfo: {
        marginTop: 20,
        backgroundColor: '#1a365d10',
        padding: 10,
        borderRadius: 4,
    },
    paymentInfoTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1a365d',
        marginBottom: 5,
    },
    paymentInfoText: {
        fontSize: 8,
        color: '#4a5568',
        lineHeight: 1.4,
    },
    dueDateWarning: {
        color: '#e53e3e',
        fontSize: 8,
        marginTop: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 8,
        color: '#a0aec0',
        marginBottom: 5,
    },
    footerLine: {
        borderBottom: 1,
        borderColor: '#e2e8f0',
        marginBottom: 5,
    },
    footerContacts: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        fontSize: 8,
        color: '#4a5568',
    },
});

interface StudentInvoiceProps {
    invoiceNumber: string;
    dateIssued: string;
    dueDate: string;
    studentDetails: StudentModel;
    institutionDetails: {
        name: string;
        registrationNumber: string;
        address: string;
        contactEmail: string;
        phone: string;
    };
    coursePayments: StudentBillingDetails[];
}

export const StudentInvoicePDF = ({
    invoiceNumber,
    dateIssued,
    dueDate,
    studentDetails,
    institutionDetails,
    coursePayments,
}: StudentInvoiceProps) => {
    const totalAmount = coursePayments.reduce((sum, payment) => sum + payment.amount, 0);
    const paidAmount = coursePayments
        .filter((payment) => payment.status === 'paid')
        .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = totalAmount - paidAmount;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    <Text style={styles.watermarkBackground}>SECURE</Text>

                    <View style={styles.header}>
                        <Image
                            style={styles.logo}
                            src="public/vercel.svg" // Update with actual logo path
                        />
                        <View style={styles.headerRight}>
                            <Text style={styles.title}>INVOICE</Text>
                            <View style={styles.invoiceDetailsTable}>
                                <View style={styles.invoiceDetailRow}>
                                    <Text style={styles.invoiceDetailLabel}>Invoice Number</Text>
                                    <Text style={styles.invoiceDetailValue}>{invoiceNumber}</Text>
                                </View>
                                <View style={styles.invoiceDetailRow}>
                                    <Text style={styles.invoiceDetailLabel}>Issue Date</Text>
                                    <Text style={styles.invoiceDetailValue}>
                                        {format(new Date(dateIssued), 'dd MMM yyyy')}
                                    </Text>
                                </View>
                                <View style={styles.invoiceDetailRow}>
                                    <Text style={styles.invoiceDetailLabel}>Due Date</Text>
                                    <Text style={styles.invoiceDetailValue}>
                                        {format(new Date(dueDate), 'dd MMM yyyy')}
                                    </Text>
                                </View>
                                <View style={[styles.invoiceDetailRow, { borderBottomWidth: 0 }]}>
                                    <Text style={styles.invoiceDetailLabel}>PSiRA Reg</Text>
                                    <Text style={styles.invoiceDetailValue}>
                                        {institutionDetails.registrationNumber}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.billTo}>
                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.billToTitle}>From:</Text>
                            <Text style={styles.billToText}>{institutionDetails.name}</Text>
                            <Text style={styles.billToText}>
                                Reg #: {institutionDetails.registrationNumber}
                            </Text>
                            <Text style={styles.billToText}>{institutionDetails.address}</Text>
                            <Text style={styles.billToText}>
                                Email: {institutionDetails.contactEmail}
                            </Text>
                            <Text style={styles.billToText}>Phone: {institutionDetails.phone}</Text>
                        </View>

                        <View>
                            <Text style={styles.billToTitle}>Bill To:</Text>
                            <Text style={styles.billToText}>
                                {studentDetails.firstName} {studentDetails.lastName}
                            </Text>
                            <Text style={styles.billToText}>Student ID: {studentDetails.id}</Text>
                            {studentDetails.psiraNumber && (
                                <Text style={styles.billToText}>
                                    PSiRA #: {studentDetails.psiraNumber}
                                </Text>
                            )}
                            <Text style={styles.billToText}>Email: {studentDetails.email}</Text>
                            {studentDetails.address && (
                                <Text style={styles.billToText}>{studentDetails.address}</Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.courseCol}>Course</Text>
                            <Text style={styles.dateCol}>Registration Date</Text>
                            <Text style={styles.methodCol}>Payment Method</Text>
                            <Text style={styles.amountCol}>Amount</Text>
                            <Text style={styles.statusCol}>Status</Text>
                        </View>
                        {coursePayments.map((payment) => (
                            <View key={payment.id} style={styles.tableRow}>
                                <Text style={styles.courseCol}>{payment.courseName}</Text>
                                <Text style={styles.dateCol}>
                                    {format(new Date(payment.registrationDate), 'dd MMM yyyy')}
                                </Text>
                                <Text style={styles.methodCol}>
                                    {payment.method
                                        ? payment.method
                                              .replace('_', ' ')
                                              .replace(/\b\w/g, (c) => c.toUpperCase())
                                        : 'N/A'}
                                </Text>
                                <Text style={styles.amountCol}>
                                    R {payment.amount.toLocaleString()}
                                </Text>
                                <Text style={styles.statusCol}>
                                    {payment.status.charAt(0).toUpperCase() +
                                        payment.status.slice(1)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.summary}>
                        <View style={styles.summaryDetails}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryTitle}>Total Amount:</Text>
                                <Text style={styles.summaryValue}>
                                    R {totalAmount.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryTitle}>Amount Paid:</Text>
                                <Text style={styles.summaryValue}>
                                    R {paidAmount.toLocaleString()}
                                </Text>
                            </View>
                            <View style={styles.totalRow}>
                                <Text style={styles.totalTitle}>Amount Due:</Text>
                                <Text style={styles.totalValue}>
                                    R {pendingAmount.toLocaleString()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.termsContainer}>
                        <Text style={styles.termsTitle}>Terms and Conditions</Text>
                        <Text style={styles.termsText}>
                            1. All fees are payable in advance before commencement of training.
                            {'\n'}
                            2. Cancellations must be made at least 5 working days before the course
                            start date for a full refund.{'\n'}
                            3. A 50% cancellation fee applies for cancellations made less than 5
                            working days before the course.{'\n'}
                            4. Students must present valid identification and PSiRA registration
                            number on the first day of training.{'\n'}
                            5. Course fees include study materials, assessments, and certification
                            upon successful completion.{'\n'}
                            6. The institution reserves the right to withhold certificates until
                            full payment is received.{'\n'}
                            7. All training is conducted in accordance with PSiRA regulations and
                            standards.
                        </Text>

                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentInfoTitle}>Payment Information</Text>
                            <Text style={styles.paymentInfoText}>
                                Bank: Standard Bank{'\n'}
                                Account Name: {institutionDetails.name}
                                {'\n'}
                                Account Number: 1234567890{'\n'}
                                Branch Code: 051001{'\n'}
                                Reference: {studentDetails.id}
                            </Text>
                            {pendingAmount > 0 && (
                                <Text style={styles.dueDateWarning}>
                                    * Payment is due by {format(new Date(dueDate), 'dd MMM yyyy')}.
                                    Late payments may result in suspension of training services.
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.footerLine} />
                        <Text style={styles.footerText}>
                            This is an official invoice issued by {institutionDetails.name}
                        </Text>
                        <View style={styles.footerContacts}>
                            <Text>{institutionDetails.phone}</Text>
                            <Text>{institutionDetails.contactEmail}</Text>
                            <Text>PSiRA Reg: {institutionDetails.registrationNumber}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
