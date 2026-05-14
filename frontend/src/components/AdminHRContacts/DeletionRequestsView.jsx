import { useState } from "react";
import { bulkUnassignHRs } from '../../api/liaisoningAPIs/hrContacts.js';

const DeletionRequestsView = ({ contacts, fetchContacts }) => {
  const [selectedRequests, setSelectedRequests] = useState([]);

  const deletionRequests = contacts.filter(c => c.deletion_requested && c.assigned_to_user_id);

  const handleSelectAll = (e) => setSelectedRequests(e.target.checked ? deletionRequests.map(c => c.contact_id) : []);
  const handleSelectOne = (id) => setSelectedRequests(prev => prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]);

  const acceptRequest = async (contactId) => {
    if (!window.confirm("Accept this deletion request and unassign the HR contact?")) return;
    try {
      await bulkUnassignHRs([contactId]);
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert("Failed to accept deletion request. " + (error.response?.data?.message || error.message));
    }
  };

  const handleBulkAccept = async () => {
    if (selectedRequests.length === 0) return;
    if (!window.confirm(`Accept and unassign ${selectedRequests.length} HR contact(s)?`)) return;
    try {
      await bulkUnassignHRs(selectedRequests);
      setSelectedRequests([]);
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert("Failed to process selected requests. " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <div className="my-4 p-4 bg-white rounded-lg shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Deletion Requests</h2>
          <p className="text-sm text-slate-500">Review caller deletion requests and unassign the HR contact when approved.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={selectedRequests.length === 0}
            onClick={handleBulkAccept}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${selectedRequests.length === 0 ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
          >
            Accept Selected
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {selectedRequests.length > 0 && (
          <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
            <p>{selectedRequests.length} request(s) selected</p>
            <button onClick={handleBulkAccept} className="px-3 py-1.5 text-xs font-medium bg-teal-500 rounded-lg hover:bg-teal-600">Accept Selected</button>
          </div>
        )}

        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th className="p-4"><input type="checkbox" onChange={handleSelectAll} className="rounded" /></th>
              <th className="px-6 py-3">HR Contact</th>
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deletionRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No deletion requests pending.</td>
              </tr>
            ) : deletionRequests.map(contact => (
              <tr key={contact.contact_id} className="border-b hover:bg-slate-50">
                <td className="p-4">
                  <input type="checkbox" checked={selectedRequests.includes(contact.contact_id)} onChange={() => handleSelectOne(contact.contact_id)} className="rounded" />
                </td>
                <td className="px-6 py-4 font-medium text-slate-900">{contact.full_name}</td>
                <td className="px-6 py-4">{contact.company_name || '-'}</td>
                <td className="px-6 py-4">{contact.assigned_to_user_name || '-'}</td>
                <td className="px-6 py-4 break-words">{contact.deletion_reason || 'No reason provided'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => acceptRequest(contact.contact_id)} className="px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeletionRequestsView;
