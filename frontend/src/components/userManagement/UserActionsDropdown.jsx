import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { updateUserRole, revokeUser } from '../../api/liaisoningAPIs/users';

const UserActionsDropdown = ({ user, fetchData, setSelectedContactToSms }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRevoke = async (userId) => {
        await revokeUser(userId);
        fetchData();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 hover:text-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500">
                <MoreVertical size={20} />
            </button>
            {isOpen && (
                <div className="absolute z-10 right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <a onClick={() => setSelectedContactToSms(user)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Send Message</a>
                    {user.role === 'caller' && (
                        <a onClick={async () => { await updateUserRole(user.user_id, 'moderator'); fetchData(); }} className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer">Make Moderator</a>
                    )}
                    {user.role === 'moderator' && (
                        <a onClick={async () => { await updateUserRole(user.user_id, 'caller'); fetchData(); }} className="block px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 cursor-pointer">Demote to Caller</a>
                    )}
                    <a onClick={() => handleRevoke(user.user_id)} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">Revoke Access</a>
                </div>
            )}
        </div>
    );
};

export default UserActionsDropdown;
