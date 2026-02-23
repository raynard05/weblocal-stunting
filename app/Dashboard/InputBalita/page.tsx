"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Baby, Calendar, MapPin, Phone, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function InputBalitaPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        parentName: '',
        childName: '',
        dob: '',
        gender: '',
        address: '',
        whatsapp: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/balita/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const result = await response.json()

            if (result.success) {
                toast({
                    variant: "success",
                    title: "Berhasil",
                    description: "Data balita berhasil disimpan!",
                })
                router.push("/Dashboard/InputBalita")
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

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <div className="flex-grow p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-6 pl-0 hover:bg-transparent hover:text-green-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Dashboard
                    </Button>

                    <Card className="border-2 border-green-500 shadow-[8px_8px_0px_0px_rgba(22,163,74,1)]">
                        <CardHeader className="bg-green-50/50 border-b border-green-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                    <Baby className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">Input Data Balita</CardTitle>
                                    <CardDescription className="text-green-700 font-medium">
                                        Masukkan data lengkap balita baru
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nama Orang Tua */}
                                <div className="space-y-2">
                                    <Label htmlFor="parentName" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <User className="w-4 h-4 text-green-600" />
                                        Nama Orang Tua / Ibu
                                    </Label>
                                    <Input
                                        id="parentName"
                                        placeholder="Masukkan nama lengkap ibu/OrangTua kandung"
                                        className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                        required
                                        value={formData.parentName}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Nama Anak */}
                                <div className="space-y-2">
                                    <Label htmlFor="childName" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <Baby className="w-4 h-4 text-green-600" />
                                        Nama Anak
                                    </Label>
                                    <Input
                                        id="childName"
                                        placeholder="Masukkan nama lengkap anak"
                                        className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                        required
                                        value={formData.childName}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tanggal Lahir */}
                                    <div className="space-y-2">
                                        <Label htmlFor="dob" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-green-600" />
                                            Tanggal Lahir
                                        </Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                            required
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                            <Baby className="w-4 h-4 text-green-600" />
                                            Jenis Kelamin
                                        </Label>
                                        <select
                                            id="gender"
                                            className="flex h-12 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">Pilih Jenis Kelamin</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Alamat Rumah */}
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        Alamat Rumah
                                    </Label>
                                    <textarea
                                        id="address"
                                        placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
                                        className="flex min-h-[80px] w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* No Whatsapp */}
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-green-600" />
                                        No. WhatsApp (Opsional)
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        type="tel"
                                        placeholder="08xxxxxxxxxx"
                                        className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 h-12"
                                        value={formData.whatsapp}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 hover:scale-[1.02] transition-all duration-200 shadow-md"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">Processing...</span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save className="w-5 h-5" />
                                                Simpan Data Balita
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
