import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const ViewTechnology = () => {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://172.16.2.246:8080/api/section-one/technologies?page=${
            currentPage - 1
          }&size=${itemsPerPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && Array.isArray(res.data.content)) {
          setTechList(res.data.content);
          setTotalElements(res.data.totalElements || 0);
        } else if (Array.isArray(res.data)) {
          setTechList(res.data);
          setTotalElements(res.data.length);
        } else {
          setError("Unexpected data format received.");
          setTechList([]);
          setTotalElements(0);
        }
      } catch (err) {
        console.error("Error fetching technologies:", err);
        setError("Failed to load data.");
        setTechList([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalElements / itemsPerPage) || 1;

  const filteredTechList = techList.filter(
    (item) =>
      item.technologyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.technologyRefNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex =
    totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalElements);

  const formatTheme = (theme) => {
    if (Array.isArray(theme)) return theme.join(", ");
    if (typeof theme === "string") return theme;
    return "N/A";
  };

  const formatLeadLab = (item) => {
    if (item.leadLaboratory) return item.leadLaboratory;
    if (Array.isArray(item.lab)) return item.lab.join(", ");
    if (item.lab) return item.lab;
    return "N/A";
  };

  return (
    <>
      <NavBar />

      {/* BACKGROUND + BLOBS */}
      <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-sky-100 via-white to-indigo-200">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-blue-200/20 blur-[120px]" />
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">

            {/* GLASS CONTAINER */}
            <div className="rounded-3xl bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] ring-1 ring-white/50 p-5 sm:p-8">

              {/* HEADER */}
              <div className="mb-6 flex flex-col gap-3 border-b border-indigo-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-indigo-900 sm:text-2xl">
                    All Technologies
                  </h2>
                  <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                    Browse the catalog of CSIR technologies.
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                    Total Records:
                    <span className="ml-1 font-bold">{totalElements}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Showing {startIndex}–{endIndex}
                  </span>
                </div>
              </div>

              {/* SEARCH BAR */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-full max-w-md">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by technology name or TRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md px-10 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* TOP CONTROLS */}
              <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                {/* Items per page */}
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-slate-600">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-slate-500">entries</span>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-2 text-sm">
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeftIcon className="mr-1 h-4 w-4" />
                    Previous
                  </button>

                  <span className="rounded-xl bg-white/70 backdrop-blur-lg px-3 py-1.5 font-medium text-slate-700 shadow-sm">
                    Page{" "}
                    <span className="font-bold text-indigo-700">
                      {currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-indigo-700">
                      {totalPages}
                    </span>
                  </span>

                  <button
                    disabled={
                      currentPage === totalPages || totalElements === 0
                    }
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    className="inline-flex items-center rounded-xl bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              {loading ? (
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-600 animate-pulse">
                      Loading technologies...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="py-10 text-center">
                  <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50/80 p-6">
                    <p className="text-sm font-semibold text-red-700">
                      Oops! {error}
                    </p>
                  </div>
                </div>
              ) : filteredTechList.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-slate-50/80 p-6">
                    <p className="text-sm font-semibold text-slate-700">
                      No technologies found.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm backdrop-blur-lg bg-white/70">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    
                    {/* TABLE HEADER */}
                    <thead className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-sky-500/10">
                      <tr className="text-slate-700">
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">
                          TRN No
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">
                          Technology Name
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">
                          Theme
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider">
                          Lead Lab
                        </th>
                        <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* TABLE BODY */}
                    <tbody className="divide-y divide-slate-100">
                      {filteredTechList.map((item) => (
                        <tr
                          key={item.technologyRefNo}
                          className="transition-all duration-200 hover:bg-indigo-50/70 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:-translate-y-[1px]"
                        >
                          <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                            {item.technologyRefNo || "N/A"}
                          </td>

                          <td className="px-6 py-3 text-sm text-slate-800">
                            {item.technologyName || "N/A"}
                          </td>

                          <td className="px-6 py-3 text-sm text-slate-700">
                            {formatTheme(item.theme)}
                          </td>

                          <td className="px-6 py-3 text-sm text-slate-700">
                            {formatLeadLab(item)}
                          </td>

                          <td className="px-6 py-3 text-center">
                            <Link
                              to={`/technology/${item.technologyRefNo}`}
                              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(59,130,246,0.35)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_6px_20px_rgba(59,130,246,0.45)]"
                            >
                              <EyeIcon className="mr-1 h-4 w-4" />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <FooterBar />
    </>
  );
};

export default ViewTechnology;
