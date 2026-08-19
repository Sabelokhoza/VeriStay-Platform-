import { Calendar, Megaphone, Plus } from "lucide-react";
import { useState } from "react";
import AddAnnouncementModal from "./add-announcement-modal";
import { AnnouncementDto, LandlordPropertyDto, useGetLandlordAnnouncementsQuery } from "@/app/errors/listingsApi";

function formatDate(date: string | null) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}



export default function AnnouncementsTab({
    landlordId,
    properties,
}: {
    landlordId: string;
    properties: LandlordPropertyDto[];
}) {
    const [showModal, setShowModal] = useState(false);

    const { data: announcements = [], isLoading, refetch } =
        useGetLandlordAnnouncementsQuery(landlordId, { skip: !landlordId });

    if (isLoading) {
        return (
            <div className="space-y-3 animate-pulse">
                <div className="h-8 w-48 rounded bg-muted" />
                <div className="h-24 rounded-xl bg-muted" />
                <div className="h-24 rounded-xl bg-muted" />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Announcements ({announcements.length})
                    </h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> New Announcement
                    </button>
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-4">
                    <Megaphone className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-purple-800">
                        <p className="font-semibold mb-0.5">About Announcements</p>
                        <p>
                            Post messages to your tenants — maintenance schedules,
                            rule reminders, or general updates. Tenants will see
                            announcements in their mobile app and dashboard.
                        </p>
                    </div>
                </div>

                {/* Empty state */}
                {announcements.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <Megaphone className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium text-muted-foreground">
                            No announcements yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 mb-4">
                            Post your first announcement to notify your tenants.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" /> Post First Announcement
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {announcements.map((ann: AnnouncementDto) => (
                            <div key={ann.id}
                                className="rounded-xl border bg-background p-4 shadow-sm">

                                {/* Header row */}
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                                            <Megaphone className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-purple-700">
                                                {ann.propertyTitle}
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(ann.postedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                                        Posted
                                    </span>
                                </div>

                                {/* Message */}
                                <p className="text-sm text-foreground leading-relaxed">
                                    {ann.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <AddAnnouncementModal
                    landlordId={landlordId}
                    properties={properties}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        refetch();
                    }}
                />
            )}
        </>
    );
}