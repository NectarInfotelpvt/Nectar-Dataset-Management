// src/pages/AdminPanel.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable from "../components/AdminDataTable";
import "../page.css/adminPanel.css"; // Ensure this path is correct

export default function AdminPanel() {
  const [rolesData, setRolesData] = useState({});
  const [formState, setFormState] = useState({
    employeeName: "",
    roleName: "",
    datasetLink: "",
    aboutDataset: "",
  });
  const [isCustomRole, setIsCustomRole] = useState(false);

  const [resourceFormState, setResourceFormState] = useState({
    title: "",
    district: "",
    state: "",
  });
  const [resourceExtraFields, setResourceExtraFields] = useState([]);

  const [resourcesData, setResourcesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTable, setShowTable] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/submission/roles`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const apiResponseData = await res.json();
      if (typeof apiResponseData === 'object' && apiResponseData !== null && !Array.isArray(apiResponseData)) {
          setRolesData(apiResponseData);
      } else {
          console.warn("API response for roles is not in the expected {roleName: [...]} format:", apiResponseData);
          setRolesData({});
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRolesData({});
    }
  }, []);

  const fetchResources = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResourcesData(data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchResources();
  }, [fetchRoles, fetchResources]);

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

  const handleResourceInputChange = (e) => {
    const { name, value } = e.target;
    setResourceFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceExtraChange = (index, e) => {
    const { name, value } = e.target;
    setResourceExtraFields((prev) => {
      const newFields = [...prev];
      newFields[index] = { ...newFields[index], [name]: value };
      return newFields;
    });
  };

  const addResourceExtraField = () => {
    setResourceExtraFields((prev) => [...prev, { label: "", value: "" }]);
  };

  const removeResourceExtraField = (index) => {
    setResourceExtraFields((prev) => prev.filter((_, i) => i !== index));
  };


  const handleCombinedSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      employeeName: formState.employeeName.trim(),
      roleName: formState.roleName.trim(),
      datasetLink: formState.datasetLink.trim(),
      aboutDataset: formState.aboutDataset.trim(),
      title: resourceFormState.title.trim(),
      district: resourceFormState.district.trim(),
      state: resourceFormState.state.trim(),
      link: formState.datasetLink.trim(),
      extra: {},
    };

    resourceExtraFields.forEach((field) => {
      if (field.label.trim()) {
        payload.extra[field.label.trim()] = field.value.trim();
      }
    });

    console.log("Payload being sent:", payload);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submission/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Data submitted successfully!");
        fetchRoles();
        fetchResources();
        setFormState({
          employeeName: "",
          roleName: "",
          datasetLink: "",
          aboutDataset: "",
        });
        setIsCustomRole(false);
        setResourceFormState({
          title: "",
          district: "",
          state: "",
        });
        setResourceExtraFields([]);
      } else {
        alert(data.message || "Server rejected the submission. Please check your inputs.");
      }
    } catch (error) {
      console.error("Error submitting combined data:", error);
      alert("Failed to connect to backend for data submission.");
    }
  };

  // --- START: Re-adding handleDelete functionality ---
  const handleDelete = async (id, type) => {
    if (!id) {
      alert("Error: Item ID is missing for deletion.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete this ${type} entry? This action cannot be undone.`)) {
      return;
    }

    try {
      let apiUrl = '';
      if (type === 'Role') {
        apiUrl = `${import.meta.env.VITE_API_URL}/api/submission/delete/${id}`;
      } else if (type === 'Resource') {
        apiUrl = `${import.meta.env.VITE_API_URL}/api/resources/${id}`;
      } else {
        alert("Unknown item type for deletion.");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Entry deleted successfully!");
        fetchRoles();
        fetchResources();
      } else {
        alert(data.message || "Failed to delete the entry.");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to connect to backend for deletion.");
    }
  };
  // --- END: Re-adding handleDelete functionality ---


  const allTableData = useMemo(() => {
    const combined = [];

    // Process Roles Data
    Object.entries(rolesData).forEach(([role, entries]) => {
      entries.forEach(entry => {
        const actualAboutDataset = entry.users ? entry.users.join(', ') : '';
        combined.push({
          type: 'Role',
          _id: entry._id, // Ensure _id is included for deletion
          roleName: role,
          employeeName: entry.employeeName || '-',
          datasetLink: entry.datasetLink,
          aboutDataset: actualAboutDataset,
          title: entry.title || '-',
          district: entry.district || '-',
          state: entry.state || '-',
          link: entry.datasetLink,
          extra: entry.extra || null,
        });
      });
    });

    // Process Resources Data
    resourcesData.forEach(res => {
      combined.push({
        type: 'Resource',
        _id: res._id, // Ensure _id is included for deletion
        roleName: '',
        employeeName: '',
        datasetLink: '',
        aboutDataset: '',
        title: res.title || '-',
        district: res.district || '-',
        state: res.state || '-',
        link: res.link,
        extra: res.extra,
      });
    });

    const lowerCaseQuery = searchQuery.toLowerCase();
    return combined.filter(item =>
      (item.employeeName && item.employeeName.toLowerCase().includes(lowerCaseQuery)) ||
      (item.roleName && item.roleName.toLowerCase().includes(lowerCaseQuery)) ||
      (item.title && item.title.toLowerCase().includes(lowerCaseQuery)) ||
      (item.district && item.district.toLowerCase().includes(lowerCaseQuery)) ||
      (item.state && item.state.toLowerCase().includes(lowerCaseQuery)) ||
      (item.aboutDataset && item.aboutDataset.toLowerCase().includes(lowerCaseQuery)) ||
      (item.link && item.link.toLowerCase().includes(lowerCaseQuery)) ||
      (item.extra && typeof item.extra === 'object' && JSON.stringify(item.extra).toLowerCase().includes(lowerCaseQuery))
    );
  }, [rolesData, resourcesData, searchQuery]);


  return (
    <div className="admin-panel-container">
      <div className="fixed-header-top-bar">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="logo">
              {/* ADDED: Icon for the logo (Font Awesome example) */}
              <img
                src="/nectar-logo.png"
                alt="Nectar Logo"
                style={{ width: "30px", height: "25px", marginRight: "8px" }}
              />
              Nectar Infotel
            </div>
          </div>
        </nav>
      </div>

      <div className="admin-panel-title-outside-header-wrapper">
        <h1 className="admin-panel-title-outside-header">Admin Panel - Manage Data & Resources</h1>
      </div>

      <div className="main-content-area">
        <main className="container py-4 curved-panel">
          <br />

          <div className="row justify-content-center">
            <div className="col-12 mb-4 d-flex">
              <section className="admin-card-section w-100">
                {/* ADDED: Icon for the section title (Font Awesome example) */}
                <h2><i className="fas fa-plus-circle"></i> Submit New Entry</h2>
                <form onSubmit={handleCombinedSubmit} noValidate>

                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="roleSelect" className="form-label">
                        Role / Designation
                      </label>
                      <select
                        id="roleSelect"
                        name="roleName"
                        className="form-select"
                        value={isCustomRole ? "__new__" : formState.roleName}
                        onChange={handleInputChange}
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

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={resourceFormState.title}
                        onChange={handleResourceInputChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="district" className="form-label">
                        District
                      </label>
                      <input
                        type="text"
                        id="district"
                        name="district"
                        className="form-control"
                        value={resourceFormState.district}
                        onChange={handleResourceInputChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="state" className="form-label">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="form-control"
                      value={resourceFormState.state}
                      onChange={handleResourceInputChange}
                    />
                  </div>

                  {resourceExtraFields.length > 0 &&
                    resourceExtraFields.map((field, idx) => (
                      <div key={idx} className="mb-3 border p-2 rounded">
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Extra Field Label</label>
                            <input
                              type="text"
                              className="form-control"
                              name="label"
                              value={field.label}
                              onChange={(e) => handleResourceExtraChange(idx, e)}
                              placeholder="Field name"
                            />
                          </div>
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Extra Field Value</label>
                            <input
                              type="text"
                              className="form-control"
                              name="value"
                              value={field.value}
                              onChange={(e) => handleResourceExtraChange(idx, e)}
                              placeholder="Field value"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeResourceExtraField(idx)}
                        >
                          {/* ADDED: Icon for remove button (Font Awesome example) */}
                          <i className="fas fa-trash-alt"></i> Remove
                        </button>
                      </div>
                    ))}

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
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="aboutDataset" className="form-label">
                      About Dataset / General Info
                    </label>
                    <div>
                      <input
                        type="text"
                        id="aboutDataset"
                        name="aboutDataset"
                        className="form-control"
                        value={formState.aboutDataset}
                        onChange={handleInputChange}
                        placeholder="Enter details about the dataset or general information..."
                      />
                    </div>
                  </div>

                  <div className="d-grid gap-2 mb-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addResourceExtraField}
                    >
                      {/* ADDED: Icon for add more fields button (Font Awesome example) */}
                      <i className="fas fa-plus"></i> Add More Fields (for Resources)
                    </button>
                  </div>

                  <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn submit-btn">
                      {/* ADDED: Icon for submit button (Font Awesome example) */}
                      <i className="fas fa-save"></i> Submit Data
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </main>
      </div>

      <div className="container py-4 table-section-container">
        <div className="d-flex justify-content-center mb-4">
          <button
            onClick={() => setShowTable(!showTable)}
            className="btn btn-primary" // Changed to Bootstrap's primary for a standard button look
            style={{ minWidth: '200px' }} // Give it a fixed width for consistent appearance
          >
            {showTable ? (
                <> {/* ADDED: Icons for toggle button (Font Awesome example) */}
                    <i className="fas fa-eye-slash"></i> Hide Data Catalog
                </>
            ) : (
                <>
                    <i className="fas fa-eye"></i> Show All Data Catalog
                </>
            )}
          </button>
        </div>

        {showTable && (
          <section className="admin-data-table-section w-100">
            {/* ADDED: Icon for the table section title (Font Awesome example) */}
            <h2><i className="fas fa-table"></i> All Data Catalog</h2>
            <DataTable
                data={allTableData}
                searchQuery={searchQuery}
                onSearchChange={(e) => setSearchQuery(e.target.value)}
                onDelete={handleDelete}
            />
          </section>
        )}
      </div>

      <footer>
        <small>© {new Date().getFullYear()} Nectar Infotel. All rights reserved.</small>
      </footer>
    </div>
  );
}