import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ViewTechnology = () => {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTech, setSelectedTech] = useState(null); // For modal
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://172.16.2.246:8080/api/technologies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTechList(res.data.content || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewTechnology = async (technologyRefNo) => {
    setModalLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://172.16.2.246:8080/api/sectionOne/${technologyRefNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTech(res.data);
    } catch (err) {
      console.error("Error fetching technology details:", err);
      alert("Failed to fetch technology details.");
    } finally {
      setModalLoading(false);
    }
  };
  const closeModal = () => setSelectedTech(null);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white px-8 py-3 flex justify-between items-center shadow-md">
        <Link to="/WelcomePage" className="text-lg font-bold hover:underline">
          Home
        </Link>
        <h1 className="text-xl font-bold tracking-wide">Technology Database</h1>
      </nav>

      {/* Table Section */}
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
                    <th className="border px-4 py-2">Lead Lab</th>
                    <th className="border px-4 py-2">Saved Date</th>
                    <th className="border px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {techList.map((item) => (
                    <tr key={item.technologyRefNo} className="hover:bg-indigo-50 transition">
                      <td className="border px-4 py-2">{item.technologyRefNo || ""}</td>
                      <td className="border px-4 py-2">{item.technologyName || ""}</td>
                      <td className="border px-4 py-2">
                        {Array.isArray(item.theme) ? item.theme.join(", ") : item.theme || ""}
                      </td>
                      <td className="border px-4 py-2">{item.leadLaboratory || ""}</td>
                      <td className="border px-4 py-2">
                        {item.savedDate ? new Date(item.savedDate).toLocaleDateString() : ""}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => viewTechnology(item.technologyRefNo)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                        >
                          View
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

      {/* Modal */}
      {selectedTech && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl p-6 relative overflow-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
            >
              ×
            </button>

            {modalLoading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-indigo-700">{selectedTech.nameTechnology || ""}</h3>
                <p><strong>TRN No:</strong> {selectedTech.technologyRefNo || ""}</p>
                <p><strong>Brief:</strong> {selectedTech.briefTech || ""}</p>
                <p><strong>Competitive Position:</strong> {selectedTech.competitivePosition || ""}</p>
                <p><strong>Environmental/Statutory:</strong> {selectedTech.environmentalStatutory || ""}</p>
                <p><strong>Laboratory Detail:</strong> {selectedTech.laboratoryDetail || ""}</p>
                <p><strong>Lead Laboratory:</strong> {selectedTech.leadLaboratory || ""}</p>
                <p><strong>Market Potential:</strong> {selectedTech.marketPotential || ""}</p>
                <p><strong>Multi Lab/Institute:</strong> {selectedTech.multiLabInstitute || ""}</p>
                <p><strong>Scale of Development:</strong> {selectedTech.scaleDevelopment || ""}</p>
                <p><strong>Techno Economics:</strong> {selectedTech.technoEconomics || ""}</p>
                <p><strong>Technology Level:</strong> {selectedTech.technologyLevel || ""}</p>
                <p><strong>Year of Development:</strong> {selectedTech.yearDevelopment || ""}</p>
                <p><strong>Industrial Sector:</strong> {Array.isArray(selectedTech.industrialSector) ? selectedTech.industrialSector.join(", ") : ""}</p>
                <p><strong>Associate Institute:</strong> {Array.isArray(selectedTech.associateInstitute) ? selectedTech.associateInstitute.join(", ") : ""}</p>
                <p><strong>Submitted By:</strong> {selectedTech.submittedByEmail || ""}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTechnology;
