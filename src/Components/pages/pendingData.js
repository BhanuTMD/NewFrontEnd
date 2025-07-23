import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const PendingData = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false); // Technology ka nested dropdown control

  const pendingItems = [
    { id: 1, trn: "TRN123", name: "Ritesh Gupta", status: "Pending" },
    { id: 2, trn: "TRN456", name: "Aman Singh", status: "Approved" },
    { id: 3, trn: "TRN789", name: "Neha Sharma", status: "Rejected" },
  ];

  return (
    <div>
      {/* NavBar */}
      <nav className="bg-indigo-600 text-white px-6 py-3 relative">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">My Dashboard</h1>

          <div className="relative">
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 rounded hover:bg-indigo-700 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            {/* Main Dropdown */}
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

                {/* Technology dropdown toggle */}
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
        <table className="min-w-full border border-gray-300">
          <thead className="bg-indigo-100 text-indigo-900">
            <tr>
              <th className="border px-4 py-2 text-left">TRN</th>
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {pendingItems.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50">
                <td className="border px-4 py-2">{item.trn}</td>
                <td className="border px-4 py-2">{item.name}</td>
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
      </div>
    </div>
  );
};

export default PendingData;
