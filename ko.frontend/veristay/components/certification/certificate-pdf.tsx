import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Register custom font
Font.register({
    family: 'OpenSans',
    src: 'https://fonts.gstatic.com/s/opensans/v28/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVQUwaEQbjB_mQ.woff',
});

const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: '#ffffff',
        fontFamily: 'OpenSans',
    },
    container: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#1a365d', // Blue border
        padding: 15,
        position: 'relative',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    institutionName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a365d',
        marginBottom: 5,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    header: {
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#2d3748',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 10,
        color: '#718096',
        textAlign: 'center',
    },
    recipientName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1a365d',
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e0',
        paddingBottom: 5,
        width: '80%',
    },
    text: {
        fontSize: 12,
        marginBottom: 3,
        color: '#4a5568',
        textAlign: 'center',
    },
    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2d3748',
        textAlign: 'center',
    },
    dateContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    dateText: {
        fontSize: 10,
        color: '#718096',
    },
    footer: {
        marginTop: 30,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    signature: {
        borderTopWidth: 1,
        borderColor: '#718096',
        paddingTop: 5,
        width: 150,
        alignItems: 'center',
    },
    signatureName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2d3748',
    },
    signatureTitle: {
        fontSize: 10,
        color: '#718096',
    },
});

interface CertificatePDFProps {
    recipientName: string;
    certification: {
        title: string;
        psiraNumber: string;
        issueDate: string;
        level: string;
        authority: string;
    };
    institutionName?: string; // Add if available in props from parent
}

export const CertificatePDF = ({
    recipientName,
    certification,
    institutionName,
}: CertificatePDFProps) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    {/* Institution Name */}
                    <Text style={styles.institutionName}>
                        {institutionName || certification.authority || 'TRAINING INSTITUTION'}
                    </Text>

                    <View style={styles.header}>
                        <Text style={styles.title}>Certificate of Completion</Text>
                        <Text style={styles.subtitle}>This is to certify that</Text>
                    </View>

                    <Text style={styles.recipientName}>{recipientName}</Text>

                    <Text style={styles.text}>Has successfully completed the course</Text>

                    <Text style={styles.courseName}>{certification.title}</Text>

                    <Text style={styles.text}>
                        {certification.level} Level Security Officer Training
                    </Text>

                    <Text style={styles.text}>PSiRA Number: {certification.psiraNumber}</Text>

                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>
                            Awarded on {format(new Date(certification.issueDate), 'MMMM dd, yyyy')}
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.signature}>
                            {/* Signature Image or Placeholder */}
                            <Text style={styles.signatureName}>Mr. Brendon</Text>
                            <Text style={styles.signatureTitle}>Director of Training</Text>
                        </View>
                    </View>

                    <Text
                        style={{
                            marginTop: 20,
                            fontSize: 10,
                            color: '#a0aec0',
                            textAlign: 'center',
                        }}
                    >
                        Powered by KodeOnce Pty Ltd
                    </Text>
                </View>
            </View>
        </Page>
    </Document>
);
