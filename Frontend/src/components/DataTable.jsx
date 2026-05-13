import React from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const DataTable = ({ title, columns, data, onSearch }) => {
  return (
    <div className="data-table-container">
      <div className="table-header">
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{title}</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input type="text" placeholder="Search..." onChange={(e) => onSearch(e.target.value)} />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Showing {data.length} results</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" style={{ padding: '4px' }}><ChevronLeft size={20} /></button>
          <button className="btn-secondary" style={{ padding: '4px' }}><ChevronRight size={20} /></button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
