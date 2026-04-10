import apiClient from "../../utils/apiClient.js";

// fetch caller dashboard data
export const fetchCallerDashboard = async () => {
  try {
    const res = await apiClient.get("/dashboard");
    return res.data;
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    throw err;
  }
};


// fetch admin dashboard data
export const fetchAdminDashboard = async (params = {}) => {
  try {
    const res = await apiClient.get("/dashboard/admin", { params });
    return res.data;
  } catch (err) {
    console.error("Error fetching admin dashboard:", err);
    throw err;
  }
};