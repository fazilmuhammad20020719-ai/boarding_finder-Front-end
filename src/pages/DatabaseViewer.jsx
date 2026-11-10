import React, { useState, useEffect } from 'react';
import { getDbTables, getDbTable, deleteDbRecord, exportDb } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Columns to highlight in the Technical Development panel
const SENSITIVE_COLS = ['password', 'password_hash', 'email_otp', 'otp', 'otp_code', 'reset_token'];

const DatabaseViewer = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDevPanel, setShowDevPanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCell, setCopiedCell] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const result = await getDbTables();
        setTables(result.tables);
        if (result.tables.length > 0) {
          fetchTableData(result.tables[0]);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchTables();
  }, []);

  const fetchTableData = async (tableName) => {
    setLoading(true);
    setSelectedTable(tableName);
    setError(null);
    setSearchQuery('');
    try {
      const result = await getDbTable(tableName);
      setTableData(result);
      // Auto-open Dev Panel when the loaded table has sensitive columns
      const hasSensitive = result.columns?.some(col =>
        SENSITIVE_COLS.includes(col.column_name.toLowerCase())
      );
      setShowDevPanel(hasSensitive);
    } catch (err) {
      setError(err.message);
      setTableData({ columns: [], data: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (tableName, pkName, pkValue) => {
    if (!isAdmin) {
      alert('Only admins can delete records.');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete this record from ${tableName}? This action cannot be undone.`)) return;
    try {
      await deleteDbRecord(tableName, pkName, pkValue);
      fetchTableData(tableName);
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
    }
  };

  const handleExport = async (withData) => {
    try {
      const data = await exportDb(withData);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `database_export${withData ? '_with_data' : '_schema_only'}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Error exporting database: ${err.message}`);
    }
  };

  const handleCopyCell = (value, cellKey) => {
    navigator.clipboard.writeText(String(value)).then(() => {
      setCopiedCell(cellKey);
      setTimeout(() => setCopiedCell(null), 1500);
    });
  };

  // Sensitive columns present in the current table
  const sensitiveCols = tableData.columns.filter(col =>
    SENSITIVE_COLS.includes(col.column_name.toLowerCase())
  );

  // Filter rows by search query
  const filteredRows = searchQuery.trim()
    ? tableData.data.filter(row =>
        tableData.columns.some(col => {
          const val = row[col.column_name];
          return val !== null && String(val).toLowerCase().includes(searchQuery.toLowerCase());
        })
      )
    : tableData.data;

  const isSensitive = (colName) => SENSITIVE_COLS.includes(colName.toLowerCase());

  const formatCellValue = (col, value) => {
    if (value === null) return null;
    if (typeof value === 'boolean') return value.toString();
    return String(value);
  };

  return (
    <div className="flex h-screen font-sans text-white" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0d1117 100%)' }}>

      {/* ── Sidebar ── */}
      <div className="w-64 flex-shrink-0 flex flex-col h-full border-r border-[#1f1f1f] shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #141414 0%, #111 100%)' }}>

        {/* Sidebar Header */}
        <div className="p-5 border-b border-[#222]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FACC15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">DB Viewer</h2>
              <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Live Database</p>
            </div>
          </div>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 px-2 pt-1">Tables ({tables.length})</div>
          {tables.length === 0 ? (
            <div className="text-sm text-white/40 px-3 py-4 text-center">No tables found</div>
          ) : (
            tables.map((table) => (
              <button
                key={table}
                onClick={() => fetchTableData(table)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer border-none flex items-center gap-2.5 mb-0.5 ${selectedTable === table
                  ? 'bg-[#FACC15]/15 text-[#FACC15] shadow-sm'
                  : 'bg-transparent text-white/50 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                <svg className="w-3.5 h-3.5 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{table}</span>
                {selectedTable === table && (
                  <span className="ml-auto text-[10px] bg-[#FACC15]/20 text-[#FACC15] px-1.5 py-0.5 rounded-md font-bold">
                    {tableData.data.length}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#1f1f1f]">
          <div className={`text-[10px] font-bold px-3 py-2 rounded-lg text-center ${isAdmin ? 'bg-[#FACC15]/10 text-[#FACC15]' : 'bg-[#1952c4]/10 text-[#60a5fa]'}`}>
            {isAdmin ? '🔑 Admin Access' : '👁 Read-only View'}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="px-8 py-4 border-b border-[#1f1f1f] flex items-center justify-between flex-shrink-0 z-10"
          style={{ background: 'linear-gradient(90deg, #141414 0%, #111 100%)' }}>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                {selectedTable ? (
                  <span className="flex items-center gap-2">
                    <span className="text-white/40 font-normal text-base">table</span>
                    <span className="text-[#FACC15]">{selectedTable}</span>
                  </span>
                ) : (
                  'Select a table'
                )}
              </h1>
              {selectedTable && !loading && (
                <span className="text-xs font-bold bg-[#333]/60 text-white/50 px-2.5 py-1 rounded-full">
                  {filteredRows.length} / {tableData.data.length} rows
                </span>
              )}
            </div>
            <p className="text-xs text-white/30 font-medium mt-0.5">
              BoardingFinder · Technical Development View
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Dev Panel toggle */}
            {sensitiveCols.length > 0 && (
              <button
                onClick={() => setShowDevPanel(!showDevPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border cursor-pointer ${showDevPanel
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                  : 'bg-[#111] border-[#333] text-white/60 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Dev Panel
              </button>
            )}

            {/* Search */}
            {selectedTable && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-3.5 h-3.5 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search rows…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#111] border border-[#333] rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#FACC15]/30 focus:border-[#FACC15]/30 transition-all w-44"
                />
              </div>
            )}

            {/* Export — admin only */}
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-[#111] border border-[#333] hover:bg-[#1a1a1a] text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-[#111] rounded-xl shadow-2xl border border-[#333] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <button onClick={() => handleExport(false)} className="w-full text-left px-4 py-3 text-sm font-semibold text-white hover:bg-[#222] border-b border-[#333] transition-colors border-none cursor-pointer">
                    Schema Only
                  </button>
                  <button onClick={() => handleExport(true)} className="w-full text-left px-4 py-3 text-sm font-semibold text-white hover:bg-[#222] transition-colors border-none cursor-pointer">
                    Schema + Data
                  </button>
                </div>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={() => fetchTableData(selectedTable)}
              disabled={!selectedTable || loading}
              className="flex items-center gap-2 bg-[#FACC15] hover:bg-[#EAB308] text-black px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </header>

        {/* ── Technical Development Panel ── */}
        {showDevPanel && sensitiveCols.length > 0 && (
          <div className="flex-shrink-0 mx-6 mt-4 rounded-2xl border border-purple-500/25 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(109,40,217,0.04) 100%)' }}>
            <div className="px-5 py-3 border-b border-purple-500/15 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-bold text-purple-300">Technical Development</span>
                <span className="ml-2 text-xs text-purple-400/60">· Sensitive column preview · {selectedTable}</span>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensitiveCols.map(col => {
                const rows = tableData.data.slice(0, 3); // show first 3 rows
                return (
                  <div key={col.column_name} className="bg-black/30 rounded-xl border border-purple-500/15 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-purple-500/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {col.column_name.toLowerCase().includes('password') ? (
                          <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                        <span className={`text-xs font-bold tracking-wider uppercase ${col.column_name.toLowerCase().includes('password') ? 'text-red-400' : 'text-amber-400'}`}>
                          {col.column_name}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/30 font-mono">{col.data_type}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      {rows.length === 0 ? (
                        <p className="text-xs text-white/30 italic">No rows</p>
                      ) : (
                        rows.map((row, i) => {
                          const val = row[col.column_name];
                          const cellKey = `${col.column_name}-${i}`;
                          return (
                            <div key={i} className="group flex items-start gap-2">
                              <span className="text-[10px] text-white/20 font-bold mt-1 w-4 flex-shrink-0">#{i + 1}</span>
                              <div
                                className="flex-1 bg-black/40 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-black/60 transition-colors relative"
                                onClick={() => val !== null && handleCopyCell(val, cellKey)}
                                title="Click to copy"
                              >
                                {val === null ? (
                                  <span className="text-white/20 italic text-xs">null</span>
                                ) : (
                                  <span className="text-xs font-mono text-white/70 break-all leading-relaxed">
                                    {String(val).length > 60 ? String(val).slice(0, 60) + '…' : String(val)}
                                  </span>
                                )}
                                {copiedCell === cellKey && (
                                  <span className="absolute right-2 top-1 text-[10px] text-emerald-400 font-bold">✓ Copied</span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                      {tableData.data.length > 3 && (
                        <p className="text-[10px] text-white/20 text-center pt-1">+{tableData.data.length - 3} more rows in table below</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-2.5 border-t border-purple-500/10 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[11px] text-white/25">
                Password hashes are bcrypt-encrypted · OTP codes are single-use time-limited tokens · Click any value to copy
              </span>
            </div>
          </div>
        )}

        {/* Data View */}
        <main className="flex-1 overflow-auto p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 mb-5 text-sm font-semibold flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#FACC15]/30 border-t-[#FACC15] animate-spin" />
                <span className="text-sm font-semibold text-white/40">Loading table data…</span>
              </div>
            </div>
          ) : !selectedTable ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <p className="font-semibold text-lg">Select a table from the sidebar</p>
              <p className="text-sm text-white/15">View rows, schema, and sensitive columns</p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-xl border border-[#1f1f1f]"
              style={{ background: 'linear-gradient(180deg, #141414 0%, #111 100%)' }}>
              {/* Schema info bar */}
              <div className="px-6 py-3 border-b border-[#1f1f1f] flex items-center gap-4 flex-wrap">
                <span className="text-xs font-bold text-white/30 uppercase tracking-wider">Schema</span>
                {tableData.columns.map(col => (
                  <span key={col.column_name}
                    className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg ${isSensitive(col.column_name)
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                      : 'bg-[#1a1a1a] text-white/40 border border-[#222]'
                    }`}
                  >
                    {isSensitive(col.column_name) && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {col.column_name}
                    <span className="text-white/20">·</span>
                    <span className="text-[10px] opacity-70">{col.data_type}</span>
                  </span>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {filteredRows.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-white/40 font-semibold">
                      {searchQuery ? `No rows match "${searchQuery}"` : 'No data in this table'}
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#1f1f1f]" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        {tableData.columns.map((col, idx) => (
                          <th key={col.column_name}
                            className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${isSensitive(col.column_name) ? 'text-purple-400' : 'text-white/40'}`}>
                            <div className="flex items-center gap-1.5">
                              {isSensitive(col.column_name) && (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                              {col.column_name}
                            </div>
                          </th>
                        ))}
                        <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-white/40 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-white divide-y divide-[#1a1a1a]">
                      {filteredRows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors group">
                          {tableData.columns.map((col) => {
                            const value = row[col.column_name];
                            const displayVal = formatCellValue(col, value);
                            const cellKey = `${rowIdx}-${col.column_name}`;
                            const sensitive = isSensitive(col.column_name);
                            return (
                              <td key={col.column_name}
                                className={`px-5 py-3.5 max-w-[220px] ${sensitive ? 'bg-purple-500/5' : ''}`}
                                title={displayVal ?? 'null'}>
                                {value === null ? (
                                  <span className="text-white/20 italic text-xs">null</span>
                                ) : typeof value === 'boolean' ? (
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${value ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                    {value.toString()}
                                  </span>
                                ) : sensitive ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-purple-300/70 text-xs truncate max-w-[140px]">
                                      {String(value).length > 20 ? String(value).slice(0, 20) + '…' : String(value)}
                                    </span>
                                    <button
                                      onClick={() => handleCopyCell(value, cellKey)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400/60 hover:text-purple-400 border-none bg-transparent cursor-pointer p-0.5 rounded"
                                      title="Copy value"
                                    >
                                      {copiedCell === cellKey ? (
                                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                      ) : (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                ) : (
                                  <span className="truncate block text-white/70">
                                    {String(value).length > 50 ? String(value).slice(0, 50) + '…' : String(value)}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-5 py-3.5 text-right">
                            {isAdmin ? (
                              <button
                                onClick={() => handleDeleteRecord(selectedTable, tableData.columns[0].column_name, row[tableData.columns[0].column_name])}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500/60 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg cursor-pointer border-none bg-transparent"
                                title="Delete record"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            ) : (
                              <span className="text-[10px] text-white/15 font-medium">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[#1a1a1a] flex justify-between items-center">
                <span className="text-xs text-white/25 font-medium">
                  {filteredRows.length} row{filteredRows.length !== 1 ? 's' : ''} shown
                  {searchQuery && ` · filtered from ${tableData.data.length} total`}
                </span>
                <div className="flex items-center gap-3">
                  {sensitiveCols.length > 0 && (
                    <span className="text-[11px] text-purple-400/50 font-semibold flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {sensitiveCols.length} sensitive column{sensitiveCols.length > 1 ? 's' : ''} detected
                    </span>
                  )}
                  <span className="text-[11px] text-white/20 font-mono">{selectedTable}</span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DatabaseViewer;
