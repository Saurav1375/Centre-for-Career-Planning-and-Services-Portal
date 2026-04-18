import { Phone, ThumbsUp, Clock, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';

const gradients = {
    teal: 'from-teal-500 to-teal-600',
    green: 'from-emerald-500 to-emerald-600',
    yellow: 'from-amber-500 to-amber-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-violet-500 to-violet-600',
    rose: 'from-rose-500 to-rose-600',
};

const iconBg = {
    teal: 'bg-teal-400/30',
    green: 'bg-emerald-400/30',
    yellow: 'bg-amber-400/30',
    blue: 'bg-blue-400/30',
    purple: 'bg-violet-400/30',
    rose: 'bg-rose-400/30',
};

const StatCard = ({ title, value, icon: Icon, color = 'teal', subtitle }) => {
    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradients[color]} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-2 -top-2 w-16 h-16 bg-white/10 rounded-full" />
            
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
                    <p className="text-4xl font-extrabold tracking-tight">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-white/70 mt-2 flex items-center gap-1">
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBg[color]}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
