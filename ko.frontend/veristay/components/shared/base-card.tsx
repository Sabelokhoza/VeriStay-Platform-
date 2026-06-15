import { Card } from '../ui/card';

const BaseCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card className="p-4 border-2 dark:bg-primary/10 border-slate-300 dark:border-primary hover:shadow-lg shadow-sm shadow-primary/10 pb-6">
            {children}
        </Card>
    );
};

export default BaseCard;
