import React from "react";
import { MessageSquare, Paperclip } from "lucide-react";
import Avatar from "./Avatar.jsx";

const PRIORITY_COLOR = {
  Low: "bg-slate-light",
  Medium: "bg-amber",
  High: "bg-coral",
  Urgent: "bg-coral",
};

const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();

const TaskCard = ({ task, onClick, draggable, onDragStart }) => {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className="bg-surface dark:bg-surface-dark rounded-lg p-3 shadow-card border border-slate-faint dark:border-white/10 cursor-pointer hover:shadow-pop transition-shadow relative overflow-hidden"
    >
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${PRIORITY_COLOR[task.priority] || "bg-slate-light"}`} />
      <div className="pl-2">
        <p className="text-sm font-medium mb-2 leading-snug">{task.title}</p>

        {task.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((l) => (
              <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full bg-sync/10 text-sync font-medium">
                {l}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate">
            {task.comments?.length > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <MessageSquare size={12} /> {task.comments.length}
              </span>
            )}
            {task.attachments?.length > 0 && (
              <span className="flex items-center gap-0.5 text-xs">
                <Paperclip size={12} /> {task.attachments.length}
              </span>
            )}
            {task.dueDate && (
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isOverdue(task.dueDate) ? "bg-coral/10 text-coral" : "bg-slate-faint dark:bg-white/10 text-slate"}`}>
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
          <div className="flex -space-x-1.5">
            {task.assignees?.slice(0, 3).map((a) => (
              <Avatar key={a._id} name={a.name} size={20} ring />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
