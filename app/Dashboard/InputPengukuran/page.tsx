"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Baby, Calendar, Scale, Ruler, Save, ChevronsUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Balita {
    id: number
    nama_anak: string
    tanggal_lahir: string
}

// Function to calculate age in months and days
function calculateAge(birthDate: string) {
    const birth = new Date(birthDate)
    const today = new Date()

    let years = today.getFullYear() - birth.getFullYear()
    let months = today.getMonth() - birth.getMonth()
    let days = today.getDate() - birth.getDate()

    if (days < 0) {
        months--
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        days += lastMonth.getDate()
    }

    if (months < 0) {
        years--
        months += 12
    }

    const totalMonths = years * 12 + months

    return { months: totalMonths, days }
}

export default function InputPengukuranPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [balitaList, setBalitaList] = useState<Balita[]>([])
    const [selectedBalitaId, setSelectedBalitaId] = useState("")
    const [tanggalLahir, setTanggalLahir] = useState("")
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [formData, setFormData] = useState({
        tinggi_badan: '',
        berat_badan: ''
    })

    useEffect(() => {
        fetchBalitaList()
    }, [])

    const fetchBalitaList = async () => {
        try {
            const response = await fetch('/api/balita/list')
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
        }
    }

    const handleBalitaChange = (id: string) => {
        setSelectedBalitaId(id)
        const selectedBalita = balitaList.find(b => b.id.toString() === id)
        if (selectedBalita) {
            setTanggalLahir(selectedBalita.tanggal_lahir)
        }
        setOpen(false)
        setSearchQuery("")
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/pengukuran/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_balita: parseInt(selectedBalitaId),
                    tinggi_badan: parseFloat(formData.tinggi_badan),
                    berat_badan: parseFloat(formData.berat_badan),
                }),
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    variant: "success",
                    title: "Berhasil",
                    description: "Data pengukuran berhasil disimpan!",
                })
                // Reset form and refetch balita list
                setSelectedBalitaId("")
                setTanggalLahir("")
                setFormData({ tinggi_badan: '', berat_badan: '' })
                fetchBalitaList()
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: result.error || "Gagal menyimpan data",
                })
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            toast({
                variant: "destructive",
                title: "Kesalahan",
                description: "Terjadi kesalahan saat menyimpan data",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const selectedBalita = balitaList.find(b => b.id.toString() === selectedBalitaId)

    // Filter balita based on search query
    const filteredBalita = balitaList.filter(balita =>
        balita.nama_anak.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <div className="flex-grow p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Button>

                    <Card className="border-2 border-blue-500 shadow-[8px_8px_0px_0px_rgba(37,99,235,1)]">
                        <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                                    <Scale className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">Input Pengukuran</CardTitle>
                                    <CardDescription className="text-blue-700 font-medium">
                                        Catat data tinggi dan berat badan balita
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Pilih Balita - Custom Searchable Dropdown */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <Baby className="w-4 h-4 text-blue-600" />
                                        Pilih Balita
                                    </Label>
                                    <div className="relative">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            onClick={() => setOpen(!open)}
                                            className="w-full h-12 justify-between border-2 border-gray-200 hover:border-blue-500 hover:bg-white"
                                        >
                                            {selectedBalita?.nama_anak || "Pilih atau cari nama balita..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>

                                        {open && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg">
                                                <div className="p-2 border-b">
                                                    <Input
                                                        placeholder="Cari nama balita..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="h-9"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="max-h-[300px] overflow-y-auto p-1">
                                                    {filteredBalita.length === 0 ? (
                                                        <div className="py-6 text-center text-sm text-gray-500">
                                                            Tidak ada balita ditemukan.
                                                        </div>
                                                    ) : (
                                                        filteredBalita.map((balita) => (
                                                            <div
                                                                key={balita.id}
                                                                onClick={() => handleBalitaChange(balita.id.toString())}
                                                                className={cn(
                                                                    "flex items-center px-2 py-2 cursor-pointer rounded-sm hover:bg-gray-100",
                                                                    selectedBalitaId === balita.id.toString() && "bg-blue-50"
                                                                )}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        selectedBalitaId === balita.id.toString() ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                <span>{balita.nama_anak}</span>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tanggal Lahir & Umur (Auto-filled) */}
                                {tanggalLahir && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-blue-600" />
                                            Tanggal Lahir & Umur
                                        </Label>
                                        <div className="flex h-auto w-full rounded-md border-2 border-gray-200 bg-gray-50 px-3 py-3 text-sm flex-col gap-1">
                                            <div className="font-medium">
                                                {new Date(tanggalLahir).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                            <div className="text-blue-600 font-semibold">
                                                Umur: {calculateAge(tanggalLahir).months} bulan {calculateAge(tanggalLahir).days} hari
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tinggi Badan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="tinggi_badan" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                            <Ruler className="w-4 h-4 text-blue-600" />
                                            Tinggi Badan (cm)
                                        </Label>
                                        <Input
                                            id="tinggi_badan"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="Masukkan tinggi badan"
                                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                                            required
                                            value={formData.tinggi_badan}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Berat Badan */}
                                    <div className="space-y-2">
                                        <Label htmlFor="berat_badan" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                            <Scale className="w-4 h-4 text-blue-600" />
                                            Berat Badan (kg)
                                        </Label>
                                        <Input
                                            id="berat_badan"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="Masukkan berat badan"
                                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-12"
                                            required
                                            value={formData.berat_badan}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all duration-200 shadow-md"
                                        disabled={isLoading || !selectedBalitaId}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">Processing...</span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save className="w-5 h-5" />
                                                Simpan Data Pengukuran
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
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
