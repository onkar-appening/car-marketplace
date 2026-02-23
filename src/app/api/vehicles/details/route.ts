import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            vin,
            accidentHistory,
            keysCount,
            tireCondition,
            titleStatus,
            damages,
            fullName,
            email,
            mobile,
        } = body;

        if (!vin || !fullName || !mobile) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = getDb();
        const vinUpper = vin.trim().toUpperCase();

        const vehicle = db.prepare('SELECT * FROM vehicles WHERE vin = ?').get(vinUpper) as any;
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        // Update vehicle details
        db.prepare(`
      UPDATE vehicles SET
        accident_history = ?,
        keys_count = ?,
        tire_condition = ?,
        title_status = ?,
        damages = ?,
        status = 'pending_otp'
      WHERE vin = ?
    `).run(accidentHistory, keysCount, tireCondition, titleStatus, damages, vinUpper);

        return NextResponse.json({ success: true, vin: vinUpper, fullName, email, mobile });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
