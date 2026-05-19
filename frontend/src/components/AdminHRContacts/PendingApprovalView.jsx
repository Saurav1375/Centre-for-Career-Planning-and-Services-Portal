import { useState } from "react";
import { toggleHRContactApproval, deleteHRContact } from '../../api/liaisoningAPIs/hrContacts.js';

const PendingApprovalView = ({ contacts, fetchContacts, setContactToEdit }) => {
    const [selectedPending, setSelectedPending] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredContacts = contacts.filter(c =>
        !c.is_approved && (
            c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleSelectAll = (e) => setSelectedPending(e.target.checked ? filteredContacts.map(c => c.contact_id) : []);
    const handleSelectOne = (id) => setSelectedPending(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);

    const approveContact = async (id) => {
        await toggleHRContactApproval(id);
        fetchContacts();
    };

    const handleBulkApprove = async () => {
        if (!window.confirm(`Are you sure you want to approve ${selectedPending.length} contacts?`)) return;
        await Promise.all(selectedPending.map(id => toggleHRContactApproval(id)));
        setSelectedPending([]);
        fetchContacts();
    };

    const rejectContact = async (id) => {
        if (!window.confirm("Reject and delete this contact?")) return;
        try {
            await deleteHRContact(id);
            fetchContacts();
        } catch (error) {
            console.error(error);
            alert("Failed to reject contact: " + (error.response?.data?.message || error.message));
        }
    };

    const handleBulkReject = async () => {
        if (!window.confirm(`Are you sure you want to reject (delete) ${selectedPending.length} contacts?`)) return;
        try {
            await Promise.all(selectedPending.map(id => deleteHRContact(id)));
            setSelectedPending([]);
            fetchContacts();
        } catch (error) {
            console.error(error);
            alert("Failed to reject selected contacts: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <div className="my-4 p-4 bg-white rounded-lg shadow-md">
                <input type="search" placeholder="Search by HR, company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 sm:text-sm" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {selectedPending.length > 0 && (
                    <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                        <p>{selectedPending.length} item(s) selected</p>
                        <div className="flex gap-2">
                            <button onClick={handleBulkApprove} className="px-3 py-1.5 text-xs font-medium bg-green-600 rounded-lg hover:bg-green-700">Approve Selected</button>
                            <button onClick={handleBulkReject} className="px-3 py-1.5 text-xs font-medium bg-red-600 rounded-lg hover:bg-red-700">Reject Selected</button>
                        </div>
                    </div>
                )}

                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="p-4"><input type="checkbox" onChange={handleSelectAll} className="rounded" /></th>
                            <th className="px-6 py-3">HR Contact</th>
                            <th className="px-6 py-3">Company</th>
                            <th className="px-6 py-3">Hiring Type</th>
                            <th className="px-6 py-3">Added By</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.map(contact => (
                            <tr key={contact.contact_id} className="border-b hover:bg-slate-50">
                                <td className="p-4">
                                    <input type="checkbox" checked={selectedPending.includes(contact.contact_id)} onChange={() => handleSelectOne(contact.contact_id)} className="rounded" />
                                </td>
                                <td className="px-6 py-4 font-medium">{contact.full_name}</td>
                                <td className="px-6 py-4">{contact.company_name}</td>
                                <td className="px-6 py-4">{contact.hiring_type || "-"}</td>
                                <td className="px-6 py-4">{contact.added_by_user_name}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => approveContact(contact.contact_id)} className="px-3 py-1 text-xs font-medium bg-green-600 rounded-md hover:bg-green-700 text-white">Approve</button>
                                    <button onClick={() => setContactToEdit(contact)} className="px-3 py-1 text-xs font-medium bg-blue-600 rounded-md hover:bg-blue-700 text-white">Edit</button>
                                    <button onClick={() => rejectContact(contact.contact_id)} className="px-3 py-1 text-xs font-medium bg-red-600 rounded-md hover:bg-red-700 text-white">Reject</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingApprovalView;
