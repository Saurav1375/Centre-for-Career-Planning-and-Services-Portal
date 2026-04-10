import { useEffect, useState } from "react";
import StatsCard from "../../components/callerDashboard/StatsCards";
import RecentCallLogs from "../../components/callerDashboard/RecentCallLogs";
import UpcomingFollowUps from "../../components/callerDashboard/UpcomingFollowUps";
import AssignedHRContacts from "../../components/callerDashboard/AssignedHRList";
import { fetchCallerDashboard } from "../../api/liaisoningAPIs/dashboard";
import Sidebar from "../../components/Sidebar";
import AddLogOptions from '../../components/callerDashboard/AddLogOptions.jsx';
import LogForm from '../../components/callerDashboard/LogForm.jsx';

const CallerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHR, setSelectedHR] = useState(null);

  

  const [ showHROptionForLogForm , setShowHROptionForLogForm ] = useState(false);
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!dashboardData) {
    return <div className="flex justify-center items-center h-screen">Failed to load dashboard</div>;
  }

  const onSubmit = () => {
    fetchCallerDashboard().then(res => setDashboardData(res.data));
  }

  const { stats, recent_call_logs, upcoming_follow_ups, assigned_hr_contacts, todays_follow_ups, top_callers } = dashboardData;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#0c4a42]">Caller Dashboard</h1>
          <div className="flex gap-4 items-center">
             {top_callers && top_callers.length > 0 && (
                <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg shadow-sm border border-yellow-200">
                    🏆 Top Caller: <span className="font-bold">{top_callers[0].name}</span> ({top_callers[0].calls} calls)
                </div>
            )}
            <button className="bg-[#0c4a42] text-white px-4 py-2 rounded-lg shadow hover:bg-[#106d60] transition" onClick={() => setShowHROptionForLogForm(!showHROptionForLogForm)} >
              + Log New Interaction
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatsCard title="Total Contacts" value={stats.total_contacts} color="#0c4a42" />
          {/* <StatsCard title="Approved Contacts" value={stats.approved_contacts} color="#047857" />
          <StatsCard title="Unapproved Contacts" value={stats.unapproved_contacts} color="#b91c1c" /> */}
          <StatsCard title="Total Call Logs" value={stats.total_call_logs} color="#2563eb" />
          <StatsCard title="Connected Calls" value={stats.connected_calls} color="#059669" />
          <StatsCard title="Follow Up Calls" value={stats.follow_up_calls} color="#d97706" />
        </div>

        {/* Logs + Follow-ups */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left section: Call logs */}
          <div className="lg:col-span-2 space-y-6">
            <RecentCallLogs logs={recent_call_logs} />
          </div>

          {/* Right section: Follow-ups */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow border-l-4 border-[#d97706]">
                <h3 className="text-lg font-bold text-[#0c4a42] mb-3 border-b pb-2">Calls for Today</h3>
                {todays_follow_ups && todays_follow_ups.length > 0 ? (
                    <ul className="space-y-3">
                        {todays_follow_ups.map((log) => (
                            <li key={log.log_id} className="text-sm">
                                <span className="font-semibold text-gray-800">{log.contact_name}</span> from <span className="text-gray-600 italic">{log.company_name}</span>
                                {log.remarks && <p className="text-xs text-gray-500 mt-1">Remarks: {log.remarks}</p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No calls scheduled for today.</p>
                )}
            </div>
            <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-600">
                <h3 className="text-lg font-bold text-[#0c4a42] mb-3 border-b pb-2">Upcoming Follow-Up</h3>
                {upcoming_follow_ups && upcoming_follow_ups.length > 0 ? (
                    <ul className="space-y-3">
                        {upcoming_follow_ups.map((log) => (
                            <li key={log.log_id} className="text-sm">
                                <span className="font-semibold text-gray-800">{log.contact_name}</span> from <span className="text-gray-600 italic">{log.company_name}</span>
                                {log.remarks && <p className="text-xs text-gray-500 mt-1">Remarks: {log.remarks}</p>}
                                <p className="text-xs text-blue-600 mt-1">Due: {new Date(log.next_follow_up_date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No upcoming follow-ups.</p>
                )}
            </div>
          </div>
        </div>

        {/* HR Contacts (full width) */}
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
