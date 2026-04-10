const ContactsTable = ({
    callers,
    selectedCaller,
    filteredContacts,
    filter,
    setFilter,
    disciplineFilter,
    setDisciplineFilter,
    searchTerm,
    setSearchTerm,
    selectedContactIds,
    handleSelectContact,
    handleSelectAll,
    handleAssignContacts,
    isAllSelected,
    mode
}) => {
    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 flex flex-wrap justify-between items-center border-b gap-4">
                    <div className="flex items-center gap-4">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-slate-300 rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="unassigned">Show: Unassigned</option>
                            <option value="assigned">Show: Assigned</option>
                            <option value="all">Show: All Contacts</option>
                        </select>
                        <select
                            value={disciplineFilter}
                            onChange={(e) => setDisciplineFilter(e.target.value)}
                            className="border border-slate-300 rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                            <option value="">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="DSAI">DSAI</option>
                            <option value="ECE">ECE</option>
                            <option value="EE">EE</option>
                            <option value="ME">ME</option>
                            <option value="MT">MT</option>
                            <option value="MSME">MSME</option>
                        </select>
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search HR or company..."
                            className="w-64 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                    </div>
                    <button
                        onClick={handleAssignContacts}
                        disabled={selectedContactIds.length === 0}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm flex items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed ${mode === 'assign' ? 'bg-teal-600' : 'bg-orange-600'
                            }`}
                    >
                        {mode === 'assign'
                            ? `Assign (${selectedContactIds.length}) to ${selectedCaller?.full_name}`
                            : `Unassign (${selectedContactIds.length})`}
                    </button>
                </div>

                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="p-4">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="rounded"
                                />
                            </th>
                            <th scope="col" className="px-6 py-3">HR Contact</th>
                            <th scope="col" className="px-6 py-3">Company</th>
                            <th scope="col" className="px-6 py-3">Assigned To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.map(contact => {
                            const assignee = callers.find(caller => caller.caller_id === contact.assigned_to_user_id);
                            return (
                                <tr key={contact.contact_id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedContactIds.includes(contact.contact_id)}
                                            onChange={() => handleSelectContact(contact.contact_id)}
                                            className="rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{contact.full_name}</td>
                                    <td className="px-6 py-4">{contact.company_name || "N/A"}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {assignee ? (
                                            <span className="text-slate-900">{assignee.full_name}</span>
                                        ) : (
                                            <span className="font-semibold text-orange-600">Unassigned</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredContacts.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <p>No contacts found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactsTable;
