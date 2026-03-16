import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.errors?.[0]?.msg ||
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const employeeService = {
  getAll: () => api.get("/employees").then((r) => r.data),
  create: (data) => api.post("/employees", data).then((r) => r.data),
  delete: (id) => api.delete(`/employees/${id}`).then((r) => r.data),
  getStats: () => api.get("/employees/stats").then((r) => r.data),
};

export const attendanceService = {
  getAll: (params) => api.get("/attendance", { params }).then((r) => r.data),
  getByEmployee: (id) => api.get(`/attendance/employee/${id}`).then((r) => r.data),
  mark: (data) => api.post("/attendance", data).then((r) => r.data),
};
