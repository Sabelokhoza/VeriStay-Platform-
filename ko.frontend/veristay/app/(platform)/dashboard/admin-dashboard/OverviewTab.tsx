import {
    Users, Building2, Home, ClipboardList, CheckCircle, AlertTriangle,
    ShieldCheck, Flag, MapPin, BedDouble, ChevronRight, TrendingUp,
} from 'lucide-react';
import { AdminDashboardDto, AdminLandlordDto, AdminPropertyDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, safeBeds, Tab } from './utils';
import { StatCard } from './StatCard';
import { Section } from './Section';
import { StatusBadge } from './StatusBadge';
import { CityDistributionChart } from './CityDistributionChart';

export function OverviewTab({
    data,
    pendingLandlords,
    pendingProperties,
    cityDistribution,
    onSwitchTab,
    onSelectLandlord,
    onSelectProperty,
}: {
    data:               AdminDashboardDto;
    pendingLandlords:   AdminLandlordDto[];
    pendingProperties:  AdminPropertyDto[];
    cityDistribution:   AdminDashboardDto['cityBreakdown'];
    onSwitchTab:        (tab: Tab) => void;
    onSelectLandlord:   (landlord: AdminLandlordDto) => void;
    onSelectProperty:   (property: AdminPropertyDto) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard icon={Users}         label="Total Students"    value={data.totalStudents}      color="bg-blue-600"   />
                <StatCard icon={Building2}     label="Total Landlords"   value={data.totalLandlords}     color="bg-purple-600" sub={`${data.pendingLandlords} pending`} alert={data.pendingLandlords > 0} onClick={() => onSwitchTab('landlords')} />
                <StatCard icon={Home}          label="Total Properties"  value={data.totalProperties}    color="bg-green-600"  sub={`${data.pendingProperties} pending`} alert={data.pendingProperties > 0} onClick={() => onSwitchTab('properties')} />
                <StatCard icon={ClipboardList} label="Applications"      value={data.totalApplications}  color="bg-orange-500" />
                <StatCard icon={CheckCircle}   label="Active Tenancies"  value={data.totalTenancies}     color="bg-teal-600"   />
                <StatCard icon={AlertTriangle} label="Open Maintenance"  value={data.openMaintenanceCount} color="bg-red-500"  />
                <StatCard icon={ShieldCheck}   label="Verified Landlords" value={data.totalLandlords - data.pendingLandlords} color="bg-emerald-600" />
                <StatCard icon={Flag}          label="Pending Review"    value={data.pendingLandlords + data.pendingProperties} color="bg-yellow-500" alert={(data.pendingLandlords + data.pendingProperties) > 0} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Section title="Landlords Awaiting Verification" icon={Users}
                    badge={pendingLandlords.length}
                    action={{ label: 'View all', onClick: () => onSwitchTab('landlords') }}>
                    {pendingLandlords.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-60" />
                            <p>All landlords are verified! ✓</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingLandlords.slice(0, 4).map(l => (
                                <div key={l.id}
                                    onClick={() => onSelectLandlord(l)}
                                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 ring-1 ring-yellow-100 transition-all">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                        {l.fullName?.charAt(0)?.toUpperCase() ?? 'L'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold truncate">{l.fullName ?? 'Landlord'}</p>
                                        <p className="text-xs text-muted-foreground truncate">{l.email}</p>
                                        <p className="text-xs text-muted-foreground">Registered {formatDate(l.createdAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <StatusBadge label="Pending" style="bg-yellow-100 text-yellow-800 border-yellow-200" />
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                <Section title="Properties Awaiting Approval" icon={Home}
                    badge={pendingProperties.length}
                    action={{ label: 'View all', onClick: () => onSwitchTab('properties') }}>
                    {pendingProperties.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-60" />
                            <p>No properties pending approval ✓</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pendingProperties.slice(0, 4).map(p => {
                                const beds = safeBeds(p.availableBeds);
                                return (
                                    <div key={p.id}
                                        onClick={() => onSelectProperty(p)}
                                        className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50 ring-1 ring-yellow-100 transition-all">
                                        <div className="rounded-lg bg-blue-50 p-2 shrink-0">
                                            <Home className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">
                                                {p.title}
                                            </p>
                                            {p.city && (
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" /> {p.city}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {p.monthlyRent > 0 && (
                                                    <span className="text-xs font-bold text-blue-600">R {formatRent(p.monthlyRent)}</span>
                                                )}
                                                {beds && (
                                                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                        <BedDouble className="h-3 w-3" /> {beds}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <StatusBadge label="Pending" style="bg-yellow-100 text-yellow-800 border-yellow-200" />
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Section>
            </div>

            <Section title="Accommodation Distribution by City" icon={TrendingUp}>
                <CityDistributionChart data={cityDistribution} />
            </Section>
        </div>
    );
}
