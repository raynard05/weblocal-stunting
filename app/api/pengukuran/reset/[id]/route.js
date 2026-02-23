import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// PUT reset measurement data by measurement ID
export async function PUT(request, context) {
    try {
        const { id: idParam } = await context.params;
        const id = Number(idParam);

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'ID pengukuran tidak valid' },
                { status: 400 }
            );
        }

        // Reset tinggi_badan and berat_badan to 0
        const result = await pool.query(
            `UPDATE pengukuran_balita 
             SET tinggi_badan = 0, berat_badan = 0
             WHERE id = $1
             RETURNING id, tinggi_badan, berat_badan`,
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Data pengukuran tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0],
            message: 'Data berhasil direset'
        });
    } catch (error) {
        console.error('Error resetting measurement:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal mereset data pengukuran'
            },
            { status: 500 }
        );
    }
}
