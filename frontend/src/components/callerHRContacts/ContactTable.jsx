import ContactRow from './ContactRow';


const ContactsTable = ({ contacts, currentUser, setSelectedContact, onAddCallLog }) => {


  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">HR Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Assigned To</th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contacts.length > 0 ? (
              contacts.map((contact) => (
                <ContactRow 
                  key={contact.contact_id} 
                  contact={contact} 
                  currentUser={currentUser} 
                  setSelectedContact={setSelectedContact}
                  onAddCallLog={onAddCallLog}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12 text-gray-500">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ContactsTable;
