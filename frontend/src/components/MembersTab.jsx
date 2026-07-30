import React, { useState } from "react";
import { UserPlus, MoreVertical } from "lucide-react";
import Avatar from "./Avatar.jsx";
import InviteMemberModal from "./InviteMemberModal.jsx";
import { updateMemberRole, removeMember } from "../services/resources";

const ROLES = ["owner", "admin", "editor", "viewer"];

const MembersTab = ({ workspace, setWorkspace, currentUserId }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const myRole = workspace.members.find((m) => m.user._id === currentUserId)?.role;
  const canManage = myRole === "owner" || myRole === "admin";

  const handleRoleChange = async (memberId, role) => {
    const updated = await updateMemberRole(workspace._id, memberId, role);
    setWorkspace(updated);
    setOpenMenu(null);
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm("Remove this member from the workspace?")) return;
    const updated = await removeMember(workspace._id, memberId);
    setWorkspace(updated);
    setOpenMenu(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm text-slate uppercase tracking-wide">
          {workspace.members.length} members
        </h3>
        {canManage && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 text-sm text-sync font-medium hover:underline"
          >
            <UserPlus size={15} /> Invite
          </button>
        )}
      </div>

      <div className="bg-surface dark:bg-surface-dark rounded-xl2 border border-slate-faint dark:border-white/10 divide-y divide-slate-faint dark:divide-white/10">
        {workspace.members.map((m) => (
          <div key={m._id} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={m.user.name} size={32} />
              <div>
                <p className="text-sm font-medium">{m.user.name}</p>
                <p className="text-xs text-slate">{m.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-faint dark:bg-white/10 capitalize">
                {m.role}
              </span>
              {canManage && m.role !== "owner" && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === m._id ? null : m._id)}
                    className="p-1.5 rounded-md hover:bg-slate-faint dark:hover:bg-white/10"
                  >
                    <MoreVertical size={15} />
                  </button>
                  {openMenu === m._id && (
                    <div className="absolute right-0 mt-1 w-40 bg-surface dark:bg-surface-dark rounded-lg shadow-pop border border-slate-faint dark:border-white/10 py-1 z-20">
                      {ROLES.filter((r) => r !== "owner").map((r) => (
                        <button
                          key={r}
                          onClick={() => handleRoleChange(m._id, r)}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-paper dark:hover:bg-white/5 capitalize"
                        >
                          Make {r}
                        </button>
                      ))}
                      <button
                        onClick={() => handleRemove(m._id)}
                        className="w-full text-left px-3 py-1.5 text-xs text-coral hover:bg-coral/10"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showInvite && (
        <InviteMemberModal
          workspaceId={workspace._id}
          onClose={() => setShowInvite(false)}
          onInvited={(ws) => {
            setWorkspace(ws);
          }}
        />
      )}
    </div>
  );
};

export default MembersTab;
