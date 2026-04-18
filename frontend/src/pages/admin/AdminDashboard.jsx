import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Phone, ThumbsUp, Clock, UserPlus, BarChart3, Filter } from 'lucide-react';
import { fetchAdminDashboard } from '../../api/liaisoningAPIs/dashboard.js';
import Sidebar from '../../components/Sidebar.jsx';
import StatCard from '../../components/adminDashboard/StatCard.jsx';
import RecentActivityList from '../../components/adminDashboard/RecentActivityList.jsx';
import TopCallersList from '../../components/adminDashboard/TopCallersList.jsx';
import ActionItem from '../../components/adminDashboard/ActionItem.jsx';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {
    const [data, setData] = useState(null);
    const [userIdFilter, setUserIdFilter] = useState("all");
    const [weekOffset, setWeekOffset] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchAdminDashboard({ userId: userIdFilter, weekOffset });
                if (res.success) setData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard:", err);
            }
        };
        loadData();
    }, [userIdFilter, weekOffset]);

    if (!data) return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">Loading dashboard...</p>
            </div>
        </div>
    );

    const chartData = {
        labels: data.weeklyCallActivity.labels,
        datasets: [
            { label: 'Positive', data: data.weeklyCallActivity.positive.map(Number), backgroundColor: '#10B981', borderRadius: 4 },
            { label: 'Follow-up', data: data.weeklyCallActivity.followUp.map(Number), backgroundColor: '#3B82F6', borderRadius: 4 },
            { label: 'Not Reachable', data: data.weeklyCallActivity.notReachable.map(Number), backgroundColor: '#F59E0B', borderRadius: 4 },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 12, weight: '500' } } },
            y: { stacked: true, grid: { color: '#f1f5f9' }, ticks: { font: { size: 12 } } },
        },
        plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', padding: 20, font: { size: 12, weight: '500' } } },
        },
    };

    // Doughnut chart for call outcome distribution
    const doughnutData = {
        labels: ['Positive', 'Follow-up', 'Not Reachable'],
        datasets: [{
            data: [
                data.stats.positiveResponses,
                data.stats.followUpsPending,
                Math.max(data.stats.totalCalls - data.stats.positiveResponses - data.stats.followUpsPending, 0)
            ],
            backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
            borderWidth: 0,
            hoverOffset: 8,
        }]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
            legend: { display: false },
        }
    };

    const weekLabel = weekOffset === 0 ? 'This Week' : weekOffset === 1 ? 'Last Week' : `${weekOffset} Weeks Ago`;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 bg-white border-r border-slate-200">
                <Sidebar />
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Overview of placement outreach & caller performance.</p>
                    </div>

                    <div className="flex gap-3 items-end">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                                <Filter className="h-3 w-3" /> Caller
                            </label>
                            <select
                                value={userIdFilter}
                                onChange={(e) => setUserIdFilter(e.target.value)}
                                className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-w-[180px] shadow-sm"
                            >
                                <option value="all">All Callers</option>
                                {data.callers && data.callers.map(caller => (
                                    <option key={caller.user_id} value={caller.user_id}>
                                        {caller.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Period</label>
                            <select
                                value={weekOffset}
                                onChange={(e) => setWeekOffset(Number(e.target.value))}
                                className="border border-slate-200 bg-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
                            >
                                <option value={0}>Current Week</option>
                                <option value={1}>Previous Week</option>
                                <option value={2}>2 Weeks Ago</option>
                                <option value={3}>3 Weeks Ago</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatCard title="Total Calls" value={data.stats.totalCalls.toLocaleString()} icon={Phone} color="teal" subtitle={weekLabel} />
                    <StatCard title="Positive Responses" value={data.stats.positiveResponses} icon={ThumbsUp} color="green" />
                    <StatCard title="Follow-ups Pending" value={data.stats.followUpsPending} icon={Clock} color="yellow" />
                    <StatCard title="New Contacts Added" value={data.stats.newContacts} icon={UserPlus} color="blue" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Bar Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="h-5 w-5 text-teal-500" />
                            <h3 className="text-lg font-bold text-slate-800">Weekly Call Activity</h3>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    </div>

                    {/* Doughnut Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Call Breakdown</h3>
                        <div className="relative" style={{ height: '220px' }}>
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-3xl font-extrabold text-slate-800">{data.stats.totalCalls}</p>
                                <p className="text-xs text-slate-400 font-medium">Total Calls</p>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            {[
                                { label: 'Positive', value: data.stats.positiveResponses, color: 'bg-emerald-500' },
                                { label: 'Follow-up', value: data.stats.followUpsPending, color: 'bg-blue-500' },
                                { label: 'Other', value: Math.max(data.stats.totalCalls - data.stats.positiveResponses - data.stats.followUpsPending, 0), color: 'bg-amber-500' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                        <span className="text-slate-600">{item.label}</span>
                                    </div>
                                    <span className="font-bold text-slate-800">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <RecentActivityList activities={data.recentActivity} />
                    </div>

                    <div className="space-y-6">
                        <TopCallersList callers={data.topCallers} />
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                ⚡ Action Items
                            </h3>
                            <ul className="space-y-3">
                                {data.actionItems.map(item => (
                                    <ActionItem key={item.id} item={item} />
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
