import { statusStyles } from './utils';

export function StatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[status] ?? 'bg-gray-100 text-gray-700'}`}
        >
            {status}
        </span>
    );
}
