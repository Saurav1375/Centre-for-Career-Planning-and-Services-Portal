import { Users } from 'lucide-react';

const AssignedHRContacts = ({ contacts }) => (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-teal-500" />
            <h2 className="text-lg font-bold text-slate-800">Assigned HR Contacts</h2>
            <span className="ml-auto text-xs text-slate-400 font-medium">{contacts.length} assigned</span>
        </div>
        {contacts.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-slate-400 text-sm">No contacts assigned to you yet.</p>
                <p className="text-xs text-slate-300 mt-1">Ask your admin to assign HR contacts.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {contacts.map((c) => (
                    <div key={c.contact_id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
                            {(c.full_name || '??').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-slate-800 truncate">{c.full_name}</p>
                            <p className="text-xs text-slate-500 truncate">{c.company_name} · {c.designation}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                            c.status === "Active" ? "bg-emerald-100 text-emerald-700" :
                            c.status === "New" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-600"
                        }`}>
                            {c.status || 'N/A'}
                        </span>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default AssignedHRContacts;
