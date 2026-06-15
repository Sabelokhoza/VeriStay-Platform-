import { Badge, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';

const EnrollmentCurrent = ({
    courseName,
    status,
    amount,
    progress,
}: Readonly<{ courseName: string; status: string; amount: number; progress: number }>) => {
    const statusIcons: Record<string, React.ElementType> = {
        paid: CheckCircle,
        pending: Clock,
        failed: XCircle,
    };
    const StatusIcon = statusIcons[status] || CheckCircle;
    return (
        <Card className="border hover:shadow-md  border-blue-500/40 shadow-sm  rounded-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-md">{courseName}</CardTitle>
                    <div className="p-2 rounded bg-green-100">
                        <StatusIcon className="text-green-600" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-primary">
                            <span>Progress</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} />
                    </div>
                    <div className="text-sm flex flex-col">
                        <p className="inline-flex gap-2">
                            <DollarSign className="text-muted-foreground h-4 mt-0.5" /> R{amount}
                        </p>
                        <p className="inline-flex gap-2">
                            <Badge className="text-green-500 h-4 mt-0.5" /> {status}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EnrollmentCurrent;
