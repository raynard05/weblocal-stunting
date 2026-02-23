"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, User, Heart, Loader2, Activity, CheckCircle2, HelpCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!username || !password) {
        throw new Error("Mohon masukkan username dan password")
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Login gagal")
      }

      // Save user data to localStorage
      console.log("Login success, saving user:", data.user)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect to Dashboard
      console.log("Redirecting to /Dashboard...")
      window.location.href = "/Dashboard"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side - Login Guide */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white p-8 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="600" fill="black" />
            <path d="M0 0H400V600H0V0Z" fill="#111" />
            <circle cx="400" cy="0" r="300" fill="#222" />
            <circle cx="0" cy="600" r="350" stroke="#333" strokeWidth="2" />
            <path d="M400 600L200 400L400 200V600Z" fill="#1a1a1a" />
            <path d="M0 0L200 200L0 400V0Z" fill="#1a1a1a" />
            <circle cx="200" cy="300" r="100" stroke="white" strokeWidth="1" strokeDasharray="4 4" opacity="0.1" />
            <path d="M400 0L200 200" stroke="white" strokeWidth="1" opacity="0.1" />
            <path d="M0 600L200 400" stroke="white" strokeWidth="1" opacity="0.1" />
            <rect x="50" y="50" width="100" height="100" stroke="#333" strokeWidth="2" transform="rotate(20 100 100)" />
            <rect x="250" y="450" width="100" height="100" stroke="#333" strokeWidth="2" transform="rotate(-15 300 500)" />
          </svg>
        </div>

        {/* Top Section */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center relative">
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                <span className="text-black text-[8px] font-bold">+</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-light tracking-tight">
                Health<span className="font-semibold">Portal</span>
              </h1>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-0.5">
                Sistem Informasi Kesehatan
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Panduan Login</h2>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">1</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Masukkan Username</h3>
                <p className="text-white/70 text-xs leading-relaxed">
                  Gunakan username yang telah diberikan oleh administrator sistem.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">2</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Masukkan Password</h3>
                <p className="text-white/70 text-xs leading-relaxed">
                  Ketik password Anda dengan benar. Password bersifat case-sensitive.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-white/40 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">3</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Klik Tombol Masuk</h3>
                <p className="text-white/70 text-xs leading-relaxed">
                  Setelah mengisi data, klik tombol &quot;Masuk&quot; untuk mengakses sistem.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-white/20 rounded-lg bg-white/5">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Lupa Password?</h4>
                <p className="text-white/70 text-xs leading-relaxed">
                  Hubungi administrator untuk reset password atau gunakan fitur &quot;Lupa Password&quot; di form login.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Phone className="w-3 h-3" />
            <span>Bantuan: (021) 555-1234</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-white/40" />
            <div className="h-px flex-1 bg-white/20" />
          </div>
          <p className="text-white/40 text-[10px]">
            Sistem ini dilindungi dan diawasi. Akses tidak sah akan ditindak sesuai hukum yang berlaku.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 relative">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Mobile Header */}
        <div className="lg:hidden absolute top-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center relative">
            <Heart className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <span className="text-base font-light">Health<span className="font-semibold">Portal</span></span>
        </div>

        <div className="w-full max-w-sm relative z-10">
          {/* Login Card */}
          <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="space-y-1 pb-4 border-b border-black/10">
              <CardTitle className="text-xl font-bold text-black text-center tracking-tight">
                Login
              </CardTitle>
              <CardDescription className="text-gray-500 text-center text-sm">
                Masukkan Akun Anda untuk melanjutkan
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                {/* Error Message */}
                {error && (
                  <div className="p-2 border-2 border-black bg-gray-100 text-black text-xs text-center font-medium flex items-center justify-center gap-1">
                    <Activity className="w-3 h-3" />
                    {error}
                  </div>
                )}

                {/* Username Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-black text-xs font-bold uppercase tracking-wider">
                    Nama Pengguna
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan nama pengguna"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-10 text-sm bg-white border-2 border-black text-black placeholder:text-gray-400 focus:border-black focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-black text-xs font-bold uppercase tracking-wider">
                    Kata Sandi
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-10 text-sm bg-white border-2 border-black text-black placeholder:text-gray-400 focus:border-black focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
                    <div className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white group-hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                      />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider">Ingat Saya</span>
                  </label>
                  <a
                    href="#"
                    className="text-xs font-bold uppercase tracking-wider text-black hover:underline underline-offset-4"
                  >
                    Lupa Kata Sandi?
                  </a>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 text-sm bg-black hover:bg-gray-900 text-white font-bold uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 uppercase tracking-wider font-medium">
                  <Lock className="w-3 h-3" strokeWidth={1.5} />
                  <span>Koneksi Aman & Terenkripsi</span>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              <a href="#" className="hover:text-black transition-colors">Privasi</a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">Ketentuan</a>
              <span>•</span>
              <a href="#" className="hover:text-black transition-colors">Bantuan</a>
            </div>
            <p className="text-[10px] text-gray-400">© 2024 HealthPortal. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
