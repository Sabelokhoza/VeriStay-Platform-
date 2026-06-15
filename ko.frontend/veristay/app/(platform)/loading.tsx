import { Loader2Icon } from 'lucide-react';
import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <Loader2Icon className="h-12 w-12 animate-spin text-sky-600" />
                <h2 className="text-xl font-medium text-sky-900">Loading information</h2>
                <p className="text-sm text-sky-600">Just a moment...</p>
            </div>
        </div>
    );
};

export default Loading;
