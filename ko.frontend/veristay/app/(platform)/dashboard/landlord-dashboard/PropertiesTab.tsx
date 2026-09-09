import { Home, Plus, MapPin, Tag, BedDouble, Calendar, Search, Clock } from 'lucide-react';
import { LandlordPropertyDto } from '@/app/errors/listingsApi';
import { formatRent, formatDate, safeBeds, isPlaceholder, getPropertyStatusLabel, getPropertyStatusStyle } from './utils';
import { StatusBadge } from './StatusBadge';

export function PropertiesTab({
    properties,
    onAddProperty,
    onGoToProperty,
}: {
    properties:     LandlordPropertyDto[];
    onAddProperty:  () => void;
    onGoToProperty: (id: number) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">My Properties ({properties.length})</h2>
                <button onClick={onAddProperty}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" /> Add Property
                </button>
            </div>

            {properties.length === 0 ? (
                <div className="rounded-xl border bg-background p-10 text-center text-muted-foreground">
                    <Home className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No properties yet</p>
                    <button onClick={onAddProperty}
                        className="mt-2 inline-block text-blue-600 hover:underline text-sm">
                        List your first property →
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {properties.map(p => {
                        const beds = safeBeds(p.availableBeds);
                        return (
                            <div key={p.id} className="rounded-xl border bg-background shadow-sm overflow-hidden">
                                <div onClick={() => onGoToProperty(p.id)}
                                    className="flex flex-col gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-lg bg-blue-50 p-2.5 shrink-0">
                                            <Home className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold">
                                                {isPlaceholder(p.title) ? `Property #${p.id}` : p.title}
                                            </p>
                                            {!isPlaceholder(p.address) && !isPlaceholder(p.city) && (
                                                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                    {p.address}, {p.city}
                                                </p>
                                            )}
                                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm">
                                                {p.monthlyRent > 0 && (
                                                    <span className="flex items-center gap-1 font-bold text-blue-600">
                                                        <Tag className="h-3.5 w-3.5" />
                                                        R {formatRent(p.monthlyRent)} / month
                                                    </span>
                                                )}
                                                {beds && (
                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                        <BedDouble className="h-3.5 w-3.5" />
                                                        {beds} {beds === 1 ? 'bedroom' : 'bedrooms'}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1 text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    From {formatDate(p.availableFrom)}
                                                </span>
                                            </div>
                                            {p.amenities.filter(a => !isPlaceholder(a)).length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {p.amenities.filter(a => !isPlaceholder(a)).slice(0, 4).map((a, i) => (
                                                        <span key={i} className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs text-blue-700">{a}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end shrink-0">
                                        <StatusBadge label={getPropertyStatusLabel(p.status)} style={getPropertyStatusStyle(p.status)} />
                                        <StatusBadge
                                            label={p.isAvailable ? 'Available' : 'Occupied'}
                                            style={p.isAvailable ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t bg-muted/20 px-4 py-2.5">
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        Tap card to manage details and images
                                    </p>
                                    <button onClick={() => onGoToProperty(p.id)}
                                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                                        <Search className="h-3.5 w-3.5" /> Manage Property
                                    </button>
                                </div>

                                {p.status === 0 && (
                                    <div className="flex items-center gap-2 border-t bg-yellow-50 px-4 py-2.5 text-xs text-yellow-800">
                                        <Clock className="h-4 w-4 shrink-0" />
                                        Awaiting admin approval. Students cannot see this listing yet.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
