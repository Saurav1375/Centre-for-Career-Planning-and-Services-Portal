import { useEffect, useState } from "react";
import StatsCard from "../../components/callerDashboard/StatsCards";
import RecentCallLogs from "../../components/callerDashboard/RecentCallLogs";
import AssignedHRContacts from "../../components/callerDashboard/AssignedHRList";
import { fetchCallerDashboard } from "../../api/liaisoningAPIs/dashboard";
import Sidebar from "../../components/Sidebar";
import AddLogOptions from '../../components/callerDashboard/AddLogOptions.jsx';
import LogForm from '../../components/callerDashboard/LogForm.jsx';
import { Trophy, Plus, CalendarClock, Bell, PhoneCall } from 'lucide-react';

const CallerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHR, setSelectedHR] = useState(null);
  const [showHROptionForLogForm, setShowHROptionForLogForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchCallerDashboard();
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="flex justify-center items-center h-screen text-slate-500">Failed to load dashboard</div>;
  }

  const onSubmit = () => {
    fetchCallerDashboard().then(res => setDashboardData(res.data));
  }

  const { stats, recent_call_logs, upcoming_follow_ups, assigned_hr_contacts, todays_follow_ups, top_callers } = dashboardData;

  const openLogForToday = (log) => {
    setSelectedHR({
      log_id: log.log_id,
      contact_id: log.contact_id,
      full_name: log.contact_name,
      company_name: log.company_name,
    });
    setShowHROptionForLogForm(false);
    setShowLogForm(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Caller Dashboard</h1>
            <p className="text-slate-500 mt-1">Your personal outreach overview & performance.</p>
          </div>
          <div className="flex gap-3 items-center">
            {top_callers && top_callers.length > 0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 px-4 py-2.5 rounded-xl shadow-sm border border-amber-200">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium">Top Caller: <span className="font-bold">{top_callers[0].name}</span> ({top_callers[0].calls} calls)</span>
              </div>
            )}
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium text-sm"
              onClick={() => setShowHROptionForLogForm(!showHROptionForLogForm)}
            >
              <Plus className="h-4 w-4" />
              Log New Interaction
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="Total Contacts" value={stats.total_contacts} color="#0c4a42" />
          <StatsCard title="Total Call Logs" value={stats.total_call_logs} color="#2563eb" />
          <StatsCard title="Connected Calls" value={stats.connected_calls} color="#059669" />
          <StatsCard title="Follow Up Calls" value={stats.follow_up_calls} color="#d97706" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Logs */}
          <div className="lg:col-span-2">
            <RecentCallLogs logs={recent_call_logs} />
          </div>

          {/* Right: Follow-ups */}
          <div className="space-y-6">
            {/* Today's Calls */}
            <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-slate-800">Calls for Today</h3>
                {todays_follow_ups && todays_follow_ups.length > 0 && (
                  <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {todays_follow_ups.length}
                  </span>
                )}
              </div>
              {todays_follow_ups && todays_follow_ups.length > 0 ? (
                <ul className="space-y-3">
                  {todays_follow_ups.map((log) => (
                    <li
                      key={log.log_id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 cursor-pointer"
                      onClick={() => openLogForToday(log)}
                    >
                      <PhoneCall className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{log.contact_name}</p>
                        <p className="text-xs text-slate-500 italic">{log.company_name}</p>
                        {log.remarks && <p className="text-xs text-slate-400 mt-1">{log.remarks}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400">No calls scheduled for today.</p>
                  <p className="text-xs text-slate-300 mt-0.5">Enjoy your free time! 🎉</p>
                </div>
              )}
            </div>

            {/* Upcoming Follow-ups */}
            <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-bold text-slate-800">Upcoming Follow-ups</h3>
              </div>
              {upcoming_follow_ups && upcoming_follow_ups.length > 0 ? (
                <ul className="space-y-3">
                  {upcoming_follow_ups.map((log) => (
                    <li key={log.log_id} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <CalendarClock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{log.contact_name}</p>
                        <p className="text-xs text-slate-500 italic">{log.company_name}</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">
                          Due: {new Date(log.next_follow_up_date).toLocaleDateString()}
                        </p>
                        {log.remarks && <p className="text-xs text-slate-400 mt-0.5">{log.remarks}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-400">No upcoming follow-ups.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Assigned HR Section */}
        <AssignedHRContacts contacts={assigned_hr_contacts} />
      </main>

      {showHROptionForLogForm && (
        <AddLogOptions setShowHROptionForLogForm={setShowHROptionForLogForm} setShowLogForm={setShowLogForm} setSelectedHR={setSelectedHR} />
      )}

      {showLogForm && (
        <LogForm hr={selectedHR} setLogForm={setShowLogForm} onSubmit={onSubmit} />
      )}
    </div>
  );
};

export default CallerDashboard;
