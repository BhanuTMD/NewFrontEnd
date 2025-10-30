import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2"; // Keep Swal for handleEdit error alert
import NavBar from "Components/common/navBar";

const PendingData = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://172.16.2.246:8080/api/section-one/technologies");

        if (res.data && Array.isArray(res.data.content)) {
          setPendingItems(res.data.content);
        } else {
          console.error("Fetched data is not in the expected format (missing 'content' array):", res.data);
          setPendingItems([]);
          // Optionally show a user-facing error, but avoid Swal inside useEffect for initial load issues
          // Swal.fire("Data Error", "Received unexpected data format from server.", "warning");
        }
      } catch (error) {
        console.error("Error fetching technologies:", error);
        setPendingItems([]);
        // Optionally show a user-facing error
        // Swal.fire("Fetch Error", "Could not load pending technologies.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array is correct here

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

  const closeDropdown = () => {
    setIsDropdownOpen(false);
    setIsTechOpen(false);
  };

  return (
    
    <div>
      {/* NavBar */}
      <NavBar />
      {/* <nav className="bg-indigo-600 text-white px-6 py-3 relative shadow-md">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link to="/WelcomePage" className="text-white hover:text-indigo-200 text-lg font-bold transition duration-150">
            Home
          </Link>
          <div className="relative">
            <button
              aria-label="Toggle menu"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-xl text-sm z-50 ring-1 ring-black ring-opacity-5"
                onMouseLeave={closeDropdown}
              >
                <Link
                  to="/WelcomePage"
                  className="block px-4 py-2 hover:bg-indigo-100 transition duration-150"
                  onClick={closeDropdown}
                >
                  Home
                </Link> */}
                {/* Corrected Link */}
                {/* <Link
                  to="/techSearch" // Changed from /viewTechnology
                  className="block px-4 py-2 hover:bg-indigo-100 transition duration-150"
                  onClick={closeDropdown}
                >
                  View/Search Technology
                </Link>
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => setIsTechOpen(!isTechOpen)}
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-100 transition duration-150 flex justify-between items-center"
                    aria-expanded={isTechOpen}
                  >
                    Technology
                    <span className={`transform transition-transform duration-200 ${isTechOpen ? 'rotate-180' : 'rotate-0'}`}>▾</span>
                  </button>
                  {isTechOpen && (
                    <div className="pl-4 bg-indigo-50 border-l-2 border-indigo-200">
                      <Link
                        to="/sectionOne"
                        className="block px-4 py-2 hover:bg-indigo-200 transition duration-150 text-sm"
                        onClick={closeDropdown}
                      >
                        Add New Technology
                      </Link>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200">
                   {/* Add Logout Button/Link here if needed */}
                {/* </div>
              </div>
            )}
          </div>
        </div>
      </nav> */}

      {/* Table Section */}
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-5 text-indigo-800">Pending Technologies</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
              <p className="text-center text-gray-600 animate-pulse">Loading data...</p>
          </div>
        ) : pendingItems.length === 0 ? (
           <div className="text-center py-10 bg-white rounded-lg shadow border border-gray-200">
               <p className="text-gray-500">No pending technology entries found.</p>
           </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRN</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {pendingItems.map((item) => (
                  <tr key={item.technologyRefNo} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{item.technologyRefNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.technologyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {item.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
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
  );
};

export default PendingData;