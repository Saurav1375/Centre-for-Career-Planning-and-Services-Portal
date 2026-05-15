import { useState } from "react";
import { exportToCSV } from "../../utils/exportCSV.js";
import ContactActionsDropdown from "./ContactActionsDropdown.jsx";

const AllContactsView = ({ contacts, setSelectedContact, fetchContacts, setContactToEdit }) => {
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [contactFilter, setContactFilter] = useState('all');

    const callerOptions = Array.from(
        contacts.reduce((map, contact) => {
            if (contact.assigned_to_user_id && contact.assigned_to_user_name) {
                map.set(contact.assigned_to_user_id, contact.assigned_to_user_name);
            }
            return map;
        }, new Map())
    ).map(([id, name]) => ({ id, name }));

    const filteredContacts = contacts.filter(c => {
        if (!c.is_approved) return false;

        if (contactFilter === 'assigned' && !c.assigned_to_user_id) return false;
        if (contactFilter === 'unassigned' && c.assigned_to_user_id) return false;
        if (contactFilter.startsWith('caller:')) {
            const callerId = contactFilter.replace('caller:', '');
            if (c.assigned_to_user_id !== callerId) return false;
        }

        return (
            c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleSelectAll = (e) => setSelectedContacts(e.target.checked ? filteredContacts.map(c => c.contact_id) : []);
    const handleSelectOne = (id) => setSelectedContacts(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);

    return (
        <div>
            <div className="my-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                    <input
                        type="search"
                        placeholder="Search by HR, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 sm:text-sm"
                    />
                    <select
                        value={contactFilter}
                        onChange={(e) => setContactFilter(e.target.value)}
                        className="border border-slate-300 rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                        <option value="all">All contacts</option>
                        <option value="assigned">Assigned</option>
                        {callerOptions.map(caller => (
                            <option key={caller.id} value={`caller:${caller.id}`}>{caller.name}</option>
                        ))}
                        <option value="unassigned">Unassigned</option>
                    </select>
                </div>
                <button onClick={() => exportToCSV(filteredContacts, "hr_contacts.csv")} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700">
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {selectedContacts.length > 0 && (
                    <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
                        <p>{selectedContacts.length} item(s) selected</p>
                        <button className="px-3 py-1.5 text-xs font-medium bg-red-600 rounded-lg hover:bg-red-700">
                            Bulk Remove Approval
                        </button>
                    </div>
                )}
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="p-4"><input type="checkbox" onChange={handleSelectAll} className="rounded" /></th>
                            <th className="px-6 py-3">HR Contact</th>
                            <th className="px-6 py-3">Company</th>
                            <th className="px-6 py-3">Assigned To</th>
                            <th className="px-6 py-3">Hiring Type</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.map(contact => (
                            <tr key={contact.contact_id} className="border-b hover:bg-slate-50">
                                <td className="p-4">
                                    <input type="checkbox" checked={selectedContacts.includes(contact.contact_id)} onChange={() => handleSelectOne(contact.contact_id)} className="rounded" />
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">{contact.full_name}</td>
                                <td className="px-6 py-4">{contact.company_name}</td>
                                <td className="px-6 py-4">{contact.assigned_to_user_name || "Unassigned"}</td>
                                <td className="px-6 py-4">{contact.hiring_type || "-"}</td>
                                <td className="px-6 py-4 text-right">
                                    <ContactActionsDropdown contact={contact} setSelectedContact={setSelectedContact} fetchContacts={fetchContacts} setContactToEdit={setContactToEdit} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllContactsView;
