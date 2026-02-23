'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const STATUS_STEPS: Record<string, number> = {
    draft: 0,
    pending_otp: 20,
    verified: 40,
    listed: 70,
    offers: 85,
    sold: 100,
};

const STATUS_LABEL: Record<string, string> = {
    draft: 'Draft',
    pending_otp: 'Pending',
    verified: 'Verified',
    listed: 'Listed',
    offers: 'Offers',
    sold: 'Sold',
};

const CAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" fill="none">
  <rect width="320" height="180" fill="#e8eeff"/>
  <g transform="translate(60,50)">
    <rect x="20" y="40" width="160" height="60" rx="10" fill="#c7d2fe"/>
    <rect x="40" y="20" width="120" height="45" rx="8" fill="#a5b4fc"/>
    <circle cx="50" cy="103" r="18" fill="#6366f1"/>
    <circle cx="150" cy="103" r="18" fill="#6366f1"/>
    <circle cx="50" cy="103" r="8" fill="#e8eeff"/>
    <circle cx="150" cy="103" r="8" fill="#e8eeff"/>
    <rect x="55" y="25" width="90" height="35" rx="5" fill="#ddd6fe"/>
    <rect x="0" y="65" width="25" height="30" rx="5" fill="#818cf8"/>
    <rect x="175" y="65" width="25" height="30" rx="5" fill="#818cf8"/>
  </g>
  <text x="160" y="160" text-anchor="middle" font-family="Inter,sans-serif" font-size="11" fill="#6b7280">No Image Available</text>
</svg>
`)}`;

function VehicleCard({ vehicle, onMarkSold }: { vehicle: any; onMarkSold: (id: string) => void }) {
    const progress = STATUS_STEPS[vehicle.status] ?? 70;
    const statusLabel = STATUS_LABEL[vehicle.status] || vehicle.status;
    const carTitle = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Vehicle';

    const badgeClass = vehicle.status === 'sold' ? 'badge-sold'
        : vehicle.status === 'listed' ? 'badge-listed'
            : 'badge-verified';

    return (
        <div className="vehicle-card">
            <div className="vehicle-card-image">
                <img src={CAR_PLACEHOLDER} alt={carTitle} />
                <span className={`vehicle-status-badge ${badgeClass}`}>{statusLabel}</span>
                {vehicle.status !== 'sold' && (
                    <button
                        onClick={() => onMarkSold(vehicle.id)}
                        style={{
                            position: 'absolute', bottom: 8, right: 8,
                            background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 6,
                            padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600, color: '#374151',
                            cursor: 'pointer', fontFamily: 'inherit'
                        }}
                    >
                        Mark as Sold
                    </button>
                )}
            </div>

            <div className="vehicle-card-body">
                <div className="vehicle-name">{carTitle}</div>
                <div className="vehicle-vin">VIN: {vehicle.vin}</div>

                {/* Status progress */}
                <div className="progress-labels">
                    <span>Car listed</span><span>Offers</span><span>Sold</span>
                </div>
                <div className="status-progress">
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Car details mini-summary */}
                {(vehicle.make || vehicle.color || vehicle.mileage) && (
                    <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 12, lineHeight: 1.6 }}>
                        {vehicle.color && <span>📦 {vehicle.color}&nbsp;&nbsp;</span>}
                        {vehicle.mileage && <span>🛣 {Number(vehicle.mileage).toLocaleString()} mi&nbsp;&nbsp;</span>}
                        {vehicle.expected_price && <span>💰 ${Number(vehicle.expected_price).toLocaleString()}</span>}
                    </div>
                )}

                {/* Action buttons */}
                <div className="vehicle-actions">
                    <button className="vehicle-action-btn">
                        <div className="action-icon-wrap orange">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                            </svg>
                            <span className="action-badge">2</span>
                        </div>
                        <span className="action-label">Offers</span>
                    </button>
                    <button className="vehicle-action-btn">
                        <div className="action-icon-wrap blue">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                            </svg>
                            <span className="action-badge">2</span>
                        </div>
                        <span className="action-label">Dealers</span>
                    </button>
                    <button className="vehicle-action-btn">
                        <div className="action-icon-wrap green">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            <span className="action-badge">2</span>
                        </div>
                        <span className="action-label">Messages</span>
                    </button>
                    <button className="vehicle-action-btn">
                        <div className="action-icon-wrap gray">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </div>
                        <span className="action-label">Edit</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function DashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<any>(null);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('My Vehicles');

    useEffect(() => {
        const userId = searchParams.get('userId') || sessionStorage.getItem('userId');
        const mobile = searchParams.get('mobile') || sessionStorage.getItem('userMobile');

        if (!userId && !mobile) {
            router.push('/');
            return;
        }

        const query = userId ? `userId=${userId}` : `mobile=${mobile}`;
        fetch(`/api/dashboard?${query}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                    setVehicles(data.vehicles || []);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleMarkSold = async (vehicleId: string) => {
        // Optimistic update
        setVehicles((prev) => prev.map((v) => v.id === vehicleId ? { ...v, status: 'sold' } : v));
    };

    const initial = user?.name?.charAt(0).toUpperCase() || 'U';

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
                <div className="navbar-actions">
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                    </button>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%', background: '#1a3fd4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginLeft: 8
                    }}>
                        {initial}
                    </div>
                </div>
            </nav>

            {/* Dashboard Header */}
            <div className="dashboard-header">
                <h1>My Account</h1>
                {user && (
                    <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 6, fontSize: '0.9rem' }}>
                        Welcome back, {user.name} &nbsp;•&nbsp; {user.mobile}
                    </p>
                )}
            </div>

            <div className="dashboard-layout">
                <div className="dashboard-content">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a3fd4" strokeWidth="2"
                                style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }}>
                                <path d="M21 12a9 9 0 11-6.219-8.56" />
                            </svg>
                            <p>Loading your vehicles...</p>
                        </div>
                    ) : (
                        <>
                            <div className="dashboard-toolbar">
                                <div className="dashboard-tabs">
                                    {['My Vehicles', 'Messages'].map((tab) => (
                                        <button key={tab} className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab)}>
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                                <Link href="/" className="btn btn-primary btn-sm" style={{ textDecoration: 'none', width: 'auto' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Add Vehicle
                                </Link>
                            </div>

                            {activeTab === 'My Vehicles' && (
                                <div className="vehicles-grid">
                                    {vehicles.map((v) => (
                                        <VehicleCard key={v.id} vehicle={v} onMarkSold={handleMarkSold} />
                                    ))}
                                    {/* Add vehicle placeholder */}
                                    <Link href="/" className="add-vehicle-card">
                                        <div className="add-vehicle-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </div>
                                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Add a Vehicle</p>
                                        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>List another car for sale</p>
                                    </Link>
                                </div>
                            )}

                            {activeTab === 'Messages' && (
                                <div className="card" style={{ textAlign: 'center', padding: '60px 32px', color: '#9ca3af' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5"
                                        style={{ margin: '0 auto 16px' }}>
                                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                    </svg>
                                    <p style={{ fontWeight: 600, color: '#6b7280' }}>No messages yet</p>
                                    <p style={{ fontSize: '0.85rem', marginTop: 6 }}>Dealer messages will appear here once you receive offers</p>
                                </div>
                            )}

                            {vehicles.length === 0 && activeTab === 'My Vehicles' && (
                                <div style={{ textAlign: 'center', padding: '24px 0', color: '#6b7280' }}>
                                    <p>No vehicles listed yet. Add your first car!</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <footer className="footer">
                <span>© AutoBid 2025. All Rights Reserved</span>
                <div className="footer-links"><a href="#">FAQ</a><a href="#">T&amp;C's</a></div>
            </footer>

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading…</div>}>
            <DashboardContent />
        </Suspense>
    );
}
