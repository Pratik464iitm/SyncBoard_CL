import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/resources";
import { useAuth } from "../context/AuthContext.jsx";

const strengthLabel = (pw) => {
  if (!pw) return { label: "", pct: 0, color: "bg-slate-faint" };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: "Weak", color: "bg-coral" },
    { label: "Fair", color: "bg-amber" },
    { label: "Good", color: "bg-signal" },
    { label: "Strong", color: "bg-sync" },
  ];
  const lvl = levels[Math.min(score, levels.length - 1)];
  return { ...lvl, pct: ((score + 1) / levels.length) * 100 };
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const strength = strengthLabel(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await registerUser({ name, email, password });
      login(token, user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper dark:bg-bg-dark px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sync flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-display font-semibold text-xl">SyncBoard</span>
          </Link>
        </div>

        <div className="bg-surface dark:bg-surface-dark rounded-xl2 shadow-card p-8">
          <h1 className="font-display text-xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-slate mb-6">Start your first workspace in under a minute.</p>

          {error && <div className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aisha Khan"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
              {password && (
                <div className="mt-2">
                  <div className="h-1 bg-slate-faint dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate mt-1">{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm password</label>
              <input
                required
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-faint dark:border-white/10 bg-transparent text-sm outline-none focus:border-sync"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sync hover:bg-sync-dark disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-slate text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-sync font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
