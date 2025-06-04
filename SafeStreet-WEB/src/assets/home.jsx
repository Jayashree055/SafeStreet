import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { TbReportSearch } from "react-icons/tb";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import { AiFillAlert } from "react-icons/ai";
import { SlCalender } from "react-icons/sl";
import { BsEyeSlash } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { AiOutlineCheckCircle } from "react-icons/ai";
import "react-datepicker/dist/react-datepicker.css";


const BACKEND_URL = "http://localhost:8000";

const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [severityData, setSeverityData] = useState([]);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/reports`);
        setReports(res.data);
        generateSeverityData(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "critical"
        ? report.summary?.toLowerCase().includes("critical")
        : report.status?.toLowerCase() === statusFilter);
    const reportDate = new Date(report.date);
    const dateMatch =
      (!startDate || reportDate >= startDate) &&
      (!endDate || reportDate <= endDate);
    return statusMatch && dateMatch;
  });

  const total = filteredReports.length;
  const pending = filteredReports.filter(r => r.status?.toLowerCase() === "pending").length;
  const resolved = filteredReports.filter(r => r.status?.toLowerCase() === "resolved").length;
  const critical = filteredReports.filter(r => r.summary?.toLowerCase().includes("critical")).length;
  const ignored = filteredReports.filter(r => r.status?.toLowerCase() === "rejected" || r.status?.toLowerCase() === "ignored").length;
  const accept = filteredReports.filter(r => r.status?.toLowerCase() === "accepted").length;
  const COLORS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#8884d8"];

  const past7Days = filteredReports.filter(report => {
    const reportDate = new Date(report.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return reportDate >= sevenDaysAgo;
  }).length;

  const damageTypes = filteredReports.reduce((acc, report) => {
    const summary = report.summary?.toLowerCase() || '';
    const type =
      summary.includes("pothole") ? "Potholes" :
      summary.includes("crack") ? "Cracks" :
      summary.includes("surface") ? "Surface Damage" :
      "Other";

    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(damageTypes).map(([damageType, count]) => ({ damageType, count }));

  // Ignored Reports
  const ignoredReports = reports.filter(
    (report) =>
      report.status?.toLowerCase() === "rejected" ||
      report.status?.toLowerCase() === "ignored"
  );


   const accepetReports = reports.filter(
    (report) =>
      report.status?.toLowerCase() === "accepted" ||
      report.status?.toLowerCase() === "approved"
  );
  const ignoredReportsByCategory = ignoredReports.reduce((acc, report) => {
    const summary = report.summary?.toLowerCase() || "";
    const category =
      summary.includes("pothole") ? "Potholes" :
      summary.includes("crack") ? "Cracks" :
      summary.includes("surface") ? "Surface Damage" :
      "Other";

    if (!acc[category]) acc[category] = 0;
    acc[category] += 1;
    return acc;
  }, {});

  // Generate Pie Chart Data for Severity
  const generateSeverityData = (reports) => {
    const severityCounts = reports.reduce((acc, report) => {
      const severity = report.severity || "Low";
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});

    const data = Object.entries(severityCounts).map(([severity, count]) => ({
      name: severity,
      value: count,
    }));

    setSeverityData(data);
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>
      <div
          className="filters"
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            justifyContent: "center", // Center the filters horizontally
            gap: "2rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ marginBottom: "5px", fontWeight: "bold" }}>From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select start date"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label style={{ marginBottom: "5px", fontWeight: "bold" }}>To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select end date"
            />
          </div>
        </div>


      {/* Filter Controls */}
      {/* <div className="filters" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {/* <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="critical">Critical</option>
        </select> */}

        {/* <div>
          <label>From: </label>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
        </div>

        <div>
          <label>To: </label>
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
        </div>
      </div> */} 

      {/* Cards */}
      <div className="main-cards">
        <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=all")}>
            <h3>Total Reports</h3>
            <TbReportSearch className="card_icon" />
          </div>
          <h1>{total}</h1>
        </div>

        <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=pending")}>
            <h3>Pending Reports</h3>
            <FaRegHourglassHalf className="card_icon" />
          </div>
          <h1>{pending}</h1>
        </div>

        <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=resolved")}>
            <h3>Resolved Reports</h3>
            <TiTick className="card_icon" />
          </div>
          <h1>{resolved}</h1>
        </div>

        <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=critical")}>
            <h3>Critical Issues</h3>
            <AiFillAlert className="card_icon" />
          </div>
          <h1>{critical}</h1>
        </div>

        <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=new")}>
            <h3>Reports in the Past 7 Days</h3>
            <SlCalender className="card_icon" />
          </div>
          <h1>{past7Days}</h1>
        </div>

         <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=accept")}>
            <h3>Accepted Reports</h3>
            <AiOutlineCheckCircle  className="card_icon" />
          </div>
          <h1>{accept}</h1>
        </div>


        <div className="card">
          <div className="card-inner" onClick={() => navigate("/damage_reports?filter=ignored")}>
            <h3>Ignored Reports</h3>
            <BsEyeSlash className="card_icon" />
          </div>
          <h1>{ignored}</h1>
        </div>
      </div>

      {/* Bar Chart */}
      <h1>DAMAGE OVERVIEW</h1>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="damageType" tick={{ fill: '#333' }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" name="Damage Reports">
            {chartData.map((entry, index) => {
              let color = "#8884d8";
              switch (entry.damageType) {
                case 'Potholes': color = "#FF6B6B"; break;
                case 'Cracks': color = '#6BFF6B'; break;
                case 'Surface Damage': color = "#6B6BFF"; break;
                case 'Other': color = "#FFD166"; break;
                default: break;
              }
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart */}
      <div className="severity-pie-chart" style={{ marginBottom: "30px", marginTop: "30px", fontSize: "20px" }}>
        <h2>REPORTS BY SEVERITY</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={severityData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name} (${value})`}
            >
              {severityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div> 
    </main>
  );
};

export default Home;