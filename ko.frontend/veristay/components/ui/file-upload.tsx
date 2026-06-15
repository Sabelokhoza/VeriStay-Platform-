import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
    accept?: string;
    onChange: (file: File) => void;
}

export function FileUpload({ accept, onChange }: FileUploadProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    return (
        <div className="grid w-full items-center gap-1.5">
            <Input type="file" accept={accept} onChange={handleChange} className="cursor-pointer" />
        </div>
    );
}
