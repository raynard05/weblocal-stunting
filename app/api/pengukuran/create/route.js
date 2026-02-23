import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { id_balita, tinggi_badan, berat_badan } = body;

        // Validate required fields
        if (!id_balita || !tinggi_badan || !berat_badan) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Semua field wajib diisi'
                },
                { status: 400 }
            );
        }

        // Insert pengukuran data with automatic timestamp
        const result = await pool.query(
            `INSERT INTO pengukuran_balita (id_balita, tinggi_badan, berat_badan, waktu_pengukuran) 
             VALUES ($1, $2, $3, NOW()) 
             RETURNING *`,
            [id_balita, tinggi_badan, berat_badan]
        );

        return NextResponse.json({
            success: true,
            data: result.rows[0],
            message: 'Data pengukuran berhasil disimpan'
        });
    } catch (error) {
        console.error('Error saving pengukuran:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal menyimpan data pengukuran'
            },
            { status: 500 }
        );
    }
}
