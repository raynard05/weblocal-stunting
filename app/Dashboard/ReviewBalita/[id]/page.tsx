"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, User, Baby, Calendar, Users as GenderIcon, Phone, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface BalitaDetail {
    id: number
    nama_ibu: string
    nama_anak: string
    tanggal_lahir: string
    jenis_kelamin: string
    no_whatsapp: string
    created_at: string
    updated_at: string
}

export default function ReviewBalitaPage() {
    const router = useRouter()
    const params = useParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [balitaData, setBalitaData] = useState<BalitaDetail | null>(null)
    const [formData, setFormData] = useState({
        nama_ibu: '',
        nama_anak: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        no_whatsapp: ''
    })

    // Edit state for each field
    const [isEditing, setIsEditing] = useState({
        nama_ibu: false,
        nama_anak: false,
        tanggal_lahir: false,
        jenis_kelamin: false,
        no_whatsapp: false
    })

    // Measurement history state
    const [measurementHistory, setMeasurementHistory] = useState<any[]>([])

    // Delete state
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeletePending, setIsDeletePending] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchBalitaDetail(params.id as string)
            fetchMeasurementHistory(params.id as string)
        }
    }, [params.id])

    const fetchMeasurementHistory = async (id: string) => {
        try {
            const response = await fetch(`/api/pengukuran/history/${id}`)
            const result = await response.json()
            if (result.success) {
                setMeasurementHistory(result.data)
            }
        } catch (error) {
            console.error('Error fetching measurement history:', error)
        }
    }

    const fetchBalitaDetail = async (id: string) => {
        try {
            const response = await fetch(`/api/balita/${id}`)
            const result = await response.json()

            if (result.success) {
                setBalitaData(result.data)

                // Format date for input field (YYYY-MM-DD)
                const formattedDate = result.data.tanggal_lahir
                    ? new Date(result.data.tanggal_lahir).toISOString().split('T')[0]
                    : ''

                setFormData({
                    nama_ibu: result.data.nama_ibu,
                    nama_anak: result.data.nama_anak,
                    tanggal_lahir: formattedDate,
                    jenis_kelamin: result.data.jenis_kelamin,
                    no_whatsapp: result.data.no_whatsapp || ''
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: result.error || "Gagal mengambil data balita",
                })
                router.push('/Dashboard/KelolaDataBalita')
            }
        } catch (error) {
            console.error('Error fetching balita detail:', error)
            toast({
                variant: "destructive",
                title: "Kesalahan",
                description: "Terjadi kesalahan saat mengambil data balita",
            })
            router.push('/Dashboard/KelolaDataBalita')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleEdit = (field: keyof typeof isEditing) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleGenderChange = (value: string) => {
        setFormData(prev => ({ ...prev, jenis_kelamin: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const response = await fetch(`/api/balita/${params.id}`, {
                method: 'PUT',
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
                    description: "Data balita berhasil diupdate!",
                })
                // Turn off all edit modes
                setIsEditing({
                    nama_ibu: false,
                    nama_anak: false,
                    tanggal_lahir: false,
                    jenis_kelamin: false,
                    no_whatsapp: false
                })
                // Refresh data
                fetchBalitaDetail(params.id as string)
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: result.error || "Gagal mengupdate data",
                })
            }
        } catch (error) {
            console.error('Error updating balita:', error)
            toast({
                variant: "destructive",
                title: "Kesalahan",
                description: "Terjadi kesalahan saat mengupdate data",
            })
        } finally {
            setIsSaving(false)
        }
    }

    const confirmDelete = (id: number) => {
        setDeleteId(id)
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setIsDeletePending(true)

        try {
            const response = await fetch(`/api/pengukuran/delete/${deleteId}`, {
                method: 'DELETE'
            })
            const result = await response.json()

            if (result.success) {
                toast({
                    variant: "success",
                    title: "Berhasil Dihapus",
                    description: "Data pengukuran berhasil dihapus",
                })
                fetchMeasurementHistory(params.id as string)
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: result.error || "Gagal menghapus data",
                })
            }
        } catch (error) {
            console.error('Error deleting data:', error)
            toast({
                variant: "destructive",
                title: "Kesalahan",
                description: "Terjadi kesalahan saat menghapus data",
            })
        } finally {
            setIsDeletePending(false)
            setDeleteId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-gray-500">Memuat data...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <div className="flex-grow p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-6 pl-0 hover:bg-transparent hover:text-orange-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Kembali ke Kelola Data
                    </Button>

                    <Card className="border-2 border-orange-500 shadow-[8px_8px_0px_0px_rgba(234,88,12,1)] mb-8">
                        <CardHeader className="bg-orange-50/50 border-b border-orange-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center">
                                    <User className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">Review Data Balita</CardTitle>
                                    <CardDescription className="text-orange-700 font-medium">
                                        Lihat dan edit informasi detail balita
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Read-only fields */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide">ID</Label>
                                        <div className="text-sm font-semibold text-gray-900">{balitaData?.id}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Dibuat
                                        </Label>
                                        <div className="text-sm text-gray-700">
                                            {balitaData?.created_at && new Date(balitaData.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Diupdate
                                        </Label>
                                        <div className="text-sm text-gray-700">
                                            {balitaData?.updated_at && new Date(balitaData.updated_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Editable fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nama Ibu */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="nama_ibu" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <User className="w-4 h-4 text-orange-600" />
                                                Nama Ibu
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('nama_ibu')}
                                                className="text-orange-600 text-xs font-bold uppercase hover:underline flex items-center gap-1"
                                            >
                                                <span className="w-4 h-4 border border-orange-600 rounded-sm flex items-center justify-center text-[10px]">✎</span>
                                                Edit
                                            </button>
                                        </div>
                                        <Input
                                            id="nama_ibu"
                                            type="text"
                                            disabled={!isEditing.nama_ibu}
                                            placeholder="Masukkan nama ibu"
                                            className={cn(
                                                "border-2 h-12 transition-all duration-200",
                                                isEditing.nama_ibu
                                                    ? "border-orange-500 bg-white ring-2 ring-orange-200"
                                                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            )}
                                            required
                                            value={formData.nama_ibu}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Nama Anak */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="nama_anak" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <Baby className="w-4 h-4 text-orange-600" />
                                                Nama Anak
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('nama_anak')}
                                                className="text-orange-600 text-xs font-bold uppercase hover:underline flex items-center gap-1"
                                            >
                                                <span className="w-4 h-4 border border-orange-600 rounded-sm flex items-center justify-center text-[10px]">✎</span>
                                                Edit
                                            </button>
                                        </div>
                                        <Input
                                            id="nama_anak"
                                            type="text"
                                            disabled={!isEditing.nama_anak}
                                            placeholder="Masukkan nama anak"
                                            className={cn(
                                                "border-2 h-12 transition-all duration-200",
                                                isEditing.nama_anak
                                                    ? "border-orange-500 bg-white ring-2 ring-orange-200"
                                                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            )}
                                            required
                                            value={formData.nama_anak}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Tanggal Lahir */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="tanggal_lahir" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-600" />
                                                Tanggal Lahir
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('tanggal_lahir')}
                                                className="text-orange-600 text-xs font-bold uppercase hover:underline flex items-center gap-1"
                                            >
                                                <span className="w-4 h-4 border border-orange-600 rounded-sm flex items-center justify-center text-[10px]">✎</span>
                                                Edit
                                            </button>
                                        </div>
                                        <Input
                                            id="tanggal_lahir"
                                            type="date"
                                            disabled={!isEditing.tanggal_lahir}
                                            className={cn(
                                                "border-2 h-12 transition-all duration-200",
                                                isEditing.tanggal_lahir
                                                    ? "border-orange-500 bg-white ring-2 ring-orange-200"
                                                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            )}
                                            required
                                            value={formData.tanggal_lahir}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Jenis Kelamin */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <GenderIcon className="w-4 h-4 text-orange-600" />
                                                Jenis Kelamin
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('jenis_kelamin')}
                                                className="text-orange-600 text-xs font-bold uppercase hover:underline flex items-center gap-1"
                                            >
                                                <span className="w-4 h-4 border border-orange-600 rounded-sm flex items-center justify-center text-[10px]">✎</span>
                                                Edit
                                            </button>
                                        </div>
                                        <Select
                                            value={formData.jenis_kelamin}
                                            onValueChange={handleGenderChange}
                                            disabled={!isEditing.jenis_kelamin}
                                        >
                                            <SelectTrigger className={cn(
                                                "border-2 h-12 transition-all duration-200",
                                                isEditing.jenis_kelamin
                                                    ? "border-orange-500 bg-white ring-2 ring-orange-200"
                                                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed opacity-100"
                                            )}>
                                                <SelectValue placeholder="Pilih jenis kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* No WhatsApp */}
                                    <div className="space-y-2 md:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="no_whatsapp" className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-orange-600" />
                                                No WhatsApp
                                            </Label>
                                            <button
                                                type="button"
                                                onClick={() => toggleEdit('no_whatsapp')}
                                                className="text-orange-600 text-xs font-bold uppercase hover:underline flex items-center gap-1"
                                            >
                                                <span className="w-4 h-4 border border-orange-600 rounded-sm flex items-center justify-center text-[10px]">✎</span>
                                                Edit
                                            </button>
                                        </div>
                                        <Input
                                            id="no_whatsapp"
                                            type="tel"
                                            disabled={!isEditing.no_whatsapp}
                                            placeholder="Masukkan nomor WhatsApp (opsional)"
                                            className={cn(
                                                "border-2 h-12 transition-all duration-200",
                                                isEditing.no_whatsapp
                                                    ? "border-orange-500 bg-white ring-2 ring-orange-200"
                                                    : "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                            )}
                                            value={formData.no_whatsapp}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700 hover:scale-[1.02] transition-all duration-200 shadow-md"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <span className="flex items-center gap-2">Menyimpan...</span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Save className="w-5 h-5" />
                                                Simpan Perubahan
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Measurement History Table */}
                    <Card className="border-2 border-orange-500 shadow-[8px_8px_0px_0px_rgba(234,88,12,1)]">
                        <CardHeader className="bg-orange-50/50 border-b border-orange-100 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900">Riwayat Pengukuran</CardTitle>
                                    <CardDescription className="text-orange-700 font-medium">
                                        Data tinggi dan berat badan balita
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {measurementHistory.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    Belum ada data pengukuran
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-orange-50 border-b border-orange-100">
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Tanggal</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Tinggi Badan (cm)</th>
                                                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide">Berat Badan (kg)</th>
                                                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wide">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {measurementHistory.map((item) => (
                                                <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {new Date(item.waktu_pengukuran).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                        {item.tinggi_badan}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                                        {item.berat_badan}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                                                                    onClick={() => confirmDelete(item.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    Hapus
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-red-600">Hapus Data Pengukuran?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Apakah anda yakin untuk menghapus data pengukuran ini?
                                                                        Tindakan ini tidak dapat dibatalkan.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel onClick={() => setDeleteId(null)}>Batal</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        className="bg-red-600 hover:bg-red-700 text-white border-none"
                                                                        onClick={handleDelete}
                                                                        disabled={isDeletePending}
                                                                    >
                                                                        {isDeletePending ? "Menghapus..." : "Ya, Hapus Data"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
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
