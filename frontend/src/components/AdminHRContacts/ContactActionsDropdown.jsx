import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { toggleHRContactApproval } from '../../api/liaisoningAPIs/hrContacts.js';

const ContactActionsDropdown = ({ contact, setSelectedContact, fetchContacts, setContactToEdit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const removeApproval = async (id) => {
        await toggleHRContactApproval(id);
        fetchContacts();
    };

    const handleViewDetails = () => setSelectedContact(contact);

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 hover:text-slate-800 rounded-full">
                <MoreVertical size={20} />
            </button>
            {isOpen && (
                <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <button onClick={handleViewDetails} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        View Details
                    </button>
                    <button onClick={() => { setContactToEdit(contact); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        Edit Contact
                    </button>
                    <button onClick={() => removeApproval(contact.contact_id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Remove Approval
                    </button>
                </div>
            )}
        </div>
    );
};

export default ContactActionsDropdown;
