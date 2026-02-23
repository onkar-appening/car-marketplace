'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DAMAGES_OPTIONS = [
    'Scratches', 'Warning Lights', 'Dents', 'Body Damage',
    'Engine Issues', 'Interior Damage', 'Transmission Issues', 'After Market Parts', 'None',
];

const COLORS = ['White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Brown', 'Gold', 'Other'];

export default function DetailsPage() {
    const router = useRouter();
    const [vehicle, setVehicle] = useState<any>(null);
    const [vin, setVin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        accidentHistory: '',
        keysCount: '',
        tireCondition: '',
        titleStatus: '',
        damages: [] as string[],
        fullName: '',
        email: '',
        mobile: '',
    });

    useEffect(() => {
        const storedVin = sessionStorage.getItem('currentVin');
        const storedVehicle = sessionStorage.getItem('currentVehicle');
        if (!storedVin) { router.push('/'); return; }
        setVin(storedVin);
        if (storedVehicle) {
            const v = JSON.parse(storedVehicle);
            setVehicle(v);
            setForm((prev) => ({
                ...prev,
                accidentHistory: v.accident_history || '',
                keysCount: v.keys_count || '',
                tireCondition: v.tire_condition || '',
                titleStatus: v.title_status || '',
                damages: v.damages ? v.damages.split(',') : [],
            }));
        }
    }, []);

    const toggleDamage = (item: string) => {
        setForm((prev) => {
            let updated: string[];
            if (item === 'None') {
                updated = prev.damages.includes('None') ? [] : ['None'];
            } else {
                const filtered = prev.damages.filter((d) => d !== 'None');
                updated = filtered.includes(item) ? filtered.filter((d) => d !== item) : [...filtered, item];
            }
            return { ...prev, damages: updated };
        });
    };

    const handleSubmit = async () => {
        if (!form.accidentHistory || !form.keysCount || !form.tireCondition || !form.titleStatus) {
            setError('Please answer all vehicle condition questions.');
            return;
        }
        if (!form.fullName || !form.mobile) {
            setError('Please enter your full name and mobile number.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/vehicles/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vin,
                    accidentHistory: form.accidentHistory,
                    keysCount: form.keysCount,
                    tireCondition: form.tireCondition,
                    titleStatus: form.titleStatus,
                    damages: form.damages.join(','),
                    fullName: form.fullName,
                    email: form.email,
                    mobile: form.mobile,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            sessionStorage.setItem('sellerName', form.fullName);
            sessionStorage.setItem('sellerEmail', form.email);
            sessionStorage.setItem('sellerMobile', form.mobile);
            router.push('/sell/otp');
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
            {/* Navbar */}
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

            {/* Hero */}
            <div className="hero" style={{ padding: '40px 20px 24px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>Final Step!</h1>
                <p style={{ marginTop: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Answer a few questions below and get your best offer instantly
                </p>
            </div>

            {/* Step Indicator */}
            <div style={{ background: '#f3f4f6', padding: '20px 20px 0' }}>
                <div className="step-indicator">
                    {['VIN', 'Details', 'Verify', 'Pricing', 'Dashboard'].map((label, i) => (
                        <div key={label} className="step-item">
                            <div className={`step-circle ${i === 0 ? 'completed' : i === 1 ? 'active' : ''}`}>
                                {i === 0 ? '✓' : i + 1}
                            </div>
                            {i < 4 && <div className={`step-connector ${i === 0 ? 'completed' : ''}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Card */}
            <div style={{ background: '#f3f4f6', flex: 1, padding: '16px 20px 40px' }}>
                <div style={{ maxWidth: 620, margin: '0 auto' }}>
                    <div className="card">
                        {/* Car title */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{carTitle || vin}</h2>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a3fd4">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-5l-2 2-1.41-1.41L10 8.67l4 4-1.41 1.41-1.09-1.08v5H10z" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                            </svg>
                            <span style={{ background: '#dbeafe', color: '#1a3fd4', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>✓ Verified</span>
                        </div>

                        {/* Q1: Accident History */}
                        <div className="question-block">
                            <p className="question-text">1. Has the vehicle been in any accident?</p>
                            <div className="radio-group">
                                {['Yes', 'No'].map((opt) => (
                                    <label key={opt} className={`radio-option ${form.accidentHistory === opt ? 'selected' : ''}`}>
                                        <input type="radio" name="accident" value={opt} checked={form.accidentHistory === opt}
                                            onChange={() => setForm({ ...form, accidentHistory: opt })} /> {opt}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Q2: Keys */}
                        <div className="question-block">
                            <p className="question-text">2. How many vehicle keys do you have?</p>
                            <div className="radio-group">
                                {['One Key', 'Two Keys', 'Three+ Keys'].map((opt) => (
                                    <label key={opt} className={`radio-option ${form.keysCount === opt ? 'selected' : ''}`}>
                                        <input type="radio" name="keys" value={opt} checked={form.keysCount === opt}
                                            onChange={() => setForm({ ...form, keysCount: opt })} /> {opt}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Q3: Tire Condition */}
                        <div className="question-block">
                            <p className="question-text">3. Which best describes the condition of your vehicle tires?</p>
                            <div className="radio-group">
                                {['Excellent', 'Good', 'Fair', 'Poor'].map((opt) => (
                                    <label key={opt} className={`radio-option ${form.tireCondition === opt ? 'selected' : ''}`}>
                                        <input type="radio" name="tires" value={opt} checked={form.tireCondition === opt}
                                            onChange={() => setForm({ ...form, tireCondition: opt })} /> {opt}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Q4: Title Status */}
                        <div className="question-block">
                            <p className="question-text">4. What best describes the title status of the vehicle?</p>
                            <div className="radio-group">
                                {['Loan', 'Lease', 'Clear Title', 'Rebuilt', 'Salvage'].map((opt) => (
                                    <label key={opt} className={`radio-option ${form.titleStatus === opt ? 'selected' : ''}`}>
                                        <input type="radio" name="title" value={opt} checked={form.titleStatus === opt}
                                            onChange={() => setForm({ ...form, titleStatus: opt })} /> {opt}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Q5: Damages */}
                        <div className="question-block">
                            <p className="question-text">5. Does the vehicle have any of the following?</p>
                            <div className="checkbox-group">
                                {DAMAGES_OPTIONS.map((opt) => (
                                    <label key={opt} className={`checkbox-option ${form.damages.includes(opt) ? 'checked' : ''}`}>
                                        <input type="checkbox" checked={form.damages.includes(opt)} onChange={() => toggleDamage(opt)} /> {opt}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />

                        {/* Personal Info */}
                        <p className="question-text" style={{ marginBottom: 16 }}>Your Contact Details</p>
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input className="form-input" type="text" placeholder="Enter your full name"
                                value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Email Address <span style={{ color: '#9ca3af' }}>(Optional)</span></label>
                                <input className="form-input" type="email" placeholder="you@email.com"
                                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mobile Number *</label>
                                <input className="form-input" type="tel" placeholder="+1 234 567 8900"
                                    value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ marginTop: 24 }}>
                            {loading ? 'Saving...' : 'Verify & Get Offers →'}
                        </button>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
                            By clicking this button, you accept our terms and conditions and become eligible to receive great offers from verified dealers.
                        </p>
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
