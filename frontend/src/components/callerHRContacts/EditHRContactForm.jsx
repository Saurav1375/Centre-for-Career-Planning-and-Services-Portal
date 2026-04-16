import { useState, useEffect } from 'react';
import { updateHRContact } from '../../api/liaisoningAPIs/hrContacts.js';
import { getAllCompanies } from '../../api/liaisoningAPIs/company.js';
import AddCompanyForm from '../company/addCompanyForm.jsx';

const EditHRContactForm = ({ existingContact, setShowEditHRContactModal, fetchContacts }) => {
    // Fill state with existing contact instead of empty strings
    const [formData, setFormData] = useState({
        linkedin_profile: existingContact?.linkedin_profile || '',
        full_name: existingContact?.full_name || '',
        designation: existingContact?.designation || '',
        email: existingContact?.email || '',
        status: existingContact?.status || 'active',
        phone_1: existingContact?.phone_1 || '',
        source: existingContact?.source || '',
        notes: existingContact?.notes || '',
        tags: existingContact?.tags || '',
        past_engagement: existingContact?.past_engagement || '',
        company_id: existingContact?.company_id || '',
        discipline: existingContact?.discipline || '',
        contact_type: existingContact?.contact_type || ''
    });

    const [companies, setCompanies] = useState([]);
    const [showCompanyForm, setShowCompanyForm] = useState(false);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await getAllCompanies();
                setCompanies(response.data); 
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
        fetchCompanies();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDisciplineChange = (e) => {
        const { value, checked } = e.target;
        let current = formData.discipline ? formData.discipline.split(", ") : [];
        if (checked) {
            current.push(value);
        } else {
            current = current.filter(item => item !== value);
        }
        setFormData(prev => ({ ...prev, discipline: current.join(", ") }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // ensure is_approved is sent properly based on backend needs
        updateHRContact(existingContact.contact_id, { ...existingContact, ...formData })
            .then(response => {
                fetchContacts(); 
                setShowEditHRContactModal(false); 
            })
            .catch(error => {
                console.error("Error updating contact:", error);
                alert("Failed to update contact. " + error.message);
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-5 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Edit HR Contact</h2>
                        <p className="text-sm text-slate-500">Update the details of the contact.</p>
                    </div>
                    <button onClick={() => setShowEditHRContactModal(false)} className="p-2 rounded-full hover:bg-slate-100">
                        <svg className="h-6 w-6 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="hrEditContactForm" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="linkedin_profile" className="block text-sm font-medium text-slate-700">LinkedIn Profile URL</label>
                            <input
                                type="url"
                                name="linkedin_profile"
                                id="linkedin_profile"
                                value={formData.linkedin_profile}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                placeholder="https://www.linkedin.com/in/username"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input type="text" name="full_name" id="full_name" value={formData.full_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label htmlFor="designation" className="block text-sm font-medium text-slate-700">Designation</label>
                                <input type="text" name="designation" id="designation" value={formData.designation} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Company</label>
                            <select
                                name="company_id"
                                value={formData.company_id}
                                onChange={(e) => {
                                    if (e.target.value === "add_new_company") {
                                        setShowCompanyForm(true);
                                        setFormData(prev => ({ ...prev, company_id: "" })); 
                                    } else {
                                        handleChange(e);
                                    }
                                }}
                                className="mt-1 block w-full border rounded-md p-2"
                                required
                            >
                                <option value="">Select a company</option>
                                {companies.map(company => (
                                    <option key={company.company_id} value={company.company_id}>
                                        {company.company_name}
                                    </option>
                                ))}
                                <option value="add_new_company" className="font-bold text-teal-600">
                                    ...Company not listed? Add New
                                </option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label htmlFor="phone_1" className="block text-sm font-medium text-slate-700">Primary Phone</label>
                                <input type="tel" name="phone_1" id="phone_1" value={formData.phone_1} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Disciplines</label>
                                <div className="grid grid-cols-3 gap-2 border border-slate-300 rounded-md p-2 bg-white">
                                    {["CSE", "DSAI", "ECE", "EE", "ME", "MT", "MSME"].map(branch => (
                                        <label key={branch} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={branch}
                                                checked={formData.discipline.includes(branch)}
                                                onChange={handleDisciplineChange}
                                                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                                            />
                                            <span>{branch}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="contact_type" className="block text-sm font-medium text-slate-700">Contact Type</label>
                                <select name="contact_type" id="contact_type" value={formData.contact_type} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md p-2">
                                    <option value="">Select Type</option>
                                    <option value="HR">HR</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Alumni">Alumni</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="source" className="block text-sm font-medium text-slate-700">Source</label>
                            <input type="text" name="source" id="source" value={formData.source} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., LinkedIn, Alumni Referral..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-slate-700">Tags</label>
                                <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="e.g., Priority, Tech, Local..." />
                            </div>
                            <div>
                                <label htmlFor="past_engagement" className="block text-sm font-medium text-slate-700">Past Engagement</label>
                                <input type="text" name="past_engagement" id="past_engagement" value={formData.past_engagement} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" placeholder="Previous interaction details..." />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes</label>
                            <textarea id="notes" name="notes" rows="3" value={formData.notes} onChange={handleChange} className="mt-1 block w-full border border-slate-300 rounded-md shadow-sm p-2 focus:ring-teal-500 focus:border-teal-500" placeholder="Any additional information..."></textarea>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t bg-slate-50 flex justify-end">
                    <button type="button" onClick={() => setShowEditHRContactModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 mr-3">Cancel</button>
                    <button type="submit" form="hrEditContactForm" className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg shadow-sm hover:bg-teal-700">Save Changes</button>
                </div>
            </div>

            {showCompanyForm && (
                <AddCompanyForm
                    setShowCompanyForm={setShowCompanyForm}
                    refreshCompanies={() => {
                        getAllCompanies().then(res => setCompanies(res.data));
                    }}
                />
            )}
        </div>
    );
};
export default EditHRContactForm;
