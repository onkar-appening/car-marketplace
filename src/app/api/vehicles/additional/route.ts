import { NextRequest, NextResponse } from 'next/server';
import { getVehicleByVin, updateVehicle } from '@/lib/store';

export async function POST(req: NextRequest) {
    try {
        const { vin, mileage, color, expectedPrice } = await req.json();

        if (!vin) {
            return NextResponse.json({ error: 'VIN required' }, { status: 400 });
        }

        const vinUpper = vin.trim().toUpperCase();
        const vehicle = getVehicleByVin(vinUpper);
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        updateVehicle(vinUpper, {
            mileage,
            color,
            expected_price: expectedPrice,
            status: 'listed',
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
