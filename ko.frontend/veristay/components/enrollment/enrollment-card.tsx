import { Card, CardContent } from '../ui/card';

import type { LucideIcon } from 'lucide-react';

interface EnrollmentCardProps {
    title: string;
    totalNumber: string | number | undefined;
    icon: LucideIcon;
    color: string;
}

const EnrollmentCard = ({
    title,
    totalNumber,
    icon: Icon,
    color = 'blue',
}: EnrollmentCardProps) => {
    const iconColor = `text-${color}-600`;
    const bgColor = `bg-${color}-100`;

    return (
        <Card className="border-2 dark:bg-primary/10 hover:shadow-lg dark:border-primary border-slate-300 shadow-sm shadow-primary/10">
            <CardContent className="flex items-center py-6 px-4">
                <div className={`p-2 rounded ${bgColor}`}>
                    {Icon ? <Icon className={`h-7 w-7 ${iconColor}`} /> : null}
                </div>
                <div className="ml-4">
                    <p className="text-muted-foreground">{title}</p>
                    <p className="text-2xl text-primary font-extrabold mt-1">{totalNumber}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default EnrollmentCard;
