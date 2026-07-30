import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-bg-dark px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-sync/10 flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-sync" />
        </div>
        <h1 className="font-display text-xl font-semibold mb-2">Password reset via email isn't wired up yet</h1>
        <p className="text-sm text-slate mb-6">
          This MVP doesn't send real emails. To change your password right now, log in and use
          Settings → Password. If you're the developer, wire up an SMTP/email provider in
          <code className="mx-1 px-1.5 py-0.5 bg-slate-faint dark:bg-white/10 rounded text-xs">authController.js</code>
          to enable this flow for real.
        </p>
        <Link to="/login" className="text-sync font-medium hover:underline text-sm">
          Back to log in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
