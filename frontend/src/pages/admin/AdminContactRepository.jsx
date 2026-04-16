import { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AddHRContactForm from '../../components/callerHRContacts/AddHRContactForm.jsx';
import EditHRContactForm from '../../components/callerHRContacts/EditHRContactForm.jsx';
import HRContactDetailsPage from '../../components/callerHRContacts/HRContactDetails/HRContactDetailsPage.jsx';
import AllContactsView from '../../components/AdminHRContacts/AllContactsView.jsx';
import PendingApprovalView from '../../components/AdminHRContacts/PendingApprovalView.jsx';
import { getAllHRContacts } from '../../api/liaisoningAPIs/hrContacts.js';

const AdminHRContactsRepository = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [contacts, setContacts] = useState([]);
    const [showAddHRContactModal, setShowAddHRContactModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [contactToEdit, setContactToEdit] = useState(null);
    const navigate = useNavigate();

    const fetchContacts = async () => {
        try {
            const response = await getAllHRContacts();
            setContacts(response.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-slate-800 text-white">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">HR Contact Repository</h1>
                        <p className="text-slate-500 mt-1">Manage, assign, and approve all company contacts.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="px-4 py-2 text-sm font-medium bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 text-white flex items-center gap-2"
                            onClick={() => navigate('/admin/assign-hr-contacts')}
                        >
                            <Users size={18} /> Assign HRs
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700 text-white flex items-center gap-2"
                            onClick={() => setShowAddHRContactModal(true)}
                        >
                            <Plus size={18} /> Add New Contact
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActiveTab('all'); }}
                            className={`shrink-0 border-b-2 py-3 px-1 text-sm font-semibold ${activeTab === 'all' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:border-slate-300'}`}
                        >
                            All Contacts
                        </a>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActiveTab('pending'); }}
                            className={`shrink-0 border-b-2 py-3 px-1 text-sm font-semibold ${activeTab === 'pending' ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:border-slate-300'}`}
                        >
                            Pending Approval
                            <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                {contacts.filter(c => !c.is_approved).length}
                            </span>
                        </a>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "all" && (
                        <AllContactsView contacts={contacts} setSelectedContact={setSelectedContact} fetchContacts={fetchContacts} setContactToEdit={setContactToEdit} />
                    )}
                    {activeTab === "pending" && (
                        <PendingApprovalView contacts={contacts} fetchContacts={fetchContacts} setContactToEdit={setContactToEdit} />
                    )}
                </div>
            </main>

            {/* Modals */}
            {showAddHRContactModal && (
                <AddHRContactForm setShowAddHRContactModal={setShowAddHRContactModal} fetchContacts={fetchContacts} />
            )}

            {contactToEdit && (
                <EditHRContactForm existingContact={contactToEdit} setShowEditHRContactModal={(val) => {if(!val) setContactToEdit(null)}} fetchContacts={fetchContacts} />
            )}

            {selectedContact && (
                <HRContactDetailsPage selectedContact={selectedContact} onClose={() => setSelectedContact(null)} />
            )}
        </div>
    );
};

export default AdminHRContactsRepository;
