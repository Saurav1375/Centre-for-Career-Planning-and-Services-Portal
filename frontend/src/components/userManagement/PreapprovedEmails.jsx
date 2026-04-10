
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
    getAllPreapprovedEmails,
    addPreapprovedEmails,
    deletePreapprovedEmails,
} from "../../api/liaisoningAPIs/preapprovedemails";

// --- Add Preapproved Emails Modal Component ---
const PreapprovedEmailsModal = ({ onClose }) => {
    const [emails, setEmails] = useState([]);
    const [newEmails, setNewEmails] = useState("");
    const [selectedEmails, setSelectedEmails] = useState([]);

    // Fetch emails from backend
    const fetchEmails = async () => {
        try {
            const res = await getAllPreapprovedEmails();
            if (res.success) {
                setEmails(res.data); // expects [{ email, addedAt }]
            }
        } catch (error) {
            console.error("Error fetching preapproved emails:", error);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, []);

    // Add new emails
    const handleAddEmails = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailsToAdd = newEmails
            .split(/[\n,;]+/) // newline, comma, or semicolon
            .map((email) => email.trim())
            .filter(
                (email) =>
                    email &&
                    emailRegex.test(email) &&
                    !emails.some((e) => e.email === email)
            );

        if (emailsToAdd.length > 0) {
            try {
                await addPreapprovedEmails(emailsToAdd);
                await fetchEmails(); // refresh list
                setNewEmails("");
                
            } catch (err) {
                console.error("Error adding preapproved emails:", err);
            }
        } else {
            alert("No valid or new emails to add.");
        }
    };

    // Delete selected emails
    const handleDeleteSelected = async () => {
        if (selectedEmails.length === 0) return;

        try {
            await deletePreapprovedEmails(selectedEmails);
            await fetchEmails(); // refresh after delete
            setSelectedEmails([]);
        } catch (err) {
            console.error("Error deleting preapproved emails:", err);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEmails(emails.map((e) => e.email));
        } else {
            setSelectedEmails([]);
        }
    };

    const handleSelectOne = (email) => {
        setSelectedEmails((prev) =>
            prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
        );
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="p-5 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Whitelist Callers</h2>
                        <p className="text-sm text-slate-500">Add or remove emails that are allowed to sign up as callers.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <svg className="h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Add new emails */}
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Bulk Add Emails</h3>
                        <textarea
                            value={newEmails}
                            onChange={(e) => setNewEmails(e.target.value)}
                            rows="10"
                            className="w-full border border-slate-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Enter emails separated by commas, semicolons, or new lines..."
                        ></textarea>
                        <button onClick={handleAddEmails} className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700">
                            Add Emails to Whitelist
                        </button>
                    </div>

                    {/* Right: Existing emails */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-slate-800">Whitelisted Emails ({emails.length})</h3>
                            <button onClick={handleDeleteSelected} disabled={selectedEmails.length === 0} className="flex items-center gap-2 text-sm text-red-600 disabled:text-slate-400 disabled:cursor-not-allowed hover:text-red-800">
                                <Trash2 size={16} /> Delete Selected
                            </button>
                        </div>
                        <div className="border rounded-lg max-h-80 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="p-2 w-8"><input type="checkbox" className="rounded" onChange={handleSelectAll} checked={selectedEmails.length === emails.length && emails.length > 0} /></th>
                                        <th className="p-2 text-left font-medium text-slate-600">Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emails.map((emailObj) => (
                                        <tr key={emailObj.email} className="border-t">
                                            <td className="p-2 w-8">
                                                <input
                                                    type="checkbox"
                                                    className="rounded"
                                                    checked={selectedEmails.includes(emailObj.email)}
                                                    onChange={() => handleSelectOne(emailObj.email)}
                                                />
                                            </td>
                                            <td className="p-2 text-slate-700">{emailObj.email}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700">Done</button>
                </div>
            </div>
        </div>
    );
};

export default PreapprovedEmailsModal;



