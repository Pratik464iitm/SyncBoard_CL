import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-paper dark:bg-bg-dark px-4 text-center">
    <p className="font-display text-6xl font-bold text-sync mb-2">404</p>
    <h1 className="font-display text-xl font-semibold mb-2">This page doesn't exist</h1>
    <p className="text-slate text-sm mb-6">The page you're looking for may have been moved or deleted.</p>
    <Link to="/dashboard" className="bg-sync hover:bg-sync-dark text-white font-medium px-5 py-2.5 rounded-lg transition-colors">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
