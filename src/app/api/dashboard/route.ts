import { NextRequest, NextResponse } from 'next/server';
import { getUserById, getUserByMobile, getVehiclesByUserId } from '@/lib/store';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const mobile = searchParams.get('mobile');

        if (!userId && !mobile) {
            return NextResponse.json({ error: 'userId or mobile required' }, { status: 400 });
        }

        const user = userId ? getUserById(userId) : getUserByMobile(mobile!);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const vehicles = getVehiclesByUserId(user.id);
        return NextResponse.json({ user, vehicles });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
