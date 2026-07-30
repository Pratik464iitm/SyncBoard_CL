import React from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, FileText, Users, Search, Bell, Paperclip } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="bg-paper dark:bg-bg-dark min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-30 backdrop-blur bg-paper/70 dark:bg-bg-dark/70 border-b border-slate-faint dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sync flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-display font-semibold text-lg">SyncBoard</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate">
            <a href="#features" className="hover:text-ink dark:hover:text-white transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-ink dark:hover:text-white transition-colors">Use cases</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="text-sm font-medium bg-sync text-white px-4 py-2 rounded-lg hover:bg-sync-dark transition-colors">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-sync transition-colors">Log in</Link>
                <Link to="/register" className="text-sm font-medium bg-sync text-white px-4 py-2 rounded-lg hover:bg-sync-dark transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fadeUp">
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5">
            Your team's work,<br /> in sync — in real time.
          </h1>
          <p className="text-slate text-lg mb-8 max-w-md">
            Boards, notes, and tasks in one workspace that updates live for everyone — no refresh,
            no lost edits, no juggling four different tools.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="bg-sync hover:bg-sync-dark text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Get Started Free
            </Link>
            <a href="#features" className="border border-slate-faint dark:border-white/10 font-medium px-6 py-3 rounded-lg hover:bg-slate-faint dark:hover:bg-white/5 transition-colors">
              See how it works
            </a>
          </div>
        </div>

        {/* Signature element: live presence mockup */}
        <div className="relative animate-floatSlow">
          <div className="bg-surface dark:bg-surface-dark rounded-xl2 shadow-pop border border-slate-faint dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Sprint 1 — Product Team</span>
              <div className="flex -space-x-2">
                {["#4C6FFF", "#16C2A3", "#F5A623"].map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full ring-2 ring-surface dark:ring-surface-dark animate-pulseRing"
                    style={{ backgroundColor: c, animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {["To Do", "In Progress", "Done"].map((col) => (
                <div key={col} className="bg-paper dark:bg-bg-dark rounded-lg p-2">
                  <p className="font-medium text-slate mb-2">{col}</p>
                  <div className="bg-surface dark:bg-surface-dark rounded-md p-2 mb-2 shadow-card">
                    <div className="w-8 h-1 bg-coral rounded-full mb-1.5" />
                    <p className="truncate">Fix login bug</p>
                  </div>
                  {col === "In Progress" && (
                    <div className="bg-surface dark:bg-surface-dark rounded-md p-2 shadow-card">
                      <div className="w-8 h-1 bg-amber rounded-full mb-1.5" />
                      <p className="truncate">Design invite modal</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-signal font-medium mt-4">● 3 people editing right now</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-2xl font-semibold text-center mb-2">Everything your team needs, together</h2>
        <p className="text-slate text-center mb-12">Not four tools stitched together. One.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: LayoutGrid, title: "Boards", desc: "Kanban-style task boards with priorities, labels, and due dates." },
            { icon: FileText, title: "Notes", desc: "Markdown docs that edit live, with attachments built right in." },
            { icon: Users, title: "Realtime Collaboration", desc: "See who's online, who's typing, and every update as it happens." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl2 border border-slate-faint dark:border-white/10 hover:shadow-card transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-sync/10 flex items-center justify-center mb-4">
                <Icon size={20} className="text-sync" />
              </div>
              <h3 className="font-display font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-slate">{desc}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            { icon: Bell, title: "Notifications", desc: "Mentions, assignments, and invites — pushed instantly." },
            { icon: Search, title: "Search", desc: "Find any board, note, or task across your workspaces in seconds." },
            { icon: Paperclip, title: "File Uploads", desc: "Drop in images, PDFs, and docs right where the work happens." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5 rounded-xl border border-slate-faint dark:border-white/10">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={16} className="text-signal" />
                <h4 className="font-medium text-sm">{title}</h4>
              </div>
              <p className="text-xs text-slate">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="use-cases" className="bg-sync">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-white mb-3">
            Start your first workspace in under a minute
          </h2>
          <p className="text-white/80 mb-8">Built for small teams, hackathon squads, and student orgs that move fast.</p>
          <Link to="/register" className="bg-white text-sync font-medium px-6 py-3 rounded-lg hover:bg-paper transition-colors inline-block">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-faint dark:border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sync flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">S</span>
            </div>
            <span>SyncBoard — built for teams who move fast.</span>
          </div>
          <p>© {new Date().getFullYear()} SyncBoard. A student project, not affiliated with Atlassian, Notion, or Trello.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
