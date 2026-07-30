import api from "./api";

// Auth
export const registerUser = (data) => api.post("/auth/register", data).then((r) => r.data);
export const loginUser = (data) => api.post("/auth/login", data).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const updateMe = (data) => api.patch("/auth/me", data).then((r) => r.data);
export const changePassword = (data) => api.patch("/auth/password", data).then((r) => r.data);

// Workspaces
export const getWorkspaces = () => api.get("/workspaces").then((r) => r.data.workspaces);
export const createWorkspace = (data) => api.post("/workspaces", data).then((r) => r.data.workspace);
export const getWorkspace = (id) => api.get(`/workspaces/${id}`).then((r) => r.data.workspace);
export const updateWorkspace = (id, data) => api.patch(`/workspaces/${id}`, data).then((r) => r.data.workspace);
export const deleteWorkspace = (id) => api.delete(`/workspaces/${id}`).then((r) => r.data);
export const getWorkspaceStats = (id) => api.get(`/workspaces/${id}/stats`).then((r) => r.data.stats);

// Members
export const inviteMember = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/invite`, data).then((r) => r.data.workspace);
export const updateMemberRole = (workspaceId, memberId, role) =>
  api.patch(`/workspaces/${workspaceId}/members/${memberId}`, { role }).then((r) => r.data.workspace);
export const removeMember = (workspaceId, memberId) =>
  api.delete(`/workspaces/${workspaceId}/members/${memberId}`).then((r) => r.data.workspace);
export const leaveWorkspace = (workspaceId) => api.post(`/workspaces/${workspaceId}/leave`).then((r) => r.data);

// Boards
export const getBoards = (workspaceId) => api.get(`/workspaces/${workspaceId}/boards`).then((r) => r.data.boards);
export const createBoard = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/boards`, data).then((r) => r.data.board);
export const getBoard = (id) => api.get(`/boards/${id}`).then((r) => r.data.board);
export const updateBoard = (id, data) => api.patch(`/boards/${id}`, data).then((r) => r.data.board);
export const toggleArchiveBoard = (id) => api.patch(`/boards/${id}/archive`).then((r) => r.data.board);
export const deleteBoard = (id) => api.delete(`/boards/${id}`).then((r) => r.data);

// Tasks
export const getTasks = (boardId) => api.get(`/boards/${boardId}/tasks`).then((r) => r.data.tasks);
export const createTask = (boardId, data) => api.post(`/boards/${boardId}/tasks`, data).then((r) => r.data.task);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data).then((r) => r.data.task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);
export const addComment = (id, text) => api.post(`/tasks/${id}/comments`, { text }).then((r) => r.data.task);

// Notes
export const getNotes = (workspaceId) => api.get(`/workspaces/${workspaceId}/notes`).then((r) => r.data.notes);
export const createNote = (workspaceId, data) =>
  api.post(`/workspaces/${workspaceId}/notes`, data).then((r) => r.data.note);
export const updateNote = (id, data) => api.patch(`/notes/${id}`, data).then((r) => r.data.note);
export const togglePinNote = (id) => api.patch(`/notes/${id}/pin`).then((r) => r.data.note);
export const deleteNote = (id) => api.delete(`/notes/${id}`).then((r) => r.data);

// Files
export const uploadFile = (formData) =>
  api.post("/files/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data.file);

// Notifications
export const getNotifications = () => api.get("/notifications").then((r) => r.data);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data);
export const markAllNotificationsRead = () => api.patch("/notifications/read-all").then((r) => r.data);

// Search
export const globalSearch = (q, workspaceId) =>
  api.get("/search", { params: { q, workspaceId } }).then((r) => r.data);
