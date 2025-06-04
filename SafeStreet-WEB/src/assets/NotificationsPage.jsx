import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../App.css";

const BACKEND_URL = "http://localhost:8000";

const NotificationsPage = () => {
  const [newReports, setNewReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewReports = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/reports/new`); // or your endpoint to get new reports
        setNewReports(res.data);
      } catch (error) {
        console.error("Failed to fetch new reports", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewReports();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  if (newReports.length === 0) return <p>No new damage reports.</p>;

 return (
  <div className="notifications-container">
    <h2>🛠️ New Damage Reports</h2>
    <ul className="notifications-list">
      {newReports.map((report) => (
        <li className="notification-item" key={report._id}>
          <span className="notification-icon">🛠️</span>
          <span className="notification-text">
            Damage report received at {new Date(report.date).toLocaleString()}<br />
            Location: {report.location}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

};

export default NotificationsPage;