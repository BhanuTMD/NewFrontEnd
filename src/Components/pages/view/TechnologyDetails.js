import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import FileViewerModal from "./FileViewerModal"; // Import the modal component
// Import helper if needed for formatting specific data
import { countryOptions } from "Components/data/country"; 
// To map country codes back to labels if needed
import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";

const TechnologyDetails = () => {
    const { trnNo } = useParams();
    const navigate = useNavigate(); // Initialize navigate
    const [sectionOneData, setSectionOneData] = useState(null);
    const [sectionTwoData, setSectionTwoData] = useState(null); // Added state for Section 2
    const [sectionThreeData, setSectionThreeData] = useState([]); // State for Section 3 (list)
    const [sectionFourData, setSectionFourData] = useState([]);  // Added state for Section 4 (list)
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileToView, setFileToView] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch all sections concurrently
                const [res1, res2, res3, res4] = await Promise.all([
                    axios.get(`http://172.16.2.246:8080/api/section-one/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 1:", err); return { data: null }; }), // Default to null on error
                    axios.get(`http://172.16.2.246:8080/api/section-two/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 2:", err); return { data: null }; }), // Default to null
                    axios.get(`http://172.16.2.246:8080/api/section-three/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 3:", err); return { data: [] }; }), // Default to empty array
                    axios.get(`http://172.16.2.246:8080/api/section-four/${trnNo}`, { headers }).catch(err => { console.error("Error fetching Section 4:", err); return { data: [] }; }), // Default to empty array
                ]);

                setSectionOneData(res1.data);
                setSectionTwoData(res2.data);
                setSectionThreeData(Array.isArray(res3.data) ? res3.data : []); // Ensure it's an array
                setSectionFourData(Array.isArray(res4.data) ? res4.data : []);   // Ensure it's an array

                // Set file URL if available in Section 1 data
                if (res1.data && res1.data.fileUrl) {
                    setExistingFileUrl(res1.data.fileUrl);
                }

            } catch (error) {
                // This catch might be less likely if individual catches handle errors
                console.error("General error fetching technology details:", error);
                // Optionally set an error state here
            } finally {
                setLoading(false); // Stop loading after all fetches are attempted
            }
        };

        if (trnNo) {
            fetchAllData();
        } else {
            setLoading(false); // Stop loading if no TRN
        }
    }, [trnNo]); // Dependency is just trnNo

    // State for existing file URL (extracted from sectionOneData)
    const [existingFileUrl, setExistingFileUrl] = useState('');

    // Update the view handler to open the modal
    const handleViewFile = () => {
        if (existingFileUrl) { // Use state variable
            // Assuming the backend path convention requires replacing download with view
            const viewUrl = existingFileUrl.replace('/download/', '/section-one/view/');
            setFileToView(viewUrl);
            setIsModalOpen(true);
        } else {
            console.warn("No file URL found in data");
            alert("File URL is missing, cannot view the file.");
        }
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            // Check if it's already a Date object (might happen if data isn't stringified)
            if (dateString instanceof Date && !isNaN(dateString)) {
                return dateString.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
            // Attempt to parse string
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) { // Check if parsing was successful
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            }
            return dateString; // Return original if parsing fails
        } catch (e) {
            console.error("Date formatting error:", e);
            return dateString; // Return original string if formatting fails
        }
    };

    // Helper to display arrays or single values nicely
    const displayValue = (value) => {
        if (value === null || value === undefined) return "N/A";
        if (Array.isArray(value)) {
            return value.length > 0 ? value.join(", ") : "None";
        }
        if (typeof value === 'boolean') return value ? "Yes" : "No";
        return String(value); // Default to string conversion
    };

    // Helper to find country label from value
    const getCountryLabel = (value) => {
        const option = countryOptions.find(opt => opt.value === value);
        return option ? option.label : value || "N/A"; // Return label or original value/N/A
    };

    // --- New Edit Handler ---
    // Navigates to the specified route, passing the trnNo in the state
    const handleEdit = (route) => {
        navigate(route, {
            state: { technologyRefNo: trnNo },
        });
    };
    // --- End of New Edit Handler ---

    if (loading) return <p className="text-center mt-6 text-gray-600">Loading technology details...</p>;
    // Check if at least Section 1 data loaded, otherwise show error
    if (!sectionOneData && !loading) return <p className="text-center mt-6 text-red-500">Could not load core details for TRN: {trnNo}</p>;

    return (
        <>
            {/* Print Styles */}
            <style>
                {`
                @media print {
                    .no-print { display: none !important; }
                    body { font-size: 12px; }
                    .print-break { page-break-before: always; }
                }
                `}
            </style>
            <NavBar className="no-print" /> {/* Hide NavBar on print */}
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Back Button and Print Button */}
                <div className="flex justify-between items-center mb-4 no-print">
                    <Link to="/ViewTechnology" className="text-indigo-600 hover:underline inline-block text-sm">
                        ← Back to All Technologies
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Print Details
                    </button>
                </div>

                {/* Main content card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
                    {/* Section 1 Data */}
                    {sectionOneData ? (
                        <>
                            {/* --- Updated Section 1 Header --- */}
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {sectionOneData.nameTechnology || "Technology Details"}
                                </h1>
                                <button
                                    onClick={() => handleEdit("/sectionOne")}
                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 no-print"
                                >
                                    Edit Section 1
                                </button>
                            </div>
                            {/* --- End of Updated Header --- */}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700 mb-6">
                                <p><strong>Technology Ref No:</strong> <span className="text-gray-900">{displayValue(sectionOneData.technologyRefNo)}</span></p>
                                <p><strong>Lead Laboratory:</strong> <span className="text-gray-900">{displayValue(sectionOneData.leadLaboratory)}</span></p>
                                <p><strong>Year of Development:</strong> <span className="text-gray-900">{displayValue(sectionOneData.yearDevelopment)}</span></p>
                                <p><strong>Technology Level (TRL):</strong> <span className="text-gray-900">{displayValue(sectionOneData.technologyLevel)}</span></p>
                                <p><strong>Scale of Development:</strong> <span className="text-gray-900">{displayValue(sectionOneData.scaleDevelopment)}</span></p>
                                <p><strong>Multi Lab/Institute:</strong> <span className="text-gray-900">{displayValue(sectionOneData.multiLabInstitute)}</span></p>
                                {/* Conditional display for associated labs */}
                                {sectionOneData.multiLabInstitute === 'Yes' && <p className="md:col-span-2"><strong>Associate Institute:</strong> <span className="text-gray-900">{displayValue(sectionOneData.lab)}</span></p>}
                                <p className="md:col-span-2"><strong>Theme(s):</strong> <span className="text-gray-900">{displayValue(sectionOneData.theme)}</span></p>
                                <p className="md:col-span-2"><strong>Industrial Sector(s):</strong> <span className="text-gray-900">{displayValue(sectionOneData.industrialSector)}</span></p>
                                <p className="md:col-span-2"><strong>Keyword(s):</strong> <span className="text-gray-900">{displayValue(sectionOneData.keywordTechnology)}</span></p>
                                <p className="md:col-span-2"><strong>Potential Application Areas:</strong> <span className="text-gray-900">{displayValue(sectionOneData.potentialApplicationAreas)}</span></p>
                                <p className="md:col-span-2"><strong>Potential Ministries:</strong> <span className="text-gray-900">{displayValue(sectionOneData.potentialMinistries)}</span></p>
                                <p className="md:col-span-2"><strong>Laboratory Contact Detail:</strong> <span className="text-gray-900">{displayValue(sectionOneData.laboratoryDetail)}</span></p>
                                <p><strong>Submitted By:</strong> <span className="text-gray-900">{displayValue(sectionOneData.submittedByEmail)}</span></p>
                            </div>

                            <div className="mt-6 space-y-2">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Brief Description</h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{displayValue(sectionOneData.briefTech)}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Competitive Positioning</h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{displayValue(sectionOneData.competitivePosition)}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Techno-economics</h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{displayValue(sectionOneData.technoEconomics)}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Environmental / Statutory Compliance</h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{displayValue(sectionOneData.environmentalStatutory)}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Market Potential</h2>
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{displayValue(sectionOneData.marketPotential)}</p>
                            </div>

                            {/* File View Button */}
                            {existingFileUrl ? (
                                <div className="mt-6 flex gap-3 no-print">
                                <button
                                    onClick={handleViewFile}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm flex items-center gap-1 shadow"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"></path></svg>
                                    View Associated File
                                </button>
                                </div>
                            ) : (
                                <p className="mt-6 text-sm text-gray-500 italic">No associated file uploaded for Section 1.</p>
                            )}
                        </>
                    ) : (
                        // Render a placeholder or message if section 1 failed but others might load
                        <h1 className="text-2xl font-bold text-red-600 mb-4 border-b pb-2">
                            Core Technology Details Unavailable (TRN: {trnNo})
                        </h1>
                    )}

                    {/* --- Section 2: Team Details --- */}
                    {sectionTwoData ? (
                        <div className="mt-6 pt-6 border-t border-gray-200 print-break">
                            {/* --- Updated Section 2 Header --- */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Section 2: Team Details
                                </h2>
                                <button
                                    onClick={() => handleEdit("/sectionTwo")}
                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 no-print"
                                >
                                    Edit Section 2
                                </button>
                            </div>
                            {/* --- End of Updated Header --- */}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
                                <p className="md:col-span-2"><strong>Principal Investigator:</strong> <span className="text-gray-900">{displayValue(sectionTwoData.principalInvestigatorName)}</span></p>
                                <p><strong>Designation:</strong> <span className="text-gray-900">{displayValue(sectionTwoData.designation)}</span></p>
                                <p><strong>Group/Division:</strong> <span className="text-gray-900">{displayValue(sectionTwoData.groupDivision)}</span></p>
                                <p className="md:col-span-2"><strong>Institute/Lab:</strong> <span className="text-gray-900">{displayValue(sectionTwoData.instituteLab)}</span></p>
                                {/* Add other Section 2 fields here using displayValue */}
                            </div>
                        </div>
                    ) : (
                        <p className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500 italic">Section 2 data not available.</p>
                    )}

                    {/* --- Section 3: Licensee Details --- */}
                    {sectionThreeData.length > 0 ? (
                        <div className="mt-6 pt-6 border-t border-gray-200 print-break">
                            {/* --- Updated Section 3 Header --- */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Section 3: Licensee Details ({sectionThreeData.length})
                                </h2>
                                <button
                                    onClick={() => handleEdit("/sectionThree")}
                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 no-print"
                                >
                                    Edit Section 3
                                </button>
                            </div>
                            {/* --- End of Updated Header --- */}
                            
                            <div className="space-y-4">
                                {sectionThreeData.map((licensee, index) => (
                                    <div key={licensee.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                                        <h3 className="text-lg font-semibold text-indigo-700">{index + 1}. {licensee.licenseName}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm">
                                            <p><strong>Type:</strong> <span className="text-gray-800">{displayValue(licensee.typeOfLicense)}</span></p>
                                            <p><strong>Geography:</strong> <span className="text-gray-800">{displayValue(licensee.staRegionalGeography)}</span></p>
                                                                                        <p><strong>Agreement Date:</strong> <span className="text-gray-800">{formatDate(licensee.dateOfAgreementSigning)}</span></p>
                                            <p><strong>License Date:</strong> <span className="text-gray-800">{formatDate(licensee.dateOfLicense)}</span></p>
                                            <p><strong>Valid Until:</strong> <span className="text-gray-800">{formatDate(licensee.licenseValidUntil)}</span></p>
                                            <p><strong>Email:</strong> <span className="text-gray-800">{displayValue(licensee.email)}</span></p>
                                            <p><strong>Contact:</strong> <span className="text-gray-800">{displayValue(licensee.contact)}</span></p>
                                            <p className="md:col-span-2"><strong>Address:</strong> <span className="text-gray-800">{displayValue(licensee.address)}</span></p>
                                            <p className="md:col-span-2"><strong>Exclusivity Details:</strong> <span className="text-gray-800">{displayValue(licensee.detailsOfExclusivity)}</span></p>
                                            <p className="md:col-span-2"><strong>Payment Terms:</strong> <span className="text-gray-800">{displayValue(licensee.paymentTerms)}</span></p>
                                            <p className="md:col-span-2"><strong>Total License Fee:</strong> <span className="font-medium text-green-700 text-base">{licensee.totalLicenseFee?.toFixed(2) || '0.00'} INR</span></p>
                                            {/* Optionally display Royalty/Premia details if needed */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <p className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500 italic">Section 3 data not available or no licensees added.</p>
                    )}

                    {/* --- Section 4: Deployment Details --- */}
                    {sectionFourData.length > 0 ? (
                        <div className="mt-6 pt-6 border-t border-gray-200 print-break">
                            {/* --- Updated Section 4 Header --- */}
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Section 4: Deployment Details ({sectionFourData.length})
                                </h2>
                                <button
                                    onClick={() => handleEdit("/sectionFour")}
                                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition duration-150 ease-in-out text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 no-print"
                                >
                                    Edit Section 4
                                </button>
                            </div>
                            {/* --- End of Updated Header --- */}
                            
                            <div className="space-y-4">
                                {sectionFourData.map((deployment, index) => (
                                    <div key={deployment.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                                        <h3 className="text-lg font-semibold text-indigo-700">{index + 1}. {deployment.clientName}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm">
                                            <p><strong>City:</strong> <span className="text-gray-800">{displayValue(deployment.city)}</span></p>
                                            {/* Use helper to find country label */}
                                            <p><strong>Country:</strong> <span className="text-gray-800">{getCountryLabel(deployment.country)}</span></p>
                                            <p className="md:col-span-2"><strong>Address:</strong> <span className="text-gray-800">{displayValue(deployment.clientAddress)}</span></p>
                                            <p className="md:col-span-2"><strong>Nodal Contact:</strong> <span className="text-gray-800">{displayValue(deployment.nodalContactPerson)}</span></p>
                                            <p className="md:col-span-2"><strong>Deployment Details:</strong> <span className="text-gray-800 whitespace-pre-wrap">{displayValue(deployment.deploymentDetails)}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                         <p className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500 italic">Section 4 data not available or no deployments added.</p>
                    )}

                </div>
            </div>

            {/* Render the modal component */}
            <FileViewerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fileUrl={fileToView}
            />
             <FooterBar /> {/* Assuming FooterBar is needed */}
        </>
    );
};

export default TechnologyDetails;