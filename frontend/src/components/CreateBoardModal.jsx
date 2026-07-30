import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { createBoard } from "../services/resources";

const TEMPLATES = [
  { key: "blank", label: "Blank", columns: ["To Do", "In Progress", "Done"] },
  { key: "sprint", label: "Sprint", columns: ["To Do", "In Progress", "In Review", "Done"] },
  { key: "bugs", label: "Bug tracker", columns: ["Reported", "Confirmed", "Fixing", "Resolved"] },
];

const CreateBoardModal = ({ workspaceId, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState("sprint");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Board name can't be empty");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const columns = TEMPLATES.find((t) => t.key === template)?.columns;
      const board = await createBoard(workspaceId, { name, columns });
      onCreated(board);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create the board. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New board" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2">{error}</div>}

        <div>
          <label className="block text-sm font-medium mb-1.5">Name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sprint 1"
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Template</label>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                type="button"
                key={t.key}
                onClick={() => setTemplate(t.key)}
                className={`text-xs px-2 py-2 rounded-lg border transition-colors ${
                  template === t.key
                    ? "border-sync bg-sync/10 text-sync font-medium"
                    : "border-slate-faint dark:border-white/10 hover:bg-slate-faint dark:hover:bg-white/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sync hover:bg-sync-dark disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Creating..." : "Create board"}
        </button>
      </form>
    </Modal>
  );
};

export default CreateBoardModal;
