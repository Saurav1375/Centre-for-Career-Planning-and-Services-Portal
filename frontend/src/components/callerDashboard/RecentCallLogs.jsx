import { Clock } from 'lucide-react';

const outcomeColors = {
    'positive': 'bg-emerald-100 text-emerald-700',
    'follow-up': 'bg-blue-100 text-blue-700',
    'follow_up': 'bg-blue-100 text-blue-700',
    'not reachable': 'bg-amber-100 text-amber-700',
    'not_reachable': 'bg-amber-100 text-amber-700',
    'spoken': 'bg-teal-100 text-teal-700',
    'connected': 'bg-emerald-100 text-emerald-700',
    'didnt pick': 'bg-slate-100 text-slate-600',
    'switch off': 'bg-red-100 text-red-600',
    'negative': 'bg-red-100 text-red-600',
};

const RecentCallLogs = ({ logs }) => (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800">Recent Call Logs</h2>
            <span className="ml-auto text-xs text-slate-400 font-medium">{logs.length} entries</span>
        </div>
        {logs.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-slate-400 text-sm">No recent calls logged yet.</p>
                <p className="text-slate-300 text-xs mt-1">Start logging calls to see your activity here.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {logs.map((log) => (
                    <div key={log.log_id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                            {(log.contact_name || '??').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-800 truncate">
                                {log.contact_name}
                                <span className="font-normal text-slate-500"> · {log.company_name || "N/A"}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${outcomeColors[log.call_outcome] || 'bg-slate-100 text-slate-600'}`}>
                                    {log.call_outcome?.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-slate-400">
                                    {new Date(log.call_timestamp).toLocaleDateString()} @ {new Date(log.call_timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default RecentCallLogs;
