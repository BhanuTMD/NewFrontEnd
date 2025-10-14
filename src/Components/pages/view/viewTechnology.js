import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ViewTechnology = () => {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://172.16.2.246:8080/api/technologies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTechList(res.data.content || []);
      } catch (err) {
        console.error("Error fetching technologies:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-8 py-3 flex justify-between items-center shadow-md">
        <Link to="/WelcomePage" className="text-lg font-bold hover:underline">
          Home
        </Link>
        <h1 className="text-xl font-bold tracking-wide">Technology Database</h1>
      </nav>

      {/* Main Table */}
      <div className="mt-8 px-4">
        <div className="w-full bg-white p-6 rounded-lg shadow-md overflow-auto">
          <h2 className="text-center text-2xl font-bold text-indigo-700 mb-4">
            All Technologies
          </h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : techList.length === 0 ? (
            <p className="text-center text-gray-600">No data available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300 text-center">
                <thead className="bg-indigo-100 text-indigo-900 sticky top-0">
                  <tr>
                    <th className="border px-4 py-2">TRN No</th>
                    <th className="border px-4 py-2">Technology Name</th>
                    <th className="border px-4 py-2">Theme</th>
                    <th className="border px-4 py-2">Lab</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {techList.map((item) => (
                    <tr
                      key={item.technologyRefNo}
                      className="hover:bg-indigo-50 transition"
                    >
                      <td className="border px-4 py-2">
                        {item.technologyRefNo || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {item.technologyName || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {Array.isArray(item.theme)
                          ? item.theme.join(", ")
                          : item.theme || ""}
                      </td>
                      <td className="border px-4 py-2">{item.lab || ""}</td>
                      <td className="border px-4 py-2">
                        <Link
                          to={`/technology/${item.technologyRefNo}`}
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
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
    </div>
  );
};

export default ViewTechnology;
