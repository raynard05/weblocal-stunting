import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const balitaSchema = z.object({
    parentName: z.string().min(1, 'Nama ibu wajib diisi').max(100, 'Nama ibu terlalu panjang'),
    childName: z.string().min(1, 'Nama anak wajib diisi').max(100, 'Nama anak terlalu panjang'),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal lahir tidak valid'),
    gender: z.enum(['Laki-laki', 'Perempuan'], {
        errorMap: () => ({ message: 'Jenis kelamin harus Laki-laki atau Perempuan' })
    }),
    address: z.string().min(1, 'Alamat wajib diisi'),
    whatsapp: z.string().optional().nullable()
});

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate with Zod
        const validation = balitaSchema.safeParse(body);
        if (!validation.success) {
            const errors = validation.error.errors.map(err => err.message).join(', ');
            return NextResponse.json(
                { success: false, error: errors },
                { status: 400 }
            );
        }

        const { parentName, childName, dob, gender, address, whatsapp } = validation.data;

        // Check for duplicates (same child name + DOB + parent name)
        const duplicateCheckQuery = `
            SELECT id FROM identitas_balita 
            WHERE LOWER(nama_anak) = LOWER($1) 
              AND tanggal_lahir = $2 
              AND LOWER(nama_ibu) = LOWER($3)
            LIMIT 1
        `;

        const duplicateCheck = await query(duplicateCheckQuery, [childName, dob, parentName]);

        if (duplicateCheck.rows.length > 0) {
            return NextResponse.json(
                { success: false, error: 'Data balita dengan nama, tanggal lahir, dan nama ibu yang sama sudah terdaftar' },
                { status: 409 }
            );
        }

        // Insert data
        const insertQuery = `
            INSERT INTO identitas_balita (nama_ibu, nama_anak, tanggal_lahir, jenis_kelamin, alamat, no_whatsapp)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, created_at
        `;

        const result = await query(insertQuery, [
            parentName,
            childName,
            dob,
            gender,
            address,
            whatsapp || null
        ]);

        return NextResponse.json({
            success: true,
            message: 'Data balita berhasil disimpan',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error creating balita data:', error);
        return NextResponse.json(
            { success: false, error: 'Gagal menyimpan data balita' },
            { status: 500 }
        );
    }
}
