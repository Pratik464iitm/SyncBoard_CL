import React, { useEffect, useState } from "react";
import { Search, LayoutGrid, FileText, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../services/resources";

const GlobalSearch = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ boards: [], notes: [], tasks: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const handle = setTimeout(() => {
      if (query.trim()) {
        globalSearch(query).then(setResults);
      } else {
        setResults({ boards: [], notes: [], tasks: [] });
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const goTo = (path) => {
    navigate(path);
    onClose();
  };

  const hasResults = results.boards.length || results.notes.length || results.tasks.length;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div
        className="bg-surface dark:bg-surface-dark w-full max-w-xl rounded-xl2 shadow-pop overflow-hidden animate-fadeUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-faint dark:border-white/10">
          <Search size={18} className="text-slate" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search boards, notes, tasks..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <kbd className="text-[10px] text-slate border border-slate-faint dark:border-white/10 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {!hasResults && query.trim() && (
            <div className="px-4 py-8 text-center text-sm text-slate">No matches for "{query}"</div>
          )}

          {results.boards.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-2 text-xs font-medium text-slate uppercase tracking-wide mb-1">Boards</p>
              {results.boards.map((b) => (
                <button
                  key={b._id}
                  onClick={() => goTo(`/boards/${b._id}`)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-paper dark:hover:bg-white/5 text-sm text-left"
                >
                  <LayoutGrid size={15} className="text-sync" /> {b.name}
                </button>
              ))}
            </div>
          )}

          {results.notes.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-2 text-xs font-medium text-slate uppercase tracking-wide mb-1">Notes</p>
              {results.notes.map((n) => (
                <button
                  key={n._id}
                  onClick={() => goTo(`/workspaces/${n.workspace}?tab=notes`)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-paper dark:hover:bg-white/5 text-sm text-left"
                >
                  <FileText size={15} className="text-signal" /> {n.title}
                </button>
              ))}
            </div>
          )}

          {results.tasks.length > 0 && (
            <div className="px-2 py-2">
              <p className="px-2 text-xs font-medium text-slate uppercase tracking-wide mb-1">Tasks</p>
              {results.tasks.map((t) => (
                <button
                  key={t._id}
                  onClick={() => goTo(`/boards/${t.board}`)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-paper dark:hover:bg-white/5 text-sm text-left"
                >
                  <CheckSquare size={15} className="text-amber" /> {t.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
