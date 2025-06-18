import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Define theme colors to match the MainDashboard component, with new accents
  const themeColors = {
    // Light Mode Defaults - Monochromatic Blue/Gray with more depth
    lightBg: '#e8f0f7', // Very light, slightly cool blue background
    lightText: '#1a3044', // Darker, deep blue for readability
    lightCardBg: '#ffffff', // Card background for light mode
    lightCardBorder: '#cce0f2', // Soft blue border
    lightCardHoverBg: '#d9eaf7', // Lighter, inviting hover
    lightButtonBg: '#aecae8', // Muted blue for general buttons
    lightButtonText: '#1a3044',
    lightButtonSelectedBg: '#0b7cd8', // Vibrant blue for selection
    lightButtonSelectedText: '#ffffff',
    lightTableHeadBg: '#0b7cd8',
    lightTableHeadText: '#ffffff',
    lightLink: '#0b7cd8',
    white: '#ffffff',
    black: '#000000',
    grayText: '#6a7e93',

    // Dark Mode Defaults (kept for consistency with the overall theme, though not directly toggled here)
    darkBg: '#1f2a38',
    darkText: '#f0f4f7',
    darkCardBg: '#2c394c',
    darkCardBorder: '#425a7a',
    darkCardHoverBg: '#425a7a',
    darkButtonBg: '#425a7a',
    darkButtonText: '#f0f4f7',
    darkButtonSelectedBg: '#0b7cd8',
    darkButtonSelectedText: '#ffffff',
    darkTableHeadBg: '#0b7cd8',
    darkTableHeadText: '#ffffff',
    darkLink: '#8fc7ed',

    // Accent Colors (Header Gradient and NEW contrasting accent)
    primaryGradient: "linear-gradient(to right, #0056b3, #007bff, #0099ff)", // Deeper, richer blue gradient
    accentOrange: '#FF7043', // Soft coral/orange accent for buttons
    accentOrangeHover: '#E65100', // Darker orange on hover
    accentGreen: '#82ffa1', // For toggle link
    accentGreenHover: '#6acb87', // For toggle link hover
    pageBackgroundGradient: "linear-gradient(to bottom right, #e8f0f7, #cce0f2)", // Light blue gradient for page background

    // New specific blues for the gradient shadow effect
    blueShadowLight: 'rgba(173, 216, 230, 0.5)', // Light blue with opacity
    blueShadowMedium: 'rgba(70, 130, 180, 0.6)', // Steel blue with opacity
    blueShadowDark: 'rgba(0, 0, 128, 0.7)', // Navy blue with opacity (deeper)
    blueShadowVibrant: 'rgba(0, 123, 255, 0.7)', // A vibrant blue for the core glow
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API = "http://localhost:5001/api";

    try {
      if (isLogin) {
        localStorage.setItem("erpId", loginId);

        const res = await fetch(`${API}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ loginId, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Login failed");
          return;
        }

        alert("Login successful!");
        localStorage.setItem("erpId", loginId);
        if (data.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        const res = await fetch(`${API}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: loginId, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Registration failed");
          return;
        }

        localStorage.setItem("erpId", data.email);
        alert("Registered and logged in successfully!");

        if (data.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }

      setName("");
      setLoginId("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("API error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="page-container">
      {/* Google Font Import */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header Section */}
      <header className="header">
        <div className="logo" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="nectar-logo.png"
            alt="Nectar Infotel Logo"
            style={{ width: "30px", height: "25px", marginRight: "8px" }}
          />
          Nectar Infotel{" "}
          <span style={{ marginLeft: "5px", fontSize: "0.8em" }}></span>
        </div>
        <button className="portal-btn">welcome</button>
      </header>

      <main className="main-section">
        <section className="hero-content">
          <h1>
            A centralized system to store, manage, and access all employee-related
            data efficiently
          </h1>
          <p className="subtext"></p>
        </section>

        <section className="form-section-wrapper">
          <div className="form-card">
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                  required
                />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
              <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="toggle-btn"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </section>
      </main>

      <footer>
        <small>© {new Date().getFullYear()} Nectar Infotel. All rights reserved.</small>
      </footer>

      <style jsx>{`
        /* Keyframe for subtle background animation */
        @keyframes backgroundPan {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        /* Keyframe for floating card */
        @keyframes floatEffect {
          0% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(0.2deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(5px) rotate(-0.2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }


        .page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          /* Light blue background with subtle gradient */
          background: ${themeColors.pageBackgroundGradient};
          background-size: 200% 200%; /* Important for background animation */
          animation: backgroundPan 30s ease infinite; /* Apply background animation */
          color: ${themeColors.lightText}; /* Default text color for the page */
          font-family: 'Inter', sans-serif; /* Matched font family */
          overflow: hidden; /* Hide overflow to prevent scrollbars from animation */
        }

        /* Updated Header Styles */
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          height: 90px; /* Increased height from 80px to 90px */
          background: ${themeColors.primaryGradient}; /* Use the blue gradient for the header */
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          z-index: 10;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          font-family: 'Inter', sans-serif; /* Matched font family */
          color: ${themeColors.white}; /* Header text in white */
          border-bottom-left-radius: 15%; /* Add corner radius */
          border-bottom-right-radius: 15%; /* Add corner radius */
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          display: flex;
          align-items: center;
          color: ${themeColors.white}; /* Logo text color */
        }
        .logo span {
          font-size: 16px;
          color: ${themeColors.darkText}; /* Secondary text in logo */
        }

        .portal-btn {
          background: transparent;
          border: 1.5px solid ${themeColors.white};
          color: ${themeColors.white};
          border-radius: 8px;
          padding: 10px 18px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; /* Smooth transition */
          font-family: 'Inter', sans-serif; /* Matched font family */
        }
        .portal-btn:hover {
          background: ${themeColors.lightButtonSelectedBg}; /* Match selected button blue */
          border-color: ${themeColors.lightButtonSelectedBg};
          color: ${themeColors.white};
          transform: translateY(-2px); /* Slight lift on hover */
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .main-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 110px; /* Adjusted padding-top to account for increased header height (90px + 20px buffer) */
          padding-bottom: 20px;
          gap: 30px;
          text-align: center;
          color: ${themeColors.lightText}; /* Text color for main content */
          font-family: 'Inter', sans-serif; /* Matched font family */
        }

        .hero-content {
          width: 100%;
          max-width: 600px;
          padding: 0 20px;
        }

        .hero-content h1 {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: ${themeColors.lightText}; /* Heading color */
          font-family: 'Inter', sans-serif; /* Matched font family */
        }

        .subtext {
            color: ${themeColors.grayText}; /* Subtext a subtle gray-blue */
            font-family: 'Inter', sans-serif; /* Matched font family */
        }

        .form-section-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
          perspective: 1000px; /* For 3D transformations */
        }

        .form-card {
          background-color: ${themeColors.lightCardBg}; /* White card background */
          backdrop-filter: blur(8px); /* Keep the blur for frosted glass effect */
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 400px;
          overflow-y: auto;
          max-height: 75vh;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1); /* Lighter shadow initial */
          color: ${themeColors.lightText}; /* Text color inside card */
          border: 1px solid ${themeColors.lightCardBorder}; /* Subtle border */
          font-family: 'Inter', sans-serif; /* Matched font family */
          animation: floatEffect 10s ease-in-out infinite; /* Apply permanent float animation */
          /* Transition for hover effects - added box-shadow */
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out;
        }

        .form-card:hover {
          transform: translateY(-10px) scale(1.02); /* More pronounced lift and slight scale on hover */
          /* Gradient Blue Shadow Effect */
          box-shadow:
            0 0 15px 5px ${themeColors.blueShadowVibrant}, /* Core vibrant glow */
            0 0 30px 10px ${themeColors.blueShadowMedium}, /* Medium spread */
            0 0 45px 15px ${themeColors.blueShadowLight}, /* Wider, lighter spread */
            0 10px 25px rgba(0,0,0,0.2); /* Base shadow for depth */
          border-color: ${themeColors.lightButtonSelectedBg}; /* Also highlight border on hover */
        }

        .form-card h2 {
          margin-bottom: 20px;
          font-size: 28px;
          text-align: center;
          color: ${themeColors.lightText}; /* Heading color inside card */
          font-family: 'Inter', sans-serif; /* Matched font family */
        }

        .form-card input {
          width: 100%;
          margin: 10px 0;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid ${themeColors.lightCardBorder}; /* Blue border for inputs */
          font-size: 16px;
          background-color: ${themeColors.white}; /* White background for inputs */
          color: ${themeColors.lightText}; /* Input text color */
          font-family: 'Inter', sans-serif; /* Matched font family */
          transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for focus/hover */
        }
        .form-card input::placeholder {
            color: ${themeColors.grayText}; /* Placeholder color */
        }
        .form-card input:focus {
            outline: none;
            border-color: ${themeColors.lightButtonSelectedBg}; /* Highlight border on focus */
            box-shadow: 0 0 0 3px rgba(11, 124, 216, 0.2); /* Subtle blue glow */
        }
        .form-card input:hover:not(:focus) { /* Hover effect, but not if already focused */
            border-color: ${themeColors.grayText};
        }


        .form-card button[type="submit"] {
          width: 100%;
          margin-top: 15px;
          padding: 12px;
          background-color: ${themeColors.accentOrange}; /* Accent orange for submit button */
          color: ${themeColors.white};
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease; /* Smooth transition */
          font-family: 'Inter', sans-serif; /* Matched font family */
        }
        .form-card button[type="submit"]:hover {
            background-color: ${themeColors.accentOrangeHover}; /* Darker orange on hover */
            transform: translateY(-2px); /* Slight lift on hover */
            box-shadow: 0 5px 15px rgba(255, 112, 67, 0.4); /* Orange glow shadow */
        }

        .toggle-btn {
          background: none;
          border: none;
          color: ${themeColors.lightLink}; /* Light blue for toggle button */
          font-weight: 600;
          margin-left: 8px;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.3s ease, transform 0.2s ease; /* Smooth transition */
          font-family: 'Inter', sans-serif; /* Matched font family */
        }
        .toggle-btn:hover {
            color: ${themeColors.lightButtonSelectedBg}; /* Deeper blue on hover */
            transform: translateX(2px); /* Slight slide right on hover */
        }

        footer {
          text-align: center;
          padding: 20px;
          font-size: 0.85rem;
          color: ${themeColors.lightText}; /* Footer text color */
          font-family: 'Inter', sans-serif; /* Matched font family */
          background-color: ${themeColors.lightCardBg}; /* Match card background for footer */
          border-top: 1px solid ${themeColors.lightCardBorder}; /* Subtle border */
        }

        /* Media Queries for Responsiveness */

        /* Tablets and larger screens */
        @media (min-width: 768px) {
          .header {
            padding: 0 30px;
          }

          .main-section {
            flex-direction: row;
            justify-content: space-around;
            text-align: left;
            padding-top: 110px; /* Adjusted padding-top for larger screens */
            gap: 50px;
          }

          .hero-content {
            width: auto;
            max-width: 50%;
            padding: 0;
          }

          .hero-content h1 {
            font-size: 3rem;
          }

          .form-card {
            width: 400px;
            max-height: none;
          }

          footer {
            padding: 2rem;
          }
        }

        /* Large desktops */
        @media (min-width: 1024px) {
          .main-section {
            justify-content: center;
            gap: 100px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;