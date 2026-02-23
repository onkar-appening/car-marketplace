import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByVin, createVehicle } from '@/lib/store';

export async function POST(req: NextRequest) {
    try {
        const { vin } = await req.json();
        if (!vin || vin.trim().length < 5) {
            return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
        }

        const vinUpper = vin.trim().toUpperCase();
        const existing = getVehicleByVin(vinUpper);

        if (existing) {
            return NextResponse.json({ exists: true, vehicle: existing });
        }

        const vehicle = createVehicle(vinUpper);
        return NextResponse.json({ exists: false, vehicle });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
