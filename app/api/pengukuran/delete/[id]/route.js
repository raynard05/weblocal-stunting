import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// DELETE measurement data by measurement ID
export async function DELETE(request, context) {
    try {
        const { id: idParam } = await context.params;
        const id = Number(idParam);

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'ID pengukuran tidak valid' },
                { status: 400 }
            );
        }

        // Delete the measurement record
        const result = await pool.query(
            `DELETE FROM pengukuran_balita 
             WHERE id = $1
             RETURNING id`,
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
            message: 'Data berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting measurement:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal menghapus data pengukuran'
            },
            { status: 500 }
        );
    }
}
