import React, { useState } from "react";
import Modal from "./Modal.jsx";
import { inviteMember } from "../services/resources";

const ROLES = ["admin", "editor", "viewer"];

const InviteMemberModal = ({ workspaceId, onClose, onInvited }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const workspace = await inviteMember(workspaceId, { email, role });
      onInvited(workspace);
      setSuccess(`Invite sent to ${email}`);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't send the invite. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Invite a member" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2">{error}</div>}
        {success && <div className="text-sm text-signal bg-signal/10 rounded-lg px-3 py-2">{success}</div>}

        <div>
          <label className="block text-sm font-medium mb-1.5">Email address</label>
          <input
            autoFocus
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@company.com"
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
          />
          <p className="text-xs text-slate mt-1">They need an existing SyncBoard account to be added.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-surface dark:bg-surface-dark">
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sync hover:bg-sync-dark disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
        >
          {loading ? "Sending..." : "Send invite"}
        </button>
      </form>
    </Modal>
  );
};

export default InviteMemberModal;
