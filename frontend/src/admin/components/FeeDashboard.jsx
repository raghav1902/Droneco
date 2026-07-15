import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Clock, TrendingUp } from 'lucide-react';
import API from '../../api/api';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid var(--${colorClass})` }}>
    <div style={{ padding: '1rem', borderRadius: '50%', background: `var(--${colorClass}-glow)`, color: `var(--${colorClass})` }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>{title}</p>
      <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', color: 'var(--text-main)' }}>{value}</h3>
    </div>
  </div>
);

const FeeDashboard = ({ setActiveTab }) => {
  const [data, setData] = useState({
    summary: { totalCollected: 0, totalPending: 0, todaysCollection: 0, totalStudents: 0 },
    recentTransactions: [],
    revenueTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/admin/reports');
        setData(res.data.data);
      } catch (err) {
        console.error('Error fetching fee dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleExportCSV = () => {
    try {
      const headers = ['TXN ID', 'Student', 'Amount', 'Method', 'Status'];
      const rows = data.recentTransactions.map(txn => 
        [txn.id, txn.studentName, txn.amount, txn.method, txn.status].join(',')
      );
      
      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'Fee_Dashboard_Transactions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Export successful', 'success');
    } catch (error) {
      showToast('Error exporting data', 'error');
    }
  };

  return (
    <div className="animate-fade-in dashboard-print-container">
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .dashboard-print-container { width: 100%; margin: 0; padding: 0; }
            body { background: white; }
          }
        `}
      </style>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Fee Overview</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="form-select" style={{ width: 'auto' }}>
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); handleExportCSV(); }}>Generate CSV</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Total Fees Collected" value={`₹${data.summary.totalCollected.toLocaleString()}`} icon={DollarSign} colorClass="success" />
        <StatCard title="Pending Fees" value={`₹${data.summary.totalPending.toLocaleString()}`} icon={Clock} colorClass="warning" />
        <StatCard title="Today's Collection" value={`₹${data.summary.todaysCollection.toLocaleString()}`} icon={TrendingUp} colorClass="accent" />
        <StatCard title="Total Students" value={data.summary.totalStudents} icon={Users} colorClass="text-secondary" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Revenue Trends</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-main)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Legend />
                <Bar dataKey="collected" fill="var(--success)" name="Collected" />
                <Bar dataKey="pending" fill="var(--warning)" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recent Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>TXN ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Student</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Method</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map(txn => (
                  <tr key={txn.id} style={{ borderBottom: '1px solid var(--border)' }} className="table-row-hover">
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.9rem' }}>{txn.id}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{txn.studentName}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-main)' }}>₹{txn.amount}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                        {txn.method}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge badge-${txn.status.toLowerCase()}`}>{txn.status}</span>
                    </td>
                  </tr>
                ))}
                {data.recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No recent transactions.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('payment-history')}>View All Transactions</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDashboard;
