import React, { useState } from "react";
import AppShell from "../components/AppShell.jsx";
import Avatar from "../components/Avatar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { updateMe, changePassword } from "../services/resources";
import useWorkspaces from "../hooks/useWorkspaces.js";

const Settings = () => {
  const { user, updateUserLocal, logout } = useAuth();
  const { workspaces } = useWorkspaces();
  const [name, setName] = useState(user.name);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg("");
    try {
      const { user: updated } = await updateMe({ name });
      updateUserLocal(updated);
      setProfileMsg("Profile updated");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwMsg("");
    try {
      await changePassword({ currentPassword, newPassword });
      setPwMsg("Password updated");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(err.response?.data?.message || "Couldn't update password");
    }
  };

  return (
    <AppShell workspaces={workspaces}>
      <div className="max-w-xl mx-auto px-6 py-8 space-y-6">
        <h1 className="font-display text-2xl font-semibold">Settings</h1>

        <div className="bg-surface dark:bg-surface-dark rounded-xl2 border border-slate-faint dark:border-white/10 p-5">
          <h2 className="font-medium mb-4">Profile</h2>
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={user.name} size={48} />
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-slate">{user.email}</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-3">
            {profileMsg && <p className="text-sm text-signal">{profileMsg}</p>}
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-sync hover:bg-sync-dark disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {savingProfile ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        <div className="bg-surface dark:bg-surface-dark rounded-xl2 border border-slate-faint dark:border-white/10 p-5">
          <h2 className="font-medium mb-4">Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            {pwMsg && <p className="text-sm text-signal">{pwMsg}</p>}
            {pwError && <p className="text-sm text-coral">{pwError}</p>}
            <div>
              <label className="block text-sm font-medium mb-1.5">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
            </div>
            <button
              type="submit"
              className="bg-sync hover:bg-sync-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Update password
            </button>
          </form>
        </div>

        <div className="border border-coral/30 bg-coral/5 rounded-xl2 p-5">
          <h2 className="font-medium text-coral mb-1">Danger zone</h2>
          <p className="text-sm text-slate mb-3">Log out of SyncBoard on this device.</p>
          <button onClick={logout} className="text-sm bg-coral text-white px-3 py-1.5 rounded-lg hover:bg-coral/90">
            Log out
          </button>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;
