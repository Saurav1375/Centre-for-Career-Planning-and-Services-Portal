import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext.jsx';
import { getAllHRContacts } from '../../api/liaisoningAPIs/hrContacts.js';
import HeaderSection from '../../components/callerHRContacts/HeaderSection.jsx';
import FiltersBar from '../../components/callerHRContacts/FiltersBar.jsx';
import ContactsTable from '../../components/callerHRContacts/ContactTable.jsx';
import Sidebar from '../../components/Sidebar.jsx';
import AddHRContactForm from '../../components/callerHRContacts/AddHRContactForm.jsx';
import HRContactDetailsPage from '../../components/callerHRContacts/HRContactDetails/HRContactDetailsPage.jsx';
import LogForm from '../../components/callerDashboard/LogForm.jsx';

const HRContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const { authUser } = useAuthContext();
  const CURRENT_USER_ID = authUser?._id;

  const [showAddHRContactModal, setShowAddHRContactModal] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedHRForLog, setSelectedHRForLog] = useState(null);

  const [selectedContact, setSelectedContact] = useState(null);

    const fetchContacts = async () => {
    try {
      const response = await getAllHRContacts();
      setContacts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContacts(); // call once on mount
  }, []);

  useEffect(() => {
    let result = contacts;
    if (searchTerm) {
      result = result.filter(contact =>
        (contact.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (contact.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }
    switch (assignmentFilter) {
      case 'me':
        result = result.filter(c => c.assigned_to_user_id === CURRENT_USER_ID);
        break;
      case 'assigned':
        result = result.filter(c => c.assigned_to_user_id);
        break;
      case 'unassigned':
        result = result.filter(c => !c.assigned_to_user_id);
        break;
      default:
        break;
    }
    setFilteredContacts(result);
  }, [searchTerm, assignmentFilter, contacts, CURRENT_USER_ID]);

  return (
    <div className="flex min-h-screen bg-gray-50">

    <Sidebar />


    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <HeaderSection setShowAddHRContactModal={setShowAddHRContactModal} />
        <FiltersBar
          contacts={filteredContacts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          assignmentFilter={assignmentFilter}
          setAssignmentFilter={setAssignmentFilter}
        />
        <ContactsTable 
          contacts={filteredContacts} 
          currentUser={CURRENT_USER_ID} 
          setSelectedContact={setSelectedContact}
          onAddCallLog={(contact) => {
            setSelectedHRForLog(contact);
            setShowLogForm(true);
          }}
        />
      </div>
    </div>


     { showAddHRContactModal && (
    <AddHRContactForm setShowAddHRContactModal={setShowAddHRContactModal} fetchContacts={fetchContacts} />
  )}


     { selectedContact && (
       <HRContactDetailsPage selectedContact={selectedContact} onClose={() => setSelectedContact(null)} />
     )}

     { showLogForm && (
       <LogForm hr={selectedHRForLog} setLogForm={setShowLogForm} onSubmit={fetchContacts} />
     )}



  </div>

 

);

};

export default HRContactsPage;
