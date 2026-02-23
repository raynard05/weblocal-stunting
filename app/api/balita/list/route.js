import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                ib.id,
                ib.nama_anak,
                ib.tanggal_lahir
            FROM identitas_balita ib
            LEFT JOIN pengukuran_balita pb
                ON ib.id = pb.id_balita
                AND DATE(pb.waktu_pengukuran) = CURRENT_DATE
            WHERE 
                pb.id IS NULL
                OR pb.tinggi_badan IS NULL
                OR pb.berat_badan IS NULL
                OR pb.tinggi_badan = 0
                OR pb.berat_badan = 0
            ORDER BY ib.nama_anak ASC
        `);

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
