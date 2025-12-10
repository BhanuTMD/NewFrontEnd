// export default SectionTwo;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import NavBar from "Components/common/navBar";
import FooterBar from "Components/common/footer";
import Section from "Components/common/section";
import { countryOptions } from "Components/data/country";

import { FileSearch, SaveAll, ArrowLeft, ArrowRight } from "lucide-react";

const SectionTwo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const technologyRefNo = location.state?.technologyRefNo || "";

  const [csirRegistrationNumber, setCsirRegistrationNumber] = useState("");
  const [iprEntries, setIprEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!technologyRefNo) {
      Swal.fire(
        "Missing Reference",
        "Technology Reference Number not provided.",
        "error"
      );
      navigate("/sectionOne");
    }
  }, [technologyRefNo, navigate]);

  const handleFetchData = () => {
    if (!csirRegistrationNumber.trim()) {
      Swal.fire("Error", "Please enter CSIR-Registration Number.", "error");
      return;
    }
    setLoading(true);

    axios
      .get(
        `http://172.16.2.246:8080/api/section-two/fetch/${csirRegistrationNumber}`
      )
      .then((response) => {
        const formattedData = response.data.map((ipr) => ({
          ...ipr,
          statusDate: ipr.statusDate ? new Date(ipr.statusDate) : null,
          country: (ipr.country || [])
            .map((c) => countryOptions.find((opt) => opt.value === c))
            .filter(Boolean),
        }));
        setIprEntries(formattedData);
        Swal.fire("Success!", "IPR data fetched successfully!", "success");
      })
      .catch((error) => {
        console.error("Error fetching IPR data:", error);
        if (error.response?.status === 404) {
          setIprEntries([]);
          Swal.fire(
            "No Data",
            "No IPR data found for this CSIR-Registration Number.",
            "info"
          );
        } else {
          Swal.fire("Error", "Could not fetch IPR data.", "error");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSubmitAll = () => {
    if (iprEntries.length === 0) {
      Swal.fire("No Data", "No IPR entries to save.", "warning");
      return;
    }

    const payload = iprEntries.map((entry) => ({
      ...entry,
      technologyRefNo: technologyRefNo,
      statusDate:
        entry.statusDate instanceof Date
          ? entry.statusDate.toISOString().split("T")[0]
          : null,
      country: (entry.country || []).map((c) => c.value),
    }));

    axios
      .post(
        `http://172.16.2.246:8080/api/section-two/save/${technologyRefNo}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        Swal.fire("Success!", "IPR entries saved successfully!", "success");
        const formattedResponse = response.data.map((ipr) => ({
          ...ipr,
          statusDate: ipr.statusDate ? new Date(ipr.statusDate) : null,
          country: (ipr.country || [])
            .map((c) => countryOptions.find((opt) => opt.value === c))
            .filter(Boolean),
        }));
        setIprEntries(formattedResponse);
      })
      .catch((error) => {
        console.error("Save error:", error.response?.data || error.message);
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Form submission failed.",
          "error"
        );
      });
  };

  return (
    <>
      <NavBar />

      <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-orange-50 to-sky-200">
        {/* Soft blobs background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-300/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen">
          {/* Left main content */}
          <div className="w-full md:w-3/4">
            <div className="ml-0 md:ml-60 mr-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
              {/* Section heading (you can keep your Section component or this custom header) */}
              <div className="mb-5 md:mb-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 border border-indigo-400/40 text-[11px] font-medium text-indigo-700 uppercase tracking-[0.2em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Section 2
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                    IPR Status
                  </h1>
                </div>
                <p className="mt-1 text-xs md:text-sm text-slate-600">
                  Fetch and save Intellectual Property details linked with this
                  technology.
                </p>
              </div>

              {/* Optional: your original Section component (if you still want the line style) */}
              {/* <Section sectionLine="Section 2 : IPR Status" /> */}

              {/* Card */}
              <div className="space-y-6 rounded-2xl border border-slate-100/70 bg-white/95 shadow-2xl px-4 py-5 md:px-8 md:py-7">
                {/* Technology Ref No */}
                <div className="mb-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-800">
                    Technology Ref No
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm md:text-base text-slate-600 cursor-not-allowed"
                    value={
                      technologyRefNo || "Not provided / navigate from Section 1"
                    }
                  />
                </div>

                {/* CSIR-Registration Number + Fetch button */}
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="mb-1 block text-sm font-semibold text-slate-800">
                      CSIR-Registration Number{" "}
                      <span className="text-xs font-normal text-slate-500">
                        (NF number provided by IPU)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={csirRegistrationNumber}
                      onChange={(e) =>
                        setCsirRegistrationNumber(e.target.value)
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm md:text-base outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400"
                      placeholder="Enter CSIR-Registration Number"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchData}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-400/40 hover:bg-indigo-700 disabled:bg-indigo-400 mt-1 md:mt-0"
                  >
                    <FileSearch className="h-4 w-4" />
                    {loading ? "Fetching..." : "Fetch Data"}
                  </button>
                </div>

                {/* IPR Entries Table */}
                {iprEntries.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base md:text-lg font-semibold text-indigo-800">
                        IPR Entries ({iprEntries.length})
                      </h3>
                      <span className="text-xs text-slate-500">
                        Data linked to CSIR Reg. No. above
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/80">
                      <table className="min-w-full table-auto border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-100/90 text-slate-800">
                            <th className="border-b border-slate-200 px-4 py-2 text-left text-xs font-semibold">
                              IPR Type
                            </th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left text-xs font-semibold">
                              Registration No.
                            </th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left text-xs font-semibold">
                              Status
                            </th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left text-xs font-semibold">
                              Status Date
                            </th>
                            <th className="border-b border-slate-200 px-4 py-2 text-left text-xs font-semibold">
                              Country
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {iprEntries.map((ipr, index) => (
                            <tr
                              key={ipr.id || `temp-${index}`}
                              className="odd:bg-white even:bg-slate-50 hover:bg-indigo-50/60 transition-colors"
                            >
                              <td className="px-4 py-2 align-top text-xs md:text-sm text-slate-800">
                                {ipr.iprType}
                              </td>
                              <td className="px-4 py-2 align-top text-xs md:text-sm text-slate-800">
                                {ipr.registrationNo}
                              </td>
                              <td className="px-4 py-2 align-top text-xs md:text-sm text-slate-800">
                                {ipr.status}
                              </td>
                              <td className="px-4 py-2 align-top text-xs md:text-sm text-slate-800">
                                {ipr.statusDate
                                  ? ipr.statusDate.toLocaleDateString("en-GB")
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-2 align-top text-xs md:text-sm text-slate-800">
                                {(ipr.country || [])
                                  .map((c) => c.label)
                                  .join(", ")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* If no data after fetch */}
                {iprEntries.length === 0 && !loading && (
                  <p className="mt-4 text-xs md:text-sm text-slate-500">
                    No IPR entries loaded yet. Fetch using a valid CSIR-Registration
                    Number.
                  </p>
                )}

                {/* Main Navigation Buttons */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mt-8 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/sectionOne/${technologyRefNo}`)
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-slate-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-slate-700 shadow-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous (Section 1)
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitAll}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-emerald-600 shadow-md shadow-emerald-400/40 disabled:bg-emerald-300"
                    disabled={iprEntries.length === 0}
                  >
                    <SaveAll className="h-4 w-4" />
                    Save All Section 2 Changes
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/sectionThree", { state: { technologyRefNo } })
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs md:text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm"
                  >
                    Next (Section 3)
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right info panel like Section 1 */}
          <div className="hidden md:flex md:w-1/4 items-start justify-center pr-6 py-10">
            <div className="w-full max-w-xs rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-xl px-5 py-6 space-y-4 text-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center text-white">
                  <FileSearch className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                    Section 2 Guide
                  </p>
                  <p className="text-sm font-medium">IPR Status Overview</p>
                </div>
              </div>

              <p className="text-xs text-slate-700">
                Use the CSIR-Registration Number to auto-fetch IPR records
                already captured in the IPU database, then link them to this
                technology reference.
              </p>

              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li>• Ensure NF number is correct before fetching.</li>
                <li>• Check country and status date carefully.</li>
                <li>• Save IPR details before moving to Section 3.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterBar />
    </>
  );
};

export default SectionTwo;
