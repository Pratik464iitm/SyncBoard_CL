import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { createWorkspace } from "../services/resources";

const COLOR_OPTIONS = ["#4C6FFF", "#16C2A3", "#F5A623", "#FF5D5D", "#8B5CF6", "#EC4899"];

const CreateWorkspaceModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Workspace name can't be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const workspace = await createWorkspace({ name, description, color });
      onCreated(workspace);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create the workspace. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New workspace" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Product Team"
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="What's this workspace for?"
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${color === c ? "scale-110 ring-2 ring-offset-2 ring-ink dark:ring-white" : ""}`}
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sync hover:bg-sync-dark disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Creating..." : "Create workspace"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateWorkspaceModal;
