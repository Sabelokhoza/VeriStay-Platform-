import { getCardType } from './utils';
import { CardTypeIcon } from './CardTypeIcon';

export function CardPreview({
    number, name, expiry, flipped,
}: {
    number: string; name: string; expiry: string; flipped: boolean;
}) {
    const cardType = getCardType(number);
    const display  = number.padEnd(16, '·').replace(/(.{4})/g, '$1 ').trim();

    return (
        <div className="perspective-1000 h-44 w-full max-w-sm mx-auto mb-6">
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d', transition: 'transform 0.5s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 shadow-xl text-white"
                    style={{ backfaceVisibility: 'hidden' }}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex flex-col">
                            <span className="text-xs text-blue-200 font-medium">VeriStay Pay</span>
                            <span className="text-[10px] text-blue-300">Simulated Card</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {cardType
                                ? <CardTypeIcon type={cardType} />
                                : <div className="h-8 w-12 rounded bg-white/20" />
                            }
                        </div>
                    </div>

                    <div className="mb-4 h-8 w-12 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-400/50" />

                    <p className="font-mono text-lg tracking-widest mb-3 text-white/90">
                        {display}
                    </p>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-[9px] text-blue-300 uppercase tracking-wide">Card Holder</p>
                            <p className="text-sm font-semibold uppercase tracking-wide truncate max-w-[160px]">
                                {name || 'YOUR NAME'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-blue-300 uppercase tracking-wide">Expires</p>
                            <p className="text-sm font-semibold">{expiry || 'MM/YY'}</p>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-xl text-white"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                    <div className="h-10 w-full bg-gray-800 mt-6 mb-4" />
                    <div className="px-5">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-10 bg-white/10 rounded-l" />
                            <div className="w-16 h-10 bg-white rounded flex items-center justify-center">
                                <p className="text-gray-800 font-mono font-bold text-sm">•••</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 text-center">
                            This is a simulated card for demo purposes only
                        </p>
                    </div>
                    <div className="absolute bottom-4 right-5">
                        {cardType && <CardTypeIcon type={cardType} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
