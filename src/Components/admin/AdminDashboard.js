// import React, { useState} from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import NavBar from "Components/common/navBar";
// import FooterBar from "Components/common/footer";
// import Swal from "sweetalert2";
// import {
//   CheckCircleIcon,
//   XCircleIcon,
//   ClockIcon,
//   ChartBarIcon,
//   EyeIcon,
// } from "@heroicons/react/24/outline";

// const BASE = "http://172.16.2.246:8282";

// const STATUS_CONFIG = {
//   DRAFT:          { label: "Draft",          bg: "bg-slate-100",   text: "text-slate-600"   },
//   SECTION_TWO_PENDING:   { label: "Sec 2 Pending", bg: "bg-sky-100",    text: "text-sky-700"     },
//   SECTION_THREE_PENDING: { label: "Sec 3 Pending", bg: "bg-blue-100",   text: "text-blue-700"    },
//   SECTION_FOUR_PENDING:  { label: "Sec 4 Pending", bg: "bg-indigo-100", text: "text-indigo-700"  },
//   COMPLETE:       { label: "Complete",       bg: "bg-emerald-100", text: "text-emerald-700" },
//   PENDING_REVIEW: { label: "Pending Review", bg: "bg-amber-100",   text: "text-amber-700"   },
//   APPROVED:       { label: "Approved",       bg: "bg-green-100",   text: "text-green-700"   },
//   REJECTED:       { label: "Rejected",       bg: "bg-red-100",     text: "text-red-700"     },
// };

// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
//   return (
//     <span className={`inline-flex items-center rounded-full px-2.5 py-0.5
//                       text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
//       {cfg.label}
//     </span>
//   );
// };

// const StatCard = ({ label, value, icon, color }) => (
//   <div className={`rounded-2xl border p-5 ${color.border} ${color.bg}`}>
//     <div className="flex items-center justify-between">
//       <div>
//         <p className={`text-3xl font-bold ${color.text}`}>{value}</p>
//         <p className={`text-sm font-medium mt-1 ${color.text} opacity-75`}>
//           {label}
//         </p>
//       </div>
//       <div className={`h-12 w-12 rounded-2xl flex items-center
//                        justify-center ${color.iconBg}`}>
//         {icon}
//       </div>
//     </div>
//   </div>
// );

// const AdminDashboard = () => {
//   const navigate   = useNavigate();
//   const [stats, setStats]         = useState(null);
//   const [technologies, setTechs]  = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [statusFilter, setStatusFilter] = useState("ALL");
//   const [page, setPage]           = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
// //   const [rejectComment, setRejectComment] = useState("");
//   const [actionLoading, setActionLoading] = useState(null);

//   const getHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   });

//   // ── Fetch stats ──────────────────────────────────────────────────────────
//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${BASE}/api/admin/dashboard-stats`,
//           { headers: getHeaders() });
//       setStats(res.data);
//     } catch (e) {
//       console.error("Stats fetch failed:", e);
//     }
//   };

//   // ── Fetch technologies ────────────────────────────────────────────────────
//   const fetchTechnologies = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: page,
//         size: 15,
//         sortBy: "reviewedAt",
//         sortDir: "desc",
//       });
//       if (statusFilter !== "ALL") params.append("status", statusFilter);

//       const res = await axios.get(
//           `${BASE}/api/admin/technologies?${params}`,
//           { headers: getHeaders() }
//       );
//       setTechs(res.data.content || []);
//       setTotalPages(res.data.totalPages || 1);
//     } catch (e) {
//       console.error("Tech fetch failed:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

// //   useEffect(() => { fetchStats(); }, []);
// //   useEffect(() => { fetchTechnologies(); }, [statusFilter, page]);

//   // ── Approve ───────────────────────────────────────────────────────────────
//   const handleApprove = async (trnNo) => {
//     const result = await Swal.fire({
//       title: "Approve Technology?",
//       text: `TRN: ${trnNo}`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#16a34a",
//       confirmButtonText: "Yes, Approve",
//     });
//     if (!result.isConfirmed) return;

//     setActionLoading(trnNo);
//     try {
//       await axios.post(
//           `${BASE}/api/admin/technologies/${trnNo}/approve`,
//           {},
//           { headers: getHeaders() }
//       );
//       Swal.fire("Approved!", `TRN ${trnNo} has been approved.`, "success");
//       fetchStats();
//       fetchTechnologies();
//     } catch (e) {
//       Swal.fire("Error", e.response?.data?.error || "Approval failed.", "error");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   // ── Reject ────────────────────────────────────────────────────────────────
//   const handleReject = async (trnNo) => {
//     const { value: comment } = await Swal.fire({
//       title: "Reject Technology",
//       input: "textarea",
//       inputLabel: "Rejection reason (required)",
//       inputPlaceholder: "Please explain what needs to be corrected...",
//       inputAttributes: { rows: 4 },
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       confirmButtonText: "Reject",
//       inputValidator: (v) => {
//         if (!v || v.trim().length < 10) {
//           return "Please provide a reason (min 10 characters).";
//         }
//       },
//     });
//     if (!comment) return;

//     setActionLoading(trnNo);
//     try {
//       await axios.post(
//           `${BASE}/api/admin/technologies/${trnNo}/reject`,
//           { comment },
//           { headers: getHeaders() }
//       );
//       Swal.fire("Rejected", `TRN ${trnNo} has been rejected.`, "info");
//       fetchStats();
//       fetchTechnologies();
//     } catch (e) {
//       Swal.fire("Error", e.response?.data?.error || "Rejection failed.", "error");
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   return (
//     <>
//       <NavBar />
//       <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50">

//         <div className="pointer-events-none absolute inset-0">
//           <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
//           <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8">

//           {/* ── Header ──────────────────────────────────────────────── */}
//           <div className="mb-8">
//             <div className="inline-flex items-center gap-2 rounded-full
//                             bg-indigo-500/10 px-3 py-1 border border-indigo-400/40
//                             text-[11px] font-medium text-indigo-700 uppercase
//                             tracking-[0.2em]">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//               Admin Panel
//             </div>
//             <h1 className="mt-3 text-2xl font-bold text-slate-900">
//               Technology Dashboard
//             </h1>
//             <p className="mt-1 text-sm text-slate-600">
//               Review, approve and manage all technology submissions.
//             </p>
//           </div>

//           {/* ── Stat cards ──────────────────────────────────────────── */}
//           {stats && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
//               <StatCard label="Total"          value={stats.total}
//                 color={{ bg:"bg-slate-50", border:"border-slate-200",
//                          text:"text-slate-700", iconBg:"bg-slate-200" }}
//                 icon={<ChartBarIcon className="h-6 w-6 text-slate-600"/>} />
//               <StatCard label="Complete"       value={stats.complete}
//                 color={{ bg:"bg-emerald-50", border:"border-emerald-200",
//                          text:"text-emerald-700", iconBg:"bg-emerald-200" }}
//                 icon={<CheckCircleIcon className="h-6 w-6 text-emerald-600"/>} />
//               <StatCard label="Pending Review" value={stats.pendingReview}
//                 color={{ bg:"bg-amber-50", border:"border-amber-200",
//                          text:"text-amber-700", iconBg:"bg-amber-200" }}
//                 icon={<ClockIcon className="h-6 w-6 text-amber-600"/>} />
//               <StatCard label="Approved"       value={stats.approved}
//                 color={{ bg:"bg-green-50", border:"border-green-200",
//                          text:"text-green-700", iconBg:"bg-green-200" }}
//                 icon={<CheckCircleIcon className="h-6 w-6 text-green-600"/>} />
//               <StatCard label="Rejected"       value={stats.rejected}
//                 color={{ bg:"bg-red-50", border:"border-red-200",
//                          text:"text-red-700", iconBg:"bg-red-200" }}
//                 icon={<XCircleIcon className="h-6 w-6 text-red-600"/>} />
//               <StatCard label="Draft"          value={stats.draft}
//                 color={{ bg:"bg-slate-50", border:"border-slate-200",
//                          text:"text-slate-500", iconBg:"bg-slate-200" }}
//                 icon={<ClockIcon className="h-6 w-6 text-slate-500"/>} />
//             </div>
//           )}

//           {/* ── Filter tabs ──────────────────────────────────────────── */}
//           <div className="flex flex-wrap gap-2 mb-6">
//             {["ALL", "PENDING_REVIEW", "APPROVED", "REJECTED",
//               "COMPLETE", "DRAFT"].map((s) => (
//               <button
//                 key={s}
//                 onClick={() => { setStatusFilter(s); setPage(0); }}
//                 className={`rounded-full px-4 py-1.5 text-xs font-semibold
//                             border transition-all
//                             ${statusFilter === s
//                               ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
//                               : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
//                             }`}
//               >
//                 {s === "ALL" ? "All" : STATUS_CONFIG[s]?.label || s}
//                 {stats && s !== "ALL" && (
//                   <span className="ml-1.5 opacity-70">
//                     ({stats[s.toLowerCase().replace("_review","Review")
//                               .replace("_","")] ?? 0})
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* ── Table ────────────────────────────────────────────────── */}
//           <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl
//                           ring-1 ring-white/60 overflow-hidden">
//             {loading ? (
//               <div className="flex items-center justify-center h-48">
//                 <div className="h-10 w-10 rounded-full border-2
//                                 border-indigo-200 border-t-indigo-600
//                                 animate-spin" />
//               </div>
//             ) : technologies.length === 0 ? (
//               <div className="py-16 text-center text-slate-400 text-sm">
//                 No technologies found for this filter.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-slate-100 text-sm">
//                   <thead className="bg-gradient-to-r from-indigo-50 to-sky-50">
//                     <tr>
//                       {["TRN", "Technology Name", "Lead Lab",
//                         "Submitted By", "Status", "Review Comment",
//                         "Actions"].map((h) => (
//                         <th key={h}
//                             className="px-4 py-3 text-left text-[11px]
//                                        font-bold uppercase tracking-wider
//                                        text-slate-600">
//                           {h}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 bg-white">
//                     {technologies.map((tech) => (
//                       <tr key={tech.technologyRefNo}
//                           className="hover:bg-slate-50 transition-colors">
//                         <td className="px-4 py-3 font-mono text-xs
//                                        text-indigo-700 font-semibold whitespace-nowrap">
//                           {tech.technologyRefNo}
//                         </td>
//                         <td className="px-4 py-3 max-w-[200px]">
//                           <p className="truncate font-medium text-slate-800">
//                             {tech.nameTechnology || "—"}
//                           </p>
//                         </td>
//                         <td className="px-4 py-3 max-w-[150px]">
//                           <p className="truncate text-xs text-slate-600">
//                             {tech.leadLaboratory || "—"}
//                           </p>
//                         </td>
//                         <td className="px-4 py-3 text-xs text-slate-600">
//                           {tech.submittedBy || "—"}
//                         </td>
//                         <td className="px-4 py-3">
//                           <StatusBadge status={tech.status} />
//                         </td>
//                         <td className="px-4 py-3 max-w-[180px]">
//                           <p className="truncate text-xs text-slate-500 italic">
//                             {tech.reviewComment || "—"}
//                           </p>
//                         </td>
//                         <td className="px-4 py-3">
//                           <div className="flex items-center gap-2">
//                             {/* View */}
//                             <button
//                               onClick={() => navigate(
//                                   `/technology/${tech.technologyRefNo}`)}
//                               className="inline-flex items-center gap-1
//                                          rounded-xl bg-slate-100 px-2 py-1
//                                          text-xs text-slate-600
//                                          hover:bg-slate-200 transition-colors"
//                             >
//                               <EyeIcon className="h-3.5 w-3.5" />
//                               View
//                             </button>

//                             {/* Approve — only for PENDING_REVIEW */}
//                             {tech.status === "PENDING_REVIEW" && (
//                               <button
//                                 onClick={() =>
//                                     handleApprove(tech.technologyRefNo)}
//                                 disabled={
//                                     actionLoading === tech.technologyRefNo}
//                                 className="inline-flex items-center gap-1
//                                            rounded-xl bg-emerald-100 px-2 py-1
//                                            text-xs text-emerald-700
//                                            hover:bg-emerald-200
//                                            disabled:opacity-50
//                                            transition-colors"
//                               >
//                                 <CheckCircleIcon className="h-3.5 w-3.5" />
//                                 Approve
//                               </button>
//                             )}

//                             {/* Reject — only for PENDING_REVIEW */}
//                             {tech.status === "PENDING_REVIEW" && (
//                               <button
//                                 onClick={() =>
//                                     handleReject(tech.technologyRefNo)}
//                                 disabled={
//                                     actionLoading === tech.technologyRefNo}
//                                 className="inline-flex items-center gap-1
//                                            rounded-xl bg-red-100 px-2 py-1
//                                            text-xs text-red-700
//                                            hover:bg-red-200
//                                            disabled:opacity-50
//                                            transition-colors"
//                               >
//                                 <XCircleIcon className="h-3.5 w-3.5" />
//                                 Reject
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}

//             {/* ── Pagination ──────────────────────────────────────── */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between px-6 py-4
//                               border-t border-slate-100">
//                 <p className="text-xs text-slate-500">
//                   Page {page + 1} of {totalPages}
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     disabled={page === 0}
//                     onClick={() => setPage((p) => p - 1)}
//                     className="rounded-xl border border-slate-200 px-3 py-1.5
//                                text-xs font-medium text-slate-600
//                                hover:bg-slate-50 disabled:opacity-40
//                                disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
//                   <button
//                     disabled={page >= totalPages - 1}
//                     onClick={() => setPage((p) => p + 1)}
//                     className="rounded-xl border border-slate-200 px-3 py-1.5
//                                text-xs font-medium text-slate-600
//                                hover:bg-slate-50 disabled:opacity-40
//                                disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <FooterBar />
//     </>
//   );
// };

// export default AdminDashboard;