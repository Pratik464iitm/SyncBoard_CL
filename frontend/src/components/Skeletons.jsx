import React from "react";

export const SkeletonCard = () => (
  <div className="p-4 rounded-xl border border-slate-faint dark:border-white/10">
    <div className="skeleton h-4 w-2/3 mb-3" />
    <div className="skeleton h-3 w-1/2 mb-4" />
    <div className="flex gap-1">
      <div className="skeleton w-6 h-6 rounded-full" />
      <div className="skeleton w-6 h-6 rounded-full" />
    </div>
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-3 py-3">
    <div className="skeleton w-8 h-8 rounded-full" />
    <div className="flex-1">
      <div className="skeleton h-3 w-1/3 mb-2" />
      <div className="skeleton h-2.5 w-1/4" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
