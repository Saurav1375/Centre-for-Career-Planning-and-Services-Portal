import InfoRow from './common/InfoRow';
import MetadataRow from './common/MetadataRow';
import StatusBadge from './common/StatusBadge';
import { Mail, Phone, Link as LinkIcon } from 'lucide-react';

const ContactDetails = ({ selectedContact }) => {
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';

  return (
    <div className="lg:col-span-1 p-6 border-r border-slate-200">
      <div className="flex items-center mb-6">
        <span className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
          {selectedContact.initials}
        </span>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-slate-900">{selectedContact.full_name}</h3>
          <p className="text-sm text-slate-600">{selectedContact.designation}</p>
          <p className="text-sm text-slate-500">{selectedContact.company_name}</p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <InfoRow icon={<Mail className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />} text={selectedContact.email} />
        <InfoRow icon={<Phone className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />} text={selectedContact.phone_1} />
        <InfoRow
          icon={<LinkIcon className="h-5 w-5 text-slate-400 mr-3 mt-0.5" />}
          text="LinkedIn Profile"
          href={selectedContact.linkedin_profile}
        />
      </div>

      <div className="mt-6 pt-6 border-t space-y-2 text-sm">
        <h4 className="font-semibold text-slate-800 mb-2">Metadata</h4>
        <MetadataRow label="Status">
          <StatusBadge text={selectedContact.status} type="success" />
        </MetadataRow>
        <MetadataRow label="Approval">
          <StatusBadge text={selectedContact.is_approved ? 'Approved' : 'Pending'} type="warning" />
        </MetadataRow>
        <MetadataRow label="Source">
          <span className="text-slate-700">{selectedContact.source}</span>
        </MetadataRow>
        <MetadataRow label="Tags">
          <span className="text-slate-700">{selectedContact.tags || "None"}</span>
        </MetadataRow>
        <MetadataRow label="Past Engagement">
          <span className="text-slate-700">{selectedContact.past_engagement || "None"}</span>
        </MetadataRow>
        <MetadataRow label="Added By">
          <span className="text-slate-700">{selectedContact.added_by_user_name}</span>
        </MetadataRow>
        <MetadataRow label="Assigned To">
          <span className="text-slate-700 font-semibold">{selectedContact.assigned_to_user_name || "Unassigned"}</span>
        </MetadataRow>
        <MetadataRow label="Added On">
          <span className="text-slate-700">{formatDate(selectedContact.created_at)}</span>
        </MetadataRow>
      </div>

      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-slate-800 mb-2">Notes</h4>
        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">
          {selectedContact.notes || 'No notes available.'}
        </p>
      </div>
    </div>
  );
};

export default ContactDetails;
