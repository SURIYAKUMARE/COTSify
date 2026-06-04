"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail, ArrowLeft, Plus, Trash2, Edit3, Check, X,
  Github, Linkedin, Save, UserPlus, Users,
} from "lucide-react";

const TEAM_KEY = "cotsify_team_members";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  dept: string;
  skills: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  color: string;
}

const COLORS = [
  "from-cyan-500 to-blue-600",
  "from-blue-500 to-purple-600",
  "from-purple-500 to-pink-600",
  "from-pink-500 to-rose-600",
  "from-green-500 to-teal-600",
  "from-amber-500 to-orange-600",
];

const EMPTY_MEMBER: Omit<TeamMember, "id"> = {
  name: "",
  role: "",
  dept: "AIML",
  skills: "",
  bio: "",
  email: "",
  github: "",
  linkedin: "",
  color: COLORS[0],
};

function getTeam(): TeamMember[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(TEAM_KEY) || "[]"); } catch { return []; }
}

function saveTeam(team: TeamMember[]) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(team));
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TeamMember, "id">>(EMPTY_MEMBER);

  useEffect(() => {
    setTeam(getTeam());
  }, []);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newMember: TeamMember = {
      ...form,
      id: crypto.randomUUID(),
      color: COLORS[team.length % COLORS.length],
    };
    const updated = [...team, newMember];
    saveTeam(updated);
    setTeam(updated);
    setForm(EMPTY_MEMBER);
    setAdding(false);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setForm({ ...member });
  };

  const handleUpdate = () => {
    const updated = team.map(m => m.id === editingId ? { ...form, id: editingId } : m);
    saveTeam(updated);
    setTeam(updated);
    setEditingId(null);
    setForm(EMPTY_MEMBER);
  };

  const handleDelete = (id: string) => {
    const updated = team.filter(m => m.id !== id);
    saveTeam(updated);
    setTeam(updated);
  };

  const FormFields = () => (
    <div className="grid sm:grid-cols-2 gap-3">
      {[
        { key: "name", label: "Full Name *", placeholder: "e.g. SURIYAKUMAR E" },
        { key: "role", label: "Role *", placeholder: "e.g. Full Stack Developer" },
        { key: "dept", label: "Department", placeholder: "e.g. AIML" },
        { key: "skills", label: "Skills (comma separated)", placeholder: "Next.js, Python, AI" },
        { key: "email", label: "Email", placeholder: "name@gmail.com" },
        { key: "github", label: "GitHub URL", placeholder: "https://github.com/username" },
        { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/username" },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
          <input
            value={(form as any)[f.key]}
            onChange={e => setForm(d => ({ ...d, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-600 transition-colors"
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label className="block text-xs text-gray-400 mb-1">Bio</label>
        <textarea
          value={form.bio}
          onChange={e => setForm(d => ({ ...d, bio: e.target.value }))}
          rows={3}
          placeholder="Brief description of contributions..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-600 transition-colors resize-none"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs text-gray-400 mb-2">Card Color</label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setForm(d => ({ ...d, color: c }))}
              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c} ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative px-4 pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(6,182,212,0.15),transparent)]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="inline-flex items-center gap-2 bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs px-4 py-2 rounded-full mb-6">
            <Users className="w-3.5 h-3.5" /> Meet the Team
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4">
            <span className="text-white">Built by </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">AIML Students</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            COTsify is a final year project by passionate AIML students who wanted to make electronics sourcing smarter for every maker in India.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 pb-20 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Add Member Button */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Team Members ({team.length})
            </h2>
            <button
              onClick={() => { setAdding(true); setEditingId(null); setForm(EMPTY_MEMBER); }}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" /> Add Member
            </button>
          </div>

          {/* Add Form */}
          {adding && (
            <div className="bg-gray-900/80 border border-cyan-800/50 rounded-2xl p-6 mb-8">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" /> Add New Team Member
              </h3>
              <FormFields />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleAdd}
                  disabled={!form.name.trim()}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-gray-950 font-semibold px-5 py-2 rounded-xl text-sm transition-all"
                >
                  <Save className="w-4 h-4" /> Save Member
                </button>
                <button
                  onClick={() => { setAdding(false); setForm(EMPTY_MEMBER); }}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 px-4 py-2 rounded-xl text-sm transition-all"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {team.length === 0 && !adding && (
            <div className="text-center py-20 bg-gray-900/40 border border-dashed border-gray-700 rounded-3xl">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-white font-semibold text-lg mb-2">No team members yet</p>
              <p className="text-gray-500 text-sm mb-6">Click "Add Member" to add your team</p>
              <button
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                <UserPlus className="w-4 h-4" /> Add First Member
              </button>
            </div>
          )}

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((member, idx) => (
              <div key={member.id} className="group relative bg-gray-900/60 border border-gray-800 rounded-3xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl">
                {/* Top color bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${member.color}`} />

                {/* Edit form inline */}
                {editingId === member.id ? (
                  <div className="p-6">
                    <h3 className="text-white font-semibold mb-4">Editing {member.name}</h3>
                    <FormFields />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleUpdate}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm"
                      >
                        <Check className="w-4 h-4" /> Update
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setForm(EMPTY_MEMBER); }}
                        className="flex items-center gap-2 bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2 rounded-xl text-sm"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                        {member.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg leading-tight">{member.name}</h3>
                        <p className="text-gray-400 text-sm mt-0.5">{member.role}</p>
                        {member.dept && (
                          <span className="inline-flex text-xs px-2.5 py-0.5 rounded-full border text-cyan-400 bg-cyan-950/60 border-cyan-800/50 mt-1.5">
                            {member.dept}
                          </span>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:border-cyan-700 hover:text-cyan-400 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1.5 bg-gray-800 text-gray-400 border border-gray-700 rounded-lg hover:border-red-700 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Bio */}
                    {member.bio && (
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>
                    )}

                    {/* Skills */}
                    {member.skills && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {member.skills.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                          <span key={skill} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Social links */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                      {member.github && member.github !== "#" && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-all">
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`}
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-all">
                          <Mail className="w-3.5 h-3.5" /> Email
                        </a>
                      )}
                      {member.linkedin && member.linkedin !== "#" && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-all ml-auto">
                          <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
