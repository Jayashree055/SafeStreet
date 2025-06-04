import React, { useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import "../App.css"; // Link to your CSS file

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendClick = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim()) {
      handleSendClick();
    }
  };

  const sendMessage = async (message) => {
    setMessages((prev) => [...prev, { from: "user", text: message }]);

    if (message.toLowerCase().includes("my name is" || "i am")) {
      const name = message.split(" ").slice(-1)[0];
      setUserName(name);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `Hi ${name}, how can I help you today?` },
      ]);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      const data = await response.json();
      const classification = data.intent;
      const botResponse = getBotResponse(classification);

      setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, I couldn't understand that." },
      ]);
    }
  };

  const getBotResponse = (intent) => {
    switch (intent) {
      case "view_reports":
        return "Navigae to Damage Reports section to see the reports that you have received";
      case "password_reset":
        return "To reset your password, go to the login page and click 'Forgot Password'.";
      case "email_help":
        return "Email issues are logged under the Email Logs section in the header.";
      case "pending_reports":
        return "All the pending reports are logged in the 'Pending' section present in the home page.";
      case "critical" || "urgent"||"high_alert":
        return "The critical reports are present in the 'ciritcal issues' section in the home page";
      case "ignored":
        return "The reports that you have ignored as logged in the 'Ignored' section present in the home page.";
      case "send_email":
        return "To send an email to the supervisor, visit the damage reports page and take the necessary action.";
      case "view_notification":
        return "Click the 'notify' icon in the header to view your notifications.";
      case "technical_support":
        return "Please contact the technical support team whose details are in the 'help' page";
      case "gratitude":
        return "You're welcome! Let me know if you have more questions.";
      case "help":
        return "Sure! Let me know what kind of help you need.";
      case "greeting":
        return "Hello! How can I assist you today?";
      default:
        return "Hmm... I didn't get that. Can you try rephrasing?";
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        <div className="chat-header">
          <span>SafeStreet Assistant</span>
        </div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.from}`}>
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={handleSendClick}>
            <FaTelegramPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;