import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import { useAuth } from "Components/auth/AuthContext";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://172.16.2.246:8282";

// ✅ No DRAFT or COMPLETE — matches the cleaned-up enum
const STATUS_CONFIG = {
  SECTION_TWO_PENDING:   { label: "Sec 2 Pending",  bg: "bg-sky-100",    text: "text-sky-700"    },
  SECTION_THREE_PENDING: { label: "Sec 3 Pending",  bg: "bg-blue-100",   text: "text-blue-700"   },
  SECTION_FOUR_PENDING:  { label: "Sec 4 Pending",  bg: "bg-indigo-100", text: "text-indigo-700" },
  PENDING_REVIEW:        { label: "Pending Review", bg: "bg-amber-100",  text: "text-amber-700"  },
  REVISION_REQUESTED:    { label: "Revision Needed",bg: "bg-orange-100", text: "text-orange-700" },
  APPROVED:              { label: "Approved",       bg: "bg-green-100",  text: "text-green-700"  },
  REJECTED:              { label: "Rejected",       bg: "bg-red-100",    text: "text-red-700"    },
};

// ✅ Fallback renders the raw status string instead of crashing on unknown values
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    label: status || "Unknown",
    bg:    "bg-slate-100",
    text:  "text-slate-500",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
};

// Shows S1 ✓  S2 ✗  S3 ✓  S4 ✗ indicators
const SectionIndicator = ({ filledSections = [] }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4].map(n => {
      const filled = filledSections.includes(n);
      return (
        <span
          key={n}
          title={`Section ${n} ${filled ? "filled" : "not filled"}`}
          className={`inline-flex items-center justify-center rounded-full w-6 h-6 text-[10px] font-bold border
            ${filled
              ? "bg-emerald-100 border-emerald-400 text-emerald-700"
              : "bg-slate-100 border-slate-300 text-slate-400"}`}
        >
          S{n}
        </span>
      );
    })}
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className={`rounded-2xl border p-5 ${color.border} ${color.bg}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-3xl font-bold ${color.text}`}>{value}</p>
        <p className={`text-sm font-medium mt-1 ${color.text} opacity-75`}>{label}</p>
      </div>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color.iconBg}`}>
        {icon}
      </div>
    </div>
  </div>
);

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const TechnologyManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [stats,         setStats]         = useState(null);
  const [technologies,  setTechs]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [statusFilter,  setStatusFilter]  = useState("ALL");
  const [search,        setSearch]        = useState("");
  const [page,          setPage]          = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [actionLoading, setActionLoading] = useState(null);

  // ── Fetch stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/api/admin/dashboard-stats`, { headers: getHeaders() });
      setStats(res.data);
    } catch (e) {
      console.error("Stats fetch failed:", e);
    }
  }, []);

  // ── Fetch technologies ────────────────────────────────────────────────────
  const fetchTechnologies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        size: 15,
        sortBy: "technologyRefNo",
        sortDir: "desc",
      });
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await axios.get(
        `${BASE}/api/admin/technologies?${params}`,
        { headers: getHeaders() }
      );
      setTechs(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalElements(res.data.totalElements || 0);
    } catch (e) {
      console.error("Tech fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchStats(); },        [fetchStats]);
  useEffect(() => { fetchTechnologies(); }, [fetchTechnologies]);

  // ── Client-side search ────────────────────────────────────────────────────
  const filtered = technologies.filter(t => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.technologyRefNo?.toLowerCase().includes(q) ||
      t.nameTechnology?.toLowerCase().includes(q)  ||
      t.leadLaboratory?.toLowerCase().includes(q)  ||
      t.submittedBy?.toLowerCase().includes(q)
    );
  });

  // ── Approve (ADMIN only) ──────────────────────────────────────────────────
  const handleApprove = async (trnNo) => {
    const result = await Swal.fire({
      title: "Approve Technology?",
      text: `TRN: ${trnNo}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, Approve",
    });
    if (!result.isConfirmed) return;

    setActionLoading(trnNo);
    try {
      await axios.post(
        `${BASE}/api/admin/technologies/${trnNo}/approve`,
        {},
        { headers: getHeaders() }
      );
      Swal.fire("Approved!", `TRN ${trnNo} has been approved.`, "success");
      fetchStats();
      fetchTechnologies();
    } catch (e) {
      Swal.fire("Error", e.response?.data?.error || "Approval failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Reject — terminal (ADMIN only) ───────────────────────────────────────
  const handleReject = async (trnNo) => {
    const { value: comment } = await Swal.fire({
      title: "Reject Technology",
      html: `<p class="text-sm text-red-600 mb-2">⚠️ This is a <strong>terminal rejection</strong>. The scientist cannot resubmit.</p>`,
      input: "textarea",
      inputLabel: "Rejection reason (required)",
      inputPlaceholder: "Explain why this technology is fundamentally rejected…",
      inputAttributes: { rows: 4 },
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Reject Permanently",
      inputValidator: v => {
        if (!v || v.trim().length < 10)
          return "Please provide a reason (min 10 characters).";
      },
    });
    if (!comment) return;

    setActionLoading(trnNo);
    try {
      await axios.post(
        `${BASE}/api/admin/technologies/${trnNo}/reject`,
        { comment },
        { headers: getHeaders() }
      );
      Swal.fire("Rejected", `TRN ${trnNo} has been permanently rejected.`, "info");
      fetchStats();
      fetchTechnologies();
    } catch (e) {
      Swal.fire("Error", e.response?.data?.error || "Rejection failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Request revision — scientist can fix and resubmit (ADMIN only) ────────
  const handleRequestRevision = async (trnNo) => {
    const { value: comment } = await Swal.fire({
      title: "Request Revision",
      html: `<p class="text-sm text-amber-600 mb-2">The scientist will be asked to fix and resubmit.</p>`,
      input: "textarea",
      inputLabel: "What needs to be corrected? (required)",
      inputPlaceholder: "e.g. Section 3 IP details are incomplete…",
      inputAttributes: { rows: 4 },
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      confirmButtonText: "Request Revision",
      inputValidator: v => {
        if (!v || v.trim().length < 10)
          return "Please provide details (min 10 characters).";
      },
    });
    if (!comment) return;

    setActionLoading(trnNo);
    try {
      await axios.post(
        `${BASE}/api/admin/technologies/${trnNo}/request-revision`,
        { comment },
        { headers: getHeaders() }
      );
      Swal.fire("Revision Requested", `TRN ${trnNo} sent back for revision.`, "warning");
      fetchStats();
      fetchTechnologies();
    } catch (e) {
      Swal.fire("Error", e.response?.data?.error || "Request failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Submit for review — SCIENTIST + ADMIN ────────────────────────────────
  const handleSubmitForReview = async (trnNo, filledSections = []) => {
    const missingSections = [1, 2, 3, 4].filter(n => !filledSections.includes(n));
    const warningHtml = missingSections.length > 0
      ? `<p class="text-sm text-amber-600 mt-2">⚠️ Sections <strong>${missingSections.map(n => `S${n}`).join(", ")}</strong> are not yet filled. You can still submit.</p>`
      : `<p class="text-sm text-emerald-600 mt-2">✓ All sections are filled.</p>`;

    const result = await Swal.fire({
      title: "Submit for Review?",
      html: `<p class="text-sm text-slate-600">TRN: <strong>${trnNo}</strong></p>${warningHtml}`,
      icon: missingSections.length > 0 ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Submit for Review",
    });
    if (!result.isConfirmed) return;

    setActionLoading(trnNo);
    try {
      await axios.post(
        `${BASE}/api/admin/technologies/${trnNo}/submit-for-review`,
        {},
        { headers: getHeaders() }
      );
      Swal.fire("Submitted!", `TRN ${trnNo} is now pending admin review.`, "success");
      fetchStats();
      fetchTechnologies();
    } catch (e) {
      Swal.fire("Error", e.response?.data?.error || "Submission failed.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Filter tabs — no DRAFT ────────────────────────────────────────────────
  const filterTabs = [
    "ALL",
    "PENDING_REVIEW",
    "REVISION_REQUESTED",
    "APPROVED",
    "REJECTED",
  ];

  // ── Stat key map — no DRAFT ───────────────────────────────────────────────
  const statCountKey = (s) => ({
    PENDING_REVIEW:     "pendingReview",
    REVISION_REQUESTED: "revisionRequested",
    APPROVED:           "approved",
    REJECTED:           "rejected",
  })[s] ?? null;

  // ✅ canSubmit — DRAFT removed, only valid enum values
  const canSubmit = (tech) => [
    "SECTION_TWO_PENDING",
    "SECTION_THREE_PENDING",
    "SECTION_FOUR_PENDING",
    "REVISION_REQUESTED",
  ].includes(tech.status);

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50">

        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {isAdmin ? "Admin Panel" : "Scientist Panel"}
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Technology Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {isAdmin
                ? "Review, approve and manage all technology submissions."
                : "View and submit your technologies for admin review."
              }{" "}
              Total: <strong>{totalElements}</strong>
            </p>
          </div>

          {/* ── Stat cards ─────────────────────────────────────────────────── */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <StatCard
                label="Total"
                value={stats.total ?? 0}
                color={{ bg:"bg-slate-50", border:"border-slate-200", text:"text-slate-700", iconBg:"bg-slate-200" }}
                icon={<ChartBarIcon className="h-6 w-6 text-slate-600"/>}
              />
              <StatCard
                label="Pending Review"
                value={stats.pendingReview ?? 0}
                color={{ bg:"bg-amber-50", border:"border-amber-200", text:"text-amber-700", iconBg:"bg-amber-200" }}
                icon={<ClockIcon className="h-6 w-6 text-amber-600"/>}
              />
              <StatCard
                label="Needs Revision"
                value={stats.revisionRequested ?? 0}
                color={{ bg:"bg-orange-50", border:"border-orange-200", text:"text-orange-700", iconBg:"bg-orange-200" }}
                icon={<ExclamationTriangleIcon className="h-6 w-6 text-orange-600"/>}
              />
              <StatCard
                label="Approved"
                value={stats.approved ?? 0}
                color={{ bg:"bg-green-50", border:"border-green-200", text:"text-green-700", iconBg:"bg-green-200" }}
                icon={<CheckCircleIcon className="h-6 w-6 text-green-600"/>}
              />
              <StatCard
                label="Rejected"
                value={stats.rejected ?? 0}
                color={{ bg:"bg-red-50", border:"border-red-200", text:"text-red-700", iconBg:"bg-red-200" }}
                icon={<XCircleIcon className="h-6 w-6 text-red-600"/>}
              />
            </div>
          )}

          {/* ── Filter + Search ─────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search TRN, name, lab, submitted by…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2">
              {filterTabs.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(0); }}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                    statusFilter === s
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label || s}
                  {stats && s !== "ALL" && statCountKey(s) && (
                    <span className="ml-1.5 opacity-70">
                      ({stats[statCountKey(s)] ?? 0})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={() => { fetchStats(); fetchTechnologies(); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
            >
              <ArrowPathIcon className="h-4 w-4" /> Refresh
            </button>
          </div>

          {/* ── Table ──────────────────────────────────────────────────────── */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-white/60 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                No technologies found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-sky-50">
                    <tr>
                      {[
                        "TRN",
                        "Technology Name",
                        "Lead Lab",
                        "Submitted By",
                        "Sections",
                        "Status",
                        "Review Comment",
                        "Actions",
                      ].map(h => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filtered.map(tech => (
                      <tr
                        key={tech.technologyRefNo}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* TRN */}
                        <td className="px-4 py-3 font-mono text-xs text-indigo-700 font-semibold whitespace-nowrap">
                          {tech.technologyRefNo}
                        </td>

                        {/* Technology Name */}
                        <td className="px-4 py-3 max-w-[180px]">
                          <p className="truncate font-medium text-slate-800">
                            {tech.nameTechnology || "—"}
                          </p>
                        </td>

                        {/* Lead Lab */}
                        <td className="px-4 py-3 max-w-[130px]">
                          <p className="truncate text-xs text-slate-600">
                            {tech.leadLaboratory || "—"}
                          </p>
                        </td>

                        {/* Submitted By */}
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {tech.submittedBy || "—"}
                        </td>

                        {/* Section indicators */}
                        <td className="px-4 py-3">
                          <SectionIndicator filledSections={tech.filledSections || []} />
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={tech.status} />
                        </td>

                        {/* Review Comment */}
                        <td className="px-4 py-3 max-w-[160px]">
                          <p className="truncate text-xs text-slate-500 italic">
                            {tech.reviewComment || "—"}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">

                            {/* View — always visible */}
                            <button
                              onClick={() => navigate(`/technology/${tech.technologyRefNo}`)}
                              className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                              <EyeIcon className="h-3.5 w-3.5" /> View
                            </button>

                            {/* ✅ Submit — section-pending + revision statuses only */}
                            {canSubmit(tech) && (
                              <button
                                onClick={() =>
                                  handleSubmitForReview(
                                    tech.technologyRefNo,
                                    tech.filledSections || []
                                  )
                                }
                                title={
                                  !(tech.filledSections || []).includes(1)
                                    ? "Fill Section 1 first"
                                    : "Submit for admin review"
                                }
                                disabled={
                                  actionLoading === tech.technologyRefNo ||
                                  !(tech.filledSections || []).includes(1)
                                }
                                className={`inline-flex items-center gap-1 rounded-xl px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
                                  !(tech.filledSections || []).includes(1)
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                }`}
                              >
                                <PaperAirplaneIcon className="h-3.5 w-3.5" />
                                {tech.status === "REVISION_REQUESTED"
                                  ? "Resubmit"
                                  : "Submit"}
                              </button>
                            )}

                            {/* ✅ Admin-only — Approve / Revise / Reject for PENDING_REVIEW */}
                            {isAdmin && tech.status === "PENDING_REVIEW" && (
                              <>
                                <button
                                  onClick={() => handleApprove(tech.technologyRefNo)}
                                  disabled={actionLoading === tech.technologyRefNo}
                                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-100 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-200 disabled:opacity-50 transition-colors"
                                >
                                  <CheckCircleIcon className="h-3.5 w-3.5" /> Approve
                                </button>

                                <button
                                  onClick={() => handleRequestRevision(tech.technologyRefNo)}
                                  disabled={actionLoading === tech.technologyRefNo}
                                  className="inline-flex items-center gap-1 rounded-xl bg-amber-100 px-2 py-1 text-xs text-amber-700 hover:bg-amber-200 disabled:opacity-50 transition-colors"
                                >
                                  <ExclamationTriangleIcon className="h-3.5 w-3.5" /> Revise
                                </button>

                                <button
                                  onClick={() => handleReject(tech.technologyRefNo)}
                                  disabled={actionLoading === tech.technologyRefNo}
                                  className="inline-flex items-center gap-1 rounded-xl bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                                >
                                  <XCircleIcon className="h-3.5 w-3.5" /> Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination ─────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
                  </button>
                  <span className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700">
                    <span className="font-bold text-indigo-600">{page + 1}</span>
                    {" / "}
                    <span className="font-bold text-indigo-600">{totalPages}</span>
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(p => p + 1)}
                    className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
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

export default TechnologyManagement;