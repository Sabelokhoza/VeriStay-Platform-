enum PSIRAGrade {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
}

enum ProvinceEnum {
    Gauteng = 'Gauteng',
    WesternCape = 'Western Cape',
    KwaZuluNatal = 'KwaZulu-Natal',
    EasternCape = 'Eastern Cape',
    FreeState = 'Free State',
    Limpopo = 'Limpopo',
    Mpumalanga = 'Mpumalanga',
    NorthWest = 'North West',
    NorthernCape = 'Northern Cape',
}

enum ReportEnum {
    StudentProgress = 'Student Progress',
    CourseCompletion = 'Course Completion',
    PaymentHistory = 'Payment History',
    EnrollmentStats = 'Enrollment Stats',
    AssessmentResults = 'Assessment Results',
    PartnerPerformance = 'Partner Performance',
}

enum RatingEnum {
    Excellent = 'Excellent',
    Good = 'Good',
    Average = 'Average',
    Poor = 'Poor',
    VeryPoor = 'Very Poor',
}

enum PaymentStatus {
    Paid = 'paid',
    Pending = 'pending',
    Overdue = 'overdue',
    Unpaid = 'unpaid',
    Cancelled = 'cancelled',
}

enum PaymentMethod {
    Cash = 'cash',
    CreditCard = 'credit_card',
    BankTransfer = 'bank_transfer',
    Online = 'online',
}

enum ActiveStatus {
    Active = 'active',
    Inactive = 'inactive',
}

const employmentOutcome: Record<string, string[]> = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
};

enum ModuleContentType {
    Text = 'text',
    Video = 'video',
    Pdf = 'pdf',
    Image = 'image',
}

export {
    ActiveStatus,
    employmentOutcome,
    ModuleContentType,
    PaymentMethod,
    PaymentStatus,
    ProvinceEnum,
    PSIRAGrade,
    RatingEnum,
    ReportEnum,
};
