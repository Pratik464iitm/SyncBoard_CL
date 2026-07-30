import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Plus, Pin, Trash2, Paperclip } from "lucide-react";
import EmptyState from "./EmptyState.jsx";
import { createNote, updateNote, togglePinNote, deleteNote, uploadFile } from "../services/resources";
import { useSocket } from "../context/SocketContext.jsx";

const NotesTab = ({ workspaceId, notes, setNotes }) => {
  const [activeId, setActiveId] = useState(notes[0]?._id || null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { socket } = useSocket();
  const saveTimeout = useRef(null);

  const active = notes.find((n) => n._id === activeId);

  useEffect(() => {
    if (active) {
      setTitle(active.title);
      setContent(active.contentMarkdown);
    }
  }, [activeId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("workspace:join", workspaceId);

    const onEdit = ({ noteId, contentMarkdown, title: t }) => {
      setNotes((prev) => prev.map((n) => (n._id === noteId ? { ...n, contentMarkdown, title: t } : n)));
      if (noteId === activeId) {
        setContent(contentMarkdown);
        setTitle(t);
      }
    };
    socket.on("note:edit", onEdit);
    return () => socket.off("note:edit", onEdit);
  }, [socket, workspaceId, activeId]);

  const scheduleSave = (newTitle, newContent) => {
    setSaving(true);
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const updated = await updateNote(activeId, { title: newTitle, contentMarkdown: newContent });
      setNotes((prev) => prev.map((n) => (n._id === activeId ? updated : n)));
      socket?.emit("note:edit", { noteId: activeId, workspaceId, contentMarkdown: newContent, title: newTitle });
      setSaving(false);
    }, 500);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    scheduleSave(e.target.value, content);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    scheduleSave(title, e.target.value);
  };

  const handleCreate = async () => {
    const note = await createNote(workspaceId, { title: "Untitled Note", contentMarkdown: "" });
    setNotes((prev) => [note, ...prev]);
    setActiveId(note._id);
  };

  const handlePin = async (id) => {
    const updated = await togglePinNote(id);
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
    if (id === activeId) setActiveId(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !active) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerType", "note");
    formData.append("ownerId", active._id);
    formData.append("workspaceId", workspaceId);
    try {
      const fileMeta = await uploadFile(formData);
      setNotes((prev) =>
        prev.map((n) => (n._id === active._id ? { ...n, attachments: [...n.attachments, fileMeta] } : n))
      );
    } finally {
      setUploading(false);
    }
  };

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={Pin}
        title="No notes yet"
        description="Create a note to start documenting ideas, specs, or meeting notes in Markdown."
        actionLabel="Create your first note"
        onAction={handleCreate}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
      <div className="space-y-1">
        <button
          onClick={handleCreate}
          className="w-full flex items-center gap-1.5 text-sm text-sync font-medium px-2 py-2 rounded-lg hover:bg-sync/10 mb-2"
        >
          <Plus size={14} /> New note
        </button>
        {notes.map((n) => (
          <button
            key={n._id}
            onClick={() => setActiveId(n._id)}
            className={`w-full text-left px-2 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors ${
              n._id === activeId ? "bg-sync/10 text-sync font-medium" : "hover:bg-slate-faint dark:hover:bg-white/5"
            }`}
          >
            <span className="truncate flex items-center gap-1.5">
              {n.isPinned && <Pin size={11} className="flex-shrink-0" />}
              {n.title || "Untitled Note"}
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="bg-surface dark:bg-surface-dark rounded-xl2 border border-slate-faint dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-3">
            <input
              value={title}
              onChange={handleTitleChange}
              className="text-lg font-display font-semibold bg-transparent outline-none flex-1"
              placeholder="Untitled Note"
            />
            <span className="text-xs text-slate mr-3">{saving ? "Saving..." : "Saved"}</span>
            <button onClick={() => handlePin(active._id)} className="p-1.5 rounded-md hover:bg-slate-faint dark:hover:bg-white/10">
              <Pin size={15} className={active.isPinned ? "fill-sync text-sync" : "text-slate"} />
            </button>
            <button onClick={() => handleDelete(active._id)} className="p-1.5 rounded-md hover:bg-coral/10">
              <Trash2 size={15} className="text-coral" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write in Markdown... # Heading, **bold**, - list"
              rows={14}
              className="w-full px-3 py-2 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm font-mono outline-none focus:border-sync resize-none"
            />
            <div className="markdown-preview text-sm px-3 py-2 border border-slate-faint dark:border-white/10 rounded-lg overflow-y-auto">
              <ReactMarkdown>{content || "*Preview appears here...*"}</ReactMarkdown>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {active.attachments?.map((f, i) => (
                <a
                  key={i}
                  href={(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "") + f.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-lg border border-slate-faint dark:border-white/10 hover:bg-slate-faint dark:hover:bg-white/5"
                >
                  <Paperclip size={12} /> {f.filename}
                </a>
              ))}
            </div>
            <label className="text-xs text-sync cursor-pointer hover:underline">
              {uploading ? "Uploading..." : "+ Attach a file"}
              <input type="file" onChange={handleFile} className="hidden" disabled={uploading} />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center text-slate text-sm">Select a note</div>
      )}
    </div>
  );
};

export default NotesTab;
