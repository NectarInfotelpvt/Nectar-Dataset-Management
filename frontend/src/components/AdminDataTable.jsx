// src/components/DataTable.jsx
import React from 'react';

const themeColors = {
    pageBackgroundGradient: "linear-gradient(to bottom right, #e8f0f7, #cce0f2)",
    primaryGradient: "linear-gradient(to right, #0056b3, #007bff, #0099ff)",
    lightText: '#1a3044',
    grayText: '#6a7e93',
    black: "#000000",
    white: "#FFFFFF",
    lightCardBackground: '#f0f8ff',
    lighterCardBackground: '#e0f2f7',
    lightCardBorder: '#add8e6',
    lightButtonSelectedBg: '#0b7cd8',
    lightLink: '#0b7cd8',
    accentOrange: '#FF7043',
    accentOrangeHover: '#E65100',
    // New color for delete button
    dangerButtonBg: '#dc3545', // Standard Bootstrap red
    dangerButtonHoverBg: '#c82333', // Darker red on hover
};

// Define the columns you want to display in the table
const columns = [
  { header: 'Type', accessor: 'type' },
  { header: 'Employee Name', accessor: 'employeeName' },
  { header: 'Role / Designation', accessor: 'roleName' },
  { header: 'Title', accessor: 'title' },
  { header: 'District', accessor: 'district' },
  { header: 'State', accessor: 'state' },
  { header: 'Link', accessor: 'link' },
  { header: 'About / Extra Info', accessor: 'aboutExtraInfo' }, // Changed accessor for clarity
  { header: 'Actions', accessor: 'actions' }, // Add Actions column for delete button
];

const DataTable = ({ data, searchQuery, onSearchChange, onDelete }) => { // Added onDelete prop
  return (
    <div className="row justify-content-center table-wrapper-row">
      <div className="col-12 mb-4">
        <div className="table-search-card-wrapper">
          <input
            type="text"
            className="form-control mb-3 table-search-input"
            placeholder="Search all data (Employee, Role, Title, District, State, Link, About/Extra Info)"
            value={searchQuery}
            onChange={onSearchChange}
          />

          <div className="card admin-table-card">
            <div className="card-header">All Data Catalog</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-light table-striped table-hover table-custom-header mb-0">
                  <thead>
                    <tr>
                      {columns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, idx) => (
                      <tr key={item._id || idx}> {/* Use item._id for key if available, fallback to idx */}
                        <td>{item.type}</td>
                        <td>{item.employeeName || '-'}</td>
                        <td>{item.roleName || '-'}</td>
                        <td>{item.title || '-'}</td>
                        <td>{item.district || '-'}</td>
                        <td>{item.state || '-'}</td>
                        <td>
                          {(item.type === 'Role' && item.datasetLink) || (item.type === 'Resource' && item.link) ? (
                            <a
                              href={item.type === 'Role' ? item.datasetLink : item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="table-link"
                            >
                              View
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="text-truncate" style={{ maxWidth: '200px' }}
                            title={
                                item.type === 'Role'
                                    ? item.aboutDataset
                                    : (item.extra && Object.entries(item.extra).map(([key, val]) => `${key}: ${val}`).join(', '))
                            }
                        >
                          {item.type === 'Role' ? (
                            item.aboutDataset || '-'
                          ) : (
                            item.extra && Object.entries(item.extra).length > 0 ? (
                              Object.entries(item.extra).map(([key, val]) => (
                                <div key={key}>
                                  <strong>{key}:</strong> {val}
                                </div>
                              ))
                            ) : (
                              '-'
                            )
                          )}
                        </td>
                        <td>
                          {/* Delete button */}
                          <button
                            className="delete-btn" // Custom class for styling
                            onClick={() => onDelete(item._id, item.type)}
                          >
                            Delete
                          </button>
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

      <style jsx>{`
        .table-wrapper-row { margin-top: 2rem; }
        .table-search-card-wrapper {
          background-color: ${themeColors.lightCardBackground};
          border: 1px solid ${themeColors.lightCardBorder};
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .table-search-card-wrapper:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .table-search-input {
            width: 100%;
            margin-bottom: 20px;
            border-radius: 8px;
            border: 1px solid ${themeColors.lightCardBorder};
            padding: 10px 15px;
            color: ${themeColors.lightText};
            background-color: ${themeColors.white};
        }
        .admin-table-card {
            border: none;
            box-shadow: none;
            background-color: transparent;
        }
        .admin-table-card .card-header {
            background-color: ${themeColors.lightButtonSelectedBg};
            color: ${themeColors.white};
            font-size: 1.4rem;
            font-weight: 600;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 0;
            border-bottom: none;
        }
        .table-custom-header th {
            background-color: ${themeColors.primaryGradient};
            color: ${themeColors.white};
            font-weight: 600;
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255,255,255,0.3);
            white-space: nowrap;
        }
        .table-custom-header thead tr:first-child th:first-child {
            border-top-left-radius: 12px;
        }
        .table-custom-header thead tr:first-child th:last-child {
            border-top-right-radius: 12px;
        }
        .table-light tbody tr {
            background-color: ${themeColors.white};
            border-bottom: 1px solid ${themeColors.lightCardBorder};
        }
        .table-light tbody tr:last-child {
            border-bottom: none;
        }
        .table-light tbody tr:hover {
            background-color: ${themeColors.lighterCardBackground};
        }
        .table-light tbody td {
            padding: 12px 15px;
            color: ${themeColors.lightText};
            vertical-align: middle;
        }
        .table-link {
          color: ${themeColors.lightLink};
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .table-link:hover {
          color: ${themeColors.lightButtonSelectedBg};
          text-decoration: underline;
        }
        .text-truncate {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: help;
        }

        /* --- Styles for the Delete Button --- */
        .delete-btn {
            background-color: ${themeColors.dangerButtonBg};
            color: ${themeColors.white};
            border: none;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .delete-btn:hover {
            background-color: ${themeColors.dangerButtonHoverBg};
            transform: translateY(-1px);
        }
        .delete-btn:active {
            transform: translateY(0);
        }

        @media (max-width: 768px) {
          .table-search-card-wrapper { padding: 20px; }
          .table-search-input { padding: 8px 12px; font-size: 0.9rem; }
          .admin-table-card .card-header { font-size: 1.2rem; padding: 12px 15px; }
          .table-custom-header th, .table-light tbody td { padding: 10px 12px; font-size: 0.85rem; }
          .delete-btn { padding: 6px 10px; font-size: 0.8rem; }
        }
        @media (max-width: 576px) {
            .table-search-card-wrapper { padding: 15px; }
            .admin-table-card .card-header { font-size: 1rem; padding: 10px 12px; }
            .table-responsive { overflow-x: auto; }
            .table-light tbody td { font-size: 0.8rem; white-space: nowrap; }
            .table-custom-header th { font-size: 0.85rem; }
            .delete-btn { padding: 5px 8px; font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default DataTable;