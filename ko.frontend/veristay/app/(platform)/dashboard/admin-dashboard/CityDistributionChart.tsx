import { BarChart3, MapPin, BedDouble } from 'lucide-react';

export function CityDistributionChart({
    data,
}: {
    data: {
        city:           string;
        propertyCount:  number;
        tenancyCount:   number;
        availableBeds?: number;
        occupiedBeds?:  number;
    }[];
}) {
    if (data.length === 0) {
        return (
            <div className="py-8 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">No city distribution data yet.</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Data appears once properties are approved.
                </p>
            </div>
        );
    }

    const enriched = data.map(d => {
        const totalBeds    = d.availableBeds ?? d.propertyCount;
        const occupied     = d.occupiedBeds  ?? d.tenancyCount;
        const availableNow = Math.max(totalBeds - occupied, 0);
        const occupancyPct = totalBeds > 0
            ? Math.min(Math.round((occupied / totalBeds) * 100), 100)
            : 0;
        return { ...d, totalBeds, occupied, availableNow, occupancyPct };
    });

    const maxBeds = Math.max(...enriched.map(d => d.totalBeds), 1);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                    <span className="text-muted-foreground">Total Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span className="text-muted-foreground">Occupied</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">Available</span>
                </div>
            </div>

            {enriched.slice(0, 8).map(item => (
                <div key={item.city} className="space-y-1.5">

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-sm font-semibold truncate">
                                {item.city}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                · {item.propertyCount} {item.propertyCount === 1 ? 'property' : 'properties'}
                            </span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.occupancyPct >= 90 ? 'bg-red-100 text-red-700'    :
                            item.occupancyPct >= 60 ? 'bg-orange-100 text-orange-700' :
                                                      'bg-green-100 text-green-700'
                        }`}>
                            {item.occupancyPct}% occupied
                        </span>
                    </div>

                    <div className="h-4 rounded-full bg-muted overflow-hidden flex">
                        <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${(item.occupied / maxBeds) * 100}%` }}
                        />
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(item.availableNow / maxBeds) * 100}%` }}
                        />
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                            <BedDouble className="h-3 w-3" />
                            {item.totalBeds} total beds
                        </span>
                        <span className="text-orange-600 font-semibold">
                            {item.occupied} occupied
                        </span>
                        <span className="text-green-600 font-semibold">
                            {item.availableNow} available
                        </span>
                    </div>

                </div>
            ))}

            {data.length > 8 && (
                <p className="text-xs text-muted-foreground text-center">
                    Showing top 8 of {data.length} cities
                </p>
            )}
        </div>
    );
}
