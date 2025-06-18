import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Define theme colors directly within the component
const themeColors = {
  // Main background gradient for the page
  pageBackgroundGradient: "linear-gradient(to bottom right, #e8f0f7, #cce0f2)",

  // Header and primary accent blue gradient
  primaryGradient: "linear-gradient(to right, #0056b3, #007bff, #0099ff)",

  // Text colors for light theme
  lightText: '#1a3044',
  grayText: '#6a7e93',
  black: "#000000",

  // Card backgrounds and borders - Introducing lighter blues
  white: "#FFFFFF",
  lightCardBackground: '#f0f8ff', // Very light blue for card background (Alice Blue)
  lighterCardBackground: '#e0f2f7', // Slightly lighter blue for hover/subtle variations (Light Cyan tint)
  lightCardBorder: '#add8e6', // Light blue for borders (Light Blue)

  // Button and interactive element colors
  lightButtonSelectedBg: '#0b7cd8',
  lightLink: '#0b7cd8',

  // Accent Orange for primary actions
  accentOrange: '#FF7043',
  accentOrangeHover: '#E65100',
};

export default function AdminPanel() {
  const [rolesData, setRolesData] = useState({});
  const [formState, setFormState] = useState({
    employeeName: "",
    roleName: "",
    datasetLink: "",
    usersList: "",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [resourcesData, setResourcesData] = useState([]);
  const [showAllTables, setShowAllTables] = useState(false);
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchResourceDistrict, setSearchResourceDistrict] = useState("");

  const fetchRoles = useCallback(async () => {
    try {
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
          alert("Received unexpected data format from roles API or no roles found.");
      }

    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRolesData({});
      alert("Failed to load roles from the server. Please check the backend and network.");
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetch("http://localhost:5001/api/resources")
      .then((res) => res.json())
      .then((data) => {
        setResourcesData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch resources:", err);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "roleName") {
      if (value === "__new__") {
        setIsCustomRole(true);
        setFormState((prev) => ({ ...prev, roleName: "" }));
      } else {
        setIsCustomRole(false);
        setFormState((prev) => ({ ...prev, roleName: value }));
      }
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { employeeName, roleName, datasetLink, usersList } = formState;

    if (
      !employeeName.trim() ||
      !roleName.trim() ||
      !datasetLink.trim() ||
      !usersList.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/submission/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeName, roleName, datasetLink, usersList }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Submission saved successfully.");
        fetchRoles(); // Re-fetch roles to update the dropdown
        setFormState({
          employeeName: "",
          roleName: "",
          datasetLink: "",
          usersList: "",
        });
        setIsCustomRole(false);
      } else {
        alert(data.message || "Server rejected the submission.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to connect to backend.");
    }
  };

  function ResourceForm() {
    const [extraFields, setExtraFields] = React.useState([]);
    const [formData, setFormData] = React.useState({
      title: "",
      district: "",
      state: "",
      link: "",
      extra: {},
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleExtraChange = (index, e) => {
      const { name, value } = e.target;
      setExtraFields((prev) => {
        const newFields = [...prev];
        newFields[index][name] = value;
        return newFields;
      });
    };

    const addExtraField = () => {
      setExtraFields((prev) => [...prev, { label: "", value: "" }]);
    };

    const removeExtraField = (index) => {
      setExtraFields((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (
        !formData.title.trim() ||
        !formData.district.trim() ||
        !formData.state.trim() ||
        !formData.link.trim()
      ) {
        alert("Please fill all required fields.");
        return;
      }

      const extraData = {};
      extraFields.forEach((field) => {
        if (field.label.trim()) {
          extraData[field.label.trim()] = field.value.trim();
        }
      });

      const payload = {
        title: formData.title.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
        link: formData.link.trim(),
        extra: extraData,
      };

      try {
        const res = await fetch("http://localhost:5001/api/resources/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Resource added successfully!");
          setFormData({
            title: "",
            district: "",
            state: "",
            link: "",
            extra: {},
          });
          setExtraFields([]);
          fetch("http://localhost:5001/api/resources")
            .then((res) => res.json())
            .then((data) => {
              setResourcesData(data);
            })
            .catch((err) => {
              console.error("Failed to fetch resources:", err);
            });
        } else {
          alert(data.message || "Failed to add resource.");
        }
      } catch (error) {
        console.error("Error adding resource:", error);
        alert("Error connecting to server.");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="district" className="form-label">
            District *
          </label>
          <input
            type="text"
            id="district"
            name="district"
            className="form-control"
            value={formData.district}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="state" className="form-label">
            State *
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className="form-control"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="link" className="form-label">
            Link *
          </label>
          <input
            type="url"
            id="link"
            name="link"
            className="form-control"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>

        {extraFields.length > 0 &&
          extraFields.map((field, idx) => (
            <div key={idx} className="mb-3 border p-2 rounded">
              <div className="mb-2">
                <label className="form-label">Extra Field Label</label>
                <input
                  type="text"
                  className="form-control"
                  name="label"
                  value={field.label}
                  onChange={(e) => handleExtraChange(idx, e)}
                  placeholder="Field name"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Extra Field Value</label>
                <input
                  type="text"
                  className="form-control"
                  name="value"
                  value={field.value}
                  onChange={(e) => handleExtraChange(idx, e)}
                  placeholder="Field value"
                />
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeExtraField(idx)}
              >
                Remove
              </button>
            </div>
          ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addExtraField}
        >
          + Add More Fields
        </button>

        <br />

        <button type="submit" className="btn submit-btn">
          Add Resource
        </button>
      </form>
    );
  }

  // Filtered resources based on search input
  const filteredResources = resourcesData.filter(res =>
    res.district.toLowerCase().includes(searchResourceDistrict.toLowerCase())
  );

  return (
    <div className="admin-panel-container">
      {/* Google Font Import */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* TOP GRADIENT SECTION (FIXED HEADER) */}
      <div className="fixed-header-top-bar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="logo" style={{ display: "flex", alignItems: "center" }}>
              <img
                src="nectar-logo.png"
                alt="Logo"
                style={{ width: "30px", height: "25px", marginRight: "8px" }}
              />
              Nectar Infotel <span></span>
            </div>
          </div>
        </nav>
      </div>

      {/* Admin Panel Title outside the fixed header */}
      <div className="admin-panel-title-outside-header-wrapper">
        <h1 className="admin-panel-title-outside-header">Admin Panel - Manage All Data Set Links</h1>
      </div>


      {/* MAIN CONTENT AREA - Pushed down by header, will contain the scrolling curved panel */}
      <div className="main-content-area">
        <main className="container py-4 curved-panel">
          <br />

          <div className="row gy-4 justify-content-center">
            {/* Section 1: Add / Update Role & Users */}
            <div className="col-12 col-md-10 col-lg-5 mb-4">
              <section className="admin-card-section">
                <h2>Add / Update Role & Users</h2>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="employeeName" className="form-label">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      id="employeeName"
                      name="employeeName"
                      className="form-control"
                      value={formState.employeeName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="roleSelect" className="form-label">
                      Role / Designation
                    </label>
                    <select
                      id="roleSelect"
                      name="roleName"
                      className="form-select"
                      value={isCustomRole ? "__new__" : formState.roleName}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">-- Select Role --</option>
                      {Object.keys(rolesData).map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                      <option value="__new__">Add New Role</option>
                    </select>
                  </div>

                  {isCustomRole && (
                    <div className="mb-3">
                      <label htmlFor="customRole" className="form-label">
                        Enter New Role
                      </label>
                      <input
                        type="text"
                        id="customRole"
                        className="form-control"
                        value={formState.roleName}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, roleName: e.target.value }))
                        }
                        placeholder="Enter new role name"
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="datasetLink" className="form-label">
                      Dataset Link
                    </label>
                    <input
                        type="url"
                        id="datasetLink"
                        name="datasetLink"
                        className="form-control"
                        value={formState.datasetLink}
                        onChange={handleInputChange}
                        placeholder="https://example.com/dataset"
                        required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="usersList" className="form-label">
                      About Dataset
                    </label>
                    <input
                      type="text"
                      id="usersList"
                      name="usersList"
                      className="form-control"
                      value={formState.usersList}
                      onChange={handleInputChange}
                      placeholder=""
                      required
                    />
                  </div>

                  <button type="submit" className="btn submit-btn">
                    Submit
                  </button>
                </form>
              </section>
            </div>

            <div className="col-12 col-md-10 col-lg-5 mb-4">
              {/* Section 2: Add Dataset / Report Resource */}
              <section className="admin-card-section">
                <h2>Add Dataset / Report Resource</h2>
                <ResourceForm />
              </section>
            </div>
          </div>

          {/* Merged Button to show/hide tables */}
          <div className="d-flex justify-content-center my-4">
            <button
              className="btn show-hide-tables-btn"
              onClick={() => setShowAllTables((prev) => !prev)}
            >
              {showAllTables ? "Hide Tables" : "Show Tables"}
            </button>
          </div>

          {showAllTables && (
            <div className="row justify-content-center table-wrapper-row">
              {/* Roles Table */}
              <div className="col-12 col-lg-6 mb-4">
                <div className="table-search-card-wrapper">
                  <input
                    type="text"
                    className="form-control mb-3 table-search-input"
                    placeholder="Search by Employee Name"
                    value={searchEmployee}
                    onChange={(e) => setSearchEmployee(e.target.value)}
                  />

                  <div
                    className="card admin-table-card"
                  >
                    <div className="card-header">Roles Overview</div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-light table-striped table-hover table-custom-header mb-0">
                          <thead>
                            <tr>
                              <th>Role</th>
                              <th>Employee Name</th>
                              <th>Dataset Link</th>
                              <th>About Dataset</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(rolesData).map(([role, entries]) =>
                              entries
                                .filter((entry) =>
                                  entry.employeeName
                                    .toLowerCase()
                                    .includes(searchEmployee.toLowerCase())
                                )
                                .map((entry, idx) => (
                                  <tr key={`${role}-${idx}`}>
                                    <td>{role}</td>
                                    <td>{entry.employeeName}</td>
                                    <td>
                                      <a
                                        href={entry.datasetLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="table-link"
                                      >
                                        Link
                                      </a>
                                    </td>
                                    <td>
                                      {Array.isArray(entry.users) && entry.users.length > 0
                                          ? (typeof entry.users[0] === 'object' && entry.users[0] !== null && entry.users[0]._id)
                                              ? String(entry.users[0]._id)
                                              : String(entry.users.join(', '))
                                          : String(entry.users || '')
                                      }
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Table */}
              <div className="col-12 col-lg-6 mb-4">
                <div className="table-search-card-wrapper">
                  <input
                    type="text"
                    className="form-control mb-3 table-search-input"
                    placeholder="Search by District"
                    value={searchResourceDistrict}
                    onChange={(e) => setSearchResourceDistrict(e.target.value)}
                  />
                  <div
                    className="card admin-table-card"
                  >
                    <div className="card-header">Resource Catalog</div>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table table-light table-striped table-hover table-custom-header mb-0">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>District</th>
                              <th>State</th>
                              <th>Link</th>
                              <th>Extra Info</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredResources.map((res, idx) => (
                              <tr key={idx}>
                                <td>{res.title}</td>
                                <td>{res.district}</td>
                                <td>{res.state}</td>
                                <td>
                                  <a
                                    href={res.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="table-link"
                                  >
                                    Link
                                  </a>
                                </td>
                                <td>
                                  {res.extra &&
                                    Object.entries(res.extra).map(([key, val]) => (
                                      <div key={key}>
                                        <strong>{key}:</strong> {val}
                                      </div>
                                    ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer>
        <small>© {new Date().getFullYear()} Nectar Infotel. All rights reserved.</small>
      </footer>

      <style jsx>{`
        /* --- Global Styles & Layout --- */
        .admin-panel-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: ${themeColors.pageBackgroundGradient};
          font-family: 'Inter', sans-serif;
          color: ${themeColors.lightText};
          overflow-x: hidden;
          padding-top: 100px; /* Adjusted to account for increased header height */
        }

        /* --- Header Styles --- */
        .fixed-header-top-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100px; /* Increased header height */
          background: ${themeColors.primaryGradient};
          color: ${themeColors.white};
          z-index: 1000;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center; /* Vertically center content */
          padding: 0 1.5rem; /* Consistent padding */
          border-bottom-left-radius: 15%; /* Rounded bottom-left corner */
          border-bottom-right-radius: 15%; /* Rounded bottom-right corner */
        }

        .navbar {
          width: 100%; /* Ensure navbar takes full width within the header */
          padding: 0; /* Remove default navbar padding as it's handled by fixed-header-top-bar */
        }

        .logo {
          font-size: 28px; /* Slightly larger logo text */
          font-weight: bold;
          color: ${themeColors.white};
          display: flex;
          align-items: center;
        }
        .logo img {
            filter: brightness(0) invert(1);
        }

        /* Admin Panel Title outside header */
        .admin-panel-title-outside-header-wrapper {
            width: 100%;
            text-align: center;
            padding: 20px 1rem 10px;
            color: ${themeColors.black};
            font-family: 'Inter', sans-serif;
            margin-top: 100px; /* Pushes content down below the fixed header */
        }

        .admin-panel-title-outside-header {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 0;
        }

        /* --- Main Content Area --- */
        .main-content-area {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px 0;
        }

        .curved-panel {
          background-color: ${themeColors.white};
          border-radius: 20px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          padding: 30px;
          width: 95%;
          max-width: 1200px;
          margin-top: 0;
        }

        /* --- Card Sections (Forms) --- */
        .admin-card-section {
          background-color: ${themeColors.lightCardBackground}; /* Subtle light blue */
          border: 1px solid ${themeColors.lightCardBorder};
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Softer shadow */
          color: ${themeColors.lightText};
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .admin-card-section:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .admin-card-section h2 {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: ${themeColors.lightText};
        }

        /* --- Form Elements --- */
        .form-label {
          font-weight: 500;
          color: ${themeColors.lightText};
          margin-bottom: .5rem;
        }

        .form-control, .form-select {
          border: 1px solid ${themeColors.lightCardBorder};
          border-radius: 8px;
          padding: 10px 15px;
          color: ${themeColors.lightText};
          background-color: ${themeColors.white};
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control::placeholder, .form-select::placeholder {
            color: ${themeColors.grayText};
        }
        .form-control:focus, .form-select:focus {
            outline: none;
            border-color: ${themeColors.lightButtonSelectedBg};
            box-shadow: 0 0 0 3px rgba(11, 124, 216, 0.2);
        }

        .submit-btn, .btn-secondary {
          background-color: ${themeColors.accentOrange};
          color: ${themeColors.white};
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
        }
        .submit-btn:hover, .btn-secondary:hover {
            background-color: ${themeColors.accentOrangeHover};
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 112, 67, 0.4);
        }

        .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
            color: ${themeColors.white};
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        .btn-danger:hover {
            background-color: #c82333;
            transform: translateY(-1px);
        }

        /* --- Show/Hide Tables Button --- */
        .show-hide-tables-btn {
          background-color: ${themeColors.lightButtonSelectedBg};
          color: ${themeColors.white};
          border: none;
          border-radius: 8px;
          padding: 10px 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
        }
        .show-hide-tables-btn:hover {
            background-color: ${themeColors.lightLink};
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(11, 124, 216, 0.3);
        }

        /* --- Tables --- */
        .table-wrapper-row {
            margin-top: 2rem;
        }

        .table-search-card-wrapper {
            padding: 10px;
        }

        .table-search-input {
            width: 100%;
        }

        .admin-table-card {
          max-height: 350px;
          overflow-y: auto;
          background-color: ${themeColors.lightCardBackground}; /* Subtle light blue */
          border: 1px solid ${themeColors.lightCardBorder};
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          color: ${themeColors.lightText};
        }
        .admin-table-card .card-header {
            background-color: ${themeColors.lightButtonSelectedBg};
            color: ${themeColors.white};
            font-weight: 600;
            font-size: 1.1rem;
            border-bottom: 1px solid ${themeColors.lightButtonSelectedBg};
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            padding: 1rem 1.25rem;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .table-custom-header thead th {
          background-color: ${themeColors.lightButtonSelectedBg};
          color: ${themeColors.white};
          border-bottom: 2px solid ${themeColors.lightButtonSelectedBg};
          white-space: nowrap;
        }

        .table-light tbody tr {
          color: ${themeColors.lightText};
        }
        .table-light tbody tr:nth-of-type(odd) {
          background-color: ${themeColors.lighterCardBackground}; /* Lighter blue for odd rows */
        }
        .table-light tbody tr:hover {
            background-color: ${themeColors.lightCardBorder}; /* Light blue on row hover */
        }

        .table-link {
          color: ${themeColors.lightLink};
          text-decoration: none;
          transition: color 0.2s ease, text-decoration 0.2s ease;
        }
        .table-link:hover {
          color: ${themeColors.lightButtonSelectedBg};
          text-decoration: underline;
        }

        /* --- Footer --- */
        footer {
          text-align: center;
          padding: 20px;
          font-size: 0.85rem;
          color: ${themeColors.lightText};
          background-color: ${themeColors.white}; /* White footer for contrast */
          border-top: 1px solid ${themeColors.lightCardBorder};
        }

        /* --- Media Queries for Responsiveness --- */
        @media (max-width: 767.98px) {
            .admin-panel-container {
                padding-top: 80px; /* Adjusted for larger header */
            }
            .fixed-header-top-bar {
                height: 80px; /* Smaller height on mobile */
                padding: 0 1rem;
                border-bottom-left-radius: 10%; /* Smaller radius on mobile */
                border-bottom-right-radius: 10%;
            }
            .logo {
                font-size: 20px;
            }
            .admin-panel-title-outside-header-wrapper {
                margin-top: 80px; /* Adjust margin-top for smaller header */
                padding: 15px 1rem 5px;
            }
            .admin-panel-title-outside-header {
                font-size: 1.5rem;
            }
            .curved-panel {
                padding: 20px;
                width: 98%;
            }
            .admin-card-section {
                padding: 20px;
            }
            .admin-table-card {
                max-height: 250px;
            }
        }

        @media (min-width: 768px) {
            .admin-panel-title-outside-header {
                font-size: 2.8rem;
            }
            .admin-panel-title-outside-header-wrapper {
                padding: 30px 1rem 15px;
            }
        }

        @media (min-width: 992px) {
            .admin-panel-title-outside-header {
                font-size: 3rem;
            }
        }
      `}</style>
    </div>
  );
}