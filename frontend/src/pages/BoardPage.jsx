import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft, Archive, Star } from "lucide-react";
import AppShell from "../components/AppShell.jsx";
import TaskCard from "../components/TaskCard.jsx";
import CreateTaskModal from "../components/CreateTaskModal.jsx";
import TaskDetailModal from "../components/TaskDetailModal.jsx";
import { SkeletonGrid } from "../components/Skeletons.jsx";
import useWorkspaces from "../hooks/useWorkspaces.js";
import { useSocket } from "../context/SocketContext.jsx";
import {
  getBoard,
  getTasks,
  updateTask,
  updateBoard,
  toggleArchiveBoard,
  getWorkspace,
} from "../services/resources";

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { workspaces } = useWorkspaces();
  const { socket } = useSocket();

  const [board, setBoard] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createStatus, setCreateStatus] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [dragTaskId, setDragTaskId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBoard(boardId)
      .then(async (b) => {
        setBoard(b);
        const [ws, taskList] = await Promise.all([getWorkspace(b.workspace), getTasks(boardId)]);
        setWorkspace(ws);
        setTasks(taskList);
      })
      .finally(() => setLoading(false));
  }, [boardId]);

  useEffect(() => {
    if (!socket || !board) return;
    socket.emit("board:join", board._id);

    const onCreated = (task) => setTasks((prev) => [...prev, task]);
    const onUpdated = (task) => setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    const onDeleted = ({ id }) => setTasks((prev) => prev.filter((t) => t._id !== id));

    socket.on("task:created", onCreated);
    socket.on("task:updated", onUpdated);
    socket.on("task:commented", onUpdated);
    socket.on("task:deleted", onDeleted);

    return () => {
      socket.emit("board:leave", board._id);
      socket.off("task:created", onCreated);
      socket.off("task:updated", onUpdated);
      socket.off("task:commented", onUpdated);
      socket.off("task:deleted", onDeleted);
    };
  }, [socket, board]);

  const handleDrop = async (status) => {
    if (!dragTaskId) return;
    setTasks((prev) => prev.map((t) => (t._id === dragTaskId ? { ...t, status } : t)));
    try {
      await updateTask(dragTaskId, { status });
    } finally {
      setDragTaskId(null);
    }
  };

  const handleTaskCreated = (task) => {
    setTasks((prev) => [...prev, task]);
    setCreateStatus(null);
  };

  const handleTaskUpdated = (task) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
    setActiveTask(task);
  };

  const handleTaskDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const toggleFavorite = async () => {
    const updated = await updateBoard(board._id, { isFavorite: !board.isFavorite });
    setBoard(updated);
  };

  const handleArchive = async () => {
    const updated = await toggleArchiveBoard(board._id);
    setBoard(updated);
  };

  if (loading || !board) {
    return (
      <AppShell workspaces={workspaces}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <SkeletonGrid count={4} />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell workspaces={workspaces} activeWorkspaceId={workspace?._id}>
      <div className="px-6 py-6">
        <button
          onClick={() => navigate(`/workspaces/${board.workspace}`)}
          className="flex items-center gap-1.5 text-sm text-slate hover:text-sync mb-4"
        >
          <ArrowLeft size={14} /> Back to workspace
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: board.color }} />
            <h1 className="font-display text-xl font-semibold">{board.name}</h1>
            {board.isArchived && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-faint dark:bg-white/10 text-slate">Archived</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleFavorite} className="p-2 rounded-lg hover:bg-slate-faint dark:hover:bg-white/10">
              <Star size={16} className={board.isFavorite ? "fill-amber text-amber" : "text-slate"} />
            </button>
            <button onClick={handleArchive} className="p-2 rounded-lg hover:bg-slate-faint dark:hover:bg-white/10">
              <Archive size={16} className="text-slate" />
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col);
            return (
              <div
                key={col}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col)}
                className="w-72 flex-shrink-0 bg-slate-faint/40 dark:bg-white/5 rounded-xl2 p-3"
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-semibold">{col}</h3>
                  <span className="text-xs text-slate bg-surface dark:bg-surface-dark px-1.5 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-2 min-h-[40px]">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      draggable
                      onDragStart={() => setDragTaskId(task._id)}
                      onClick={() => setActiveTask(task)}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCreateStatus(col)}
                  className="w-full flex items-center gap-1.5 text-xs text-slate hover:text-sync mt-2 px-1 py-1.5"
                >
                  <Plus size={13} /> Add task
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {createStatus && (
        <CreateTaskModal
          boardId={board._id}
          status={createStatus}
          onClose={() => setCreateStatus(null)}
          onCreated={handleTaskCreated}
        />
      )}

      {activeTask && workspace && (
        <TaskDetailModal
          task={activeTask}
          members={workspace.members}
          workspaceId={workspace._id}
          onClose={() => setActiveTask(null)}
          onUpdated={handleTaskUpdated}
          onDeleted={handleTaskDeleted}
        />
      )}
    </AppShell>
  );
};

export default BoardPage;
