import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// GET measurement history by balita ID
export async function GET(request, context) {
    try {
        const { id: idParam } = await context.params;
        const id = Number(idParam);

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'ID balita tidak valid' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `SELECT 
                pb.id,
                pb.id_balita,
                ib.nama_anak,
                pb.tinggi_badan,
                pb.berat_badan,
                pb.waktu_pengukuran
            FROM pengukuran_balita pb
            JOIN identitas_balita ib
                ON pb.id_balita = ib.id
            WHERE pb.id_balita = $1
            ORDER BY pb.waktu_pengukuran DESC`,
            [id]
        );

        return NextResponse.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching measurement history:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal mengambil riwayat pengukuran'
            },
            { status: 500 }
        );
    }
}
