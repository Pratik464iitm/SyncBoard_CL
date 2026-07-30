import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";
import AppShell from "../components/AppShell.jsx";
import EmptyState from "../components/EmptyState.jsx";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal.jsx";
import { SkeletonGrid } from "../components/Skeletons.jsx";
import Avatar from "../components/Avatar.jsx";
import useWorkspaces from "../hooks/useWorkspaces.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { workspaces, loading, setWorkspaces } = useWorkspaces();
  const [showCreate, setShowCreate] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreated = (workspace) => {
    setWorkspaces((prev) => [workspace, ...prev]);
    setShowCreate(false);
    navigate(`/workspaces/${workspace._id}`);
  };

  return (
    <AppShell workspaces={workspaces} onCreateWorkspace={() => setShowCreate(true)}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-display text-2xl font-semibold mb-1">
          Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-slate text-sm mb-8">Here's what your team's been up to.</p>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium text-sm text-slate uppercase tracking-wide">Your workspaces</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 text-sm text-sync font-medium hover:underline"
          >
            <Plus size={15} /> New workspace
          </button>
        </div>

        {loading ? (
          <SkeletonGrid count={3} />
        ) : workspaces.length === 0 ? (
          <div className="border border-dashed border-slate-faint dark:border-white/10 rounded-xl2">
            <EmptyState
              icon={LayoutGrid}
              title="No workspaces yet"
              description="Create your first workspace to start organizing boards, notes, and tasks with your team."
              actionLabel="Create your first workspace"
              onAction={() => setShowCreate(true)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((w) => (
              <button
                key={w._id}
                onClick={() => navigate(`/workspaces/${w._id}`)}
                className="text-left p-4 rounded-xl2 border border-slate-faint dark:border-white/10 bg-surface dark:bg-surface-dark hover:shadow-card transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                  <h3 className="font-medium truncate">{w.name}</h3>
                </div>
                {w.description && <p className="text-xs text-slate mb-4 line-clamp-2">{w.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {w.members?.slice(0, 4).map((m) => (
                      <Avatar key={m._id} name={m.user?.name} size={24} ring />
                    ))}
                    {w.members?.length > 4 && (
                      <div className="w-6 h-6 rounded-full bg-slate-faint dark:bg-white/10 ring-2 ring-surface dark:ring-surface-dark flex items-center justify-center text-[10px] font-medium">
                        +{w.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-slate">{w.members?.length || 0} members</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showCreate && <CreateWorkspaceModal onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
    </AppShell>
  );
};

export default Dashboard;
