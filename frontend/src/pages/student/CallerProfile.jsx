import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { fetchCallerDashboard } from "../../api/liaisoningAPIs/dashboard";
import Sidebar from "../../components/Sidebar";
import {
    User, Mail, GitBranch, Shield, Phone, PhoneForwarded,
    PhoneOff, Calendar, TrendingUp, Users, Award, Clock
} from 'lucide-react';

const CallerProfile = () => {
    const { authUser } = useAuthContext();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchCallerDashboard();
                setData(res.data);
            } catch (err) {
                console.error("Failed to load profile data", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-slate-50 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    const stats = data?.stats || {};
    const profile = data?.profile || {};
    const topCallers = data?.top_callers || [];
    const myRank = topCallers.findIndex(c => c.name === profile.full_name) + 1;
    const initials = (profile.full_name || "??").split(" ").map(w => w[0]).join("").toUpperCase();

    const statItems = [
        { label: "Contacts Assigned", value: stats.total_contacts || 0, icon: Users, color: "from-teal-500 to-teal-600" },
        { label: "Total Calls Made", value: stats.total_call_logs || 0, icon: Phone, color: "from-blue-500 to-blue-600" },
        { label: "Connected Calls", value: stats.connected_calls || 0, icon: PhoneForwarded, color: "from-emerald-500 to-emerald-600" },
        { label: "Follow-ups Pending", value: stats.follow_up_calls || 0, icon: Clock, color: "from-amber-500 to-amber-600" },
    ];

    // Connection rate calculation
    const totalCalls = stats.total_call_logs || 0;
    const connected = stats.connected_calls || 0;
    const connectionRate = totalCalls > 0 ? Math.round((connected / totalCalls) * 100) : 0;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
                    <p className="text-slate-500 mt-1">Your account details and performance overview.</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden mb-8">
                    {/* Banner */}
                    <div className="h-32 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                <span className="text-3xl font-extrabold text-teal-600">{initials}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pt-16 pb-6 px-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{profile.full_name}</h2>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                                        <Mail className="h-4 w-4" /> {profile.email}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                                        <Shield className="h-4 w-4" />
                                        <span className="capitalize">{profile.role}</span>
                                    </span>
                                    {profile.branch && (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
                                            <GitBranch className="h-3.5 w-3.5" /> {profile.branch}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Rank Badge */}
                            {myRank > 0 && (
                                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl px-4 py-3">
                                    <Award className="h-6 w-6 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-amber-600 font-medium">Weekly Rank</p>
                                        <p className="text-xl font-extrabold text-amber-800">#{myRank}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ID */}
                        <div className="mt-4 p-3 bg-slate-50 rounded-xl inline-block">
                            <p className="text-xs text-slate-400 font-medium">User ID</p>
                            <p className="text-sm text-slate-600 font-mono">{profile.user_id}</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {statItems.map(item => (
                        <div key={item.label} className={`relative overflow-hidden bg-gradient-to-br ${item.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}>
                            <div className="absolute -right-3 -top-3 w-20 h-20 bg-white/10 rounded-full" />
                            <div className="absolute -right-1 -top-1 w-12 h-12 bg-white/10 rounded-full" />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-medium text-white/75 uppercase tracking-wider">{item.label}</p>
                                    <p className="text-3xl font-extrabold mt-1">{item.value}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-white/20">
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Performance Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Connection Rate Ring */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-teal-500" />
                            Connection Rate
                        </h3>
                        <div className="flex items-center justify-center">
                            <div className="relative w-44 h-44">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                                    <circle
                                        cx="60" cy="60" r="52" fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="10"
                                        strokeLinecap="round"
                                        strokeDasharray={`${connectionRate * 3.27} ${327 - connectionRate * 3.27}`}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#14b8a6" />
                                            <stop offset="100%" stopColor="#10b981" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-4xl font-extrabold text-slate-800">{connectionRate}%</p>
                                    <p className="text-xs text-slate-400 font-medium">Connected</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="bg-emerald-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-emerald-700">{connected}</p>
                                <p className="text-xs text-emerald-600">Connected</p>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 text-center">
                                <p className="text-2xl font-bold text-slate-700">{totalCalls - connected}</p>
                                <p className="text-xs text-slate-500">Other Outcomes</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="space-y-5">
                        {/* Account Info */}
                        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-500" />
                                Account Details
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Full Name", value: profile.full_name },
                                    { label: "Email", value: profile.email },
                                    { label: "Branch", value: profile.branch || "Not set" },
                                    { label: "Role", value: profile.role, capitalize: true },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                                        <span className="text-sm text-slate-500">{item.label}</span>
                                        <span className={`text-sm font-semibold text-slate-800 ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Leaderboard Position */}
                        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-500" />
                                Weekly Leaderboard
                            </h3>
                            {topCallers.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">No leaderboard data yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {topCallers.slice(0, 5).map((caller, idx) => {
                                        const medals = ['🥇', '🥈', '🥉'];
                                        const isMe = caller.name === profile.full_name;
                                        return (
                                            <li key={caller.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isMe ? 'bg-teal-50 border border-teal-200' : 'hover:bg-slate-50'}`}>
                                                <span className="w-7 text-center text-sm">
                                                    {idx < 3 ? medals[idx] : <span className="text-slate-400 font-bold">{idx + 1}</span>}
                                                </span>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                                                    {caller.initials}
                                                </div>
                                                <span className={`flex-1 text-sm font-medium ${isMe ? 'text-teal-800' : 'text-slate-700'}`}>
                                                    {caller.name} {isMe && <span className="text-xs text-teal-500">(You)</span>}
                                                </span>
                                                <span className="text-sm font-bold text-slate-600 tabular-nums">{caller.calls}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CallerProfile;
