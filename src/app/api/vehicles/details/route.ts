import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByVin, updateVehicle } from '@/lib/store';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { vin, accidentHistory, keysCount, tireCondition, titleStatus, damages, fullName, email, mobile } = body;

        if (!vin || !fullName || !mobile) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const vinUpper = vin.trim().toUpperCase();
        const vehicle = getVehicleByVin(vinUpper);
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        updateVehicle(vinUpper, {
            accident_history: accidentHistory,
            keys_count: keysCount,
            tire_condition: tireCondition,
            title_status: titleStatus,
            damages,
            status: 'pending_otp',
        });

        return NextResponse.json({ success: true, vin: vinUpper, fullName, email, mobile });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
