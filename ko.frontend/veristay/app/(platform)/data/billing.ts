type PaymentMethod = 'card' | 'cash';
type PaymentStatus = 'paid' | 'pending' | 'failed';

interface Transaction {
    id: string;
    date: string;
    amount: number;
    status: PaymentStatus;
    description: string;
    paymentMethod: {
        type: PaymentMethod;
        details: string;
    };
    receiptNumber?: string; // For cash payments
}

interface PaymentMethodInfo {
    type: 'Credit Card';
    last4: string;
    expiryDate: string;
    brand: string;
}

interface BillingData {
    currentPlan: string;
    nextBillingDate: string;
    amount: number;
    currency: string;
    features: string[];
    preferredPaymentMethod: PaymentMethod;
    paymentMethods: {
        card?: PaymentMethodInfo;
        cash?: {
            lastPaymentDate: string;
            receiptNumber: string;
        };
    };
    recentTransactions: Transaction[];
}

export const billingData: BillingData = {
    currentPlan: 'Professional',
    nextBillingDate: '2025-08-27',
    amount: 5499.99,
    currency: 'ZAR',
    features: [
        'Unlimited Course Access',
        'Priority Support',
        'Certification Tracking',
        'Advanced Analytics',
        'Progress Reports',
        'Course Downloads',
    ],
    preferredPaymentMethod: 'card',
    paymentMethods: {
        card: {
            type: 'Credit Card',
            last4: '4242',
            expiryDate: '12/26',
            brand: 'Visa',
        },
        cash: {
            lastPaymentDate: '2025-07-01',
            receiptNumber: 'RCP-2025-0701',
        },
    },
    recentTransactions: [
        {
            id: 'inv_123',
            date: '2025-07-01',
            amount: 5499.99,
            status: 'paid',
            description: 'Professional Plan - July 2025',
            paymentMethod: {
                type: 'card',
                details: 'Visa ●●●● 4242',
            },
        },
        {
            id: 'inv_122',
            date: '2025-06-01',
            amount: 5499.99,
            status: 'paid',
            description: 'Professional Plan - June 2025',
            paymentMethod: {
                type: 'cash',
                details: 'Cash Payment',
            },
            receiptNumber: 'RCP-2025-0601',
        },
        {
            id: 'inv_121',
            date: '2025-05-01',
            amount: 5499.99,
            status: 'paid',
            description: 'Professional Plan - May 2025',
            paymentMethod: {
                type: 'card',
                details: 'Visa ●●●● 4242',
            },
        },
        {
            id: 'inv_120',
            date: '2025-04-01',
            amount: 5499.99,
            status: 'failed',
            description: 'Professional Plan - April 2025',
            paymentMethod: {
                type: 'card',
                details: 'Visa ●●●● 4242',
            },
        },
    ],
};
