import api from "./api";

export const complaintService = {
  // Owner endpoints
  submitComplaint: async (data: FormData) => {
    const response = await api.post("/complaints", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  
  getMyComplaints: async () => {
    const response = await api.get("/complaints/my-complaints");
    return response.data;
  },

  // Admin endpoints
  getAllComplaints: async () => {
    const response = await api.get("/admin/complaints");
    return response.data;
  },

  getComplaintById: async (id: string) => {
    const response = await api.get(`/admin/complaints/${id}`);
    return response.data;
  },

  resolveComplaint: async (id: string, resolution: string) => {
    const response = await api.put(`/admin/complaints/${id}/resolve`, { resolution });
    return response.data;
  },

  rejectComplaint: async (id: string, reason: string) => {
    const response = await api.put(`/admin/complaints/${id}/reject`, { reason });
    return response.data;
  },
};
