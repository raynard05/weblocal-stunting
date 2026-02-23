import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        const result = await pool.query(
            'SELECT id, nama_anak FROM identitas_balita ORDER BY nama_anak DESC'
        );

        return NextResponse.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching balita list:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal mengambil data balita'
            },
            { status: 500 }
        );
    }
}
