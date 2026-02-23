import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const MASTER_OTP = '0000';

export async function POST(req: NextRequest) {
    try {
        const { otp, vin, fullName, email, mobile } = await req.json();

        if (otp !== MASTER_OTP) {
            return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
        }

        const db = getDb();

        // Create or find user
        let user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile) as any;

        if (!user) {
            const userId = uuidv4();
            db.prepare(`
        INSERT INTO users (id, name, email, mobile, is_verified)
        VALUES (?, ?, ?, ?, 1)
      `).run(userId, fullName, email || null, mobile);
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
        } else {
            db.prepare('UPDATE users SET is_verified = 1, name = ?, email = ? WHERE mobile = ?')
                .run(fullName, email || null, mobile);
            user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile) as any;
        }

        // Link vehicle to user
        if (vin) {
            db.prepare('UPDATE vehicles SET user_id = ?, status = ? WHERE vin = ?')
                .run(user.id, 'verified', vin.toUpperCase());
        }

        return NextResponse.json({ success: true, user });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
