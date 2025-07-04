import React, { useEffect, useState, useCallback } from "react";
import { Button } from 'react-bootstrap';
import "../page.css/MainDashboard.css";

export default function MainDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [rolesData, setRolesData] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [resources, setResources] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [errorRoles, setErrorRoles] = useState(false);
  const [errorResources, setErrorResources] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      setErrorRoles(false);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submission/roles`);
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources`);
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

  return (
    <div className={`user-panel-layout ${darkMode ? "dark" : ""}`}>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />

      <div className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <div className="logo">
              <img
                src="nectar-logo.png"
                alt="Nectar Infotel Logo"
                style={{ width: "30px", height: "25px", marginRight: "8px" }}
              />
              Nectar Infotel
            </div>
            <Button onClick={toggleTheme}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </div>
        </nav>
      </div>

      <div className="main-content-wrapper">
        <main className="py-4 curved-panel-container">
          <div className="row mb-4 align-items-center text-center px-3">
            <div className="col-12">
              <h1 className="main-content-title">Nectar Dataset Management</h1>
              <p className="main-content-subtitle">Get Your Dataset Link</p>
            </div>
          </div>

          <div className="role-button-group">
            {rolesList.map((role) => (
              <button
                key={role}
                className={`btn role-button ${selectedRole === role ? "selected" : ""}`}
                onClick={() => {
                  setSelectedRole(role);
                  setExpandedIndex(null);
                }}
              >
                {role}
              </button>
            ))}
          </div>

          {errorRoles && (
            <div className="col-12 text-center text-danger mt-3">
              <p>Failed to load roles. Please ensure the backend is running and accessible (e.g., at http://localhost:5001/api/submission/roles).</p>
            </div>
          )}
          <div className="content-sections-container">
            <section className="user-card-section">
              <h2>Role Entries</h2>
              <div className="cards-grid">
                {selectedEntries.length > 0 ? (
                  selectedEntries.map((entry, index) => (
                    <div
                      className="card role-entry-item"
                      key={index}
                      onClick={() => toggleExpand(index)}
                      aria-expanded={expandedIndex === index}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") toggleExpand(index);
                      }}
                    >
                      <span className="role-title">{selectedRole}</span>
                      <span className="role-name">
                        {entry.employeeName}
                        <span className="arrow">
                          {expandedIndex === index ? "▲" : "▼"}
                        </span>
                      </span>

                      {expandedIndex === index && (
                        <>
                          <p>
                            <strong>Dataset:</strong>{" "}
                            {entry.datasetLink ? (
                              <a href={entry.datasetLink} target="_blank" rel="noreferrer" className="text-info">
                                {entry.datasetLink}
                              </a>
                            ) : (
                              "None"
                            )}
                          </p>
                          {/* Display Title, District, State */}
                          {entry.title && (
                            <p>
                              <strong>Title:</strong> {entry.title}
                            </p>
                          )}
                          {entry.district && (
                            <p>
                              <strong>District:</strong> {entry.district}
                            </p>
                          )}
                          {entry.state && (
                            <p>
                              <strong>State:</strong> {entry.state}
                            </p>
                          )}
                          {/* Removed the duplicate 'Link' field here */}
                          <div className="details">
                            <strong>About Dataset:</strong>
                            <ul>
                              {entry.aboutDataset ? (
                                <li>{entry.aboutDataset}</li>
                              ) : (
                                <li>No description available</li>
                              )}
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                ) : selectedRole ? (
                  <p className="text-center">
                    No entries for <strong>{selectedRole}</strong>.
                  </p>
                ) : (
                  <p className="text-center">
                    Select a role to view assignments.
                  </p>
                )}
              </div>
            </section>

            {errorResources && (
              <div className="col-12 text-center text-danger mt-3">
                <p>Failed to load resources. Please ensure the backend is running and accessible (e.g., at http://localhost:5001/api/resources).</p>
              </div>
            )}

          </div>
        </main>
      </div>

      <footer className="site-footer">
        <div className="container">
          <p>&copy; 2025 Nectar Infotel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}