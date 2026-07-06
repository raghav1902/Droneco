import React, { useState, useEffect } from 'react';
import { Download, Printer, Share2, CheckCircle, ArrowLeft } from 'lucide-react';
import { showToast } from '../../utils/toast.js';
import API from '../../api/api.js';

const ReceiptPage = ({ transaction, onBack }) => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get('/settings');
        if (response.data.success && response.data.data) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load settings for receipt:', error);
      }
    };
    fetchSettings();
  }, []);
  if (!transaction) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <p>No transaction selected.</p>
        <button className="btn btn-primary mt-4" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const studentName = transaction.fee_id?.lead_id?.full_name || 'Unknown Student';
  const studentId = transaction.fee_id?.lead_id?._id || transaction.fee_id?.lead_id?.id || 'N/A';
  const courseName = transaction.fee_id?.lead_id?.interested_course_id || 'N/A'; // We might need to fetch course name here but id is fallback
  const dateStr = new Date(transaction.transaction_date).toLocaleDateString();

  return (
    <div className="animate-fade-in receipt-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Hide controls when printing by using a media query in css, but for now we'll just let them show or hide manually if needed, standard print media css usually hides .no-print */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .receipt-container { width: 100%; margin: 0; padding: 0; }
            body { background: white; }
          }
        `}
      </style>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-secondary p-2 rounded-full border-border shadow-sm hover:bg-muted" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Payment Receipt</h2>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); showToast('Share not implemented yet!', 'info'); }}>
            <Share2 size={16} /> Share
          </button>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); handlePrint(); }}>
            <Download size={16} /> PDF
          </button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.preventDefault(); handlePrint(); }}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '3rem', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {settings?.receipt?.showLogo && settings?.institute?.logo && (
              <img src={settings.institute.logo} alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            )}
            <div>
              <h1 style={{ fontSize: '2rem', color: 'var(--accent-hex)', fontWeight: 700, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                {settings?.institute?.name || 'INSTITUTE'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>
                {settings?.institute?.address ? settings.institute.address + '\n' : '123 Education Lane, Tech District\n'}
                {settings?.institute?.email || 'contact@institute.edu'} | {settings?.institute?.contact || '+1 234-567-8900'}
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
              <CheckCircle size={20} /> <span style={{ fontWeight: 600 }}>PAID</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
              Receipt #{settings?.receipt?.prefix || ''}{transaction.receipt_number}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Date: {dateStr}</p>
          </div>
        </div>

        {settings?.receipt?.header && (
          <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius)', marginBottom: '2rem', textAlign: 'center', fontWeight: 500 }}>
            {settings.receipt.header}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Billed To</h4>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{studentName}</p>
            <p style={{ color: 'var(--text-secondary)' }}>ID: {studentId}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Payment Info</h4>
            <p style={{ color: 'var(--text-main)' }}>Method: <span style={{ fontWeight: 600 }}>{transaction.payment_method}</span></p>
            {transaction.reference_number && <p style={{ color: 'var(--text-main)' }}>Reference ID: <span style={{ fontWeight: 600 }}>{transaction.reference_number}</span></p>}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '2rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1rem 0' }}>Description</th>
              <th style={{ padding: '1rem 0', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '1rem 0' }}>Course Fee Installment</td>
              <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{transaction.amount_paid?.toLocaleString()}</td>
            </tr>
            {transaction.late_fee > 0 && (
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 0' }}>Late Fee Penalty</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{transaction.late_fee.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '2px solid var(--border)' }}>
          <div style={{ color: 'var(--text-secondary)' }}>
            {settings?.receipt?.footerMessage || 'Thank you for your payment.'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Total Paid:</span>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-hex)' }}>₹{(transaction.amount_paid + (transaction.late_fee || 0)).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
