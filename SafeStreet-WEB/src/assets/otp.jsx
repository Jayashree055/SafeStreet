import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const [officialEmail, setOfficialEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("officialEmail");
    if (storedEmail) {
      setOfficialEmail(storedEmail);
    } else {
      alert("No official email found. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ officialEmail, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP verified successfully! You are now logged in.");
        localStorage.setItem("isAuthenticated", true);
        navigate("/home");
      } else {
        alert(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ officialEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("A new OTP has been sent to your registered personal email.");
        setTimeLeft(60);
        setIsExpired(false);
        setOtp("");
      } else {
        alert(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setIsExpired(true);
    }

    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // 🧾 Inline Styles
    const wrapperStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent", // transparent wrapper
  };



    const containerStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // translucent background
    backdropFilter: "blur(10px)", // glassmorphism effect
    WebkitBackdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)", // subtle shadow
    color: "#000", // black text
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
  };


    const inputStyle = {
    padding: "10px",
    width: "100%",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "rgba(14, 14, 14, 0.8)", // lighter input bg
    color: "white", // black text
  };


  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    backgroundColor: "#007bff",
    cursor: "pointer",
  };

  const resendBtnStyle = {
    ...buttonStyle,
    marginLeft: "10px",
    backgroundColor: isExpired ? "#28a745" : "#ccc",
    cursor: isExpired ? "pointer" : "not-allowed",
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2>Authority OTP Verification</h2>
        <p>An OTP has been sent to your registered personal email for verification.</p>

        <form onSubmit={handleVerifyOtp}>
          <input
            type="text"
            placeholder="Enter the 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={isExpired}
            style={inputStyle}
          />
          <br />

          <button type="submit" style={buttonStyle} disabled={isExpired}>
            Verify OTP
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!isExpired}
            style={resendBtnStyle}
          >
            Resend OTP
          </button>
        </form>

        {/* <div style={{ marginTop: "10px", color: isExpired ? "red" : "gray" }}>
          {isExpired
            ? "OTP expired. Please request a new one."
            : `Time left: 00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
        </div> */}
            <div style={{ marginTop: "10px", color: isExpired ? "red" : "#000" }}>
            {isExpired
              ? "OTP expired. Please request a new one."
              : `Time left: 00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`}
            </div>

      </div>
    </div>
  );
};

export default Otp;
