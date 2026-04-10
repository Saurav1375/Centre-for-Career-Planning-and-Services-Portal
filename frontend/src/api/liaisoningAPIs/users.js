import apiClient from "../../utils/apiClient.js";

// Get all users (optionally filter by status or role)
export const getAllUsers = async (params = {}) => {
  const { data } = await apiClient.get("/users", { params });
  return data;
};

// Approve a user
export const approveUser = async (id) => {
  const { data } = await apiClient.patch(`/users/${id}/approve`);
  return data;
};

// Delete a user
export const deleteUser = async (id) => {
  const { data } = await apiClient.delete(`/users/${id}`);
  return data;
};


// Revoke a user
export const revokeUser = async (id) => {
  const { data } = await apiClient.patch(`/users/${id}/revoke`);
  return data;
};

// Send Admin SMS to caller
export const sendAdminSMS = async (callerId, adminMessage) => {
  const { data } = await apiClient.post(`/users/${callerId}/send-sms`, {
    adminMessage,
  });
  return data;
};

// Bulk approve users
export const bulkApproveUsers = async (userIds) => {
  const { data } = await apiClient.post(`/users/bulk-approve`, { userIds });
  return data;
};

// Bulk delete users
export const bulkDeleteUsers = async (userIds) => {
  const { data } = await apiClient.post(`/users/bulk-delete`, { userIds });
  return data;
};

// Bulk revoke users
export const bulkRevokeUsers = async (userIds) => {
  const { data } = await apiClient.post(`/users/bulk-revoke`, { userIds });
  return data;
};

// Update user role
export const updateUserRole = async (id, role) => {
  const { data } = await apiClient.patch(`/users/${id}/role`, { role });
  return data;
};