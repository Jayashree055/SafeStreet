import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../App.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import jsPDF from "jspdf";

const BACKEND_URL = "http://localhost:8000";

const DamageReports = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter") || "all";
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/reports`);
      setReports(res.data);
      applyFilter(res.data, filter);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, seen: true } : report
      )
    );
  };

  const generatePDF = (report) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("SafeStreet Damage Report Summary", 20, 20);

    doc.setFontSize(12);
    doc.text(`Location: ${report.location}`, 20, 40);
    doc.text(`Summary: ${report.summary}`, 20, 50);
    doc.text(`Status: ${report.status}`, 20, 60);
    doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 70);

    const summaryText = `This report highlights damage at ${report.location}. Summary: ${report.summary}. Status: ${report.status}.`;

    doc.text("Details:", 20, 90);
    doc.text(doc.splitTextToSize(summaryText, 170), 20, 100);
    doc.save(`Damage_Report_${report._id}.pdf`);

    markAsSeen(report._id);
  };

  const sendStatusEmail = async (report, action) => {
    try {
      const supervisorEmail = report.supervisorEmail || "sravanijanak@gmail.com";
      const newStatus = action === "reject" ? "Ignored" : "Accepted";

      // Persist status and seen = true in backend
      await axios.post(`${BACKEND_URL}/api/update-report-status`, {
        reportId: report._id,
        status: newStatus,
        seen: true
      });

      // Update local state
      setReports((prevReports) =>
        prevReports.map((r) =>
          r._id === report._id ? { ...r, status: newStatus, seen: true } : r
        )
      );

      // Send email
      await axios.post(`${BACKEND_URL}/api/send-email`, {
        to: supervisorEmail,
        subject: `Damage Report - ${report.location} - ${newStatus.toUpperCase()}`,
        text: `
         Dear Supervisor,
          
          The following action has been taken for the damage report:
          
          Location: ${report.location}
          Summary: ${report.summary}
          Status: ${action === "accept" ? "Accepted" : "Rejected"}
          Date: ${new Date(report.date).toLocaleDateString()}
          
          Action Taken: The report has been ${action === "accept" ? "accepted for further processing" : "ignored for now"}.
          
          Thank you.
        `,
      });

      alert(`✅ Report ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating report.");
    }
  };

  const applyFilter = (allReports, activeFilter) => {
    let filtered;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Filter reports based on the selected filter
    if (activeFilter === "pending") {
      filtered = allReports.filter(
        (report) => report.status?.toLowerCase() === "pending" && !report.seen
      );
    } else if (activeFilter === "resolved") {
      filtered = allReports.filter((report) => report.status?.toLowerCase() === "resolved");
    }else if (activeFilter === "accept") {
      filtered = allReports.filter((report) => report.status?.toLowerCase() === "accepted");
    } else if (activeFilter === "ignored") {
      filtered = allReports.filter(
        (report) =>
          report.status?.toLowerCase() === "ignored" || report.status?.toLowerCase() === "rejected"
      );
    } else if (activeFilter === "critical") {
      filtered = allReports.filter(
        (report) =>
          report.summary?.toLowerCase().includes("critical") || report.severity === "High"
      );
    } else if (activeFilter === "new") {
      filtered = allReports.filter(
        (report) =>
          new Date(report.date) >= sevenDaysAgo &&
          report.status?.toLowerCase() === "pending" &&
          !report.seen
      );
    } else {
      filtered = allReports;
    }

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    applyFilter(reports, filter);
  }, [filter, reports, searchQuery]); // Add searchQuery to dependencies

  return (
    <div className="damage-reports-container">
      <h1 className="damage-reports-header">Damage Reports</h1>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by location or summary..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
        />
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <div className="damage-reports-content">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Summary</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, index) => {
                const statusLower = report.status?.toLowerCase();
                const isResolved = statusLower === "resolved";

                return (
                  <tr key={report._id || index}>
                    <td>{index + 1}</td>
                    <td>{report.location}</td>
                    <td>{report.damageType || report.summary}</td>
                    <td
                      className={
                        report.severity === "High"
                          ? "high-severity"
                          : report.severity === "Medium"
                          ? "medium-severity"
                          : "low-severity"
                      }
                    >
                      {report.severity || "Low"}
                    </td>
                    <td>
                      {report.status}
                      {!report.seen && !isResolved && !["accepted", "ignored"].includes(statusLower) && (
                        <span className="new-badge">New</span>
                      )}
                    </td>
                    <td>{new Date(report.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => generatePDF(report)}
                        className="action-button download-pdf-button"
                        style={{ marginBottom: "10px", width: "170px" }}
                      >
                        Download Summary
                      </button>
                      {!isResolved && (
                        <>
                          <button
                            onClick={() => sendStatusEmail(report, "accept")}
                            className="action-button accept-button"
                            style={{ marginBottom: "10px", width: "170px" }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => sendStatusEmail(report, "reject")}
                            className="action-button reject-button"
                            style={{ marginBottom: "10px", width: "170px" }}
                          >
                            Ignore
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredReports.length === 0 && (
            <p>No reports found for the selected filter or search criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DamageReports;





// implement search in header

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation } from "react-router-dom";
// import "../App.css";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import jsPDF from "jspdf";

// const BACKEND_URL = "http://localhost:8000";

// const DamageReports = () => {
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const filter = queryParams.get("filter") || "all";
//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(""); // New state for search query

//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${BACKEND_URL}/api/reports`);
//       setReports(res.data);
//       applyFilter(res.data, filter);
//     } catch (error) {
//       console.error("Failed to fetch reports:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsSeen = (reportId) => {
//     setReports((prevReports) =>
//       prevReports.map((report) =>
//         report._id === reportId ? { ...report, seen: true } : report
//       )
//     );
//   };

//   const generatePDF = (report) => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text("SafeStreet Damage Report Summary", 20, 20);

//     doc.setFontSize(12);
//     doc.text(`Location: ${report.location}`, 20, 40);
//     doc.text(`Summary: ${report.summary}`, 20, 50);
//     doc.text(`Status: ${report.status}`, 20, 60);
//     doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 70);

//     const summaryText = `This report highlights damage at ${report.location}. Summary: ${report.summary}. Status: ${report.status}.`;

//     doc.text("Details:", 20, 90);
//     doc.text(doc.splitTextToSize(summaryText, 170), 20, 100);
//     doc.save(`Damage_Report_${report._id}.pdf`);

//     markAsSeen(report._id);
//   };

//   const sendStatusEmail = async (report, action) => {
//     try {
//       const supervisorEmail = report.supervisorEmail || "sravanijanak@gmail.com";
//       const newStatus = action === "reject" ? "Ignored" : "Accepted";

//       // Persist status and seen = true in backend
//       await axios.post(`${BACKEND_URL}/api/update-report-status`, {
//         reportId: report._id,
//         status: newStatus,
//         seen: true
//       });

//       // Update local state
//       setReports((prevReports) =>
//         prevReports.map((r) =>
//           r._id === report._id ? { ...r, status: newStatus, seen: true } : r
//         )
//       );

//       // Send email
//       await axios.post(`${BACKEND_URL}/api/send-email`, {
//         to: supervisorEmail,
//         subject: `Damage Report - ${report.location} - ${newStatus.toUpperCase()}`,
//         text: `The report at ${report.location} has been marked as ${newStatus}.`,
//       });

//       alert(`✅ Report ${newStatus} successfully!`);
//     } catch (error) {
//       console.error("Error updating status:", error);
//       alert("Error updating report.");
//     }
//   };

//   const applyFilter = (allReports, activeFilter) => {
//     let filtered;
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     // Filter reports based on the selected filter
//     if (activeFilter === "pending") {
//       filtered = allReports.filter(
//         (report) => report.status?.toLowerCase() === "pending" && !report.seen
//       );
//     } else if (activeFilter === "resolved") {
//       filtered = allReports.filter((report) => report.status?.toLowerCase() === "resolved");
//     } else if (activeFilter === "ignored") {
//       filtered = allReports.filter(
//         (report) =>
//           report.status?.toLowerCase() === "ignored" || report.status?.toLowerCase() === "rejected"
//       );
//     } else if (activeFilter === "critical") {
//       filtered = allReports.filter(
//         (report) =>
//           report.summary?.toLowerCase().includes("critical") || report.severity === "High"
//       );
//     } else if (activeFilter === "new") {
//       filtered = allReports.filter(
//         (report) =>
//           new Date(report.date) >= sevenDaysAgo &&
//           report.status?.toLowerCase() === "pending" &&
//           !report.seen
//       );
//     } else {
//       filtered = allReports;
//     }

//     // Apply search query filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (report) =>
//           report.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           report.summary.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredReports(filtered);
//   };

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   useEffect(() => {
//     applyFilter(reports, filter);
//   }, [filter, reports, searchQuery]); // Add searchQuery to dependencies

//   return (
//     <div className="damage-reports-container">
//       <h1 className="damage-reports-header">Damage Reports</h1>

//       {/* Search bar */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search by location or summary..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state
//         />
//       </div>

//       {loading ? (
//         <p>Loading reports...</p>
//       ) : (
//         <div className="damage-reports-content">
//           <table>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Location</th>
//                 <th>Summary</th>
//                 <th>Severity</th>
//                 <th>Status</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredReports.map((report, index) => {
//                 const statusLower = report.status?.toLowerCase();
//                 const isResolved = statusLower === "resolved";

//                 return (
//                   <tr key={report._id || index}>
//                     <td>{index + 1}</td>
//                     <td>{report.location}</td>
//                     <td>{report.damageType || report.summary}</td>
//                     <td
//                       className={
//                         report.severity === "High"
//                           ? "high-severity"
//                           : report.severity === "Medium"
//                           ? "medium-severity"
//                           : "low-severity"
//                       }
//                     >
//                       {report.severity || "Medium"}
//                     </td>
//                     <td>
//                       {report.status}
//                       {!report.seen && !isResolved && !["accepted", "ignored"].includes(statusLower) && (
//                         <span className="new-badge">New</span>
//                       )}
//                     </td>
//                     <td>{new Date(report.date).toLocaleDateString()}</td>
//                     <td>
//                       <button
//                         onClick={() => generatePDF(report)}
//                         className="action-button download-pdf-button"
//                         style={{ marginBottom: "10px", width: "170px" }}
//                       >
//                         Download Summary
//                       </button>
//                       {!isResolved && (
//                         <>
//                           <button
//                             onClick={() => sendStatusEmail(report, "accept")}
//                             className="action-button accept-button"
//                             style={{ marginBottom: "10px", width: "170px" }}
//                           >
//                             Accept
//                           </button>
//                           <button
//                             onClick={() => sendStatusEmail(report, "reject")}
//                             className="action-button reject-button"
//                             style={{ marginBottom: "10px", width: "170px" }}
//                           >
//                             Ignore
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           {filteredReports.length === 0 && (
//             <p>No reports found for the selected filter or search criteria.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DamageReports;
