import {
    Home, ClipboardList, Users, Wrench, AlertCircle, ChevronRight, MapPin, BedDouble,
} from 'lucide-react';
import {
    ApplicationDto, LandlordPropertyDto, LandlordMaintenanceDto, LandlordDashboardDataDto,
} from '@/app/errors/listingsApi';
import { formatRent, safeBeds, isPlaceholder, getAppStatusLabel, getAppStatusStyle, getPropertyStatusLabel, getPropertyStatusStyle, getMaintPriorityLabel, getMaintStatusLabel, Tab } from './utils';
import { StatCard } from './StatCard';
import { Section } from './Section';
import { StatusBadge } from './StatusBadge';

export function OverviewTab({
    data,
    properties,
    applications,
    maintenance,
    tenants,
    pendingApps,
    onSwitchTab,
    onSelectApp,
    onSelectMaint,
    onGoToProperty,
    onAddProperty,
}: {
    data:            LandlordDashboardDataDto;
    properties:      LandlordPropertyDto[];
    applications:    ApplicationDto[];
    maintenance:     LandlordMaintenanceDto[];
    tenants:         { id: string }[];
    pendingApps:     ApplicationDto[];
    onSwitchTab:     (tab: Tab) => void;
    onSelectApp:     (app: ApplicationDto) => void;
    onSelectMaint:   (item: LandlordMaintenanceDto) => void;
    onGoToProperty:  (id: number) => void;
    onAddProperty:   () => void;
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard icon={Home}          label="Properties"      value={data.propertiesCount}   sub={`${properties.filter(p => p.status === 0).length} pending`}     color="bg-blue-600"   onClick={() => onSwitchTab('properties')}   />
                <StatCard icon={ClipboardList} label="Applications"    value={data.applicationsCount} sub={`${pendingApps.length} pending review`}                           color="bg-orange-500" onClick={() => onSwitchTab('applications')} />
                <StatCard icon={Users}         label="Tenants"         value={tenants.length}         sub="active tenancies"                                                  color="bg-green-600"  onClick={() => onSwitchTab('tenants')}      />
                <StatCard icon={Wrench}        label="Open Maintenance" value={data.requestsCount}    sub="requests"                                                          color="bg-red-500"    onClick={() => onSwitchTab('maintenance')}  />
            </div>

            {pendingApps.length > 0 && (
                <div onClick={() => onSwitchTab('applications')}
                    className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 cursor-pointer hover:bg-orange-100 transition-colors">
                    <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-800">
                            {pendingApps.length} pending {pendingApps.length === 1 ? 'application' : 'applications'} need your response
                        </p>
                        <p className="text-xs text-orange-700 mt-0.5">Students are waiting. Tap to review.</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-orange-600 shrink-0" />
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <Section title="Recent Applications" icon={ClipboardList}
                    action={{ label: 'View all', onClick: () => onSwitchTab('applications') }}>
                    {applications.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>No applications yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applications.slice(0, 4).map(app => (
                                <div key={app.id}
                                    onClick={app.status === 0 ? () => onSelectApp(app) : undefined}
                                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all
                                        ${app.status === 0 ? 'cursor-pointer hover:border-orange-300 hover:bg-orange-50 ring-1 ring-orange-100' : ''}`}>
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
                                        {(app.studentName ?? app.studentId).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {app.studentName ?? `Student #${app.studentId.slice(0, 8)}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {isPlaceholder(app.propertyTitle) ? `Property #${app.propertyId}` : app.propertyTitle}
                                        </p>
                                        {app.price > 0 && (
                                            <p className="text-xs font-bold text-blue-600">R {formatRent(app.price)} / month</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <StatusBadge label={getAppStatusLabel(app.status)} style={getAppStatusStyle(app.status)} />
                                        {app.status === 0 && <ChevronRight className="h-4 w-4 text-orange-500" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Section>

                <Section title="My Properties" icon={Home}
                    action={{ label: 'View all', onClick: () => onSwitchTab('properties') }}>
                    {properties.length === 0 ? (
                        <div className="text-center py-6 text-sm text-muted-foreground">
                            <Home className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p>No properties yet.</p>
                            <button onClick={onAddProperty}
                                className="mt-1 inline-block text-blue-600 hover:underline text-xs">
                                Add your first property →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {properties.slice(0, 3).map(p => {
                                const beds = safeBeds(p.availableBeds);
                                return (
                                    <div key={p.id}
                                        onClick={() => onGoToProperty(p.id)}
                                        className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 hover:border-blue-300 transition-all">
                                        <div className="rounded-lg bg-blue-50 p-2 shrink-0">
                                            <Home className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {isPlaceholder(p.title) ? `Property #${p.id}` : p.title}
                                            </p>
                                            {!isPlaceholder(p.city) && (
                                                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" /> {p.city}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {p.monthlyRent > 0 && (
                                                    <span className="text-xs font-bold text-blue-600">R {formatRent(p.monthlyRent)} / month</span>
                                                )}
                                                {beds && (
                                                    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                                        <BedDouble className="h-3 w-3" /> {beds}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <StatusBadge label={getPropertyStatusLabel(p.status)} style={getPropertyStatusStyle(p.status)} />
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Section>
            </div>

            {maintenance.length > 0 && (
                <Section title="Open Maintenance Requests" icon={Wrench}
                    action={{ label: 'View all', onClick: () => onSwitchTab('maintenance') }}>
                    <div className="space-y-3">
                        {maintenance.slice(0, 3).map(req => {
                            const priority = getMaintPriorityLabel(req.priority);
                            const status   = getMaintStatusLabel(req.status);
                            return (
                                <div key={req.id} onClick={() => onSelectMaint(req)}
                                    className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-all">
                                    <div className="rounded-lg bg-orange-50 p-2 shrink-0">
                                        <Wrench className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {isPlaceholder(req.title) ? 'Maintenance Issue' : req.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {isPlaceholder(req.propertyTitle) ? `Property #${req.propertyId}` : req.propertyTitle}
                                        </p>
                                        <p className={`text-xs font-semibold ${priority.style}`}>{priority.label} Priority</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <StatusBadge label={status.label} style={status.style} />
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Section>
            )}
        </div>
    );
}
