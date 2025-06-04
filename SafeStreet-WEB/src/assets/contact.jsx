import React from "react";
import "../App.css";
import ChatBot from "./chatBot";

const cards = [
  {
    title: "🛠️ Road Maintenance Department",
    phone: "+91 98765 43210",
    email: "maintenance@safestreet.com",
    image: "/road.jpg",
  },
  {
    title: "🏛️ Municipal Authorities",
    phone: "+91 91234 56789",
    email: "authorities@safestreet.com",
    image: "/auth.jpg",
  },
  {
    title: "💻 Technical Support",
    phone: "+91 78901 23456",
    email: "support@safestreet.com",
    image: "/tech.jpg",
  },
];

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Need Help?</h1>
      <p>For any assistance related to road damage reports, please reach out to the respective departments.</p>

      <div className="contact-content">
        {/* LEFT: FLIP CARDS */}
        <div className="contact-cards">
          {cards.map(({ title, phone, email, image }, idx) => (
            <div className="flip-card" key={idx}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={image} alt={title} />
                  <h3>{title}</h3>
                </div>
                <div className="flip-card-back">
                  <p>📞 {phone}</p>
                  <p>✉️ {email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: CHATBOT */}
        <div className="contact-form">
          <h2>Chat with SafeStreet Assistant</h2>
          <ChatBot />
        </div>
      </div>

      <div className="emergency-section">
        <h2>🚨 Emergency Contact</h2>
        <p>If you need <strong>urgent road safety intervention</strong>, contact:</p>
        <p><strong>Road Safety Helpline:</strong> 1800-123-4567</p>
      </div>
    </div>
  );
};

export default Contact;
