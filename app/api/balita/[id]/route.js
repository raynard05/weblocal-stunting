import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

/**
 * GET /api/balita/[id]
 * Ambil detail balita berdasarkan ID
 */
export async function GET(request, { params }) {
    try {
        const { id: idParam } = await params
        const id = Number(idParam)

        // Validasi ID
        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'ID balita tidak valid' },
                { status: 400 }
            )
        }

        const result = await pool.query(
            `
            SELECT 
                id,
                nama_ibu,
                nama_anak,
                tanggal_lahir,
                jenis_kelamin,
                no_whatsapp,
                created_at,
                updated_at
            FROM identitas_balita
            WHERE id = $1
            `,
            [id]
        )

        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Data balita tidak ditemukan' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0],
        })
    } catch (error) {
        console.error('GET balita error:', error)
        return NextResponse.json(
            { success: false, error: 'Terjadi kesalahan server' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/balita/[id]
 * Update data balita
 */
export async function PUT(request, { params }) {
    try {
        const { id: idParam } = await params
        const id = Number(idParam)

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { success: false, error: 'ID balita tidak valid' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const {
            nama_ibu,
            nama_anak,
            tanggal_lahir,
            jenis_kelamin,
            no_whatsapp,
        } = body

        // Validasi field wajib
        if (!nama_ibu || !nama_anak || !tanggal_lahir || !jenis_kelamin) {
            return NextResponse.json(
                { success: false, error: 'Field wajib tidak boleh kosong' },
                { status: 400 }
            )
        }

        const result = await pool.query(
            `
            UPDATE identitas_balita
            SET
                nama_ibu = $1,
                nama_anak = $2,
                tanggal_lahir = $3,
                jenis_kelamin = $4,
                no_whatsapp = $5,
                updated_at = NOW()
            WHERE id = $6
            RETURNING *
            `,
            [
                nama_ibu,
                nama_anak,
                tanggal_lahir,
                jenis_kelamin,
                no_whatsapp || null,
                id,
            ]
        )

        if (result.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Data balita tidak ditemukan' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Data balita berhasil diperbarui',
            data: result.rows[0],
        })
    } catch (error) {
        console.error('PUT balita error:', error)
        return NextResponse.json(
            { success: false, error: 'Gagal memperbarui data balita' },
            { status: 500 }
        )
    }
}
