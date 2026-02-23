import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { vin, mileage, color, expectedPrice } = await req.json();

        if (!vin) {
            return NextResponse.json({ error: 'VIN required' }, { status: 400 });
        }

        const db = getDb();
        const vinUpper = vin.trim().toUpperCase();

        db.prepare(`
      UPDATE vehicles SET
        mileage = ?,
        color = ?,
        expected_price = ?,
        status = 'listed'
      WHERE vin = ?
    `).run(mileage, color, expectedPrice, vinUpper);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
