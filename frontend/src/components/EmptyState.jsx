import React from "react";

const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    {Icon && (
      <div className="w-14 h-14 rounded-full bg-sync/10 flex items-center justify-center mb-4">
        <Icon size={26} className="text-sync" />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
    <p className="text-slate text-sm max-w-sm mb-5">{description}</p>
    {actionLabel && (
      <button
        onClick={onAction}
        className="bg-sync hover:bg-sync-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
