import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "Components/common/navBar";
import {
  PencilIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const PendingData = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://172.16.2.246:8080/api/section-one/my-technologies?page=${
            currentPage - 1
          }&size=${itemsPerPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && Array.isArray(res.data.content)) {
          setPendingItems(res.data.content);
          setTotalElements(res.data.totalElements || 0);
        } else if (Array.isArray(res.data)) {
          setPendingItems(res.data);
          setTotalElements(res.data.length);
        } else {
          setError("Unexpected data format received.");
          setPendingItems([]);
          setTotalElements(0);
        }
      } catch (err) {
        console.error("Error fetching technologies:", err);
        setError("Failed to load data.");
        setPendingItems([]);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalElements / itemsPerPage) || 1;

  const handleEdit = (item) => {
    const statusToRoute = {
      SectionOne: "/sectionOne",
      SectionTwo: "/sectionTwo",
      SectionThree: "/sectionThree",
      SectionFour: "/sectionFour",
    };

    const route = statusToRoute[item.status];

    if (route) {
      navigate(route, {
        state: { technologyRefNo: item.technologyRefNo },
      });
    } else {
      console.warn("No valid edit route found for status:", item.status);
      Swal.fire(
        "Navigation Error",
        `Cannot edit item with status: ${item.status}. No matching route defined.`,
        "warning"
      );
    }
  };

  // Client-side filter on current page data
  const filteredPendingItems = pendingItems.filter(
    (item) =>
      item.technologyName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.technologyRefNo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Range text helper
  const startIndex =
    totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalElements);

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 flex flex-col">
        <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {/* Card wrapper */}
            <div className="rounded-3xl bg-white/90 p-5 shadow-xl ring-1 ring-slate-200/70 backdrop-blur-sm sm:p-8">
              {/* Header */}
              <div className="mb-6 flex flex-col gap-3 border-b border-indigo-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-indigo-900 sm:text-2xl">
                    Pending Technologies
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Review and continue submissions based on their current
                    progress across sections.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 text-right">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
                    Total Records:{" "}
                    <span className="ml-1 font-bold">{totalElements}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Showing {startIndex || 0}–{endIndex || 0}
                  </span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-full max-w-md">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by technology name or TRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-10 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              {/* Top Controls: Items per page + Pagination */}
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
                    aria-label="Previous page"
                  >
                    <ChevronLeftIcon className="mr-1 h-4 w-4" />
                    Previous
                  </button>

                  <span className="rounded-xl bg-slate-50 px-3 py-1.5 font-medium text-slate-700 shadow-sm">
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
                    aria-label="Next page"
                  >
                    Next
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              {loading ? (
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                    <p className="text-sm font-medium text-slate-600 animate-pulse">
                      Loading pending technologies...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="py-10 text-center">
                  <div className="mx-auto max-w-md rounded-2xl border border-red-100 bg-red-50/80 p-6">
                    <p className="text-sm font-semibold text-red-700">
                      Oops! {error}
                    </p>
                    <p className="mt-2 text-xs text-red-500">
                      Please try again later or contact the administrator if the
                      issue persists.
                    </p>
                  </div>
                </div>
              ) : filteredPendingItems.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-slate-50/80 p-6">
                    <ExclamationTriangleIcon className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">
                      No pending technologies found.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try adjusting your search or pagination settings.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-gradient-to-r from-indigo-50 via-sky-50 to-blue-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                          TRN
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                          Technology Name
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-600">
                          Current Status
                        </th>
                        <th className="px-6 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredPendingItems.map((item, index) => (
                        <tr
                          key={item.technologyRefNo}
                          className="transition-transform duration-150 hover:scale-[1.005] hover:bg-indigo-50/60"
                          style={{ animationDelay: `${index * 40}ms` }}
                        >
                          <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                            {item.technologyRefNo}
                          </td>
                          <td className="px-6 py-3 text-sm text-slate-800">
                            {item.technologyName}
                          </td>
                          <td className="px-6 py-3">
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 shadow-sm">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <button
                              onClick={() => handleEdit(item)}
                              className="inline-flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg"
                              aria-label={`Edit ${item.technologyName}`}
                            >
                              <PencilIcon className="mr-1 h-4 w-4" />
                              Edit / Continue
                            </button>
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
    </>
  );
};

export default PendingData;
