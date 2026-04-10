import { useState } from 'react';
import UserActionsDropdown from './UserActionsDropdown';
import { formatDistanceToNow, isToday } from 'date-fns';
import { XCircle } from 'lucide-react';
import { bulkRevokeUsers } from '../../api/liaisoningAPIs/users.js';

const formatLastActive = (ts) => {
    if (!ts) return "Never";
    const date = new Date(ts);
    return isToday(date)
        ? formatDistanceToNow(date, { addSuffix: true })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ApprovedUsersTable = ({ users, fetchData, setSelectedContactToSms }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(users.map(u => u.user_id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleBulkRevoke = async () => {
        if (selectedUsers.length === 0) return;
        if (!window.confirm(`Are you sure you want to revoke access for ${selectedUsers.length} users?`)) return;
        
        try {
            await bulkRevokeUsers(selectedUsers);
            fetchData();
            setSelectedUsers([]);
            alert(`${selectedUsers.length} users have been revoked.`);
        } catch (error) {
            console.error(error);
            alert("An error occurred during bulk operation");
        }
    };

    return (
    <div className="mt-4 bg-white rounded-lg shadow-md overflow-visible">
        {selectedUsers.length > 0 && (
            <div className="bg-yellow-50 px-6 py-3 flex justify-between items-center border-b border-yellow-100">
                <span className="text-sm font-medium text-yellow-800">{selectedUsers.length} users selected</span>
                <div className="flex gap-2">
                    <button onClick={handleBulkRevoke} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 flex items-center gap-1.5">
                        <XCircle size={16} /> Revoke Selected
                    </button>
                </div>
            </div>
        )}
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                    <th scope="col" className="px-6 py-3 w-10">
                        <input type="checkbox" onChange={handleSelectAll} checked={users.length > 0 && selectedUsers.length === users.length} className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500" />
                    </th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3 text-center">Contacts Assigned</th>
                    <th scope="col" className="px-6 py-3">Last Active</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.user_id} className="bg-white border-b hover:bg-slate-50">
                        <td className="px-6 py-4">
                            <input type="checkbox" checked={selectedUsers.includes(user.user_id)} onChange={() => handleSelectUser(user.user_id)} className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500" />
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">{user.initials}</div>
                                <div>
                                    <p>{user.full_name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4 font-medium text-center">{user.contactsAssigned}</td>
                        <td className="px-6 py-4">{formatLastActive(user.last_active_at)}</td>
                        <td className="px-6 py-4 text-right">
                            <UserActionsDropdown user={user} fetchData={fetchData} setSelectedContactToSms={setSelectedContactToSms} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default ApprovedUsersTable;
