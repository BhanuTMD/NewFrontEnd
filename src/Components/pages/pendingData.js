import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import axios from "axios";

const PendingData = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState([]); // API data ke liye state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch pending data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://172.16.2.246:8080/apf/tdmp/sectionStatus");
        setPendingItems(res.data); // API response set kar do
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* NavBar */}
      <nav className="bg-indigo-600 text-white px-6 py-3 relative">
        <div className="flex justify-between items-center">
          {/* <h1 className="text-xl font-bold">Home</h1> */}
          <Link to="/WelcomePage" className="text-white hover:underline text-lg font-bold">
            Home
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded hover:bg-indigo-700 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-indigo-100 text-black rounded shadow-md text-sm z-20"
                onMouseLeave={() => {
                  setIsDropdownOpen(false);
                  setIsTechOpen(false);
                }}
              >
                <Link
                  to="/WelcomePage"
                  className="block px-4 py-2 hover:bg-indigo-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/techSearch"
                  className="block px-4 py-2 hover:bg-indigo-200"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  View
                </Link>

                <div>
                  <button
                    onClick={() => setIsTechOpen(!isTechOpen)}
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-200"
                  >
                    Technology ▾
                  </button>

                  {isTechOpen && (
                    <div className="pl-6 bg-indigo-50">
                      <Link
                        to="/sectionOne"
                        className="block px-4 py-2 hover:bg-indigo-200"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsTechOpen(false);
                        }}
                      >
                        Add Technology
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Table */}
      <div className="p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full border border-gray-300">
            <thead className="bg-indigo-100 text-indigo-900">
              <tr>
                <th className="border px-4 py-2 text-left">TRN</th>
                <th className="border px-4 py-2 text-left">Technology Name</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item, index) => (
                <tr key={index} className="hover:bg-indigo-50">
                  <td className="border px-4 py-2">{item.technologyRefNo}</td>
                  <td className="border px-4 py-2">{item.technologyName}</td>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingData;
