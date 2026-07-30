import React, { useState } from "react";
import Modal from "./Modal.jsx";
import Avatar from "./Avatar.jsx";
import { Paperclip, Trash2 } from "lucide-react";
import { updateTask, deleteTask, addComment, uploadFile } from "../services/resources";

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const TaskDetailModal = ({ task, members, workspaceId, onClose, onUpdated, onDeleted }) => {
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localTask, setLocalTask] = useState(task);

  const patch = async (data) => {
    const updated = await updateTask(localTask._id, data);
    setLocalTask(updated);
    onUpdated(updated);
  };

  const handleAssigneeToggle = (userId) => {
    const current = localTask.assignees.map((a) => a._id);
    const next = current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId];
    patch({ assignees: next });
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const updated = await addComment(localTask._id, comment);
    setLocalTask(updated);
    onUpdated(updated);
    setComment("");
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerType", "task");
    formData.append("ownerId", localTask._id);
    formData.append("workspaceId", workspaceId);
    try {
      const fileMeta = await uploadFile(formData);
      const updated = { ...localTask, attachments: [...localTask.attachments, fileMeta] };
      setLocalTask(updated);
      onUpdated(updated);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task? This can't be undone.")) return;
    await deleteTask(localTask._id);
    onDeleted(localTask._id);
    onClose();
  };

  return (
    <Modal title={localTask.title} onClose={onClose} wide>
      <div className="space-y-5">
        <textarea
          defaultValue={localTask.description}
          onBlur={(e) => patch({ description: e.target.value })}
          placeholder="Add a description..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync resize-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">Priority</label>
            <select
              value={localTask.priority}
              onChange={(e) => patch({ priority: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p} className="bg-surface dark:bg-surface-dark">{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">Due date</label>
            <input
              type="date"
              defaultValue={localTask.dueDate ? localTask.dueDate.slice(0, 10) : ""}
              onChange={(e) => patch({ dueDate: e.target.value || null })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">Assignees</label>
          <div className="flex flex-wrap gap-2">
            {members.map((m) => {
              const active = localTask.assignees.some((a) => a._id === m.user._id);
              return (
                <button
                  key={m._id}
                  onClick={() => handleAssigneeToggle(m.user._id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border transition-colors ${
                    active ? "border-sync bg-sync/10 text-sync font-medium" : "border-slate-faint dark:border-white/10"
                  }`}
                >
                  <Avatar name={m.user.name} size={16} /> {m.user.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">Attachments</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {localTask.attachments?.map((f, i) => (
              <a
                key={i}
                href={(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "") + f.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border border-slate-faint dark:border-white/10 hover:bg-slate-faint dark:hover:bg-white/5"
              >
                <Paperclip size={12} /> {f.filename}
              </a>
            ))}
          </div>
          <label className="text-xs text-sync cursor-pointer hover:underline">
            {uploading ? "Uploading..." : "+ Add file"}
            <input type="file" onChange={handleFile} className="hidden" disabled={uploading} />
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
            Comments ({localTask.comments?.length || 0})
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-2">
            {localTask.comments?.map((c) => (
              <div key={c._id} className="flex gap-2 text-sm">
                <Avatar name={c.author?.name} size={22} />
                <div>
                  <p className="text-xs text-slate">{c.author?.name} · {new Date(c.createdAt).toLocaleTimeString()}</p>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleComment} className="flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment... use @ to mention"
              className="flex-1 px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
            />
            <button type="submit" className="bg-sync text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-sync-dark">
              Send
            </button>
          </form>
        </div>

        <div className="border-t border-slate-faint dark:border-white/10 pt-4">
          <button onClick={handleDelete} className="flex items-center gap-1.5 text-sm text-coral hover:underline">
            <Trash2 size={14} /> Delete task
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
