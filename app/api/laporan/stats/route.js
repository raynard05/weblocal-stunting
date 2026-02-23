import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        // We can add filtering by petugas ID if needed in the future
        // const idPetugas = searchParams.get('id_petugas'); 

        const today = new Date().toISOString().split('T')[0];

        // 1. Total Balita
        const totalBalitaQuery = await query('SELECT COUNT(*) FROM identitas_balita');
        const totalBalita = parseInt(totalBalitaQuery.rows[0].count);

        // 2. Gender Stats
        const genderQuery = await query(`
            SELECT 
                SUM(CASE WHEN jenis_kelamin = 'Laki-laki' THEN 1 ELSE 0 END) as laki_laki,
                SUM(CASE WHEN jenis_kelamin = 'Perempuan' THEN 1 ELSE 0 END) as perempuan
            FROM identitas_balita
        `);
        const genderStats = {
            laki_laki: parseInt(genderQuery.rows[0].laki_laki || 0),
            perempuan: parseInt(genderQuery.rows[0].perempuan || 0)
        };

        // 3. WhatsApp Coverage
        const waQuery = await query(`
            SELECT 
                SUM(CASE WHEN no_whatsapp IS NOT NULL AND no_whatsapp != '' THEN 1 ELSE 0 END) as ada_wa,
                SUM(CASE WHEN no_whatsapp IS NULL OR no_whatsapp = '' THEN 1 ELSE 0 END) as tidak_ada_wa
            FROM identitas_balita
        `);
        const waStats = {
            ada_wa: parseInt(waQuery.rows[0].ada_wa || 0),
            tidak_ada_wa: parseInt(waQuery.rows[0].tidak_ada_wa || 0)
        };

        // 4. Measurement Today
        // Count unique balita measured today
        const measuredTodayQuery = await query(`
            SELECT COUNT(DISTINCT id_balita) 
            FROM pengukuran_balita 
            WHERE DATE(waktu_pengukuran) = $1
        `, [today]);

        const measuredToday = parseInt(measuredTodayQuery.rows[0].count || 0);
        const notMeasuredToday = totalBalita - measuredToday;

        const data = {
            total_balita: totalBalita,
            gender: genderStats,
            whatsapp: waStats,
            measurement: {
                sudah_diukur: measuredToday,
                belum_diukur: notMeasuredToday
            },
            tanggal: today
        };

        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Error fetching report stats:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Gagal mengambil data laporan'
            },
            { status: 500 }
        );
    }
}
