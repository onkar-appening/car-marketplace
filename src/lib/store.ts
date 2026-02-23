import { randomUUID } from 'crypto';

export interface Vehicle {
    id: string;
    user_id: string | null;
    vin: string;
    make: string | null;
    model: string | null;
    year: string | null;
    accident_history: string | null;
    keys_count: string | null;
    tire_condition: string | null;
    title_status: string | null;
    damages: string | null;
    mileage: string | null;
    color: string | null;
    expected_price: string | null;
    status: string;
    created_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string | null;
    mobile: string;
    is_verified: number;
    created_at: string;
}

// Use globalThis to persist across serverless function warm invocations
const g = globalThis as any;

if (!g.__cmVehicles) {
    g.__cmVehicles = new Map<string, Vehicle>();
    // Pre-seed with test vehicles
    const seeds = [
        { vin: '1HGCM82633A123456', make: 'Honda', model: 'Accord', year: '2003' },
        { vin: '2T1BURHE0JC034567', make: 'Toyota', model: 'Corolla', year: '2018' },
        { vin: '1FTFW1ET5DFA89012', make: 'Ford', model: 'F-150', year: '2013' },
        { vin: 'WDBUF56X08B234567', make: 'Mercedes-Benz', model: 'E-Class', year: '2008' },
        { vin: '5YJ3E1EA7JF012345', make: 'Tesla', model: 'Model 3', year: '2018' },
    ];
    for (const s of seeds) {
        const v: Vehicle = {
            id: randomUUID(), user_id: null, ...s,
            accident_history: null, keys_count: null, tire_condition: null,
            title_status: null, damages: null, mileage: null, color: null,
            expected_price: null, status: 'listed',
            created_at: new Date().toISOString(),
        };
        g.__cmVehicles.set(v.vin, v);
    }
}

if (!g.__cmUsers) {
    g.__cmUsers = new Map<string, User>();
}

const vehicles: Map<string, Vehicle> = g.__cmVehicles;
const users: Map<string, User> = g.__cmUsers;

// ── Vehicle CRUD ───────────────────────────────────────
export function getVehicleByVin(vin: string): Vehicle | undefined {
    return vehicles.get(vin);
}

export function getVehiclesByUserId(userId: string): Vehicle[] {
    return [...vehicles.values()]
        .filter((v) => v.user_id === userId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createVehicle(vin: string): Vehicle {
    const vehicle: Vehicle = {
        id: randomUUID(), user_id: null, vin,
        make: null, model: null, year: null,
        accident_history: null, keys_count: null, tire_condition: null,
        title_status: null, damages: null, mileage: null, color: null,
        expected_price: null, status: 'draft',
        created_at: new Date().toISOString(),
    };
    vehicles.set(vin, vehicle);
    return vehicle;
}

export function updateVehicle(vin: string, data: Partial<Vehicle>): void {
    const existing = vehicles.get(vin);
    if (existing) vehicles.set(vin, { ...existing, ...data });
}

// ── User CRUD ──────────────────────────────────────────
export function getUserById(id: string): User | undefined {
    return users.get(id);
}

export function getUserByMobile(mobile: string): User | undefined {
    return [...users.values()].find((u) => u.mobile === mobile);
}

export function createUser(data: { name: string; email?: string; mobile: string }): User {
    const user: User = {
        id: randomUUID(),
        name: data.name,
        email: data.email || null,
        mobile: data.mobile,
        is_verified: 1,
        created_at: new Date().toISOString(),
    };
    users.set(user.id, user);
    return user;
}

export function updateUser(id: string, data: Partial<User>): void {
    const existing = users.get(id);
    if (existing) users.set(id, { ...existing, ...data });
}
