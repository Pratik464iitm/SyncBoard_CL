import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, onClose, children, wide }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className={`bg-surface dark:bg-surface-dark rounded-xl2 shadow-pop w-full ${
          wide ? "max-w-2xl" : "max-w-md"
        } max-h-[85vh] overflow-y-auto animate-fadeUp`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-faint dark:border-white/10">
          <h3 className="text-lg font-semibold font-display">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md hover:bg-slate-faint dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
