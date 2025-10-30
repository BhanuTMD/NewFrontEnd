import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import Swal for consistency (though not used currently)
import NavBar from "Components/common/navBar"; // Import NavBar
import FooterBar from "Components/common/footer"; // Import FooterBar

const ViewTechnology = () => {
    const [techList, setTechList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(""); // Keep error state

    useEffect(() => {
        const fetchTechnologies = async () => {
            setLoading(true);
            setError(""); // Reset error on fetch start
            try {
                const token = localStorage.getItem("token"); // Get token if needed for auth

                const res = await axios.get("http://172.16.2.246:8080/api/section-one/technologies", {
                    headers: { Authorization: `Bearer ${token}` }, // Add auth header
                });

                // Assuming response structure is { content: [...] } for pagination
                if (res.data && Array.isArray(res.data.content)) {
                    setTechList(res.data.content);
                // Check if response is a simple array (non-paginated)
                } else if (Array.isArray(res.data)) {
                    setTechList(res.data);
                }
                else {
                    console.error("Fetched data is not in the expected format (array or {content: array}):", res.data);
                    setTechList([]); // Set empty on format error
                    setError("Received unexpected data format from server."); // Set error message
                }

            } catch (err) {
                console.error("Error fetching technologies:", err);
                setError("Failed to load technology data. Please try again later."); // Set user-friendly error
                setTechList([]); // Ensure list is empty on error
            } finally {
                setLoading(false);
            }
        };
        fetchTechnologies();
    }, []); // Empty dependency array means run once on mount

    return (
        <> {/* Use Fragment to wrap NavBar, content, and FooterBar */}
            <NavBar />
            <div className="min-h-screen bg-gray-50 flex flex-col"> {/* Use flex-col for footer placement */}
                {/* Main Table Content */}
                <main className="flex-grow p-6 max-w-7xl mx-auto w-full"> {/* Use main tag and flex-grow */}
                    <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <h2 className="text-center text-2xl font-bold text-indigo-700 mb-5 border-b pb-3">
                            All Technologies
                        </h2>

                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <p className="text-center text-gray-600 animate-pulse">Loading...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-10 text-red-600 bg-red-50 rounded border border-red-200">
                                <p>{error}</p>
                            </div>
                        ) : techList.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                               <p>No technology data available.</p>
                             </div>
                        ) : (
                            <div className="overflow-x-auto"> {/* Ensure table scrolls horizontally if needed */}
                                <table className="min-w-full divide-y divide-gray-200 text-sm"> {/* Improved structure and text size */}
                                    <thead className="bg-gray-50"> {/* Removed sticky header for simplicity, re-add if needed with height constraints */}
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TRN No</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technology Name</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Lab</th> {/* Changed header */}
                                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {techList.map((item) => (
                                            <tr
                                                key={item.technologyRefNo} // Ensure this key is unique and correct
                                                className="hover:bg-gray-50 transition duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                                    {item.technologyRefNo || "N/A"}
                                                </td>
                                                {/* Correct field name based on JSON */}
                                                <td className="px-6 py-4 whitespace-normal text-gray-700"> {/* Allow wrapping for long names */}
                                                    {item.technologyName || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    {/* Handle theme if it's an array or string */}
                                                    {Array.isArray(item.theme)
                                                        ? item.theme.join(", ")
                                                        : item.theme || "N/A"}
                                                </td>
                                                {/* Correct field name based on JSON */}
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.lab || "N/A"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <Link
                                                        // Link to the detailed view page, passing TRN in the URL
                                                        to={`/technology/${item.technologyRefNo}`}
                                                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" // Consistent button style
                                                    >
                                                        View Details
                                                    </Link>
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
            <FooterBar /> {/* Render FooterBar */}
        </>
    );
};

export default ViewTechnology;

