import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const { vin } = await req.json();

        if (!vin || vin.trim().length < 5) {
            return NextResponse.json({ error: 'Invalid VIN' }, { status: 400 });
        }

        const db = getDb();
        const vinUpper = vin.trim().toUpperCase();

        // Check if vehicle already exists
        const existing = db.prepare('SELECT * FROM vehicles WHERE vin = ?').get(vinUpper) as any;

        if (existing) {
            return NextResponse.json({
                exists: true,
                vehicle: existing,
            });
        }

        // Create new vehicle entry
        const id = uuidv4();
        db.prepare('INSERT INTO vehicles (id, vin, status) VALUES (?, ?, ?)').run(id, vinUpper, 'draft');

        const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id) as any;

        return NextResponse.json({
            exists: false,
            vehicle,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
