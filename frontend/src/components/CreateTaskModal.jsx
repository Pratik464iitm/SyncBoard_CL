import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { createTask } from "../services/resources";

const CreateTaskModal = ({ boardId, status, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title can't be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const task = await createTask(boardId, { title, priority, status });
      onCreated(task);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create the task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`New task in ${status}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fix login bug"
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
          >
            {["Low", "Medium", "High", "Urgent"].map((p) => (
              <option key={p} value={p} className="bg-surface dark:bg-surface-dark">{p}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sync hover:bg-sync-dark disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Creating..." : "Create task"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
