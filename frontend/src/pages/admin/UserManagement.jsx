
import { useState, useEffect } from 'react';
import { UserPlus, Download } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import PreapprovedEmailsModal from '../../components/userManagement/PreapprovedEmails.jsx';
import SendSmsModal from '../../components/userManagement/SendSmsModal.jsx';
import { getAllUsers } from '../../api/liaisoningAPIs/users';
import { getAllCallersStats } from '../../api/liaisoningAPIs/callersStats';
import { exportToCSV } from '../../utils/exportCSV.js';
import ApprovedUsersTable from '../../components/userManagement/ApprovedUsersTable.jsx';
import PendingUsersTable from '../../components/userManagement/PendingUsersTable.jsx';

const UserManagementPage = () => {
    const [activeTab, setActiveTab] = useState('approved');
    const [approvedUsers, setApprovedUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [showPreapprovedModal, setShowPreapprovedModal] = useState(false);
    const [selectedContactToSms, setSelectedContactToSms] = useState(null);

    const fetchData = async () => {
        try {
            const [usersResponse, statsResponse] = await Promise.all([
                getAllUsers(),
                getAllCallersStats(),
            ]);

            const users = usersResponse.data;
            const stats = statsResponse.data;

            const statsMap = {};
            stats.forEach(stat => { statsMap[stat.caller_id] = stat; });

            const usersWithStats = users.map(user => ({
                ...user,
                contactsAssigned: statsMap[user.user_id]?.total_contacts_assigned || 0,
                callsMade: statsMap[user.user_id]?.total_call_logs || 0,
            }));

            setApprovedUsers(usersWithStats.filter(user => user.is_approved));
            setPendingUsers(users.filter(user => !user.is_approved));
        } catch (error) {
            console.error("Error fetching users or stats:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const TabButton = ({ name, label, count, onClick }) => {
        const isActive = activeTab === name;
        return (
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onClick(name); }}
                className={`shrink-0 border-b-2 py-3 px-1 text-sm font-semibold ${isActive ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
            >
                {label}
                {count > 0 && (
                    <span className={`ml-2 inline-block py-0.5 px-2 rounded-full text-xs font-bold ${isActive ? 'bg-teal-100 text-teal-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {count}
                    </span>
                )}
            </a>
        );
    };

    return (
        <div className="bg-slate-100 min-h-screen flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
                        <p className="text-slate-500 mt-1">Add, manage, and revoke user access to the portal.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 flex items-center gap-2"
                            onClick={() => setShowPreapprovedModal(true)}
                        >
                            <UserPlus size={18} /> Add Callers
                        </button>
                    </div>
                </div>

                <div className="mt-6 border-b border-slate-200 flex items-center justify-between">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <TabButton name="approved" label="Approved Users" count={null} onClick={setActiveTab} />
                        <TabButton name="pending" label="Pending Approval" count={pendingUsers.length} onClick={setActiveTab} />
                    </nav>
                    {activeTab === "approved" && (
                        <button onClick={() => exportToCSV(approvedUsers, "approved_users.csv")}
                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 flex items-center gap-2"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    )}
                </div>

                {activeTab === "approved" && (
                    <ApprovedUsersTable users={approvedUsers} fetchData={fetchData} setSelectedContactToSms={setSelectedContactToSms} />
                )}
                {activeTab === "pending" && (
                    <PendingUsersTable users={pendingUsers} fetchData={fetchData} />
                )}
            </div>

            {showPreapprovedModal && (
                <PreapprovedEmailsModal onClose={() => setShowPreapprovedModal(false)} />
            )}
            {selectedContactToSms && (
                <SendSmsModal user={selectedContactToSms} onClose={() => setSelectedContactToSms(false)} />
            )}
        </div>
    );
};

export default UserManagementPage;
