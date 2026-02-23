import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET(request, context) {
    try {
        const { id: idParam } = await context.params;
        const id = Number(idParam);

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'ID petugas tidak valid' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `SELECT 
                pp.nama,
                pp.id_posyandu,
                p.nama_posyandu,
                p.lokasi_posyandu
            FROM petugas_posyandu pp
            LEFT JOIN posyandu p
                ON pp.id_posyandu = p.id
            WHERE pp.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Petugas tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching dashboard info:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal mengambil informasi dashboard'
            },
            { status: 500 }
        );
    }
}
