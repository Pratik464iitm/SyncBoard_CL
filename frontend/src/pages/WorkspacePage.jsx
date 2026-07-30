import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Plus, LayoutGrid, Star, Archive } from "lucide-react";
import AppShell from "../components/AppShell.jsx";
import EmptyState from "../components/EmptyState.jsx";
import CreateBoardModal from "../components/CreateBoardModal.jsx";
import NotesTab from "../components/NotesTab.jsx";
import MembersTab from "../components/MembersTab.jsx";
import { SkeletonGrid } from "../components/Skeletons.jsx";
import useWorkspaces from "../hooks/useWorkspaces.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  getWorkspace,
  getBoards,
  getNotes,
  getWorkspaceStats,
  deleteWorkspace,
} from "../services/resources";

const TABS = ["boards", "notes", "members", "settings"];

const WorkspacePage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "boards";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workspaces } = useWorkspaces();

  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([getWorkspace(id), getBoards(id), getNotes(id), getWorkspaceStats(id)])
      .then(([ws, b, n, s]) => {
        setWorkspace(ws);
        setBoards(b);
        setNotes(n);
        setStats(s);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const setTab = (t) => setSearchParams({ tab: t });

  const visibleBoards = boards.filter((b) => (showArchived ? b.isArchived : !b.isArchived));

  const handleDeleteWorkspace = async () => {
    if (!window.confirm(`Delete "${workspace.name}"? This deletes all its boards and notes permanently.`)) return;
    await deleteWorkspace(id);
    navigate("/dashboard");
  };

  if (loading || !workspace) {
    return (
      <AppShell workspaces={workspaces}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <SkeletonGrid count={3} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell workspaces={workspaces} activeWorkspaceId={id}>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: workspace.color }} />
          <h1 className="font-display text-2xl font-semibold">{workspace.name}</h1>
        </div>
        {workspace.description && <p className="text-slate text-sm mb-4">{workspace.description}</p>}

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Boards", value: stats.totalBoards },
              { label: "Tasks", value: stats.totalTasks },
              { label: "Completed", value: stats.completedTasks },
              { label: "Members", value: stats.totalMembers },
            ].map((s) => (
              <div key={s.label} className="bg-surface dark:bg-surface-dark border border-slate-faint dark:border-white/10 rounded-xl p-3">
                <p className="text-xl font-display font-semibold">{s.value}</p>
                <p className="text-xs text-slate">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-faint dark:border-white/10 mb-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t ? "border-sync text-sync" : "border-transparent text-slate hover:text-ink dark:hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "boards" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowArchived((s) => !s)}
                className="flex items-center gap-1.5 text-xs text-slate hover:text-ink dark:hover:text-white"
              >
                <Archive size={13} /> {showArchived ? "Show active boards" : "Show archived"}
              </button>
              <button
                onClick={() => setShowCreateBoard(true)}
                className="flex items-center gap-1.5 text-sm text-sync font-medium hover:underline"
              >
                <Plus size={15} /> New board
              </button>
            </div>

            {visibleBoards.length === 0 ? (
              <div className="border border-dashed border-slate-faint dark:border-white/10 rounded-xl2">
                <EmptyState
                  icon={LayoutGrid}
                  title={showArchived ? "No archived boards" : "No boards yet"}
                  description={
                    showArchived
                      ? "Boards you archive will show up here, fully restorable."
                      : "Create a board to start tracking tasks with your team."
                  }
                  actionLabel={showArchived ? undefined : "Create your first board"}
                  onAction={() => setShowCreateBoard(true)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleBoards.map((b) => (
                  <button
                    key={b._id}
                    onClick={() => navigate(`/boards/${b._id}`)}
                    className="text-left p-4 rounded-xl2 border border-slate-faint dark:border-white/10 bg-surface dark:bg-surface-dark hover:shadow-card transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                      <h3 className="font-medium truncate flex-1">{b.name}</h3>
                      {b.isFavorite && <Star size={14} className="fill-amber text-amber" />}
                    </div>
                    <p className="text-xs text-slate">{b.columns.length} columns</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "notes" && <NotesTab workspaceId={id} notes={notes} setNotes={setNotes} />}

        {tab === "members" && (
          <MembersTab workspace={workspace} setWorkspace={setWorkspace} currentUserId={user.id} />
        )}

        {tab === "settings" && (
          <div className="max-w-md">
            <div className="bg-surface dark:bg-surface-dark rounded-xl2 border border-slate-faint dark:border-white/10 p-5 mb-4">
              <h3 className="font-medium mb-3">Workspace details</h3>
              <p className="text-sm text-slate">Name: {workspace.name}</p>
              <p className="text-sm text-slate">Created: {new Date(workspace.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="border border-coral/30 bg-coral/5 rounded-xl2 p-5">
              <h3 className="font-medium text-coral mb-1">Danger zone</h3>
              <p className="text-sm text-slate mb-3">Deleting a workspace removes all its boards, tasks, and notes permanently.</p>
              <button
                onClick={handleDeleteWorkspace}
                className="text-sm bg-coral text-white px-3 py-1.5 rounded-lg hover:bg-coral/90"
              >
                Delete workspace
              </button>
            </div>
          </div>
        )}
      </div>

      {showCreateBoard && (
        <CreateBoardModal
          workspaceId={id}
          onClose={() => setShowCreateBoard(false)}
          onCreated={(board) => {
            setBoards((prev) => [board, ...prev]);
            setShowCreateBoard(false);
            navigate(`/boards/${board._id}`);
          }}
        />
      )}
    </AppShell>
  );
};

export default WorkspacePage;
