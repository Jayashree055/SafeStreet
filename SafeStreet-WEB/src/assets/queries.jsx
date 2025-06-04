import React, { useEffect, useState } from "react";

const AllQueries = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      const response = await fetch("http://localhost:8000/api/get-queries");
      const data = await response.json();
      setQueries(data);
    };

    fetchQueries();
  }, []);

  return (
    <div className="queries-container">
      <h1>All Queries</h1>
      <table className="queries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((query, index) => (
            <tr key={index}>
              <td>{query.name}</td>
              <td>{query.email}</td>
              <td>{query.message}</td>
              <td>{new Date(query.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllQueries;
