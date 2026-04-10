import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar.jsx';
import { getAllCallersStats } from '../../api/liaisoningAPIs/callersStats.js';
import { getAllHRContacts, bulkAssignHRsToCaller, bulkUnassignHRs } from '../../api/liaisoningAPIs/hrContacts.js';

import CallersList from '../../components/adminContactAssignment/CallersList.jsx';
import ContactsTable from '../../components/adminContactAssignment/ContactsTable.jsx';

const ContactAssignmentPage = () => {
    const [callers, setCallers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedCaller, setSelectedCaller] = useState(null);
    const [selectedContactIds, setSelectedContactIds] = useState([]);
    const [filter, setFilter] = useState('unassigned'); 
    const [sharedBranchFilter, setSharedBranchFilter] = useState('');
    const [mode, setMode] = useState('assign'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [callerSearchTerm, setCallerSearchTerm] = useState('');

    // Fetch callers
    const fetchCallersStats = async () => {
        const response = await getAllCallersStats();
        setCallers(response.data);
    };
    useEffect(() => { fetchCallersStats(); }, []);

    useEffect(() => {
        if (!selectedCaller && callers.length > 0) {
            setSelectedCaller(callers[0]);
        }
    }, [callers, selectedCaller]);

    // Fetch contacts
    const fetchContacts = async () => {
        const response = await getAllHRContacts();
        setContacts(response.data);
    };
    useEffect(() => { fetchContacts(); }, []);

    // Filter contacts
    useEffect(() => {
        let result = contacts;
        if (filter === 'unassigned') {
            result = result.filter(c => !c.assigned_to_user_id);
        } else if (filter === 'assigned') {
            result = result.filter(c => c.assigned_to_user_id);
        }

        if (sharedBranchFilter) {
            result = result.filter(c => c.discipline === sharedBranchFilter);
        }

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(c =>
                c.full_name.toLowerCase().includes(lower) ||
                (c.company_name && c.company_name.toLowerCase().includes(lower)) ||
                (c.discipline && c.discipline.toLowerCase().includes(lower))
            );
        }
        setFilteredContacts(result);
    }, [contacts, filter, sharedBranchFilter, searchTerm]);

    // Select contact
    const handleSelectContact = (contactId) => {
        setSelectedContactIds(prev =>
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedContactIds(filteredContacts.map(c => c.contact_id));
        } else {
            setSelectedContactIds([]);
        }
    };

    // Assign/unassign
    const handleAssignContacts = async () => {
        if (selectedContactIds.length === 0) return;

        if (mode === "assign") {
            await bulkAssignHRsToCaller(selectedCaller?.caller_id, selectedContactIds);
        } else {
            await bulkUnassignHRs(selectedContactIds);
        }

        setSelectedContactIds([]);
        fetchContacts();
        fetchCallersStats();
    };

    const isAllSelected = filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />

            <div className="flex-1 p-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Contact Assignment</h1>
                    <p className="text-slate-500 mt-1">Assign and unassign HR contacts to student callers.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Callers List */}
                    <CallersList
                        callers={callers.filter(c => !sharedBranchFilter || c.branch === sharedBranchFilter)}
                        selectedCaller={selectedCaller}
                        setSelectedCaller={setSelectedCaller}
                        callerSearchTerm={callerSearchTerm}
                        setCallerSearchTerm={setCallerSearchTerm}
                        callerBranchFilter={sharedBranchFilter}
                        setCallerBranchFilter={setSharedBranchFilter}
                        mode={mode}
                        setMode={setMode}
                    />

                    {/* Contacts Table */}
                    <ContactsTable
                        callers={callers}
                        selectedCaller={selectedCaller}
                        filteredContacts={filteredContacts}
                        filter={filter}
                        setFilter={setFilter}
                        disciplineFilter={sharedBranchFilter}
                        setDisciplineFilter={setSharedBranchFilter}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedContactIds={selectedContactIds}
                        handleSelectContact={handleSelectContact}
                        handleSelectAll={handleSelectAll}
                        handleAssignContacts={handleAssignContacts}
                        isAllSelected={isAllSelected}
                        mode={mode}
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactAssignmentPage;
