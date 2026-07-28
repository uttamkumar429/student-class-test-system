import api from "./api";

// Get All Tests
export const getAllTests = async () => {
  const response = await api.get("/tests");
  return response.data;
};

// Create Test
export const createTest = async (data) => {
  const response = await api.post("/tests", data);
  return response.data;
};

// Update Test
export const updateTest = async (id, data) => {
  const response = await api.put(`/tests/${id}`, data);
  return response.data;
};

// Delete Test
export const deleteTest = async (id) => {
  const response = await api.delete(`/tests/${id}`);
  return response.data;
};

// Publish Test
export const publishTest = async (id) => {
  const response = await api.post(`/tests/${id}/publish`);
  return response.data;
};