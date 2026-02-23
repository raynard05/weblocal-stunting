"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface Balita {
    id: number
    nama_anak: string
}

export default function KelolaDataBalitaPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [balitaList, setBalitaList] = useState<Balita[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBalitaList()
    }, [])

    const fetchBalitaList = async () => {
        try {
            const response = await fetch('/api/balita/list-all')
            const result = await response.json()

            if (result.success) {
                setBalitaList(result.data)
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: "Gagal mengambil data balita",
                })
            }
        } catch (error) {
            console.error('Error fetching balita list:', error)
            toast({
                variant: "destructive",
                title: "Kesalahan",
                description: "Terjadi kesalahan saat mengambil data balita",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleReview = (id: number) => {
        console.log('Navigating to review page with ID:', id)
        router.push(`/Dashboard/ReviewBalita/${id}`)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <div className="flex-grow p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/Dashboard')}
                        className="mb-6 pl-0 hover:bg-transparent hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Button>

                    <Card className="border-2 border-orange-500 shadow-[8px_8px_0px_0px_rgba(234,88,12,1)]">
                        <CardHeader className="bg-orange-50/50 border-b border-orange-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">Kelola Data Balita</CardTitle>
                                    <CardDescription className="text-orange-700 font-medium">
                                        Daftar semua data balita terdaftar
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">Memuat data...</div>
                                </div>
                            ) : balitaList.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-gray-500">Belum ada data balita</div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-orange-50 border-b-2 border-orange-200">
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                    No.
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                    ID
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                    Nama Anak
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {balitaList.map((balita, index) => (
                                                <tr
                                                    key={balita.id}
                                                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-4 py-3 text-sm text-gray-700">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                                                        {balita.id}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                                                        {balita.nama_anak}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <Button
                                                            onClick={() => handleReview(balita.id)}
                                                            size="sm"
                                                            className="bg-orange-600 hover:bg-orange-700 text-white"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Review
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
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
