import React, { useState, useEffect } from 'react';

const DatabaseViewer = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch tables on component mount
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch(`${API_URL}/db/tables`);
        if (!response.ok) throw new Error('Failed to fetch tables');
        const result = await response.json();
        setTables(result.tables);
        if (result.tables.length > 0) {
          fetchTableData(result.tables[0]);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTables();
  }, [API_URL]);

  const fetchTableData = async (tableName) => {
    setLoading(true);
    setSelectedTable(tableName);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/db/tables/${tableName}`);
      if (!response.ok) throw new Error('Failed to fetch table data');
      const result = await response.json();
      setTableData(result);
    } catch (err) {
      setError(err.message);
      setTableData({ columns: [], data: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (tableName, pkName, pkValue) => {
    if (!window.confirm(`Are you sure you want to permanently delete this record from ${tableName}? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`${API_URL}/db/tables/${tableName}/${pkName}/${pkValue}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete record');
      // Refresh the table data to reflect the deletion
      fetchTableData(tableName);
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  const handleExport = (withData) => {
    const url = `${API_URL}/db/export?withData=${withData}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-screen bg-[#f4f7f9] font-sans text-[#0f172a]">
      {/* Sidebar for Tables */}
      <div className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col h-full shadow-sm">
        <div className="p-6 border-b border-[#e2e8f0]">
          <h2 className="text-xl font-extrabold text-[#1952c4] flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
            DB Viewer
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Tables</div>
          {tables.length === 0 ? (
            <div className="text-sm text-slate-500 px-2">No tables found</div>
          ) : (
            tables.map((table) => (
              <button
                key={table}
                onClick={() => fetchTableData(table)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer border-none flex items-center gap-3 ${selectedTable === table
                    ? 'bg-[#ebf3ff] text-[#1952c4]'
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                {table}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white px-8 py-5 border-b border-[#e2e8f0] flex items-center justify-between shadow-sm z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f172a]">
              {selectedTable ? `Table: ${selectedTable}` : 'Select a table'}
            </h1>
            <p className="text-sm text-[#64748b] font-medium mt-1">
              {tableData.data.length} row{tableData.data.length !== 1 ? 's' : ''} retrieved
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-white border border-[#e2e8f0] hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export DB
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e2e8f0] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <button
                  onClick={() => handleExport(false)}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 border-b border-[#e2e8f0] transition-colors border-none cursor-pointer"
                >
                  Schema Only
                </button>
                <button
                  onClick={() => handleExport(true)}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-none cursor-pointer"
                >
                  Schema + Data
                </button>
              </div>
            </div>
            <button
              onClick={() => fetchTableData(selectedTable)}
              disabled={!selectedTable || loading}
              className="flex items-center gap-2 bg-[#1952c4] hover:bg-[#1546a8] text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
          </div>
        </header>

        {/* Data View */}
        <main className="flex-1 overflow-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-sm font-semibold flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1952c4]"></div>
            </div>
          ) : !selectedTable ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
              <p className="font-semibold text-lg">Select a table from the sidebar</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-[#e2e8f0]/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f0f4f9] border-b border-[#e2e8f0]/60">
                      {tableData.columns.map((col, idx) => (
                        <th key={col.column_name} className={`px-5 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider whitespace-nowrap ${idx === 0 ? 'rounded-tl-3xl' : ''}`}>
                          <div className="flex flex-col">
                            <span>{col.column_name}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 lowercase font-medium">{col.data_type}</span>
                          </div>
                        </th>
                      ))}
                      <th className="px-5 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider whitespace-nowrap rounded-tr-3xl text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-[#0f172a]">
                    {tableData.data.length === 0 ? (
                      <tr>
                        <td colSpan={tableData.columns.length} className="px-5 py-12 text-center text-slate-500 font-medium">
                          No data found in this table
                        </td>
                      </tr>
                    ) : (
                      tableData.data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-[#e2e8f0]/60 hover:bg-slate-50 transition-colors">
                          {tableData.columns.map((col) => (
                            <td key={col.column_name} className="px-5 py-4 max-w-xs truncate" title={String(row[col.column_name])}>
                              {row[col.column_name] === null ? (
                                <span className="text-slate-400 italic">null</span>
                              ) : typeof row[col.column_name] === 'boolean' ? (
                                <span className={row[col.column_name] ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                                  {row[col.column_name].toString()}
                                </span>
                              ) : (
                                String(row[col.column_name])
                              )}
                            </td>
                          ))}
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleDeleteRecord(selectedTable, tableData.columns[0].column_name, row[tableData.columns[0].column_name])}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                              title="Permanently Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DatabaseViewer;
