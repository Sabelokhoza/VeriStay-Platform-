import { useGetAccommodationReportQuery } from "@/app/errors/listingsApi";
import { BarChart3, MapPin } from "lucide-react";

function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}
export default function ReportTab() {
    const { data: report, isLoading, refetch } = useGetAccommodationReportQuery();

    if (isLoading) return <div className="h-64 animate-pulse rounded-xl bg-muted" />;
    if (!report)   return null;

    const metrics = [
        { label: 'Total Properties',     value: report.totalProperties,    color: 'bg-blue-600'   },
        { label: 'Approved',             value: report.approvedProperties,  color: 'bg-green-600'  },
        { label: 'Pending Review',       value: report.pendingProperties,   color: 'bg-yellow-500' },
        { label: 'Total Beds',           value: report.totalBeds,           color: 'bg-purple-600' },
        { label: 'Occupied Beds',        value: report.occupiedBeds,        color: 'bg-teal-600'   },
        { label: 'Available Beds',       value: report.availableBeds,       color: 'bg-emerald-600'},
        { label: 'Total Students',       value: report.totalStudents,       color: 'bg-indigo-600' },
        { label: 'Housed Students',      value: report.housedStudents,      color: 'bg-cyan-600'   },
        { label: 'Open Disputes',        value: report.openDisputes,        color: 'bg-red-500'    },
        { label: 'Open Complaints',      value: report.openComplaints,      color: 'bg-orange-500' },
        { label: 'Suspended Landlords',  value: report.suspendedLandlords,  color: 'bg-gray-500'   },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Accommodation Report</h2>
                <button onClick={refetch}
                    className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">
                    Refresh
                </button>
            </div>

            {/* Occupancy rate hero */}
            <div className="rounded-xl border bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white text-center">
                <p className="text-sm text-blue-100 mb-2">Platform Occupancy Rate</p>
                <p className="text-6xl font-black">{report.occupancyRate}%</p>
                <p className="text-sm text-blue-100 mt-2">
                    {report.occupiedBeds} of {report.totalBeds} beds occupied
                </p>
                <div className="mt-4 h-3 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${report.occupancyRate}%` }} />
                </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {metrics.map(m => (
                    <div key={m.label} className="rounded-xl border bg-background p-4 text-center shadow-sm">
                        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${m.color} mb-2`}>
                            <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xl font-bold">{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                    </div>
                ))}
            </div>

            {/* City breakdown */}
            <div className="rounded-xl border bg-background shadow-sm">
                <div className="border-b px-5 py-4 font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Accommodation Distribution by City
                </div>
                <div className="p-5 space-y-4">
                    {report.cityBreakdown.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center">No city data.</p>
                    ) : (
                        report.cityBreakdown.map(city => (
                            <div key={city.city}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium">{city.city}</span>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                                        <span className="text-blue-600 font-semibold">
                                            {city.propertyCount} properties
                                        </span>
                                        <span className="text-green-600 font-semibold">
                                            {city.occupiedBeds}/{city.totalBeds} occupied
                                        </span>
                                        <span className="font-bold text-foreground">
                                            {city.occupancyRate}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                    <div className="h-full rounded-full bg-blue-600 transition-all"
                                        style={{ width: `${city.occupancyRate}%` }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}