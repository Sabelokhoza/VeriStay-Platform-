import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const SharedCard = ({
    title,
    description,
    className,
    children,
}: Readonly<{
    title: string;
    description: string;
    className?: string;
    children: React.ReactNode;
}>) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className={className}>{children}</CardContent>
        </Card>
    );
};

export default SharedCard;
