'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CAR_COLORS = [
    'White', 'Black', 'Silver', 'Gray', 'Red',
    'Blue', 'Green', 'Brown', 'Gold', 'Orange', 'Other',
];

export default function AdditionalPage() {
    const router = useRouter();
    const [form, setForm] = useState({ mileage: '', color: '', expectedPrice: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [vehicle, setVehicle] = useState<any>(null);
    const [vin, setVin] = useState('');

    useEffect(() => {
        const v = sessionStorage.getItem('currentVin');
        const vData = sessionStorage.getItem('currentVehicle');
        if (!v) { router.push('/'); return; }
        if (!sessionStorage.getItem('userId')) { router.push('/sell/otp'); return; }
        setVin(v);
        if (vData) setVehicle(JSON.parse(vData));
    }, []);

    const handleSubmit = async () => {
        if (!form.mileage || !form.color || !form.expectedPrice) {
            setError('Please complete all three fields.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/vehicles/additional', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vin,
                    mileage: form.mileage,
                    color: form.color,
                    expectedPrice: form.expectedPrice,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const userId = sessionStorage.getItem('userId');
            router.push(`/dashboard?userId=${userId}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const carTitle = vehicle
        ? `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim() || vin
        : vin;

    return (
        <div className="page-center">
            <nav className="navbar">
                <div className="navbar-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h14l4 4v4a2 2 0 01-2 2h-2" />
                        <circle cx="7" cy="17" r="2" /><circle cx="15" cy="17" r="2" />
                        <path d="M5 9h9l3 3H5" />
                    </svg>
                    AutoBid™
                </div>
            </nav>

            <div className="hero" style={{ padding: '40px 20px' }}>
                <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)' }}>Almost There! 🎯</h1>
                <p>Just a few more details to get you the best price</p>
            </div>

            {/* Step indicator */}
            <div style={{ background: '#f3f4f6', padding: '20px 20px 0' }}>
                <div className="step-indicator">
                    {['VIN', 'Details', 'Verify', 'Pricing', 'Dashboard'].map((label, i) => (
                        <div key={label} className="step-item">
                            <div className={`step-circle ${i <= 2 ? 'completed' : i === 3 ? 'active' : ''}`}>
                                {i <= 2 ? '✓' : i + 1}
                            </div>
                            {i < 4 && <div className={`step-connector ${i <= 1 ? 'completed' : ''}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: '#f3f4f6', flex: 1, padding: '16px 20px 40px' }}>
                <div style={{ maxWidth: 520, margin: '0 auto' }}>
                    <div className="card">
                        <div style={{ marginBottom: 28 }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{carTitle}</h2>
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2, fontFamily: 'monospace' }}>VIN: {vin}</p>
                        </div>

                        {/* Mileage */}
                        <div className="question-block">
                            <p className="question-text">1. What is your vehicle's current mileage?</p>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="form-input"
                                    type="number"
                                    placeholder="e.g. 45000"
                                    value={form.mileage}
                                    onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                                    style={{ paddingRight: 56 }}
                                />
                                <span style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '0.8rem', color: '#9ca3af', fontWeight: 500
                                }}>miles</span>
                            </div>
                        </div>

                        {/* Color */}
                        <div className="question-block">
                            <p className="question-text">2. What is your vehicle's color?</p>
                            <div className="radio-group">
                                {CAR_COLORS.map((c) => (
                                    <label key={c} className={`radio-option ${form.color === c ? 'selected' : ''}`}>
                                        <input type="radio" name="color" value={c} checked={form.color === c}
                                            onChange={() => setForm({ ...form, color: c })} />
                                        {c !== 'Other' && (
                                            <span style={{
                                                width: 12, height: 12, borderRadius: '50%', display: 'inline-block', border: '1px solid #d1d5db',
                                                background: c === 'White' ? '#fff' : c === 'Black' ? '#000' : c === 'Silver' ? '#c0c0c0' :
                                                    c === 'Gray' ? '#808080' : c === 'Red' ? '#dc2626' : c === 'Blue' ? '#2563eb' :
                                                        c === 'Green' ? '#16a34a' : c === 'Brown' ? '#92400e' : c === 'Gold' ? '#d97706' :
                                                            c === 'Orange' ? '#ea580c' : '#e5e7eb',
                                                flexShrink: 0
                                            }} />
                                        )}
                                        {c}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Expected Price */}
                        <div className="question-block" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <p className="question-text">3. What is your expected offer price?</p>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                                    fontSize: '1rem', color: '#6b7280', fontWeight: 600
                                }}>$</span>
                                <input
                                    className="form-input"
                                    type="number"
                                    placeholder="e.g. 12000"
                                    value={form.expectedPrice}
                                    onChange={(e) => setForm({ ...form, expectedPrice: e.target.value })}
                                    style={{ paddingLeft: 32 }}
                                />
                            </div>
                            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: 6 }}>
                                Dealers will send you competitive offers based on this price.
                            </p>
                        </div>

                        {error && (
                            <div className="alert alert-error" style={{ marginTop: 16 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 28 }}>
                            {loading ? 'Saving...' : '🚀 Go to My Dashboard'}
                        </button>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <span>© AutoBid 2025. All Rights Reserved</span>
                <div className="footer-links"><a href="#">Privacy Policy</a><a href="#">T&amp;C's</a></div>
            </footer>
        </div>
    );
}
