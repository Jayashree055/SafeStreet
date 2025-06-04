import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.fullScreenWrapper}>
      <div style={styles.box}>
        <h1 style={styles.title}>
          <i>Welcome to SafeStreet</i>
        </h1>
        <p style={styles.tagline}>Making streets safer, one report at a time.</p>
        <div style={styles.buttonContainer}>
          <button onClick={() => navigate("/login")} style={styles.button}>
            Login
          </button>
          <button onClick={() => navigate("/register")} style={styles.button}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  fullScreenWrapper: {
    position: "fixed",
    inset: 0,
    zIndex: 10,
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("/bgr.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  box: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "40px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
    maxWidth: "400px",
    width: "100%",
  },
  title: {
    color: "white",
    fontSize: "2.2rem",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  tagline: {
    color: "#ffc107",
    fontSize: "1rem",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  button: {
    backgroundColor: "#28a745",
    border: "none",
    color: "white",
    padding: "12px 20px",
    fontSize: "1rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default Welcome;
