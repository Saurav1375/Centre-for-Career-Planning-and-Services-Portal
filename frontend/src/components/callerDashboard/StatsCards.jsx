const StatsCard = ({ title, value, color, icon: Icon }) => {
    const gradients = {
        '#0c4a42': 'from-teal-600 to-teal-700',
        '#2563eb': 'from-blue-500 to-blue-600',
        '#059669': 'from-emerald-500 to-emerald-600',
        '#d97706': 'from-amber-500 to-amber-600',
        '#7c3aed': 'from-violet-500 to-violet-600',
        '#e11d48': 'from-rose-500 to-rose-600',
    };

    const gradient = gradients[color] || 'from-slate-500 to-slate-600';

    return (
        <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
            <div className="absolute -right-3 -top-3 w-16 h-16 bg-white/10 rounded-full" />
            <div className="absolute -right-1 -top-1 w-10 h-10 bg-white/10 rounded-full" />
            <p className="text-xs font-medium text-white/75 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-extrabold mt-1 tracking-tight">{value}</p>
        </div>
    );
};

export default StatsCard;
