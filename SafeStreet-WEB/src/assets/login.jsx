import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const [officialEmail, setOfficialEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!officialEmail.endsWith("@safestreet.org")) {
        setError("Only SafeStreet authority domains are allowed.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officialEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("officialEmail", officialEmail);
        alert("Login successful, OTP sent to your personal email.");
        navigate("/otp");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Failed to connect to the server. Please try again later.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.fullScreenWrapper}>
      {/* Light Rays */}
      <div className="ray" style={{ left: "20%" }} />
      <div className="ray" style={{ left: "40%", animationDelay: "1s" }} />
      <div className="ray" style={{ left: "60%", animationDelay: "2s" }} />
      <div className="ray" style={{ left: "80%", animationDelay: "3s" }} />

      <div style={styles.cardWrapper}>
        {/* Left Panel with Typing Animation */}
        <div style={styles.leftPanel}>
          <p style={styles.typingText}>Making roads safer, one step at a time</p>
        </div>

        {/* Right Panel - Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <h1 style={styles.title}>LOGIN</h1>

          <label style={styles.label}>Official Email:</label>
          <input
            type="email"
            placeholder="Enter your official email"
            value={officialEmail}
            onChange={(e) => setOfficialEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>Password:</label>
          <div style={styles.passwordWrapper}>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.inputWithIcon}
            />
            <span onClick={togglePasswordVisibility} style={styles.icon}>
              {passwordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
            </span>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.link}>
            Forgot your password?{" "}
            <Link to="/forgotpassword" style={styles.inlineLink}>
              Click here to reset it!
            </Link>
          </p>

          <p style={styles.link}>
            New User?{" "}
            <Link to="/register" style={styles.inlineLink}>
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* CSS keyframes and ray styles */}
      <style>{`
            @keyframes typing {
              from { width: 0 }
              to { width: 100% }
            }

            @keyframes blink-caret {
              from, to { border-color: transparent }
              50% { border-color: white }
            }

            @keyframes rays {
              0% {
                transform: translateY(-100%) rotate(15deg);
                opacity: 0.3;
              }
              100% {
                transform: translateY(200%) rotate(15deg);
                opacity: 0;
              }
            }

            .ray {
              position: absolute;
              width: 10px; /* Increased from 2px to 10px */
              height: 400px; /* You can adjust this too */
              background: rgba(255, 255, 255, 0.08);
              top: -400px;
              transform: rotate(15deg);
              animation: rays 5s linear infinite;
              z-index: 0;
              border-radius: 10px;
            }

            .ray::before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              background: linear-gradient(to bottom, rgba(255,255,255,0.3), rgba(255,255,255,0));
              border-radius: 10px;
            }
          `}</style>

    </div>
  );
};

const styles = {
  fullScreenWrapper: {
    position: "fixed",
    inset: 0,
    zIndex: 10,
    background: "linear-gradient(to right,rgb(30, 62, 76),rgb(52, 96, 110),rgb(59, 111, 133))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    overflow: "hidden",
  },
  cardWrapper: {
    display: "flex",
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 50px rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  typingText: {
    fontSize: "24px",
    borderRight: ".15em solid #fff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    animation: "typing 4s steps(40, end) forwards, blink-caret .75s step-end infinite",
    width: "fit-content",
    maxWidth: "100%",
  },
  form: {
    flex: 1.2,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: "40px",
    color: "#fff",
    backdropFilter: "blur(10px)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
    color: "#fff",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    marginTop: "10px",
    fontSize: "1rem",
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "1rem",
  },
  inputWithIcon: {
    width: "100%",
    padding: "10px 35px 10px 10px",
    borderRadius: "6px",
    border: "none",
    fontSize: "1rem",
  },
  passwordWrapper: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "20px",
    color: "#ccc",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "0.9rem",
    marginTop: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    color: "#fff",
    cursor: "pointer",
    marginTop: "20px",
  },
  link: {
    marginTop: "15px",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  inlineLink: {
    color: "#ffc107",
    textDecoration: "none",
  },
};

export default Login;
