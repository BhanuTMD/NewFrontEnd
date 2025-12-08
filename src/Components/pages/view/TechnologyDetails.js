import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FileViewerModal from "./FileViewerModal";
import { countryOptions } from "Components/data/country";
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";

// --- Icon Imports for a Professional Look (Assuming you have access to a library like Heroicons) ---
// For the purpose of this response, I'll use simple inline SVG paths, but in a real project,
// you'd import from a dedicated icon library.
const FileIcon = (props) => (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
    </svg>
);
const TeamIcon = (props) => (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-2m2 0h-2M15 12H9m-6 4h2v4h4v-4m-2 0h-2M13 18v-4m-4 0v4m4-4h2m-4 0h-2m2 0V9m0-6v4m0 0H9m-6 4h2v4h4v-4m-2 0h-2m2 0V9m0-6v4m0 0H9m4-4V5a2 2 0 00-2-2H7a2 2 0 00-2 2v2m4 0h6m2 0V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"></path>
    </svg>
);
const LicenseIcon = (props) => (
    <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.944 12c0 3.076 1.09 5.867 2.944 8.016M18 12h-2"></path>
    </svg>
);
const DeploymentIcon = (props) => (
    <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
);

// --- Component Definition ---
const TechnologyDetails = () => {
    const { trnNo } = useParams();
    const navigate = useNavigate();
    const [sectionOneData, setSectionOneData] = useState(null);
    const [sectionTwoData, setSectionTwoData] = useState(null);
    const [sectionThreeData, setSectionThreeData] = useState([]);
    const [sectionFourData, setSectionFourData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToView, setFileToView] = useState('');
    const [existingFileUrl, setExistingFileUrl] = useState(''); // State for existing file URL

    // --- Data Fetching Logic (Kept mostly as is) ---
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [res1, res2, res3, res4] = await Promise.all([
                    axios.get(`http://172.16.2.246:8080/api/section-one/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 1:", err); return { data: null }; }),
                    axios.get(`http://172.16.2.246:8080/api/section-two/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 2:", err); return { data: null }; }),
                    axios.get(`http://172.16.2.246:8080/api/section-three/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 3:", err); return { data: [] }; }),
                    axios.get(`http://172.16.2.246:8080/api/section-four/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 4:", err); return { data: [] }; }),
                ]);

                setSectionOneData(res1.data);
                setSectionTwoData(res2.data);
                setSectionThreeData(Array.isArray(res3.data) ? res3.data : []);
                setSectionFourData(Array.isArray(res4.data) ? res4.data : []);

                if (res1.data && res1.data.fileUrl) {
                    setExistingFileUrl(res1.data.fileUrl);
                }

            } catch (error) {
                console.error("General error fetching technology details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (trnNo) {
            fetchAllData();
        } else {
            setLoading(false);
        }
    }, [trnNo]);

    // --- Helper Functions (Kept as is) ---
    const handleViewFile = () => {
        if (existingFileUrl) {
            // Note: The original URL replacement logic is maintained here
            const viewUrl = existingFileUrl.replace('/download/', '/section-one/view/');
            setFileToView(viewUrl);
            setIsModalOpen(true);
        } else {
            console.warn("No file URL found in data");
            alert("File URL is missing, cannot view the file.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            if (dateString instanceof Date && !isNaN(dateString)) {
                return dateString.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
            return dateString;
        } catch (e) {
            console.error("Date formatting error:", e);
            return dateString;
        }
    };

    const displayValue = (value) => {
        if (value === null || value === undefined || value === "") return <span className="text-gray-400 italic">N/A</span>;
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(", ") : <span className="text-gray-400 italic">None</span>;
        }
        if (typeof value === 'boolean') return value ? "Yes" : "No";
        return String(value);
    };

    const getCountryLabel = (value) => {
        const option = countryOptions.find(opt => opt.value === value);
        return option ? option.label : value || <span className="text-gray-400 italic">N/A</span>;
    };

    const handleEdit = (route) => {
        navigate(route, {
            state: { technologyRefNo: trnNo },
        });
    };

    // --- Loading and Error States ---
    if (loading) return <p className="text-center mt-6 text-xl text-indigo-600 font-medium">Loading technology details...</p>;
    if (!sectionOneData && !loading) return <p className="text-center mt-6 text-2xl text-red-600">⚠️ Could not load core details for TRN: **{trnNo}**</p>;

    // --- Presentation Component ---
    const DetailItem = ({ label, value }) => (
        <div>
            <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-900 mt-1 break-words">{value}</p>
        </div>
    );

    const SectionCard = ({ title, icon, trnNo, editRoute, children }) => (
        <div className="mt-8 pt-6 border-t border-gray-200 print-break bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {icon}
                    {title}
                </h2>
                <button
                    onClick={() => handleEdit(editRoute)}
                    className="bg-sky-600 text-white px-3 py-1.5 rounded-lg hover:bg-sky-700 transition duration-150 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 no-print shadow-sm"
                >
                    Edit
                </button>
            </div>
            {children}
        </div>
    );

    // --- Main Render ---
    return (
  <>
    <style>
      {`
        @media print {
          .no-print { display: none !important; }
          body { font-size: 11px; }
          .print-break { page-break-before: always; }
          .printable-card { box-shadow: none !important; border: 1px solid #ccc; padding: 10px; margin: 0; }
        }
      `}
    </style>

    <NavBar className="no-print" />

    <div className="min-h-screen bg-slate-50 py-8 px-3 sm:px-4">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto mb-5 flex flex-wrap gap-3 justify-between items-center no-print">
        <Link
          to="/ViewTechnology"
          className="inline-flex items-center text-sm font-medium text-sky-700 hover:text-sky-900"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to All Technologies
        </Link>

        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs sm:text-sm font-medium text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m0 0h10m-7 2h4M7 17v-5m10 5v-5"
              ></path>
            </svg>
            Print
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* SECTION 1 MAIN CARD */}
        {sectionOneData ? (
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl printable-card">
            {/* Gradient header */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-sky-100/80">
                  Technology Reference
                </p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                  {sectionOneData.nameTechnology || "Technology Details"}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-sky-100">
                  TRN:{" "}
                  <span className="font-semibold">
                    {displayValue(sectionOneData.technologyRefNo)}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-end">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase tracking-wide text-sky-100/80">
                    Lead Lab
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {displayValue(sectionOneData.leadLaboratory)}
                  </span>
                </div>
                <div className="h-10 w-px bg-sky-200/50 hidden sm:block" />
                <div className="flex flex-col text-right">
                  <span className="text-[10px] uppercase tracking-wide text-sky-100/80">
                    TRL
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {displayValue(sectionOneData.technologyLevel)}
                  </span>
                </div>
                <button
                  onClick={() => handleEdit("/sectionOne")}
                  className="no-print inline-flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-sky-700 shadow hover:bg-white"
                >
                  Edit Section 1
                </button>
              </div>
            </div>

            {/* CORE INFO + META */}
            <div className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailItem
                    label="Year of Development"
                    value={displayValue(sectionOneData.yearDevelopment)}
                  />
                  <DetailItem
                    label="Scale of Development"
                    value={displayValue(sectionOneData.scaleDevelopment)}
                  />
                  <DetailItem
                    label="Multi Lab/Institute"
                    value={displayValue(sectionOneData.multiLabInstitute)}
                  />
                  {sectionOneData.multiLabInstitute === "Yes" && (
                    <DetailItem
                      label="Associate Institute"
                      value={displayValue(sectionOneData.lab)}
                    />
                  )}
                  <DetailItem
                    label="Laboratory Contact Detail"
                    value={displayValue(sectionOneData.laboratoryDetail)}
                  />
                  <DetailItem
                    label="Submitted By"
                    value={displayValue(sectionOneData.submittedByEmail)}
                  />
                </div>

                {/* Right mini summary card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                  <p className="font-semibold text-slate-700 mb-1">
                    Quick Summary
                  </p>
                  <DetailItem
                    label="Theme(s)"
                    value={displayValue(sectionOneData.theme)}
                  />
                  <DetailItem
                    label="Industrial Sector(s)"
                    value={displayValue(sectionOneData.industrialSector)}
                  />
                  <DetailItem
                    label="Keyword(s)"
                    value={displayValue(sectionOneData.keywordTechnology)}
                  />
                </div>
              </div>

              {/* Long text blocks */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <div className="border-l-4 border-sky-500 pl-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      Brief Description
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                      {displayValue(sectionOneData.briefTech)}
                    </p>
                  </div>
                  <div className="border-l-4 border-sky-500 pl-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      Competitive Positioning
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                      {displayValue(sectionOneData.competitivePosition)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-sky-500 pl-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      Techno-economics
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                      {displayValue(sectionOneData.technoEconomics)}
                    </p>
                  </div>
                  <div className="border-l-4 border-sky-500 pl-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      Environmental / Statutory Compliance
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                      {displayValue(sectionOneData.environmentalStatutory)}
                    </p>
                  </div>
                  <div className="border-l-4 border-sky-500 pl-4">
                    <h2 className="text-sm font-semibold text-gray-800">
                      Market Potential
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">
                      {displayValue(sectionOneData.marketPotential)}
                    </p>
                  </div>
                </div>
              </div>

              {/* File button */}
              {existingFileUrl ? (
                <div className="mt-6 flex gap-3 no-print">
                  <button
                    onClick={handleViewFile}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow hover:bg-blue-700"
                  >
                    <FileIcon />
                    View Associated File
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-xs text-gray-500 italic">
                  No associated file uploaded for Section 1.
                </p>
              )}
            </div>
          </div>
        ) : (
          <h1 className="text-2xl font-bold text-red-600 mb-4 border-b pb-2">
            Core Technology Details Unavailable (TRN: {trnNo})
          </h1>
        )}

        {/* SECTION 2 */}
        {sectionTwoData ? (
          <SectionCard
            title="Section 2: Team Details"
            icon={<TeamIcon />}
            editRoute="/sectionTwo"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <DetailItem
                label="Principal Investigator"
                value={displayValue(sectionTwoData.principalInvestigatorName)}
              />
              <DetailItem
                label="Designation"
                value={displayValue(sectionTwoData.designation)}
              />
              <DetailItem
                label="Group/Division"
                value={displayValue(sectionTwoData.groupDivision)}
              />
              <DetailItem
                label="Institute/Lab"
                value={displayValue(sectionTwoData.instituteLab)}
              />
            </div>
          </SectionCard>
        ) : (
          <p className="mt-2 text-sm text-gray-500 italic">
            Section 2 data not available.
          </p>
        )}

        {/* SECTION 3 */}
        {sectionThreeData.length > 0 ? (
          <SectionCard
            title={`Section 3: Licensee Details (${sectionThreeData.length})`}
            icon={<LicenseIcon />}
            editRoute="/sectionThree"
          >
            <div className="space-y-5">
              {sectionThreeData.map((licensee, index) => (
                <div
                  key={licensee.id || index}
                  className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm"
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-emerald-800 mb-3">
                    {index + 1}. {licensee.licenseName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    <DetailItem
                      label="Type"
                      value={displayValue(licensee.typeOfLicense)}
                    />
                    <DetailItem
                      label="Geography"
                      value={displayValue(licensee.staRegionalGeography)}
                    />
                    <DetailItem
                      label="Agreement Date"
                      value={formatDate(licensee.dateOfAgreementSigning)}
                    />
                    <DetailItem
                      label="License Date"
                      value={formatDate(licensee.dateOfLicense)}
                    />
                    <DetailItem
                      label="Valid Until"
                      value={formatDate(licensee.licenseValidUntil)}
                    />
                    <DetailItem
                      label="Total License Fee"
                      value={
                        <span className="font-bold text-emerald-800">
                          {licensee.totalLicenseFee?.toFixed(2) || "0.00"} INR
                        </span>
                      }
                    />
                    <div className="md:col-span-2 lg:col-span-3">
                      <DetailItem
                        label="Address"
                        value={displayValue(licensee.address)}
                      />
                    </div>
                    <DetailItem
                      label="Email"
                      value={displayValue(licensee.email)}
                    />
                    <DetailItem
                      label="Contact"
                      value={displayValue(licensee.contact)}
                    />
                    <div className="lg:col-span-3">
                      <DetailItem
                        label="Exclusivity Details"
                        value={displayValue(licensee.detailsOfExclusivity)}
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <DetailItem
                        label="Payment Terms"
                        value={displayValue(licensee.paymentTerms)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Section 3 data not available or no licensees added.
          </p>
        )}

        {/* SECTION 4 */}
        {sectionFourData.length > 0 ? (
          <SectionCard
            title={`Section 4: Deployment Details (${sectionFourData.length})`}
            icon={<DeploymentIcon />}
            editRoute="/sectionFour"
          >
            <div className="space-y-5">
              {sectionFourData.map((deployment, index) => (
                <div
                  key={deployment.id || index}
                  className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 shadow-sm"
                >
                  <h3 className="text-sm sm:text-lg font-semibold text-rose-800 mb-3">
                    {index + 1}. {deployment.clientName}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                    <DetailItem
                      label="City"
                      value={displayValue(deployment.city)}
                    />
                    <DetailItem
                      label="Country"
                      value={getCountryLabel(deployment.country)}
                    />
                    <DetailItem
                      label="Nodal Contact"
                      value={displayValue(deployment.nodalContactPerson)}
                    />
                    <div className="md:col-span-2 lg:col-span-3">
                      <DetailItem
                        label="Address"
                        value={displayValue(deployment.clientAddress)}
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <DetailItem
                        label="Deployment Details"
                        value={
                          <p className="whitespace-pre-wrap">
                            {displayValue(deployment.deploymentDetails)}
                          </p>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Section 4 data not available or no deployments added.
          </p>
        )}
      </div>
    </div>

    <FileViewerModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      fileUrl={fileToView}
    />
    <FooterBar />
  </>
  );
};

export default TechnologyDetails;