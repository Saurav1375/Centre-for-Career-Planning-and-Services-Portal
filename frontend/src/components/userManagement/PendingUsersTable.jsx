import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { approveUser, deleteUser, bulkApproveUsers, bulkDeleteUsers } from '../../api/liaisoningAPIs/users';

const PendingUsersTable = ({ users, fetchData }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleApproval = async (userId, isApproved) => {
        if (isApproved) {
            await approveUser(userId);
        } else {
            if (!window.confirm("Are you sure you want to deny and delete this request?")) return;
            await deleteUser(userId);
        }
        fetchData();
        setSelectedUsers(prev => prev.filter(id => id !== userId));
        alert(`User ${userId} has been ${isApproved ? 'approved' : 'denied'}.`);
    };

    const handleBulkApproval = async (isApproved) => {
        if (selectedUsers.length === 0) return;
        if (!isApproved && !window.confirm(`Are you sure you want to deny and delete ${selectedUsers.length} requests?`)) return;
        
        try {
            if (isApproved) {
                await bulkApproveUsers(selectedUsers);
            } else {
                await bulkDeleteUsers(selectedUsers);
            }
            fetchData();
            setSelectedUsers([]);
            alert(`${selectedUsers.length} users have been ${isApproved ? 'approved' : 'denied'}.`);
        } catch (error) {
            console.error(error);
            alert("An error occurred during bulk operation");
        }
    };

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

    return (
        <div className="mt-4 bg-white rounded-lg shadow-md overflow-hidden">
            {selectedUsers.length > 0 && (
                <div className="bg-emerald-50 px-6 py-3 flex justify-between items-center border-b border-emerald-100">
                    <span className="text-sm font-medium text-emerald-800">{selectedUsers.length} users selected</span>
                    <div className="flex gap-2">
                        <button onClick={() => handleBulkApproval(false)} className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 flex items-center gap-1.5">
                            <XCircle size={16} /> Deny Selected
                        </button>
                        <button onClick={() => handleBulkApproval(true)} className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-200 rounded-lg hover:bg-green-300 flex items-center gap-1.5">
                            <CheckCircle size={16} /> Approve Selected
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
                        <th scope="col" className="px-6 py-3">Requested Role</th>
                    <th scope="col" className="px-6 py-3">Branch</th>
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
                        <td className="px-6 py-4">
                            {user.branch ? (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">{user.branch}</span>
                            ) : (
                                <span className="text-xs text-slate-400">—</span>
                            )}
                        </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => handleApproval(user.user_id, false)} className="p-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-1.5">
                                        <XCircle size={16} /> Deny
                                    </button>
                                    <button onClick={() => handleApproval(user.user_id, true)} className="p-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 flex items-center gap-1.5">
                                        <CheckCircle size={16} /> Approve
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PendingUsersTable;
