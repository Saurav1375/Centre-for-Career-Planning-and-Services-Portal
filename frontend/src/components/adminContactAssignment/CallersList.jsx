import { ChevronRight } from 'lucide-react';

const CallersList = ({ callers, selectedCaller, setSelectedCaller, callerSearchTerm, setCallerSearchTerm, callerBranchFilter, setCallerBranchFilter, mode, setMode }) => {
    const filteredCallers = callers.filter(caller =>
        caller.full_name.toLowerCase().includes(callerSearchTerm.toLowerCase())
    );

    return (
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-4 h-fit">
            <h3 className="font-bold text-slate-800 px-2 mb-2">Student Callers</h3>
            <div className="px-2 mb-3 space-y-2">
                <input
                    type="search"
                    value={callerSearchTerm}
                    onChange={(e) => setCallerSearchTerm(e.target.value)}
                    placeholder="Search callers..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
            </div>
            <ul className="space-y-1">
                {filteredCallers.map(caller => {
                    const initials = caller.full_name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .toUpperCase();
                    return (
                        <li key={caller.caller_id}>
                            <a
                                href="#"
                                onClick={() => setSelectedCaller(caller)}
                                className={`flex justify-between items-center p-3 rounded-lg border-l-4 transition-colors ${selectedCaller?.caller_id === caller.caller_id
                                    ? 'bg-teal-50 border-l-teal-500'
                                    : 'border-transparent hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 mr-3">
                                        {initials}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800">{caller.full_name}</p>
                                        <p className="text-xs text-slate-500">{caller.total_contacts_assigned} Contacts · <span className="font-medium text-teal-600">{caller.branch || 'N/A'}</span></p>
                                    </div>
                                </div>
                                {selectedCaller?.caller_id === caller.caller_id && <ChevronRight className="h-5 w-5 text-teal-500" />}
                            </a>
                        </li>
                    );
                })}
            </ul>

            {/* Mode Toggle */}
            <div className="mt-4 px-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Action Mode</label>
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                >
                    <option value="assign">Assign</option>
                    <option value="unassign">Unassign</option>
                </select>
            </div>
        </div>
    );
};

export default CallersList;
