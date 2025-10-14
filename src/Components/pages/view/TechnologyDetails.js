// File: TechnologyDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import FileViewerModal from "./FileViewerModal"; // 1. Import the new modal component

const TechnologyDetails = () => {
  const { trnNo } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewed, setViewed] = useState(false);
  
  // 2. Add state to manage the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileToView, setFileToView] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://172.16.2.246:8080/api/section-one/${trnNo}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching technology details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [trnNo]);

  // 3. Update the view handler to open the modal
  const handleViewFile = () => {
    if (data && data.fileUrl) {
      // The backend should provide a direct URL for viewing
      // Assuming your API has a '/view/' endpoint as per your previous Java code
      const viewUrl = data.fileUrl.replace('/download/','/view/');
      setFileToView(viewUrl);
      setIsModalOpen(true);
      setViewed(true); // Still enable download button after viewing
    }
  };

  // Handler to download the file (no changes here)
  const handleDownloadFile = () => {
    if (data && data.fileUrl) {
      window.open(data.fileUrl, '_blank');
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!data) return <p className="text-center mt-6 text-red-500">No details found.</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Back Button */}
        <Link to="/ViewTechnology" className="text-indigo-600 hover:underline mb-4 inline-block">
          ← Back to All Technologies
        </Link>

        {/* Main content card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {data.nameTechnology || "Technology Details"}
          </h1>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
            <p><strong>Technology Ref No:</strong> {data.technologyRefNo}</p>
            <p><strong>Lead Laboratory:</strong> {data.leadLaboratory}</p>
            <p><strong>Year of Development:</strong> {data.yearDevelopment}</p>
            <p><strong>Technology Level:</strong> {data.technologyLevel}</p>
            <p><strong>Scale of Development:</strong> {data.scaleDevelopment}</p>
            <p><strong>Market Potential:</strong> {data.marketPotential}</p>
            <p><strong>Competitive Position:</strong> {data.competitivePosition}</p>
            <p><strong>Environmental/Statutory:</strong> {data.environmentalStatutory}</p>
            <p><strong>Laboratory Detail:</strong> {data.laboratoryDetail}</p>
            <p><strong>Techno Economics:</strong> {data.technoEconomics}</p>
            <p><strong>Keyword:</strong> {data.keywordTechnology}</p>
            <p><strong>Multi Lab/Institute:</strong> {data.multiLabInstitute ? "Yes" : "No"}</p>
            <p><strong>Theme:</strong> {Array.isArray(data.theme) ? data.theme.join(", ") : ""}</p>
            <p><strong>Industrial Sector:</strong> {Array.isArray(data.industrialSector) ? data.industrialSector.join(", ") : ""}</p>
            <p><strong>Associate Institute:</strong> {Array.isArray(data.associateInstitute) ? data.associateInstitute.join(", ") : ""}</p>
            <p><strong>Submitted By:</strong> {data.submittedByEmail}</p>
          </div>

          {/* Brief Section */}
          <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold text-gray-800">Brief Description</h2>
            <p className="text-gray-700">{data.briefTech}</p>
          </div>

          {/* File View and Download Buttons */}
          {data.fileUrl && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleViewFile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                👁️ View File
              </button>

              {viewed && (
                <button
                  onClick={handleDownloadFile}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  ⬇️ Download File
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Render the modal component */}
      <FileViewerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileUrl={fileToView}
      />
    </>
  );
};

export default TechnologyDetails;