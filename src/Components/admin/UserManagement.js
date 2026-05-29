import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import {
  
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://172.16.2.246:8282";

const ROLE_CONFIG = {
  ADMIN:     { bg: "bg-indigo-100", text: "text-indigo-700",  border: "border-indigo-200"  },
  SCIENTIST: { bg: "bg-emerald-100",text: "text-emerald-700", border: "border-emerald-200" },
  VIEWER:    { bg: "bg-slate-100",  text: "text-slate-600",   border: "border-slate-200"   },
};

// ✅ Promotion path: VIEWER → SCIENTIST → ADMIN
// Demotion path:    ADMIN → SCIENTIST → VIEWER
const ROLE_ORDER = ["VIEWER", "SCIENTIST", "ADMIN"];

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.VIEWER;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5
                      text-xs font-semibold border
                      ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {role}
    </span>
  );
};

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const UserManagement = () => {
  const [users, setUsers]           = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(null);
  const [page, setPage]             = useState(1);
  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
          `${BASE}/api/auth/admin/users`,
          { headers: getHeaders() }
      );
      setUsers(res.data || []);
    } catch (e) {
      Swal.fire("Error",
          e.response?.data?.error || "Failed to load users.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    let result = [...users];
    if (roleFilter !== "ALL") {
      result = result.filter(u => u.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(u =>
        u.email?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
    setPage(1);
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const stats = {
    total:      users.length,
    admins:     users.filter(u => u.role === "ADMIN").length,
    scientists: users.filter(u => u.role === "SCIENTIST").length,
    viewers:    users.filter(u => u.role === "VIEWER").length,
  };

  // ── Promote or demote ─────────────────────────────────────────────────
  const changeRole = async (email, currentRole, direction) => {
    const currentIndex = ROLE_ORDER.indexOf(currentRole);
    const newIndex     = direction === "promote"
        ? currentIndex + 1
        : currentIndex - 1;

    if (newIndex < 0 || newIndex >= ROLE_ORDER.length) {
      Swal.fire("Info",
          direction === "promote"
              ? "This user is already at the highest role (ADMIN)."
              : "This user is already at the lowest role (VIEWER).",
          "info");
      return;
    }

    const newRole  = ROLE_ORDER[newIndex];
    const action   = direction === "promote" ? "Promote" : "Demote";
    const color    = direction === "promote" ? "#16a34a" : "#dc2626";

    const result = await Swal.fire({
      title: `${action} User?`,
      html: `
        <div style="text-align:left;font-size:14px;line-height:2">
          <p>User: <strong>${email}</strong></p>
          <p>Current role: <strong>${currentRole}</strong></p>
          <p>New role: <strong>${newRole}</strong></p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: color,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!result.isConfirmed) return;

    setActionLoading(email);
    try {
       await axios.post(
          `${BASE}/api/auth/admin/promote`,
          { email, role: newRole },
          { headers: getHeaders() }
      );
      Swal.fire(
          "Success",
          `${email} is now a ${newRole}.`,
          "success"
      );
      fetchUsers();
    } catch (e) {
      Swal.fire("Error",
          e.response?.data?.error || "Role change failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-br
                      from-slate-100 via-white to-indigo-50">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 h-64 w-64 rounded-full
                          bg-indigo-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full
                          bg-sky-200/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8">

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full
                            bg-indigo-500/10 px-3 py-1 border
                            border-indigo-400/40 text-[11px] font-medium
                            text-indigo-700 uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Admin Panel
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage user roles.{" "}
              <span className="text-indigo-600 font-medium">
                @csir.res.in
              </span>{" "}
              emails register as <strong>SCIENTIST</strong>. All others as{" "}
              <strong>VIEWER</strong>.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total",      value: stats.total,      color: "slate"   },
              { label: "Admins",     value: stats.admins,     color: "indigo"  },
              { label: "Scientists", value: stats.scientists, color: "emerald" },
              { label: "Viewers",    value: stats.viewers,    color: "sky"     },
            ].map(({ label, value, color }) => (
              <div key={label}
                   className={`rounded-2xl border p-5
                               bg-${color}-50 border-${color}-200`}>
                <p className={`text-3xl font-bold text-${color}-700`}>
                  {value}
                </p>
                <p className={`text-sm font-medium mt-1
                               text-${color}-700 opacity-75`}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="pointer-events-none absolute
                left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white
                           pl-9 pr-4 py-2 text-sm text-slate-800 shadow-sm
                           outline-none focus:border-indigo-400
                           focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "ADMIN", "SCIENTIST", "VIEWER"].map(r => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold
                              border transition-all
                              ${roleFilter === r
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                              }`}>
                  {r === "ALL" ? "All" : r}
                </button>
              ))}
            </div>

            <button onClick={fetchUsers}
              className="inline-flex items-center gap-1.5 rounded-full border
                         border-slate-200 bg-white px-4 py-1.5 text-xs
                         font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl
                          ring-1 ring-white/60 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="h-10 w-10 rounded-full border-2
                                border-indigo-200 border-t-indigo-600
                                animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-sky-50">
                    <tr>
                      {["#", "Full Name", "Email", "Role",
                        "Domain", "Status", "Actions"].map(h => (
                        <th key={h}
                            className="px-4 py-3 text-left text-[11px]
                                       font-bold uppercase tracking-wider
                                       text-slate-600">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {paginated.map((user, idx) => {
                      const roleIndex = ROLE_ORDER.indexOf(user.role);
                      const canPromote = roleIndex < ROLE_ORDER.length - 1;
                      const canDemote  = roleIndex > 0;
                      const isCsir     = user.email?.includes("@csir.res.in");

                      return (
                        <tr key={user.email}
                            className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-slate-400
                                         font-mono">
                            {(page - 1) * pageSize + idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-indigo-100
                                              flex items-center justify-center
                                              text-xs font-bold text-indigo-700
                                              shrink-0">
                                {(user.fullName || user.email || "?")[0]
                                    .toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-800
                                               truncate max-w-[140px]">
                                {user.fullName || (
                                  <span className="text-slate-400 italic">
                                    No name
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600
                                         font-mono">
                            {user.email}
                          </td>
                          <td className="px-4 py-3">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium
                              ${isCsir
                                ? "text-emerald-600"
                                : "text-slate-400"}`}>
                              {isCsir ? "CSIR" : "External"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1
                              rounded-full px-2.5 py-0.5 text-xs font-semibold
                              ${user.enabled
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full
                                ${user.enabled
                                  ? "bg-green-500"
                                  : "bg-red-500"}`} />
                              {user.enabled ? "Active" : "Disabled"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {/* Promote button */}
                              <button
                                onClick={() => changeRole(
                                    user.email, user.role, "promote")}
                                disabled={!canPromote ||
                                    actionLoading === user.email}
                                title={canPromote
                                    ? `Promote to ${ROLE_ORDER[roleIndex + 1]}`
                                    : "Already highest role"}
                                className="inline-flex items-center gap-1
                                           rounded-xl bg-emerald-100 px-2.5
                                           py-1.5 text-xs text-emerald-700
                                           hover:bg-emerald-200
                                           disabled:opacity-40
                                           disabled:cursor-not-allowed
                                           transition-colors font-semibold"
                              >
                                <ArrowUpCircleIcon className="h-3.5 w-3.5" />
                                Promote
                              </button>

                              {/* Demote button */}
                              <button
                                onClick={() => changeRole(
                                    user.email, user.role, "demote")}
                                disabled={!canDemote ||
                                    actionLoading === user.email}
                                title={canDemote
                                    ? `Demote to ${ROLE_ORDER[roleIndex - 1]}`
                                    : "Already lowest role"}
                                className="inline-flex items-center gap-1
                                           rounded-xl bg-red-100 px-2.5
                                           py-1.5 text-xs text-red-700
                                           hover:bg-red-200
                                           disabled:opacity-40
                                           disabled:cursor-not-allowed
                                           transition-colors font-semibold"
                              >
                                <ArrowDownCircleIcon className="h-3.5 w-3.5" />
                                Demote
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4
                              border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  {Math.min((page - 1) * pageSize + 1, filtered.length)}–
                  {Math.min(page * pageSize, filtered.length)}{" "}
                  of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="inline-flex items-center rounded-xl border
                               border-slate-200 px-3 py-1.5 text-xs
                               font-medium text-slate-600 hover:bg-slate-50
                               disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
                  </button>
                  <span className="rounded-xl bg-slate-50 px-3 py-1.5
                                   text-xs font-medium text-slate-700">
                    Page{" "}
                    <span className="font-bold text-indigo-600">{page}</span>
                    {" "}of{" "}
                    <span className="font-bold text-indigo-600">
                      {totalPages}
                    </span>
                  </span>
                  <button disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="inline-flex items-center rounded-xl border
                               border-slate-200 px-3 py-1.5 text-xs
                               font-medium text-slate-600 hover:bg-slate-50
                               disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default UserManagement;