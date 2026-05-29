import React, { useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

// ── Action config ─────────────────────────────────────────────────────────────
const ACTION_CONFIG = {
  CREATE: {
    label: "Create",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-300",
    dot: "bg-emerald-500",
  },
  UPDATE: {
    label: "Update",
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
    dot: "bg-blue-500",
  },
  SKIP: {
    label: "Skip",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-300",
    dot: "bg-slate-400",
  },
  WARN: {
    label: "Warning",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  ERROR: {
    label: "Error",
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
    dot: "bg-red-500",
  },
};

// ── Result config (after confirm) ─────────────────────────────────────────────
const RESULT_CONFIG = {
  CREATED: { label: "Created", bg: "bg-emerald-100", text: "text-emerald-800" },
  UPDATED: { label: "Updated", bg: "bg-blue-100",    text: "text-blue-800"    },
  SKIPPED: { label: "Skipped", bg: "bg-slate-100",   text: "text-slate-600"   },
  FAILED:  { label: "Failed",  bg: "bg-red-100",     text: "text-red-800"     },
};

// ── Badge components ──────────────────────────────────────────────────────────
const ActionBadge = ({ action }) => {
  const cfg = ACTION_CONFIG[action] || ACTION_CONFIG.SKIP;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
                  text-xs font-semibold border
                  ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const ResultBadge = ({ action }) => {
  const cfg = RESULT_CONFIG[action] || RESULT_CONFIG.SKIPPED;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5
                  text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

// ── Summary card ──────────────────────────────────────────────────────────────
const SummaryCard = ({ label, count, color }) => (
  <div
    className={`rounded-2xl border ${color.border} ${color.bg}
                px-4 py-3 text-center`}
  >
    <p className={`text-2xl font-bold ${color.text}`}>{count}</p>
    <p className={`text-xs font-medium ${color.text} opacity-80`}>{label}</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ExcelUpload = () => {
  // ── Stage ────────────────────────────────────────────────────────────────
  const [stage, setStage]               = useState("idle");
  const [uploading, setUploading]       = useState(false);
  const [confirming, setConfirming]     = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // ── Preview data ─────────────────────────────────────────────────────────
  const [summary, setSummary]   = useState(null);
  const [rows, setRows]         = useState([]);

  // ── User decisions: rowNumber → action ───────────────────────────────────
  const [decisions, setDecisions] = useState({});

  // ── Final results ─────────────────────────────────────────────────────────
  const [finalRows, setFinalRows] = useState([]);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [expandedRow, setExpandedRow] = useState(null);
  const [filter, setFilter]           = useState("ALL");

  const fileInputRef = useRef();

  // ── Auth header helper ────────────────────────────────────────────────────
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // =========================================================================
  // DOWNLOAD TEMPLATE
  // =========================================================================
  const handleDownloadTemplate = async () => {
    try {
      const res = await axios.get(
        "http://172.16.2.246:8282/api/excel/template",
        {
          headers: getAuthHeaders(),
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(res.data);
      const a   = document.createElement("a");
      a.href     = url;
      a.download = "section_one_template.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      Swal.fire("Error", "Could not download template.", "error");
    }
  };

  // =========================================================================
  // FILE SELECT
  // =========================================================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".xlsx")) {
      Swal.fire("Invalid File", "Please upload an .xlsx Excel file.", "error");
      e.target.value = null;
      return;
    }

    // Validate size — max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire("Too Large", "File must be under 10 MB.", "error");
      e.target.value = null;
      return;
    }

    setSelectedFile(file);
    // Reset previous results
    setStage("idle");
    setSummary(null);
    setRows([]);
    setDecisions({});
    setFinalRows([]);
    setExpandedRow(null);
    setFilter("ALL");
  };

  // =========================================================================
  // UPLOAD + PREVIEW
  // =========================================================================
  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire("No File", "Please select an Excel file first.", "warning");
      return;
    }

    setUploading(true);

    // ✅ FIXED: formData declared here — top of function, not inside a block
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "http://172.16.2.246:8282/api/excel/upload",
        formData,
        {
          // ✅ Do NOT set Content-Type manually for multipart
          // axios sets it automatically with the correct boundary
          headers: getAuthHeaders(),
        }
      );

      const data = res.data;
      setSummary(data);
      setRows(data.rows || []);

      // Default decisions from backend suggestion
      const defaultDecisions = {};
      (data.rows || []).forEach((row) => {
        defaultDecisions[row.rowNumber] = row.action;
      });
      setDecisions(defaultDecisions);
      setStage("preview");

    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Could not parse the file. Please check the format.";
      Swal.fire("Upload Failed", msg, "error");
    } finally {
      setUploading(false);
    }
  };

  // =========================================================================
  // OVERRIDE DECISION FOR ONE ROW
  // =========================================================================
  const handleDecisionChange = (rowNumber, newAction) => {
    setDecisions((prev) => ({ ...prev, [rowNumber]: newAction }));
  };

  // =========================================================================
  // CONFIRM + SAVE
  // =========================================================================
  const handleConfirm = async () => {
    const createCount = Object.values(decisions).filter(
      (d) => d === "CREATE"
    ).length;
    const updateCount = Object.values(decisions).filter(
      (d) => d === "UPDATE"
    ).length;
    const skipCount   = Object.values(decisions).filter(
      (d) => d === "SKIP" || d === "WARN"
    ).length;

    const confirmed = await Swal.fire({
      title: "Confirm Bulk Upload?",
      html: `
        <div style="text-align:left; font-size:14px; line-height:2">
          🟢 <strong>${createCount}</strong> new records will be created<br/>
          🔵 <strong>${updateCount}</strong> records will be updated<br/>
          ⚪ <strong>${skipCount}</strong> records will be skipped<br/>
          <br/>
          <small style="color:#64748b">
            Created records cannot be undone automatically.
          </small>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Save All",
      cancelButtonText: "Review Again",
    });

    if (!confirmed.isConfirmed) return;

    setConfirming(true);

    try {
      const res = await axios.post(
        "http://172.16.2.246:8282/api/excel/confirm",
        { rows, decisions },
        { headers: getAuthHeaders() }
      );

      setFinalRows(res.data.rows || []);
      setSummary(res.data);
      setStage("done");

      Swal.fire({
        title: "Upload Complete!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

    } catch (err) {
      const msg =
        err.response?.data?.error || "Could not save records.";
      Swal.fire("Save Failed", msg, "error");
    } finally {
      setConfirming(false);
    }
  };

  // =========================================================================
  // RESET
  // =========================================================================
  const handleReset = () => {
    setStage("idle");
    setSelectedFile(null);
    setSummary(null);
    setRows([]);
    setDecisions({});
    setFinalRows([]);
    setExpandedRow(null);
    setFilter("ALL");
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // =========================================================================
  // FILTERED ROWS
  // =========================================================================
  const displayRows = stage === "done" ? finalRows : rows;
  const filteredRows = displayRows.filter((row) => {
    if (filter === "ALL") return true;
    const d = stage === "done"
      ? row.finalAction
      : (decisions[row.rowNumber] || row.action);
    return d === filter;
  });

  // ── Filter counts ─────────────────────────────────────────────────────────
  const getFilterCount = (f) => {
    if (f === "ALL") return displayRows.length;
    return displayRows.filter((r) => {
      const d = stage === "done"
        ? r.finalAction
        : (decisions[r.rowNumber] || r.action);
      return d === f;
    }).length;
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <>
      <NavBar />

      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-indigo-100">

        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:px-8">

          {/* ── Page header ───────────────────────────────────────────── */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Bulk Upload
            </div>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">
              Excel Bulk Data Entry
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Download the template, fill it in, upload — duplicates are
              detected automatically before saving.
            </p>
          </div>

          {/* ── Step indicator ────────────────────────────────────────── */}
          <div className="mb-8 flex items-center gap-2 text-sm">
            {["Download Template", "Upload & Preview", "Confirm & Save"].map(
              (step, i) => {
                const isActive =
                  (i === 0 && stage === "idle") ||
                  (i === 1 && stage === "preview") ||
                  (i === 2 && stage === "done");
                const isDone =
                  (i === 0 && stage !== "idle") ||
                  (i === 1 && stage === "done");
                return (
                  <React.Fragment key={step}>
                    <div
                      className={`flex items-center gap-2 rounded-full
                                  px-4 py-1.5 font-medium transition-all
                                  ${isActive
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : isDone
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-white/60 text-slate-400"}`}
                    >
                      <span
                        className={`h-5 w-5 rounded-full flex items-center
                                    justify-center text-xs font-bold
                                    ${isActive
                                      ? "bg-white/30"
                                      : isDone
                                      ? "bg-emerald-500 text-white"
                                      : "bg-slate-200"}`}
                      >
                        {isDone ? "✓" : i + 1}
                      </span>
                      <span className="hidden sm:inline">{step}</span>
                    </div>
                    {i < 2 && <div className="flex-1 h-px bg-slate-200" />}
                  </React.Fragment>
                );
              }
            )}
          </div>

          {/* ── Main card ─────────────────────────────────────────────── */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl ring-1 ring-white/60 p-6 md:p-8 space-y-6">

            {/* ── Upload area (idle + preview stages) ─────────────────── */}
            {stage !== "done" && (
              <div className="flex flex-col sm:flex-row gap-4 items-start">

                {/* Download template */}
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-2 rounded-2xl
                             border-2 border-dashed border-indigo-300
                             bg-indigo-50 px-5 py-3 text-sm font-semibold
                             text-indigo-700 hover:bg-indigo-100
                             transition-colors flex-shrink-0"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  Download Template
                </button>

                {/* File picker + upload trigger */}
                <div className="flex-1 space-y-3 w-full">
                  <div
                    className="flex items-center gap-3 rounded-2xl border-2
                               border-dashed border-slate-300 bg-slate-50
                               px-4 py-3 cursor-pointer
                               hover:border-indigo-400 hover:bg-indigo-50/50
                               transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ArrowUpTrayIcon className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      {selectedFile ? (
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {selectedFile.name}
                          <span className="ml-2 text-xs text-slate-400">
                            ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </p>
                      ) : (
                        <p className="text-sm text-slate-500">
                          Click to select .xlsx file (max 10 MB)
                        </p>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="inline-flex items-center gap-2 rounded-2xl
                                 bg-indigo-600 px-5 py-2.5 text-sm font-semibold
                                 text-white shadow-md hover:bg-indigo-700
                                 disabled:bg-indigo-300 disabled:cursor-not-allowed
                                 transition-colors"
                    >
                      {uploading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Parsing...
                        </>
                      ) : (
                        <>
                          <ArrowUpTrayIcon className="h-4 w-4" />
                          Upload &amp; Preview
                        </>
                      )}
                    </button>

                    {(stage === "preview" || selectedFile) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-2xl border border-slate-300
                                   px-4 py-2 text-sm text-slate-600
                                   hover:bg-slate-50 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Summary cards ────────────────────────────────────────── */}
            {(stage === "preview" || stage === "done") && summary && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <SummaryCard
                  label="Total Rows"
                  count={summary.totalRows}
                  color={{ bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" }}
                />
                <SummaryCard
                  label="Create"
                  count={summary.createCount}
                  color={{ bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" }}
                />
                <SummaryCard
                  label="Update"
                  count={summary.updateCount}
                  color={{ bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" }}
                />
                <SummaryCard
                  label="Skip"
                  count={summary.skipCount}
                  color={{ bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-500" }}
                />
                <SummaryCard
                  label="Errors"
                  count={summary.errorCount}
                  color={{ bg: "bg-red-50", border: "border-red-200", text: "text-red-700" }}
                />
              </div>
            )}

            {/* ── Filter tabs ───────────────────────────────────────────── */}
            {(stage === "preview" || stage === "done") &&
              displayRows.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(stage === "preview"
                  ? ["ALL", "CREATE", "UPDATE", "SKIP", "WARN", "ERROR"]
                  : ["ALL", "CREATED", "UPDATED", "SKIPPED", "FAILED"]
                ).map((f) => {
                  const count = getFilterCount(f);
                  const cfg = ACTION_CONFIG[f] ||
                    RESULT_CONFIG[f] || {
                      bg: "bg-slate-100",
                      text: "text-slate-700",
                      border: "border-slate-200",
                    };
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold
                                  border transition-all
                                  ${filter === f
                                    ? `ring-2 ring-offset-1 ring-indigo-400
                                       ${cfg.bg} ${cfg.text} ${cfg.border}`
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                  }`}
                    >
                      {f === "ALL" ? "All" : (cfg.label || f)} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Preview / Result table ────────────────────────────────── */}
            {(stage === "preview" || stage === "done") &&
              filteredRows.length > 0 && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-sky-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Row
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Technology Name
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Lead Lab
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Year
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Reason / Result
                      </th>
                      {stage === "preview" && (
                        <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          Decision
                        </th>
                      )}
                      {stage === "done" && (
                        <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-600">
                          TRN
                        </th>
                      )}
                      <th className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        Detail
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredRows.map((row) => {
                      const currentDecision =
                        stage === "done"
                          ? row.finalAction
                          : (decisions[row.rowNumber] || row.action);
                      const isExpanded = expandedRow === row.rowNumber;

                      return (
                        <React.Fragment key={row.rowNumber}>
                          {/* ── Main row ──────────────────────────────── */}
                          <tr
                            className={`transition-colors hover:bg-slate-50
                              ${currentDecision === "ERROR" || currentDecision === "FAILED"
                                ? "bg-red-50/40"
                                : currentDecision === "WARN"
                                ? "bg-amber-50/40"
                                : ""}`}
                          >
                            {/* Row number */}
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">
                              #{row.rowNumber}
                            </td>

                            {/* Tech name */}
                            <td className="px-4 py-3 max-w-[200px]">
                              <p className="truncate font-medium text-slate-800">
                                {row.dto?.nameTechnology || (
                                  <span className="italic text-red-400">
                                    Missing
                                  </span>
                                )}
                              </p>
                            </td>

                            {/* Lead lab */}
                            <td className="px-4 py-3 max-w-[160px]">
                              <p className="truncate text-xs text-slate-600">
                                {row.dto?.leadLaboratory || "—"}
                              </p>
                            </td>

                            {/* Year */}
                            <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                              {row.dto?.yearDevelopment || "—"}
                            </td>

                            {/* Status badge */}
                            <td className="px-4 py-3">
                              {stage === "done"
                                ? <ResultBadge action={row.finalAction} />
                                : <ActionBadge action={currentDecision} />
                              }
                            </td>

                            {/* Reason / error */}
                            <td className="px-4 py-3 max-w-[200px]">
                              {row.errorMessage ? (
                                <p className="text-xs text-red-600 truncate">
                                  {row.errorMessage}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-500 truncate">
                                  {row.duplicateReason || "—"}
                                  {row.similarityScore > 0 &&
                                    row.similarityScore < 100 && (
                                      <span className="ml-1 font-semibold text-amber-600">
                                        ({row.similarityScore}%)
                                      </span>
                                    )}
                                </p>
                              )}
                            </td>

                            {/* Decision override — preview only */}
                            {stage === "preview" && (
                              <td className="px-4 py-3 text-center">
                                <select
                                  value={decisions[row.rowNumber] || row.action}
                                  onChange={(e) =>
                                    handleDecisionChange(
                                      row.rowNumber,
                                      e.target.value
                                    )
                                  }
                                  disabled={row.action === "ERROR"}
                                  className="rounded-xl border border-slate-200
                                             bg-white px-2 py-1 text-xs font-medium
                                             text-slate-700 shadow-sm outline-none
                                             focus:border-indigo-400
                                             disabled:opacity-40
                                             disabled:cursor-not-allowed"
                                >
                                  <option value="CREATE">Create</option>
                                  <option
                                    value="UPDATE"
                                    disabled={!row.existingTrn}
                                  >
                                    Update
                                  </option>
                                  <option value="SKIP">Skip</option>
                                </select>
                              </td>
                            )}

                            {/* Generated TRN — done only */}
                            {stage === "done" && (
                              <td className="px-4 py-3 text-center">
                                {row.generatedTrn ? (
                                  <p className="text-[10px] font-mono
                                                text-emerald-700 font-semibold">
                                    {row.generatedTrn}
                                  </p>
                                ) : (
                                  <span className="text-xs text-slate-400">—</span>
                                )}
                              </td>
                            )}

                            {/* Expand detail */}
                            <td className="px-4 py-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedRow(
                                    isExpanded ? null : row.rowNumber
                                  )
                                }
                                className="inline-flex items-center gap-1
                                           rounded-xl bg-slate-100 px-2 py-1
                                           text-xs text-slate-600
                                           hover:bg-slate-200 transition-colors"
                              >
                                <PencilSquareIcon className="h-3.5 w-3.5" />
                                {isExpanded ? "Hide" : "View"}
                              </button>
                            </td>
                          </tr>

                          {/* ── Expanded detail row ───────────────────── */}
                          {isExpanded && row.dto && (
                            <tr>
                              <td
                                colSpan={8}
                                className="bg-slate-50/80 px-6 py-4
                                           border-b border-slate-100"
                              >
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                                  {[
                                    ["TRN", row.dto.technologyRefNo],
                                    ["Name", row.dto.nameTechnology],
                                    ["Lead Lab", row.dto.leadLaboratory],
                                    ["Theme", row.dto.theme],
                                    ["Sector", row.dto.industrialSector],
                                    ["TRL", row.dto.technologyLevel],
                                    ["Year", row.dto.yearDevelopment],
                                    ["Scale", row.dto.scaleDevelopment],
                                    ["Scale Stage", row.dto.scaleStage],
                                    ["Lab Scale Date", row.dto.labScaleDate],
                                    ["Bench Scale Date", row.dto.benchScaleDate],
                                    ["Pilot Scale Date", row.dto.pilotScaleDate],
                                    ["Industrial Scale Date", row.dto.industrialScaleDate],
                                    ["Keywords", row.dto.keywordTechnology],
                                    ["Multi-Lab", row.dto.multiLabInstitute],
                                    ["Existing TRN", row.existingTrn],
                                    ["Similarity",
                                      row.similarityScore > 0
                                        ? `${row.similarityScore}%`
                                        : null],
                                  ]
                                    .filter(([, v]) => v)
                                    .map(([label, value]) => (
                                      <div
                                        key={label}
                                        className="rounded-lg bg-white border
                                                   border-slate-200 px-3 py-2"
                                      >
                                        <p className="text-[10px] font-semibold
                                                      uppercase text-slate-400">
                                          {label}
                                        </p>
                                        <p className="mt-0.5 text-slate-700 break-words">
                                          {value}
                                        </p>
                                      </div>
                                    ))}

                                  {/* Brief tech — full width */}
                                  {row.dto.briefTech && (
                                    <div className="col-span-2 sm:col-span-3 md:col-span-4
                                                    rounded-lg bg-white border border-slate-200
                                                    px-3 py-2">
                                      <p className="text-[10px] font-semibold
                                                    uppercase text-slate-400">
                                        Brief Tech
                                      </p>
                                      <p className="mt-0.5 text-slate-700 line-clamp-3">
                                        {row.dto.briefTech}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Empty state ───────────────────────────────────────────── */}
            {(stage === "preview" || stage === "done") &&
              filteredRows.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-sm">
                No rows match the selected filter.
              </div>
            )}

            {/* ── Warning callout ───────────────────────────────────────── */}
            {stage === "preview" &&
              rows.some(
                (r) => (decisions[r.rowNumber] || r.action) === "WARN"
              ) && (
              <div className="flex items-start gap-3 rounded-2xl border
                              border-amber-200 bg-amber-50 px-4 py-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Similar names detected</p>
                  <p className="text-xs mt-0.5">
                    Some rows closely match existing records. Choose{" "}
                    <strong>Skip</strong> for duplicates or{" "}
                    <strong>Create</strong> for genuinely new entries.
                  </p>
                </div>
              </div>
            )}

            {/* ── Error callout ─────────────────────────────────────────── */}
            {stage === "preview" &&
              rows.some(
                (r) => (decisions[r.rowNumber] || r.action) === "ERROR"
              ) && (
              <div className="flex items-start gap-3 rounded-2xl border
                              border-red-200 bg-red-50 px-4 py-3">
                <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Some rows have errors</p>
                  <p className="text-xs mt-0.5">
                    Rows marked <strong>Error</strong> will be skipped.
                    Fix them in your Excel file and re-upload.
                  </p>
                </div>
              </div>
            )}

            {/* ── Confirm button ────────────────────────────────────────── */}
            {stage === "preview" && rows.length > 0 && (
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-2xl border border-slate-300 px-5 py-2.5
                             text-sm font-semibold text-slate-600
                             hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={confirming}
                  className="inline-flex items-center gap-2 rounded-2xl
                             bg-emerald-600 px-6 py-2.5 text-sm font-semibold
                             text-white shadow-md hover:bg-emerald-700
                             disabled:bg-emerald-300 disabled:cursor-not-allowed
                             transition-colors"
                >
                  {confirming ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/40
                                       border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="h-4 w-4" />
                      Confirm &amp; Save
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── Done state ────────────────────────────────────────────── */}
            {stage === "done" && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border
                                border-emerald-200 bg-emerald-50 px-5 py-4">
                  <CheckCircleIcon className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-800">
                      Bulk upload complete!
                    </p>
                    <p className="text-xs text-emerald-700 mt-1 space-x-3">
                      <span>
                        ✅{" "}
                        {finalRows.filter((r) => r.finalAction === "CREATED").length}{" "}
                        created
                      </span>
                      <span>
                        🔵{" "}
                        {finalRows.filter((r) => r.finalAction === "UPDATED").length}{" "}
                        updated
                      </span>
                      <span>
                        ⚪{" "}
                        {finalRows.filter((r) => r.finalAction === "SKIPPED").length}{" "}
                        skipped
                      </span>
                      <span>
                        ❌{" "}
                        {finalRows.filter((r) => r.finalAction === "FAILED").length}{" "}
                        failed
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-2xl bg-indigo-600 px-5 py-2.5
                               text-sm font-semibold text-white
                               hover:bg-indigo-700 transition-colors"
                  >
                    Upload Another File
                  </button>
                </div>
              </div>
            )}

            {/* ── Idle info banner ──────────────────────────────────────── */}
            {stage === "idle" && !selectedFile && (
              <div className="flex items-start gap-3 rounded-2xl border
                              border-indigo-100 bg-indigo-50/60 px-4 py-3">
                <InformationCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-indigo-800 space-y-2">
                  <p className="font-semibold">How it works</p>
                  <ol className="text-xs space-y-1 list-decimal list-inside text-indigo-700">
                    <li>Download the template and fill in your technology data</li>
                    <li>Upload the filled template using the button above</li>
                    <li>Review the preview — override any decisions if needed</li>
                    <li>Click Confirm &amp; Save to write to the database</li>
                  </ol>
                  <p className="text-xs text-indigo-600 pt-1">
                    Duplicate detection:{" "}
                    <span className="font-medium">exact name + lab + year match</span>{" "}
                    (skip) and{" "}
                    <span className="font-medium">fuzzy name &gt; 80%</span>{" "}
                    (warning — you decide).
                  </p>
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

export default ExcelUpload;