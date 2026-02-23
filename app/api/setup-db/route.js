import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS identitas_balita (
                id SERIAL PRIMARY KEY,
                nama_ibu VARCHAR(100) NOT NULL,
                nama_anak VARCHAR(100) NOT NULL,
                tanggal_lahir DATE NOT NULL,
                jenis_kelamin VARCHAR(10) 
                    CHECK (jenis_kelamin IN ('Laki-laki', 'Perempuan')) NOT NULL,
                alamat TEXT NOT NULL,
                no_whatsapp VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await query(createTableQuery);
        return NextResponse.json({ success: true, message: 'Table identitas_balita created successfully' });
    } catch (error) {
        console.error('Error creating table:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
