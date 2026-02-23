"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, LogOut, User, IdCard, Activity, Baby, Scale, ClipboardList, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface UserData {
    id: number
    nomor_petugas: string
    nama: string
    username: string
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null)
    const [posyanduInfo, setPosyanduInfo] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(new Date())
    const router = useRouter()

    useEffect(() => {
        // Timer for real-time clock
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem("user")
        console.log("Dashboard - checking user data:", userData)

        if (userData) {
            try {
                const parsed = JSON.parse(userData)
                console.log("Dashboard - user authorized:", parsed)
                setUser(parsed)

                // Fetch Posyandu Info
                if (parsed.id) {
                    fetchPosyanduInfo(parsed.id)
                }
            } catch (e) {
                console.error("Dashboard - failed to parse user data", e)
            }
        }
        setIsLoading(false)
    }, [])

    const fetchPosyanduInfo = async (userId: number) => {
        try {
            const response = await fetch(`/api/dashboard/info/${userId}`)
            const result = await response.json()
            if (result.success) {
                setPosyanduInfo(result.data)
            }
        } catch (error) {
            console.error("Error fetching posyandu info:", error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("user")
        window.location.href = "/"
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Memuat Dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
                <div className="text-xl font-bold mb-4">Dashboard Debug Mode</div>
                <div className="p-4 border border-red-500 rounded bg-red-50 mb-4 max-w-md text-center">
                    <p className="font-bold text-red-700">User Data Not Found in State</p>
                    <p className="text-sm mt-2 text-gray-600">The dashboard could not find your login session.</p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                    <Button
                        onClick={() => {
                            const data = localStorage.getItem("user");
                            if (data) {
                                alert("Found data: " + data);
                                setUser(JSON.parse(data));
                            } else {
                                alert("No data found in localStorage!");
                            }
                        }}
                        className="bg-black text-white w-full"
                    >
                        Check & Reload Session
                    </Button>
                    <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="w-full border-black"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Main Background Image - Dashboard.svg */}


            <div className="flex-grow p-4 md:p-8">
                {/* Header */}
                <header className="relative z-10 flex items-center justify-between mb-8 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-black">
                            <Heart className="w-8 h-8 text-black" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-light tracking-tight text-black">
                                Health<span className="font-semibold">Portal</span>
                            </h1>
                            <p className="text-lg text-gray-500 uppercase tracking-wider">Dashboard</p>
                        </div>
                    </div>

                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="border-2 border-black hover:bg-black hover:text-white transition-all duration-200 py-6 px-6 text-lg"
                    >
                        <LogOut className="w-6 h-6 mr-3" />
                        Logout
                    </Button>
                </header>

                {/* Main Content */}
                <main className="relative z-10 max-w-4xl mx-auto">
                    {/* Welcome Card */}
                    <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <CardHeader className="border-b border-black/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-1">
                                        <CardTitle className="text-3xl font-semibold text-black flex items-center gap-2">
                                            <Activity className="w-8 h-8" />
                                            Selamat Datang!
                                        </CardTitle>
                                    </div>

                                    <CardDescription className="text-xl text-gray-500 mt-2">
                                        Anda log in sebagai <b>{user.nama}</b>
                                        {posyanduInfo && (
                                            <span className="block mt-1 text-lg text-black font-medium">
                                                {posyanduInfo.nama_posyandu} - {posyanduInfo.lokasi_posyandu}
                                            </span>
                                        )}
                                    </CardDescription>
                                </div>
                                {/* Real-time Clock in Card Header */}
                                <div className="hidden md:flex flex-col items-end">
                                    <div className="text-3xl font-bold text-black tracking-tight">
                                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':')} <span className="text-lg font-medium text-gray-500">WIB</span>
                                    </div>
                                    <div className="text-base text-gray-500 font-medium uppercase tracking-wider mt-1">
                                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Nama */}
                                <div className="p-4 border-2 border-black bg-gray-50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Nama
                                        </span>
                                    </div>
                                    <p className="text-xl font-semibold text-black">{user.nama}</p>
                                </div>

                                {/* Username */}
                                <div className="p-4 border-2 border-black bg-gray-50">
                                    <div className="flex items-center gap-3 mb-2">
                                        <User className="w-5 h-5 text-gray-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Username
                                        </span>
                                    </div>
                                    <p className="text-xl font-semibold text-black">{user.username}</p>
                                </div>

                                {/* Nomor Petugas */}
                                <div className="p-4 border-2 border-black bg-gray-50 md:col-span-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <IdCard className="w-5 h-5 text-gray-600" />
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Nomor Petugas
                                        </span>
                                    </div>
                                    <p className="text-xl font-semibold text-black">{user.nomor_petugas}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Feature Service Cards */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* 1. Input Data Balita - Green Theme */}
                        <Link href="/Dashboard/InputBalita" className="block group">
                            <Card className="h-full bg-white border-2 border-green-500 shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] hover:shadow-[4px_4px_0px_0px_rgba(22,163,74,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer">
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <Baby className="w-8 h-8 text-green-600" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black mb-1 group-hover:text-green-600 transition-colors">Input Data Balita</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Pendaftaran data baru balita ke dalam sistem posyandu.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 2. Input Pengukuran - Blue Theme */}
                        <Link href="/Dashboard/InputPengukuran" className="block group">
                            <Card className="h-full bg-white border-2 border-blue-500 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)] hover:shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer">
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <Scale className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black mb-1 group-hover:text-blue-600 transition-colors">Input Pengukuran</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Catat data tinggi dan berat badan balita secara berkala.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 3. Kelola Data Balita - Orange Theme */}
                        <Link href="/Dashboard/KelolaDataBalita" className="block group">
                            <Card className="h-full bg-white border-2 border-orange-500 shadow-[8px_8px_0px_0px_rgba(234,88,12,1)] hover:shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer">
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <ClipboardList className="w-8 h-8 text-orange-600" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black mb-1 group-hover:text-orange-600 transition-colors">Kelola Data Balita</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Lihat, ubah, atau hapus data balita yang terdaftar.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* 4. Rekap & Laporan - Purple Theme */}
                        <Link href="/Dashboard/Laporan" className="block group">
                            <Card className="h-full bg-white border-2 border-purple-500 shadow-[8px_8px_0px_0px_rgba(147,51,234,1)] hover:shadow-[4px_4px_0px_0px_rgba(147,51,234,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200 cursor-pointer">
                                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-purple-50 border-2 border-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                        <FileText className="w-8 h-8 text-purple-600" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-black mb-1 group-hover:text-purple-600 transition-colors">Laporan Posyandu</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">Lihat statistik harian dan cetak laporan posyandu.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="relative z-10 w-full bg-black text-white py-8 px-4 text-center mt-auto border-t-4 border-gray-900">
                <div className="max-w-4xl mx-auto">
                    <p className="text-sm font-medium tracking-wide mb-4">
                        &copy; 2024 HealthPortal Posyandu. Hak Cipta Dilindungi.
                    </p>
                    <div className="flex justify-center gap-6 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                        <a href="#" className="hover:text-white transition-colors">Privasi</a>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                        <span>•</span>
                        <a href="#" className="hover:text-white transition-colors">Bantuan</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
