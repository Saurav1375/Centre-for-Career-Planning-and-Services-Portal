import { Link } from "react-router-dom";
import { UserPlus, ClipboardList, Clock, AlertTriangle } from 'lucide-react';

const ActionItem = ({ item }) => {
    const colors = {
        yellow: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
        red: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
        blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    };
    const badgeColors = {
        yellow: 'bg-amber-500 text-white',
        red: 'bg-rose-500 text-white',
        blue: 'bg-blue-500 text-white',
    };
    const iconColors = {
        yellow: 'text-amber-500',
        red: 'text-rose-500',
        blue: 'text-blue-500',
    };
    const iconsMap = { UserPlus, ClipboardList, Clock };
    const Icon = iconsMap[item.icon] || Clock;

    return (
        <li className={`flex items-center p-4 rounded-xl border ${colors[item.color]} transition-colors cursor-default`}>
            <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${iconColors[item.color]}`} />
            <p className="text-sm flex-1 text-slate-700">
                {item.text}
            </p>
            <span className={`ml-2 text-xs font-bold px-2.5 py-1 rounded-full ${badgeColors[item.color]}`}>
                {item.count}
            </span>
            {item.id === 1 && (
                <Link to="/admin/user-management" className="ml-3 text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline">
                    View →
                </Link>
            )}
        </li>
    );
};

export default ActionItem;
