'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OtpPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [mobile, setMobile] = useState('');

    useEffect(() => {
        const m = sessionStorage.getItem('sellerMobile') || '';
        setMobile(m);
        if (!sessionStorage.getItem('currentVin')) { router.push('/'); }
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (pasted.length === 4) {
            setOtp(pasted.split(''));
            inputRefs.current[3]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpStr = otp.join('');
        if (otpStr.length !== 4) {
            setError('Please enter the complete 4-digit OTP.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const vin = sessionStorage.getItem('currentVin');
            const fullName = sessionStorage.getItem('sellerName');
            const email = sessionStorage.getItem('sellerEmail');
            const mobileNum = sessionStorage.getItem('sellerMobile');

            const res = await fetch('/api/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp: otpStr, vin, fullName, email, mobile: mobileNum }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setSuccess(true);
            sessionStorage.setItem('userId', data.user.id);
            sessionStorage.setItem('userMobile', data.user.mobile);

            setTimeout(() => router.push('/sell/additional'), 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const maskedMobile = mobile
        ? mobile.replace(/(\d{3})\d+(\d{3})/, '$1••••$2')
        : '•••••';

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
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>Verify Your Number</h1>
                <p>We sent a 4-digit code to {maskedMobile}</p>
            </div>

            {/* Step indicator */}
            <div style={{ background: '#f3f4f6', padding: '20px 20px 0' }}>
                <div className="step-indicator">
                    {['VIN', 'Details', 'Verify', 'Pricing', 'Dashboard'].map((label, i) => (
                        <div key={label} className="step-item">
                            <div className={`step-circle ${i <= 1 ? 'completed' : i === 2 ? 'active' : ''}`}>
                                {i <= 1 ? '✓' : i + 1}
                            </div>
                            {i < 4 && <div className={`step-connector ${i <= 0 ? 'completed' : ''}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ background: '#f3f4f6', flex: 1, padding: '16px 20px 40px' }}>
                <div style={{ maxWidth: 420, margin: '0 auto' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        {success ? (
                            <div style={{ padding: '24px 0' }}>
                                <div style={{
                                    width: 72, height: 72, background: '#d1fae5', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 16px', fontSize: '2rem'
                                }}>✓</div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#059669' }}>Verified Successfully!</h3>
                                <p style={{ color: '#6b7280', marginTop: 8, fontSize: '0.9rem' }}>Redirecting you to add pricing details…</p>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    width: 64, height: 64, background: '#e8eeff', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px'
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a3fd4" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <polyline points="9 12 11 14 15 10" />
                                    </svg>
                                </div>

                                <h2 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 6 }}>Enter OTP</h2>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 0 }}>
                                    Use the master OTP for demo:
                                    <strong style={{ color: '#1a3fd4' }}> 0000</strong>
                                </p>

                                <div className="otp-inputs" onPaste={handlePaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => { inputRefs.current[i] = el; }}
                                            className="otp-input"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleChange(i, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(i, e)}
                                        />
                                    ))}
                                </div>

                                {error && (
                                    <div className="alert alert-error" style={{ marginBottom: 16, textAlign: 'left' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        {error}
                                    </div>
                                )}

                                <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <button
                                    style={{ marginTop: 14, background: 'none', border: 'none', color: '#1a3fd4', fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
                                    onClick={() => setOtp(['0', '0', '0', '0'])}
                                >
                                    Auto-fill demo OTP (0000)
                                </button>
                            </>
                        )}
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
