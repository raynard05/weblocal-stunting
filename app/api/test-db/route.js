import { testConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    // Log environment variable untuk debugging (akan muncul di terminal, bukan browser)
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

    try {
        const result = await testConnection();

        if (result.success) {
            return NextResponse.json({
                status: 'connected',
                message: 'Database connection successful',
                serverTime: result.timestamp,
                databaseUrlSet: !!process.env.DATABASE_URL,
            });
        } else {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Database connection failed',
                    error: result.error,
                    databaseUrlSet: !!process.env.DATABASE_URL,
                },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            {
                status: 'error',
                message: 'Unexpected error',
                error: error.message,
                databaseUrlSet: !!process.env.DATABASE_URL,
            },
            { status: 500 }
        );
    }
}
