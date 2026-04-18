import { Activity } from 'lucide-react';

const outcomeColors = {
    'positive': 'bg-emerald-100 text-emerald-700',
    'follow-up': 'bg-blue-100 text-blue-700',
    'not reachable': 'bg-amber-100 text-amber-700',
    'spoken': 'bg-teal-100 text-teal-700',
    'didnt pick': 'bg-slate-100 text-slate-600',
    'switch off': 'bg-red-100 text-red-600',
    'negative': 'bg-red-100 text-red-600',
};

const RecentActivityList = ({ activities }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
        <div className="flex items-center gap-2 mb-5">
            <Activity className="h-5 w-5 text-teal-500" />
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
        </div>
        {activities.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No recent activity to show.</p>
        ) : (
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-100" />
                
                <ul className="space-y-4">
                    {activities.map((activity, idx) => (
                        <li key={activity.id} className="relative flex items-start gap-4 group">
                            {/* Timeline dot */}
                            <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shadow-sm ring-2 ring-white flex-shrink-0">
                                {activity.initials}
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-3 group-hover:bg-slate-100 transition-colors">
                                <p className="text-sm text-slate-700">
                                    <span className="font-semibold text-slate-900">{activity.user}</span>{' '}
                                    {activity.action}{' '}
                                    <span className="font-semibold text-slate-900">{activity.subject}</span>{' '}
                                    {activity.company && <>from <span className="font-semibold">{activity.company}</span></>}
                                </p>
                                <div className="flex items-center gap-2 mt-1.5">
                                    {activity.outcome && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${outcomeColors[activity.outcome] || 'bg-slate-100 text-slate-600'}`}>
                                            {activity.outcome}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-400">
                                        {new Date(activity.call_timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);

export default RecentActivityList;
