import React, { useState } from 'react';
import { formatTime } from '../../utils/dataHelpers';
import { getBatteryColor } from '../../utils/batteryColor';
import './Table.css';

interface TableProps {
  columns: any[];
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 12;

  const startIndex = pageIndex * pageSize;
  const currentPageData = data.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex < 0 || newPageIndex >= totalPages) return;
    setPageIndex(newPageIndex);
  };

  const renderBattery = (batteryLevel: number) => {
    const batteryColor = getBatteryColor(batteryLevel);
    return (
      <div className="battery-cell">
        <span>{batteryLevel}%</span>
        <div
          className="battery-bar"
          style={{ width: `${batteryLevel}%`, backgroundColor: batteryColor }}
        />
      </div>
    );
  };

  const renderStatus = (status: string) => {
    const isActive = status.toLowerCase() === 'active';
    return (
      <div className={`status-cell ${isActive ? 'active' : 'inactive'}`}>
        <div className={`status-indicator ${isActive ? 'active' : 'inactive'}`} />
        <span>{status}</span>
      </div>
    );
  };

  const renderAlertType = (alertType: string) => {
    const alertClass = alertType.toLowerCase();
    return (
      <div className={`alert-type-cell ${alertClass}`}>
        <div className={`alert-dot ${alertClass}`}></div>
        <span>{alertType}</span>
      </div>
    );
  };

  return (
    <div className="table-container">
      <table className="table-container__table">
        <thead>
          <tr className="table-container__table-header">
            {columns.map((col) => (
              <th key={col.accessor} className="table-container__table-cell">
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-container__table-row">
              {columns.map((col) => (
                <td
                  key={col.accessor}
                  className={`table-container__table-cell ${col.accessor.replace('_', '-')}`}
                >
                  {col.accessor === 'alert_type' ? (
                    renderAlertType(row[col.accessor])
                  ) : col.accessor === 'alert_time' ? (
                    formatTime(new Date(row[col.accessor]))
                  ) : col.accessor === 'data_type' ? (
                    <div className="data-type">
                      <span className="data-type__dot"></span>
                      {row[col.accessor].replace('_', ' ').toUpperCase()}
                    </div>
                  ) : col.accessor === 'battery_level' ? (
                    renderBattery(row[col.accessor])
                  ) : col.accessor === 'status' ? (
                    renderStatus(row[col.accessor])
                  ) : (
                    row[col.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-container__pagination">
        <span className="table-container__page-info">
          Page {pageIndex + 1} of {totalPages}
        </span>
        <div className="table-container__pagination-buttons">
          <button
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className={`table-container__pagination-button ${pageIndex === 0 ? 'table-container__pagination-button--disabled' : ''}`}
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={pageIndex + 1 === totalPages}
            className={`table-container__pagination-button ${pageIndex + 1 === totalPages ? 'table-container__pagination-button--disabled' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;