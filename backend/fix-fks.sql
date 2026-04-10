ALTER TABLE hr_contacts DROP FOREIGN KEY hr_contacts_ibfk_2;
ALTER TABLE hr_contacts DROP FOREIGN KEY hr_contacts_ibfk_3;
ALTER TABLE call_logs DROP FOREIGN KEY call_logs_ibfk_2;

ALTER TABLE hr_contacts ADD CONSTRAINT hr_contacts_ibfk_2 FOREIGN KEY (added_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL;
ALTER TABLE hr_contacts ADD CONSTRAINT hr_contacts_ibfk_3 FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id) ON DELETE SET NULL;
ALTER TABLE call_logs ADD CONSTRAINT call_logs_ibfk_2 FOREIGN KEY (caller_id) REFERENCES users(user_id) ON DELETE SET NULL;
