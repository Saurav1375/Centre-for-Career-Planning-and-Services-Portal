import ContactActionsDropdown from './ContactActionsDropdown';
import { useState } from 'react';

const ContactRow = ({ contact, currentUser, setSelectedContact, setContactToEdit, onAddCallLog }) => {


  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{contact.full_name}</div>
        <div className="text-sm text-gray-500">{contact.designation}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{contact.company_name || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.email}</div>
        <div className="text-sm text-gray-500">{contact.phone_1}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {contact.assigned_to_user_id ? (
          <span className="text-gray-900">{contact.assigned_to_user_name}</span>
        ) : (
          <span className="font-semibold text-orange-600">Unassigned</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end items-center space-x-2">
        {contact.assigned_to_user_id === currentUser && (
          <button 
            onClick={() => onAddCallLog(contact)}
            className="text-white bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition-colors"
          >
            + Add Log
          </button>
        )}
        <ContactActionsDropdown contact={contact} currentUser={currentUser} setSelectedContact={setSelectedContact} setContactToEdit={setContactToEdit} />
      </td>
    </tr>
  );
};

export default ContactRow;
