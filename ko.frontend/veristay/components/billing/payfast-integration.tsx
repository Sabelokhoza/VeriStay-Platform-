export interface PaymentResponse {
    success: boolean;
    message?: string;
    transactionId?: string;
}

export const initiatePayment = async (
    userId: string,
    paymentName: string,
    amount: number,
    enrollmentId?: string | number
): Promise<PaymentResponse> => {
    try {
        const form = document.createElement('form');
        console.log('Payment initiation started for user:', userId, 'with amount:', amount);
        form.action =
            process.env.NEXT_PUBLIC_PAYMENT_GATEWAY || 'https://sandbox.payfast.co.za/eng/process';
        form.method = 'post';

        const port = globalThis.location.port ? `:${globalThis.location.port}` : '';
        const baseUrl = `${globalThis.location.protocol}//${globalThis.location.hostname}${port}`;

        let return_url = `${baseUrl}/billing?status=success`;
        let cancel_url = `${baseUrl}/billing?status=cancelled`;

        if (enrollmentId) {
            return_url += `&enrollmentId=${enrollmentId}&amount=${amount}`;
            cancel_url += `&enrollmentId=${enrollmentId}`;
        }

        const formData = {
            merchant_id: process.env.NEXT_PUBLIC_MERCHANT_ID,
            merchant_key: process.env.NEXT_PUBLIC_MERCHANT_KEY,
            amount: amount.toString(),
            item_name: paymentName,
            return_url: return_url,
            cancel_url: cancel_url,
            custom_str1: userId,
            custom_str2: enrollmentId ? enrollmentId.toString() : '',
        };

        console.log('Initiating payment with data:', formData);
        for (const [key, value] of Object.entries(formData)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value ?? '';
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
        form.remove();

        return {
            success: true,
            message: 'Payment initiated successfully',
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Payment initiation failed',
        };
    }
};
