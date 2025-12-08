import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "Components/common/navBar";
// Assuming you have Heroicons installed; if not, install via npm i @heroicons/react
import { PencilIcon, ExclamationTriangleIcon, ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const PendingData = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Optional search for beauty/UX
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // 1-based for UI
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0); // From API response

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        // Add query params for server-side pagination (page is 0-based)
        const res = await axios.get(
          `http://172.16.2.246:8080/api/section-one/technologies?page=${currentPage - 1}&size=${itemsPerPage}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && Array.isArray(res.data.content)) {
          setPendingItems(res.data.content);
          setTotalElements(res.data.totalElements || 0); // Assuming API returns this
        } else if (Array.isArray(res.data)) {
          // Fallback if not paginated
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
  }, [currentPage, itemsPerPage]); // Refetch on page/size change

  const totalPages = Math.ceil(totalElements / itemsPerPage);

  const handleEdit = (item) => {
    const statusToRoute = {
      "SectionOne": "/sectionOne",
      "SectionTwo": "/sectionTwo",
      "SectionThree": "/sectionThree",
      "SectionFour": "/sectionFour",
    };

    const route = statusToRoute[item.status];

    if (route) {
      navigate(route, {
        state: { technologyRefNo: item.technologyRefNo },
      });
    } else {
      console.warn("No valid edit route found for status:", item.status);
      // Use Swal here for user feedback on action failure
      Swal.fire("Navigation Error", `Cannot edit item with status: ${item.status}. No matching route defined.`, "warning");
    }
  };

  // Filter pendingItems based on search term (optional enhancement)
  const filteredPendingItems = pendingItems.filter((item) =>
    item.technologyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.technologyRefNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-center text-3xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-4">
              Pending Technologies
            </h2>

            {/* SEARCH BAR (Optional for enhanced UX) */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-full max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or TRN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm"
                />
              </div>
            </div>

            {/* TOP BAR – ITEMS PER PAGE + PAGINATION */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              {/* ITEMS PER PAGE DROPDOWN */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-semibold text-sm">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to page 1
                  }}
                  className="border border-gray-300 px-4 py-2 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition duration-200 shadow-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-gray-600 text-sm">entries</span>
              </div>

              {/* PAGINATION BUTTONS */}
              <div className="flex gap-2 items-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <span className="px-4 py-2 bg-indigo-50 text-indigo-800 rounded-lg font-medium shadow-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-sm"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium animate-pulse">Loading pending technologies...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-700 font-semibold">Oops! {error}</p>
                  <p className="text-red-500 text-sm mt-2">Please try again later.</p>
                </div>
              </div>
            ) : filteredPendingItems.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md mx-auto">
                  <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-semibold">No pending technologies found.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">TRN</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Technology Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Current Status</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-indigo-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredPendingItems.map((item, index) => (
                      <tr
                        key={item.technologyRefNo}
                        className="hover:bg-indigo-50 transition duration-200 ease-in-out transform hover:scale-[1.01]"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">{item.technologyRefNo}</td>
                        <td className="px-6 py-4 text-gray-800">{item.technologyName}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 shadow-sm">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:from-indigo-700 hover:to-blue-700 transition duration-200 shadow-md hover:shadow-lg"
                            aria-label={`Edit ${item.technologyName}`}
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
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
        </main>
      </div>
    </>
  );
};

export default PendingData;
