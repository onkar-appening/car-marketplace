'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
    const [vin, setVin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleContinue = async () => {
        const trimmed = vin.trim().toUpperCase();
        if (trimmed.length < 5) {
            setError('Please enter a valid VIN number (at least 5 characters).');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/vehicles/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vin: trimmed }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');

            // Store VIN and vehicle data in sessionStorage
            sessionStorage.setItem('currentVin', trimmed);
            sessionStorage.setItem('currentVehicle', JSON.stringify(data.vehicle));
            router.push('/sell/details');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-center">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l4 4v4a2 2 0 01-2 2h-2" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="15" cy="17" r="2" />
                        <path d="M5 9h9l3 3H5" />
                    </svg>
                    AutoBid™
                </div>
                <div className="navbar-actions">
                    <a href="#" className="nav-btn nav-btn-outline">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Sign In
                    </a>
                    <a href="#" className="nav-btn nav-btn-primary">Dealers</a>
                </div>
            </nav>

            {/* Hero */}
            <div className="hero">
                <h1>Sell Your Car in Minutes<br />to Verified Dealers</h1>
                <p>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                    </svg>
                    Majority of sellers get their best offer in under 2 minutes
                </p>
            </div>

            {/* VIN Entry Card */}
            <div style={{ background: '#f3f4f6', flex: 1, padding: '40px 20px' }}>
                <div style={{ maxWidth: 560, margin: '0 auto' }}>
                    <div className="card">
                        <p style={{ textAlign: 'center', fontWeight: 600, fontSize: '1rem', marginBottom: 28, color: '#374151' }}>
                            Enter your VIN number to get started
                        </p>

                        <div className="form-group">
                            <label className="form-label" htmlFor="vin">VIN Number</label>
                            <input
                                id="vin"
                                className="form-input"
                                type="text"
                                placeholder="e.g. 1HGCM82633A123456"
                                value={vin}
                                onChange={(e) => setVin(e.target.value.toUpperCase())}
                                onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                                maxLength={17}
                                style={{ fontSize: '1rem', letterSpacing: '0.5px' }}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            className="btn btn-primary"
                            onClick={handleContinue}
                            disabled={loading}
                            style={{ marginTop: 20 }}
                        >
                            {loading ? (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                        <path d="M21 12a9 9 0 11-6.219-8.56" />
                                    </svg>
                                    Checking VIN...
                                </>
                            ) : 'Continue →'}
                        </button>

                        {/* Sample VINs hint */}
                        <div style={{ marginTop: 24, padding: '14px 16px', background: '#f8faff', borderRadius: 8, border: '1px solid #dbeafe' }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a3fd4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                🧪 Test VINs for Demo
                            </p>
                            {[
                                { vin: '1HGCM82633A123456', label: '2003 Honda Accord' },
                                { vin: '2T1BURHE0JC034567', label: '2018 Toyota Corolla' },
                                { vin: '1FTFW1ET5DFA89012', label: '2013 Ford F-150' },
                                { vin: 'WDBUF56X08B234567', label: '2008 Mercedes E-Class' },
                                { vin: '5YJ3E1EA7JF012345', label: '2018 Tesla Model 3' },
                            ].map((item) => (
                                <button
                                    key={item.vin}
                                    onClick={() => setVin(item.vin)}
                                    style={{
                                        display: 'block',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        color: '#374151',
                                        padding: '2px 0',
                                        textAlign: 'left',
                                        fontFamily: 'inherit',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1a3fd4' }}>{item.vin}</span>
                                    <span style={{ color: '#6b7280' }}>&nbsp; – {item.label}</span>
                                </button>
                            ))}
                            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 8 }}>
                                Or type any new VIN (min 5 chars) to start fresh.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <span>© AutoBid 2025. All Rights Reserved</span>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                </div>
            </footer>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
