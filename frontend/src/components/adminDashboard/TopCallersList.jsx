import { Trophy } from 'lucide-react';

const medals = ['🥇', '🥈', '🥉'];

const TopCallersList = ({ callers }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <div className="flex items-center gap-2 mb-5">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Top Callers</h3>
        </div>
        {callers.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No call activity yet this week.</p>
        ) : (
            <ul className="space-y-3">
                {callers.map((caller, index) => {
                    const barWidth = callers[0].calls > 0 ? Math.max((caller.calls / callers[0].calls) * 100, 8) : 8;
                    return (
                        <li key={caller.id} className="group">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-lg w-7 text-center flex-shrink-0">
                                    {index < 3 ? medals[index] : <span className="text-slate-400 text-sm font-bold">{index + 1}</span>}
                                </span>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {caller.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-slate-800 truncate">{caller.name}</p>
                                </div>
                                <span className="text-sm font-bold text-teal-600 tabular-nums">{caller.calls}</span>
                            </div>
                            <div className="ml-10 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${barWidth}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        )}
    </div>
);

export default TopCallersList;
