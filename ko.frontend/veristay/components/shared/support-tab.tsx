import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function SupportTab({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Need Help? We are Here for You!</DialogTitle>
                    <DialogDescription>
                        Fill out the form below, and our team will get back to you as soon as
                        possible.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-5">
                    <Textarea
                        id="feedback"
                        placeholder="Give us as much detail as possible"
                        aria-label="Send"
                    />
                    <div className="flex flex-col sm:flex-row sm:justify-end">
                        <Button type="button">Send</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
