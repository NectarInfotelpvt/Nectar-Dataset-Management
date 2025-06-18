import React, { useEffect, useState, useCallback } from "react";
import { Container, Navbar, Nav, Button, Card, Row, Col, Table } from 'react-bootstrap';

export default function MainDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [rolesData, setRolesData] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [resources, setResources] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [errorRoles, setErrorRoles] = useState(false);
  const [errorResources, setErrorResources] = useState(false);

  // Enhanced Theme Colors for better UI and consistency
  const themeColors = {
    // Light Mode Defaults - Monochromatic Blue/Gray with more depth
    lightBg: '#e8f0f7', // Very light, slightly cool blue background
    lightText: '#1a3044', // Darker, deep blue for readability
    lightCardBg: '#ffffff',
    lightCardBorder: '#cce0f2', // Soft blue border
    lightCardHoverBg: '#d9eaf7', // Lighter, inviting hover
    lightButtonBg: '#aecae8', // Muted blue for buttons
    lightButtonText: '#1a3044',
    lightButtonSelectedBg: '#0b7cd8', // Vibrant blue for selection
    lightButtonSelectedText: '#ffffff',
    lightTableHeadBg: '#0b7cd8',
    lightTableHeadText: '#ffffff',
    lightLink: '#0b7cd8',
    white: '#ffffff',
    black: '#000000',
    grayText: '#6a7e93', // A slightly blue-tinted gray for secondary text

    // Dark Mode Defaults - Monochromatic Blue/Gray with more depth
    darkBg: '#1f2a38', // Deep, rich dark blue background
    darkText: '#f0f4f7', // Very light, almost white text
    darkCardBg: '#2c394c', // Darker blue card background
    darkCardBorder: '#425a7a', // Subtle dark blue border
    darkCardHoverBg: '#425a7a', // Consistent hover with border
    darkButtonBg: '#425a7a', // Dark button background
    darkButtonText: '#f0f4f7',
    darkButtonSelectedBg: '#0b7cd8', // Consistent vibrant blue for selected
    darkButtonSelectedText: '#ffffff',
    darkTableHeadBg: '#0b7cd8', // Vibrant blue head
    darkTableHeadText: '#ffffff',
    darkLink: '#8fc7ed', // Lighter, more prominent blue for links

    // Accent Colors (Header Gradient ONLY) - Slightly adjusted for more blue depth
    primaryGradient: "linear-gradient(to right, #0056b3, #007bff, #0099ff)", // Deeper, richer blue gradient
  };

  const fetchRoles = useCallback(async () => {
    try {
      setErrorRoles(false);
      const res = await fetch("http://localhost:5001/api/submission/roles");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const apiResponseData = await res.json();
      if (typeof apiResponseData === 'object' && apiResponseData !== null && !Array.isArray(apiResponseData)) {
        setRolesData(apiResponseData);
      } else {
        console.warn("API response for roles is not in the expected {roleName: [...]} format. It should be an object where keys are role names and values are arrays of entries:", apiResponseData);
        setRolesData({});
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRolesData({});
      setErrorRoles(true);
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      setErrorResources(false);
      const res = await fetch("http://localhost:5001/api/resources");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResources(data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
      setResources([]);
      setErrorResources(true);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchResources();
  }, [fetchRoles, fetchResources]);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const rolesList = Object.keys(rolesData);
  const selectedEntries = rolesData[selectedRole] || [];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Dynamic CSS using template literals
  const dynamicStyles = `
    /* Import Google Font */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    /* Global Resets & Base Styles */
    html, body, #root, .user-panel-layout {
      height: 100%;
      margin: 0;
      padding: 0;
      min-height: 100vh;
      overflow-x: hidden; /* Prevent horizontal scrolling on the entire layout */
      box-sizing: border-box; /* Global box-sizing */
      font-family: 'Inter', sans-serif; /* Applied new font */
      transition: all 0.3s ease-in-out;
    }

    .user-panel-layout {
      position: relative;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      background: ${themeColors.lightBg}; /* Light mode background */
      color: ${themeColors.lightText}; /* Base text color for light mode */
    }

    .user-panel-layout.dark {
        background: ${themeColors.darkBg}; /* Dark mode background */
        color: ${themeColors.darkText}; /* Dark mode text color */
    }

    /* Header Styles */
    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: ${themeColors.primaryGradient};
      box-shadow: 0px 2px 10px rgba(0,0,0,0.1);
      z-index: 1000;
      padding-bottom: 0.75rem; /* Reduced from 1rem */
      border-bottom-left-radius: 45px; /* Reduced from 60px */
      border-bottom-right-radius: 45px; /* Reduced from 60px */
      box-sizing: border-box;
      width: 100%;
    }

    .user-panel-layout.dark .site-header {
      background: ${themeColors.primaryGradient}; /* Keep header vibrant in dark mode */
      box-shadow: 0px 2px 10px rgba(0,0,0,0.3);
    }

    /* Footer Styles */
    .site-footer {
      background-color: ${themeColors.lightCardBg};
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05); /* Subtle shadow */
      padding: 1.5rem 0;
      text-align: center;
      height: 60px; /* Fixed height for footer */
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${themeColors.lightText};
      margin-top: 0;
      box-sizing: border-box;
      width: 100%;
    }

    .user-panel-layout.dark .site-footer {
      background-color: ${themeColors.darkCardBg};
      box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
      color: ${themeColors.darkText};
    }

    /* Main Content Wrapper */
    .main-content-wrapper {
      position: relative;
      z-index: 1;
      margin-top: 100px;
      margin-bottom: 60px; /* Space for the footer */
      box-sizing: border-box;
      width: 100%;
    }

    /* Navbar & Buttons */
    .navbar {
      background: transparent;
      color: ${themeColors.white};
      padding: 0.75rem 1.5rem; /* Slightly reduced padding */
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      width: 100%;
    }

    .navbar .logo {
      display: flex;
      align-items: center;
      font-weight: 600; /* Bolder font for logo */
      font-size: 1rem; /* Reduced from 1.2rem */
      color: ${themeColors.white};
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }
    .navbar .logo img {
        filter: brightness(0) invert(1); /* This makes the logo white */
    }

    .navbar .btn {
      border-radius: 0.75rem;
      padding: 0.6rem 1.2rem; /* Slightly reduced padding */
      font-weight: 600; /* Bolder button text */
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease;
      background: ${themeColors.lightButtonSelectedBg}; /* Blue for toggle button */
      color: ${themeColors.white};
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .navbar .btn {
      background: ${themeColors.darkButtonSelectedBg}; /* Consistent selected blue for dark mode */
      color: ${themeColors.white};
    }

    /* Main Content Area (Curved Panel) */
    .curved-panel-container {
      background-color: ${themeColors.lightBg}; /* Light mode */
      border-top-left-radius: 60px;
      border-top-right-radius: 60px;
      margin-top: -60px;
      position: relative;
      z-index: 2;
      padding-top: 80px;
      padding-bottom: 40px;
      box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: none;
      box-sizing: border-box;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .user-panel-layout.dark .curved-panel-container {
      background-color: ${themeColors.darkBg}; /* Dark mode */
      color: ${themeColors.darkText};
      box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
    }

    /* Styles for the moved H1 and P */
    .main-content-title {
        color: ${themeColors.lightText};
        font-weight: bold;
        text-align: center;
        margin-top: 20px;
        margin-bottom: 0.5rem;
        font-size: 2.8rem;
        font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .main-content-subtitle {
        color: ${themeColors.lightText};
        font-size: 1.2rem;
        text-align: center;
        margin-top: 0.5rem;
        margin-bottom: 2rem;
        font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .main-content-title,
    .user-panel-layout.dark .main-content-subtitle {
        color: ${themeColors.darkText}; /* Text color in dark mode */
    }


    /* Section Cards (e.g., Role Entries, Available Resources) */
    .user-card-section {
      border-radius: 1rem; /* Softer radius */
      box-shadow: 0px 4px 15px rgba(0,0,0,0.1); /* Lighter shadow */
      padding: 1.5rem;
      transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      background-color: ${themeColors.lightCardBg};
      color: ${themeColors.lightText};
      border: 1px solid ${themeColors.lightCardBorder}; /* Subtle border */
      box-sizing: border-box;
      width: 100%;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-card-section:hover {
      transform: translateY(-5px);
      box-shadow: 0px 8px 20px rgba(0,0,0,0.15); /* More prominent hover shadow */
      background-color: ${themeColors.lightCardHoverBg};
    }

    .user-panel-layout.dark .user-card-section {
      background-color: ${themeColors.darkCardBg};
      color: ${themeColors.darkText};
      border: 1px solid ${themeColors.darkCardBorder};
    }

    .user-panel-layout.dark .user-card-section:hover {
      background-color: ${themeColors.darkCardHoverBg};
      box-shadow: 0px 10px 20px rgba(0,0,0,0.3);
    }

    .user-panel-layout.dark .user-card-section h2 {
      color: ${themeColors.darkText}; /* Ensure headings follow dark mode text */
    }

    /* Role Buttons - Targeted for Project Coordinator, Back Office Coordinator, Team Leader */
    .role-button-group {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem; /* Uniform gap */
      width: 100%;
      margin: 0 auto 2rem; /* More space below buttons */
      padding: 0 1rem;
      box-sizing: border-box;
    }

    .role-button {
      background: ${themeColors.lightButtonBg};
      color: ${themeColors.lightButtonText};
      padding: 0.6rem 1.2rem;
      border: 1px solid ${themeColors.lightCardBorder}; /* Subtle border */
      border-radius: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      white-space: normal;
      text-align: center;
      min-width: 140px;
      max-width: 180px;
      min-height: 95px;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      line-height: 1.3;
      font-size: 0.95rem;
      flex-grow: 1;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .role-button:hover {
        border-color: ${themeColors.lightButtonSelectedBg}; /* Highlight border on hover */
    }

    .role-button.selected {
      background: ${themeColors.lightButtonSelectedBg};
      color: ${themeColors.lightButtonSelectedText};
      border-color: ${themeColors.lightButtonSelectedBg};
    }

    .user-panel-layout.dark .role-button {
      background: ${themeColors.darkButtonBg};
      color: ${themeColors.darkButtonText};
      border: 1px solid ${themeColors.darkCardBorder};
    }

    .user-panel-layout.dark .role-button:hover {
        border-color: ${themeColors.darkButtonSelectedBg};
    }

    .user-panel-layout.dark .role-button.selected {
      background: ${themeColors.darkButtonSelectedBg};
      color: ${themeColors.darkButtonSelectedText};
      border-color: ${themeColors.darkButtonSelectedBg};
    }

    /* Card Grid for Role Entries */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Slightly larger min-width */
      gap: 1.5rem; /* Increased uniform gap between cards */
      margin-top: 1rem;
    }

    .cards-grid .card {
      background: ${themeColors.lightCardBg};
      color: ${themeColors.lightText};
      border-radius: 1rem; /* Uniform radius with section cards */
      padding: 1.2rem; /* Consistent padding */
      box-shadow: 0px 5px 15px rgba(0,0,0,0.08); /* Lighter shadow */
      border: 1px solid ${themeColors.lightCardBorder};
      transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
      cursor: pointer;
      box-sizing: border-box;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .cards-grid .card:hover {
      transform: translateY(-5px);
      box-shadow: 0px 8px 20px rgba(0,0,0,0.12);
      border-color: ${themeColors.lightButtonSelectedBg}; /* Highlight border on hover */
    }

    .user-panel-layout.dark .cards-grid .card {
      background: ${themeColors.darkCardBg};
      color: ${themeColors.darkText};
      box-shadow: 0px 5px 15px rgba(0,0,0,0.25);
      border: 1px solid ${themeColors.darkCardBorder};
    }

    .user-panel-layout.dark .cards-grid .card:hover {
      border-color: ${themeColors.darkButtonSelectedBg};
    }

    .cards-grid .card h3 {
      color: ${themeColors.lightText};
      font-weight: 600;
      margin-bottom: 0.5rem;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .cards-grid .card h3 {
      color: ${themeColors.darkText};
    }

    .cards-grid .card p {
      color: ${themeColors.lightText};
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .cards-grid .card p {
      color: ${themeColors.darkText};
    }

    .cards-grid .card a {
      color: ${themeColors.lightLink};
      text-decoration: underline;
      transition: color 0.3s ease;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .cards-grid .card a {
      color: ${themeColors.darkLink};
    }

    .cards-grid .card a:hover {
        color: ${themeColors.lightButtonSelectedBg}; /* Slightly change on hover */
    }

    .cards-grid .card .details {
      margin-top: 1rem;
      font-size: 0.9rem;
      line-height: 1.4;
      color: ${themeColors.lightText};
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }
    .user-panel-layout.dark .cards-grid .card .details {
      color: ${themeColors.darkText};
    }

    .cards-grid .card .details ul {
      margin: 0.5rem 0 0;
      padding-left: 1.2rem;
      list-style-type: disc; /* Ensure bullet points */
    }

    .cards-grid .card .details ul li {
      margin-bottom: 0.3rem;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    /* Tables */
    .table-card {
      border-radius: 1rem;
      background: ${themeColors.lightCardBg};
      box-shadow: 0px 10px 20px rgba(0,0,0,0.1);
      box-sizing: border-box;
      padding: 0;
      overflow: hidden; /* Important for table border-radius */
      border: 1px solid ${themeColors.lightCardBorder};
    }

    .user-panel-layout.dark .table-card {
      background: ${themeColors.darkCardBg};
      box-shadow: 0px 10px 20px rgba(0,0,0,0.25);
      border: 1px solid ${themeColors.darkCardBorder};
    }

    .table-card table {
      border-collapse: separate;
      border-spacing: 0;
      width: 100%;
      background: ${themeColors.lightCardBg};
      border-radius: 1rem;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .table-card table {
      background: ${themeColors.darkCardBg};
      color: ${themeColors.darkText};
    }

    .table-custom-header th {
      background: ${themeColors.lightTableHeadBg}; /* Use new table header background */
      color: ${themeColors.lightTableHeadText};
      font-weight: 600;
      padding: 0.9rem 1rem;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .table-custom-header th {
      background: ${themeColors.darkTableHeadBg};
      color: ${themeColors.darkTableHeadText};
    }

    .table-striped tbody tr:nth-of-type(odd) {
      background-color: rgba(0, 0, 0, 0.02); /* Very subtle stripe */
    }

    .user-panel-layout.dark .table-striped tbody tr:nth-of-type(odd) {
      background-color: rgba(255, 255, 255, 0.03); /* Subtle dark stripe */
    }

    .table-hover tbody tr:hover {
      background-color: ${themeColors.lightCardHoverBg} !important;
    }

    .user-panel-layout.dark .table-hover tbody tr:hover {
      background-color: ${themeColors.darkCardHoverBg} !important;
    }

    .table-card td {
      padding: 0.8rem 1rem;
      vertical-align: middle;
      white-space: normal;
      word-break: break-word;
      color: ${themeColors.lightText};
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }
    .user-panel-layout.dark .table-card td {
      color: ${themeColors.darkText};
    }

    .table-card a.text-info {
      color: ${themeColors.lightLink};
      text-decoration: underline;
      word-break: break-all;
      font-family: 'Inter', sans-serif; /* Explicitly apply font */
    }

    .user-panel-layout.dark .table-card a.text-info {
      color: ${themeColors.darkLink};
    }


    /* Responsive adjustments */

    /* Tablets and Desktops (min-width: 768px) */
    @media (min-width: 768px) {
      .site-header {
          padding-bottom: 1.125rem;
      }

      .site-header .navbar {
          padding: 0.75rem 1.5rem;
      }

      .site-header .navbar .logo {
          font-size: 1.125rem;
      }

      .main-content-wrapper {
          margin-top: 100px;
      }

      .main-content-title {
          font-size: 2.8rem;
          margin-top: 40px;
      }
      .main-content-subtitle {
          font-size: 1.25rem;
          margin-bottom: 2rem;
      }
    }

    /* Tablets (min-width: 480px and max-width: 767px) */
    @media (min-width: 480px) and (max-width: 767px) {
        .site-header {
            border-bottom-left-radius: 22.5px;
            border-bottom-right-radius: 22.5px;
        }

        .site-header .navbar .logo {
            font-size: 0.7875rem;
        }

        .main-content-wrapper {
            margin-top: 80px;
        }

        .main-content-title {
            font-size: 2rem;
            margin-top: 30px;
        }
        .main-content-subtitle {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }
    }

    /* Mobile (max-width: 479px) */
    @media (max-width: 479px) {
        .site-header {
            padding-bottom: 0.375rem;
            border-bottom-left-radius: 18.75px;
            border-bottom-right-radius: 18.75px;
        }

        .site-header .navbar {
            padding: 0.375rem 0.375rem;
        }

        .site-header .navbar .logo {
            font-size: 0.3375rem;
        }

        .site-header .navbar .btn {
            padding: 0.3rem 0.6rem;
            font-size: 0.6rem;
        }

        .main-content-wrapper {
            margin-top: 60px;
        }

        .main-content-title {
            font-size: 1.5rem;
            margin-top: 20px;
        }
        .main-content-subtitle {
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
    }
  `;

  return (
    <div className={`user-panel-layout ${darkMode ? "dark" : ""}`}>
      {/* Bootstrap CSS Link - Keep this if you're using Bootstrap classes */}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      {/* Injected styles */}
      <style>{dynamicStyles}</style>

      {/* Top Gradient Section (Header) */}
      <div className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <div className="logo">
              {/* Replaced placeholder with actual logo */}
              <img
                src="nectar-logo.png" // Assuming 'nectar-logo.png' is in your public folder or accessible path
                alt="Nectar Infotel Logo"
                style={{ width: "30px", height: "25px", marginRight: "8px" }}
              />
              Nectar Infotel
            </div>
            {/* Dark/Light Mode Toggle Button */}
            <Button onClick={toggleTheme}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </nav>
      </div> {/* End of site-header */}

      {/* Main Content Area - This will now scroll naturally after the header */}
      <div className="main-content-wrapper">
        <main className="py-4 curved-panel-container">
          {/* Main Title and Subtitle - NOW INSIDE main-content-wrapper, at the top of curved-panel-container */}
          <div className="row mb-4 align-items-center text-center px-3">
            <div className="col-12">
              <h1 className="main-content-title">Nectar Dataset Management</h1>
              <p className="main-content-subtitle">Get Your Dataset Link</p>
            </div>
          </div>

          {/* Role selection buttons */}
          <div className="role-button-group">
            {rolesList.map((role) => (
              <button
                key={role}
                className={`btn role-button ${selectedRole === role ? "selected" : ""}`}
                onClick={() => {
                  setSelectedRole(role);
                  setExpandedIndex(null); // Collapse any expanded entry when a new role is selected
                }}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Error message for roles fetch failure */}
          {errorRoles && (
            <div className="col-12 text-center text-danger mt-3">
              <p>Failed to load roles. Please ensure the backend is running and accessible (e.g., at http://localhost:5001/api/submission/roles).</p>
            </div>
          )}

          {/* Container for Role Entries and Resources sections */}
          <div className="content-sections-container">
            {/* Cards Section (Role Entries) */}
            <section className="user-card-section">
              <h2>Role Entries</h2>
              {/* Grid for individual role entry cards */}
              <div className="cards-grid">
                {selectedEntries.length > 0 ? (
                  selectedEntries.map((entry, index) => (
                    <div
                      className="card"
                      key={index}
                      onClick={() => toggleExpand(index)}
                      aria-expanded={expandedIndex === index}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleExpand(index);
                      }}
                    >
                      <h3 style={{ marginBottom: "0.2rem" }}>{selectedRole}</h3>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          textTransform: "capitalize",
                          marginTop: 0,
                          marginBottom: "0.5rem",
                          fontWeight: 500,
                        }}
                      >
                        {entry.employeeName}
                        <span style={{ float: "right", fontWeight: "bold", color: darkMode ? themeColors.darkText : themeColors.lightText }}>
                          {expandedIndex === index ? "▲" : "▼"}
                        </span>
                      </p>

                      {/* Collapsible details section */}
                      {expandedIndex === index && (
                        <>
                          <p style={{ fontSize: '0.85rem' }}>
                            <strong>Dataset:</strong>{" "}
                            {entry.datasetLink ? (
                              <a href={entry.datasetLink} target="_blank" rel="noreferrer" className="text-info">
                                {entry.datasetLink}
                              </a>
                            ) : (
                              "None"
                            )}
                          </p>
                          <div className="details">
                            <strong>About Dataset:</strong>
                            <ul>
                              {entry.users && entry.users.length > 0 ? (
                                // Ensure each user is a string before mapping
                                entry.users.map((user, idx) => (
                                  <li key={idx} style={{ fontSize: '0.8rem' }}>{typeof user === 'object' && user !== null && user._id ? String(user._id) : String(user)}</li>
                                ))
                              ) : (
                                <li style={{ fontSize: '0.8rem' }}>No description available</li>
                              )}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : selectedRole ? (
                  <p style={{ textAlign: "center", fontSize: '0.9rem' }}>
                    No entries for <strong>{selectedRole}</strong>.
                  </p>
                ) : (
                  <p style={{ textAlign: "center", fontSize: '0.9rem' }}>
                    Select a role to view assignments.
                  </p>
                )}
              </div>
            </section>

            {/* Resources Table Section */}
            <section className="user-card-section">
              <h2>Available Resources</h2>
              {/* Error message for resources fetch failure */}
              {errorResources && (
                <div className="col-12 text-center text-danger mt-3">
                  <p>Failed to load resources. Please ensure the backend is running and accessible (e.g., at http://localhost:5001/api/resources).</p>
                </div>
              )}
              {resources.length > 0 ? (
                <div className="table-responsive table-card">
                  <Table className={`table table-hover table-striped ${darkMode ? 'table-dark' : ''}`}>
                    <thead className="table-custom-header">
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">District</th>
                        <th collocation="col">State</th>
                        <th scope="col">Link</th>
                        <th scope="col">Extra Info</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resources.map((resource) => (
                        <tr key={resource._id}>
                          <td>{resource.title}</td>
                          <td>{resource.district}</td>
                          <td>{resource.state}</td>
                          <td>
                            <a href={resource.link} target="_blank" rel="noreferrer" className="text-info">
                              {resource.link}
                            </a>
                          </td>
                          <td>{resource.extraInfo || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p style={{ textAlign: "center", fontSize: '0.9rem' }}>
                  No resources available.
                </p>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* Fixed Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>&copy; 2025 Nectar Infotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}