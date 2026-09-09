export function CardTypeIcon({ type }: { type: 'visa' | 'mastercard' | 'amex' | null }) {
    if (!type) return null;
    const styles = {
        visa:       'bg-blue-700  text-white  text-[10px] font-black italic',
        mastercard: 'bg-orange-500 text-white  text-[9px]  font-bold',
        amex:       'bg-blue-500  text-white  text-[9px]  font-bold',
    };
    const labels = { visa: 'VISA', mastercard: 'MC', amex: 'AMEX' };
    return (
        <span className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 ${styles[type]}`}>
            {labels[type]}
        </span>
    );
}
