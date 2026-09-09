export function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function formatRent(amount: number) {
    return new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 0 }).format(amount);
}

export function isPlaceholder(v: string | null | undefined) {
    if (!v) return true;
    const l = v.trim().toLowerCase();
    return l === 'string' || l === 'string - string' || l === '';
}
