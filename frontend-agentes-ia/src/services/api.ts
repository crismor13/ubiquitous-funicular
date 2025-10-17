import axios from "axios";

// Configura la URL base de tu API de FastAPI
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // O la URL donde corra tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// --- AGENTES ---
export const getAgents = () => apiClient.get("/agents/");
export const createAgent = (data: { name: string; prompt: string }) => apiClient.post("/agents/", data);
export const getAgentDetails = (agentId: string) => apiClient.get(`/agents/${agentId}`);

// --- NUEVAS FUNCIONES ---
export const updateAgent = (agentId: string, data: { name?: string; prompt?: string }) =>
  apiClient.put(`/agents/${agentId}`, data);

export const deleteAgent = (agentId: string) => apiClient.delete(`/agents/${agentId}`);

// --- DOCUMENTOS ---
export const uploadDocument = (agentId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/agents/${agentId}/documents`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- NUEVA FUNCIÓN ---
export const deleteDocument = (agentId: string, fileName: string) =>
  apiClient.delete(`/agents/${agentId}/documents/${fileName}`);

// --- CHAT ---
export const chatWithAgent = (agentId: string, query: string) => {
  return apiClient.post(`/agents/${agentId}/chat`, { query });
};
