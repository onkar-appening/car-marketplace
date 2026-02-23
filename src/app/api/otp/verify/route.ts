import { NextRequest, NextResponse } from 'next/server';
import { getUserByMobile, createUser, updateUser, updateVehicle } from '@/lib/store';

const MASTER_OTP = '0000';

export async function POST(req: NextRequest) {
    try {
        const { otp, vin, fullName, email, mobile } = await req.json();

        if (otp !== MASTER_OTP) {
            return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
        }

        let user = getUserByMobile(mobile);

        if (!user) {
            user = createUser({ name: fullName, email, mobile });
        } else {
            updateUser(user.id, { name: fullName, email: email || null, is_verified: 1 });
            user = getUserByMobile(mobile)!;
        }

        if (vin) {
            updateVehicle(vin.toUpperCase(), { user_id: user.id, status: 'verified' });
        }

        return NextResponse.json({ success: true, user });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
