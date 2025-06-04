
import { useEffect, useState } from "react";
import "../App.css";

function EmailHistory() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/emails')
      .then(response => response.json())
      .then(data => setEmails(data))
      .catch(error => console.error('Error fetching emails:', error));
  }, []);

  return (
    <div className="email-history-container">
      <div className="email-history-card">
        <h2>📧 Email History</h2>

        {emails.length === 0 ? (
          <p className="no-email-text">No emails found.</p>
        ) : (
          <div className="email-list">
            {emails.map((email, index) => (
              <div className="email-card" key={index}>
                <p><strong>To:</strong> {email.to}</p>
                <p><strong>Subject:</strong> {email.subject}</p>
                <p><strong>Message:</strong> {email.text}</p>
                <p><strong>Sent At:</strong> {new Date(email.sentAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailHistory;
