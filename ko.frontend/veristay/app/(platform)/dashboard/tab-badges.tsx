'use client';

import { useEffect, useMemo, useState } from 'react';

const tones = {
    red:    'bg-red-500',
    orange: 'bg-orange-500',
    green:  'bg-green-500',
    blue:   'bg-blue-500',
} as const;

export type BadgeTone = keyof typeof tones;

/** Small count bubble shown next to a dashboard tab label. Renders nothing for 0. */
export function TabBadge({ count, tone = 'red' }: { count: number; tone?: BadgeTone }) {
    if (count <= 0) return null;
    return (
        <span className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${tones[tone]}`}>
            {count > 9 ? '9+' : count}
        </span>
    );
}

function readSeen(storageKey: string): Set<string> {
    try {
        const raw = localStorage.getItem(storageKey);
        return new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
        return new Set();
    }
}

function writeSeen(storageKey: string, seen: Set<string>) {
    try {
        localStorage.setItem(storageKey, JSON.stringify([...seen]));
    } catch {
        // Storage unavailable (private mode etc.) — badges just won't persist as seen.
    }
}

/**
 * Counts items the user has not looked at yet, for "something new arrived" badges
 * (announcements, landlord responses, signed leases...). Each key should change when
 * the item changes in a way worth flagging again, e.g. `${id}:${respondedAt}`.
 * Opening the tab (isActive) marks every current key as seen. Seen state is per
 * browser, kept in localStorage.
 */
export function useUnseenCount(storageKey: string, keys: string[], isActive: boolean): number {
    const [seen, setSeen] = useState<Set<string> | null>(null);
    const keysId = keys.join('|');

    // Read after mount so server and client render the same markup.
    useEffect(() => {
        setSeen(readSeen(storageKey));
    }, [storageKey]);

    useEffect(() => {
        if (!isActive || seen === null || keys.length === 0) return;
        if (keys.every(k => seen.has(k))) return;
        const next = new Set(seen);
        keys.forEach(k => next.add(k));
        writeSeen(storageKey, next);
        setSeen(next);
        // keysId stands in for keys so a new array with the same contents doesn't re-run this.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, seen, storageKey, keysId]);

    return useMemo(() => {
        if (seen === null || isActive) return 0;
        return keys.filter(k => !seen.has(k)).length;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seen, isActive, keysId]);
}
