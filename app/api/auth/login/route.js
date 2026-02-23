import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: 'Username dan password harus diisi' },
                { status: 400 }
            );
        }

        // Query to find user by username and password
        const result = await query(
            'SELECT id, nomor_petugas, nama, username FROM petugas_posyandu WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Username atau password salah' },
                { status: 401 }
            );
        }

        const user = result.rows[0];

        // Ensure clean JSON response
        const responseData = {
            success: true,
            message: 'Login berhasil',
            user: {
                id: user.id,
                nomor_petugas: user.nomor_petugas,
                nama: user.nama,
                username: user.username,
            },
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, message: 'Terjadi kesalahan server', error: error.message },
            { status: 500 }
        );
    }
}
