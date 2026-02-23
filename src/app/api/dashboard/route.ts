import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const mobile = searchParams.get('mobile');

        if (!userId && !mobile) {
            return NextResponse.json({ error: 'userId or mobile required' }, { status: 400 });
        }

        const db = getDb();

        let user: any;
        if (userId) {
            user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        } else {
            user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile);
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const vehicles = db.prepare('SELECT * FROM vehicles WHERE user_id = ? ORDER BY created_at DESC').all(user.id);

        return NextResponse.json({ user, vehicles });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
