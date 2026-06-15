import { montserrat } from '@/lib/fonts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

export type Step = {
    title: string;
    description: string;
};

type ProcessCardProps = {
    steps: Step[];
};

export default function ProcessCards({ steps }: ProcessCardProps) {
    return (
        <div className="grid lg:grid-cols-3 gap-3 p-8">
            {steps.map((step, index) => (
                <Card key={index} className="p-4 text-center bg-neutral-100 dark:bg-card">
                    <CardHeader>
                        <CardTitle className={`${montserrat.className}`}>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p>{step.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
