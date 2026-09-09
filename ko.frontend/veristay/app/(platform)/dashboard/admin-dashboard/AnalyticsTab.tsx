import { BarChart3, ShieldCheck } from 'lucide-react';
import { AdminDashboardDto } from '@/app/errors/listingsApi';
import { Section } from './Section';
import { CityDistributionChart } from './CityDistributionChart';

export function AnalyticsTab({ data }: { data: AdminDashboardDto }) {
    const cityDistribution = data.cityBreakdown ?? [];

    const totalBeds     = data.totalAvailableBeds ?? data.totalProperties ?? 0;
    const occupancyRate = totalBeds > 0
        ? Math.min(Math.round((data.totalTenancies / totalBeds) * 100), 100)
        : 0;

    const housingCoverage = data.totalStudents > 0
        ? Math.min(Math.round((data.totalTenancies / data.totalStudents) * 100), 100)
        : 0;

    const healthMetrics = [
        {
            label:    'Landlord Verification Rate',
            value:    data.totalLandlords > 0
                ? Math.round(((data.totalLandlords - data.pendingLandlords) / data.totalLandlords) * 100)
                : 0,
            color: 'bg-blue-600',
            sub:   `${data.totalLandlords - data.pendingLandlords} of ${data.totalLandlords} verified`,
        },
        {
            label:    'Property Approval Rate',
            value:    data.totalProperties > 0
                ? Math.round(((data.totalProperties - data.pendingProperties) / data.totalProperties) * 100)
                : 0,
            color: 'bg-green-600',
            sub:   `${data.totalProperties - data.pendingProperties} of ${data.totalProperties} approved`,
        },
        {
            label:    'Student Housing Coverage',
            value:    housingCoverage,
            color:    'bg-purple-600',
            sub:      `${Math.min(data.totalTenancies, data.totalStudents)} of ${data.totalStudents} students housed`,
        },
        {
            label:    'Bed Occupancy Rate',
            value:    occupancyRate,
            color:    'bg-orange-500',
            sub:      `${data.totalTenancies} of ${totalBeds} beds occupied`,
        },
    ];

    const quickInsights = [
        { label: 'Total Applications', value: data.totalApplications, color: 'text-blue-600',   bg: 'bg-blue-50'   },
        { label: 'Active Tenancies',   value: data.totalTenancies,    color: 'text-green-600',  bg: 'bg-green-50'  },
        { label: 'Pending Landlords',  value: data.pendingLandlords,  color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Pending Properties', value: data.pendingProperties, color: 'text-red-600',    bg: 'bg-red-50'    },
        { label: 'Total Students',     value: data.totalStudents,     color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Total Landlords',    value: data.totalLandlords,    color: 'text-gray-700',   bg: 'bg-gray-50'   },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Accommodation Distribution Analytics</h2>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground">Platform Coverage</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {data.totalAvailableBeds ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">available beds</p>
                </div>

                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground">Avg Properties/City</p>
                    <p className="text-2xl font-bold text-purple-600">
                        {cityDistribution.length > 0
                            ? (data.totalProperties / cityDistribution.length).toFixed(1)
                            : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">per city</p>
                </div>

                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground">Occupancy Rate</p>
                    <p className={`text-2xl font-bold ${
                        data.totalTenancies === 0    ? 'text-gray-400'  :
                        occupancyRate >= 80          ? 'text-green-600' :
                        occupancyRate >= 50          ? 'text-orange-500':
                                                       'text-red-500'
                    }`}>
                        {occupancyRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {data.totalTenancies} tenants · {data.totalAvailableBeds ?? data.totalProperties} beds
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-4 shadow-sm text-center">
                    <p className="text-xs text-muted-foreground">Application Rate</p>
                    <p className="text-2xl font-bold text-orange-600">
                        {data.totalProperties > 0
                            ? (data.totalApplications / data.totalProperties).toFixed(1)
                            : 0}
                    </p>
                    <p className="text-xs text-muted-foreground">apps per property</p>
                </div>
            </div>

            <Section title="Properties & Tenancies by City" icon={BarChart3}>
                <div className="mb-4 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                        <span className="text-muted-foreground">Properties</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-green-600" />
                        <span className="text-muted-foreground">Active Tenancies</span>
                    </div>
                </div>

                {cityDistribution.length === 0 ? (
                    <div className="py-8 text-center">
                        <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm text-muted-foreground">
                            No city distribution data yet.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Data appears once properties are approved and tenancies created.
                        </p>
                    </div>
                ) : (
                    <CityDistributionChart data={cityDistribution} />
                )}
            </Section>

            <Section title="Platform Health" icon={ShieldCheck}>
                <div className="space-y-4">
                    {healthMetrics.map(metric => (
                        <div key={metric.label}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-medium">{metric.label}</span>
                                <span className={`text-sm font-bold ${
                                    metric.value >= 80 ? 'text-green-600' :
                                    metric.value >= 50 ? 'text-orange-500' :
                                                        'text-red-500'
                                }`}>
                                    {metric.value}%
                                </span>
                            </div>
                            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                                    style={{ width: `${Math.min(metric.value, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{metric.sub}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Quick Insights" icon={BarChart3}>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {quickInsights.map(item => (
                        <div key={item.label}
                            className={`rounded-xl ${item.bg} p-3 text-center`}>
                            <p className={`text-xl font-bold ${item.color}`}>
                                {item.value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
