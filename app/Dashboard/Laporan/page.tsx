"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Printer, Users as UsersIcon, Smartphone, CheckCircle, XCircle, FileText, Calendar, Building, MapPin, User, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface StatsData {
    total_balita: number
    gender: {
        laki_laki: number
        perempuan: number
    }
    whatsapp: {
        ada_wa: number
        tidak_ada_wa: number
    }
    measurement: {
        sudah_diukur: number
        belum_diukur: number
    }
    tanggal: string
}

interface PosyanduInfo {
    nama: string // nama petugas
    nama_posyandu: string
    lokasi_posyandu: string
}

export default function LaporanPage() {
    const router = useRouter()
    const { toast } = useToast()
    const reportRef = useRef<HTMLDivElement>(null)

    const [stats, setStats] = useState<StatsData | null>(null)
    const [posyanduInfo, setPosyanduInfo] = useState<PosyanduInfo | null>(null)
    const [evaluasi, setEvaluasi] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get user from local storage
                const userDataStr = localStorage.getItem("user")
                if (!userDataStr) {
                    router.push("/")
                    return
                }
                const userData = JSON.parse(userDataStr)

                // Fetch Posyandu Info
                const infoResponse = await fetch(`/api/dashboard/info/${userData.id}`)
                const infoResult = await infoResponse.json()

                if (infoResult.success) {
                    setPosyanduInfo(infoResult.data)
                }

                // Fetch Stats
                const statsResponse = await fetch('/api/laporan/stats')
                const statsResult = await statsResponse.json()

                if (statsResult.success) {
                    setStats(statsResult.data)
                }

            } catch (error) {
                console.error("Error fetching data:", error)
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: "Gagal memuat data laporan",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const handlePrint = async () => {
        if (!reportRef.current || !posyanduInfo) return

        setIsGenerating(true)
        toast({
            title: "Memproses PDF",
            description: "Mohon tunggu sebentar...",
        })

        try {
            const canvas = await html2canvas(reportRef.current!, {
                scale: 2, // Higher quality
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                onclone: (clonedDoc: Document) => {
                    // Force body background to white
                    clonedDoc.body.style.background = 'none'
                    clonedDoc.body.style.backgroundColor = '#ffffff'

                    // Iterate over all elements to sanitize styles
                    const allElements = clonedDoc.getElementsByTagName('*')
                    for (let i = 0; i < allElements.length; i++) {
                        const el = allElements[i] as HTMLElement
                        const style = window.getComputedStyle(el)

                        // 1. Sanitize Border Color (often comes from global * { border-color: ... })
                        // We force a default gray if it's not explicitly set to something else, or just overwrite it
                        if (style.borderColor && (style.borderColor.includes('oklch') || style.borderColor.includes('lab'))) {
                            el.style.borderColor = '#e5e7eb'
                        } else if (!style.borderColor) {
                            el.style.borderColor = '#e5e7eb'
                        }

                        // 2. Sanitize Background Color if it uses oklch/lab
                        if (style.backgroundColor && (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('lab'))) {
                            el.style.backgroundColor = '#ffffff'
                        }

                        // 3. Sanitize Text Color
                        if (style.color && (style.color.includes('oklch') || style.color.includes('lab'))) {
                            el.style.color = '#111827'
                        }
                    }
                }
            } as any)

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()

            const imgWidth = pdfWidth
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            // Logic to handle multi-page content if needed, but assuming single page for stats
            let heightLeft = imgHeight
            let position = 0

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pdfHeight

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pdfHeight
            }

            const fileName = `Laporan_Posyandu_${posyanduInfo.nama_posyandu.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
            pdf.save(fileName)

            toast({
                variant: "success",
                title: "Berhasil",
                description: "Laporan berhasil diunduh",
            })
        } catch (error) {
            console.error("Error generating PDF:", error)
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Gagal membuat PDF",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-purple-600 font-medium animate-pulse">Memuat Laporan...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans p-4 md:p-8">
            <div className="max-w-5xl mx-auto w-full">
                {/* Navigation & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="pl-0 hover:bg-transparent hover:text-[#9333ea] transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Button>

                    <Button
                        onClick={handlePrint}
                        disabled={isGenerating}
                        className="bg-[#9333ea] hover:bg-[#7e22ce] text-white shadow-lg shadow-[#e9d5ff]"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">Generating...</span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Download className="w-5 h-5" />
                                Unduh Laporan PDF
                            </span>
                        )}
                    </Button>
                </div>

                {/* Printable Report Container */}
                <div ref={reportRef} className="bg-white p-8 md:p-12 border border-[#e5e7eb] shadow-xl rounded-xl">

                    {/* Report Header */}
                    <div className="border-b-4 border-[#9333ea] pb-8 mb-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">Laporan Harian Posyandu</h1>
                                <p className="text-lg text-[#9333ea] font-medium">
                                    {new Date().toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f3e8ff] border-2 border-[#9333ea] mb-2">
                                    <FileText className="w-8 h-8 text-[#9333ea]" />
                                </div>
                            </div>
                        </div>

                        {/* Posyandu Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-6 bg-[#faf5ff] rounded-lg border border-[#f3e8ff]">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-[#9333ea] uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Petugas
                                </span>
                                <span className="text-lg font-semibold text-[#111827]">{posyanduInfo?.nama || "-"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-[#9333ea] uppercase tracking-wider flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Posyandu
                                </span>
                                <span className="text-lg font-semibold text-[#111827]">{posyanduInfo?.nama_posyandu || "-"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-bold text-[#9333ea] uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Lokasi
                                </span>
                                <span className="text-lg font-semibold text-[#111827]">{posyanduInfo?.lokasi_posyandu || "-"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                        {/* 1. Total & Gender */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[#111827] border-l-4 border-[#a855f7] pl-4 py-1">Data Demografi</h3>

                            <div className="bg-gradient-to-br from-[#f9fafb] to-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#f3e8ff] rounded-lg text-[#9333ea]">
                                            <UsersIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-[#6b7280]">Total Balita Terdaftar</div>
                                            <div className="text-3xl font-bold text-[#111827]">{stats?.total_balita} Anak</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-[#eff6ff] rounded-lg border border-[#dbeafe]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                                            <span className="font-medium text-[#374151]">Laki-laki</span>
                                        </div>
                                        <span className="text-xl font-bold text-[#1d4ed8]">{stats?.gender.laki_laki}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-[#fdf2f8] rounded-lg border border-[#fce7f3]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
                                            <span className="font-medium text-[#374151]">Perempuan</span>
                                        </div>
                                        <span className="text-xl font-bold text-[#be185d]">{stats?.gender.perempuan}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Measurement Activity */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[#111827] border-l-4 border-[#22c55e] pl-4 py-1">Aktivitas Pengukuran Hari Ini</h3>

                            <div className="bg-gradient-to-br from-[#f9fafb] to-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-[#dcfce7] rounded-lg text-[#16a34a]">
                                        <Activity className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-[#6b7280]">Status Pengukuran</div>
                                        <div className="text-sm font-medium text-[#9ca3af]">{new Date().toLocaleDateString('id-ID')}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0] text-center">
                                        <div className="text-3xl font-bold text-[#15803d] mb-1">{stats?.measurement.sudah_diukur}</div>
                                        <div className="text-sm font-medium text-[#166534] flex items-center justify-center gap-1">
                                            <CheckCircle className="w-4 h-4" />
                                            Sudah Diukur
                                        </div>
                                    </div>
                                    <div className="p-4 bg-[#f3f4f6] rounded-xl border border-[#e5e7eb] text-center">
                                        <div className="text-3xl font-bold text-[#6b7280] mb-1">{stats?.measurement.belum_diukur}</div>
                                        <div className="text-sm font-medium text-[#4b5563] flex items-center justify-center gap-1">
                                            <XCircle className="w-4 h-4" />
                                            Belum Diukur
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Coverage */}
                            <div className="bg-gradient-to-br from-[#f9fafb] to-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm mt-6">
                                <h4 className="text-sm font-bold text-[#374151] uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    Jangkauan WhatsApp Orang Tua
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#4b5563]">Memiliki WhatsApp</span>
                                        <span className="font-bold text-[#111827]">{stats?.whatsapp.ada_wa} Orang Tua</span>
                                    </div>
                                    <div className="w-full bg-[#e5e7eb] rounded-full h-2">
                                        <div
                                            className="bg-[#22c55e] h-2 rounded-full"
                                            style={{ width: `${(stats?.total_balita ? (stats.whatsapp.ada_wa / stats.total_balita) * 100 : 0)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-sm mt-2">
                                        <span className="text-[#4b5563]">Tidak Memiliki WhatsApp</span>
                                        <span className="font-bold text-[#111827]">{stats?.whatsapp.tidak_ada_wa} Orang Tua</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Evaluasi Section */}
                    <div>
                        <h3 className="text-xl font-bold text-[#111827] border-l-4 border-[#f97316] pl-4 py-1 mb-4">Catatan Evaluasi Petugas</h3>
                        <div className="bg-[#fff7ed] p-6 rounded-xl border border-[#fed7aa]">
                            <label htmlFor="evaluasi" className="text-sm font-medium text-[#374151] mb-2 block">
                                Tambahkan catatan atau evaluasi untuk kegiatan hari ini:
                            </label>
                            <textarea
                                id="evaluasi"
                                placeholder="Tuliskan evaluasi kegiatan, kendala, atau catatan penting lainnya..."
                                className="flex min-h-[150px] w-full rounded-md border border-[#fed7aa] bg-white px-3 py-2 text-sm placeholder:text-[#9ca3af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fed7aa] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[#1f2937]"
                                value={evaluasi}
                                onChange={(e) => setEvaluasi(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Footer for Report */}
                    <div className="mt-12 flex justify-end">
                        <div className="text-center w-64">
                            <p className="text-sm text-[#4b5563] mb-16">Mengetahui, Petugas Posyandu</p>
                            <div className="border-b border-[#111827] mb-2"></div>
                            <p className="font-bold text-[#111827] text-lg">{posyanduInfo?.nama}</p>
                            <p className="text-sm text-[#6b7280]">NIP. {posyanduInfo && 'nomor_petugas' in posyanduInfo ? (posyanduInfo as any).nomor_petugas : "-"}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

}
