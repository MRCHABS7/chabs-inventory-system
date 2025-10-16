import { useState, useEffect } from 'react';
import { me } from '../lib/auth-simple';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export function logAuditEvent(action: string, resource: string, resourceId: string, details: string) {
  const user = me();
  if (!user) return;

  const entry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userEmail: user.email,
    action,
    resource,
    resourceId,
    details,
    ipAddress: 'localhost', // In a real app, this would be the actual IP
    userAgent: navigator.userAgent
  };

  // Get existing audit log
  const existingLog = JSON.parse(localStorage.getItem('chabs_audit_log') || '[]');
  
  // Add new entry
  existingLog.unshift(entry);
  
  // Keep only last 1000 entries to prevent storage bloat
  if (existingLog.length > 1000) {
    existingLog.splice(1000);
  }
  
  // Save back to storage
  localStorage.setItem('chabs_audit_log', JSON.stringify(existingLog));
}

export default function AuditTrail() {
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [filteredLog, setFilteredLog] = useState<AuditEntry[]>([]);
  const [filters, setFilters] = useState({
    action: '',
    resource: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    const log = JSON.parse(localStorage.getItem('chabs_audit_log') || '[]');
    setAuditLog(log);
    setFilteredLog(log);
  }, []);

  useEffect(() => {
    let filtered = auditLog;

    // Apply filters
    if (filters.action) {
      filtered = filtered.filter(entry => entry.action.toLowerCase().includes(filters.action.toLowerCase()));
    }
    
    if (filters.resource) {
      filtered = filtered.filter(entry => entry.resource.toLowerCase().includes(filters.resource.toLowerCase()));
    }
    
    if (filters.user) {
      filtered = filtered.filter(entry => entry.userEmail.toLowerCase().includes(filters.user.toLowerCase()));
    }
    
    if (filters.dateFrom) {
      filtered = filtered.filter(entry => entry.timestamp >= filters.dateFrom);
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(entry => new Date(entry.timestamp) <= dateTo);
    }

    setFilteredLog(filtered);
  }, [auditLog, filters]);

  const clearAuditLog = () => {
    if (confirm('Are you sure you want to clear the entire audit log? This action cannot be undone.')) {
      localStorage.removeItem('chabs_audit_log');
      setAuditLog([]);
      setFilteredLog([]);
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      'Timestamp,User,Action,Resource,Resource ID,Details,IP Address',
      ...filteredLog.map(entry => 
        `"${entry.timestamp}","${entry.userEmail}","${entry.action}","${entry.resource}","${entry.resourceId}","${entry.details}","${entry.ipAddress || 'N/A'}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return '➕';
    if (action.includes('update') || action.includes('edit')) return '✏️';
    if (action.includes('delete')) return '🗑️';
    if (action.includes('login')) return '🔑';
    if (action.includes('logout')) return '🚪';
    if (action.includes('view')) return '👁️';
    return '📝';
  };

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'text-green-600';
    if (action.includes('update') || action.includes('edit')) return 'text-blue-600';
    if (action.includes('delete')) return 'text-red-600';
    if (action.includes('login')) return 'text-purple-600';
    if (action.includes('logout')) return 'text-gray-600';
    return 'text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">📋 Audit Trail</h2>
          <div className="flex space-x-2">
            <button
              onClick={exportAuditLog}
              className="btn btn-secondary"
              aria-label="Export audit log"
            >
              📤 Export
            </button>
            <button
              onClick={clearAuditLog}
              className="btn btn-danger"
              aria-label="Clear audit log"
            >
              🗑️ Clear Log
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <input
              type="text"
              placeholder="Filter by action..."
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
            <input
              type="text"
              placeholder="Filter by resource..."
              value={filters.resource}
              onChange={(e) => setFilters({ ...filters, resource: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
            <input
              type="text"
              placeholder="Filter by user..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="input"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {filteredLog.length} of {auditLog.length} audit entries
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Resource</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLog.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    <div>{new Date(entry.timestamp).toLocaleDateString()}</div>
                    <div className="text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="font-medium">{entry.userEmail}</div>
                    <div className="text-gray-500">{entry.ipAddress}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className={`flex items-center space-x-2 ${getActionColor(entry.action)}`}>
                      <span>{getActionIcon(entry.action)}</span>
                      <span className="font-medium">{entry.action}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="font-medium">{entry.resource}</div>
                    <div className="text-gray-500 text-xs">{entry.resourceId}</div>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <div className="max-w-xs truncate" title={entry.details}>
                      {entry.details}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLog.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No audit entries found</h3>
            <p className="text-gray-600">
              {auditLog.length === 0 
                ? 'No audit entries have been recorded yet.'
                : 'No entries match your current filters.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}