"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, Heart, Loader2, Activity } from "lucide-react"
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
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            if (!username || !password) {
                throw new Error("Username dan password harus diisi")
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

            // Verify it was saved
            const saved = localStorage.getItem("user")
            console.log("Verifying saved user:", saved)

            // Redirect to Dashboard using window.location for reliable navigation
            console.log("Redirecting to /Dashboard...")
            window.location.href = "/Dashboard"
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login gagal")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-black" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
                <Activity className="w-5 h-5 text-black" />
                <div className="h-px w-16 bg-black/20" />
            </div>
            <div className="absolute bottom-8 right-8 flex items-center gap-3">
                <div className="h-px w-16 bg-black/20" />
                <Activity className="w-5 h-5 text-black" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Brand Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-black mb-6 relative">
                        <Heart className="w-9 h-9 text-black" strokeWidth={1.5} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                            <span className="text-white text-[8px] font-bold">+</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight text-black mb-2">
                        Health<span className="font-semibold">Portal</span>
                    </h1>
                    <p className="text-gray-500 text-sm tracking-wide uppercase">
                        Healthcare Information System
                    </p>
                </div>

                {/* Login Card */}
                <Card className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <CardHeader className="space-y-1 pb-6 border-b border-black/10">
                        <CardTitle className="text-xl font-semibold text-black text-center tracking-tight">
                            Administrator Access
                        </CardTitle>
                        <CardDescription className="text-gray-500 text-center text-sm">
                            Enter your credentials to continue
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6 pt-6">
                            {/* Error Message */}
                            {error && (
                                <div className="p-3 border-2 border-black bg-gray-100 text-black text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Username Field */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-black text-xs font-semibold uppercase tracking-wider">
                                    Username
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                                    </div>
                                    <Input
                                        id="username"
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="pl-11 h-12 bg-white border-2 border-black text-black placeholder:text-gray-400 focus:border-black focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-black text-xs font-semibold uppercase tracking-wider">
                                    Password
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-11 pr-11 h-12 bg-white border-2 border-black text-black placeholder:text-gray-400 focus:border-black focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black transition-colors"
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
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
                                    <div className="w-4 h-4 border-2 border-black flex items-center justify-center bg-white group-hover:bg-gray-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                        />
                                    </div>
                                    <span className="text-xs uppercase tracking-wider">Remember me</span>
                                </label>
                                <a
                                    href="#"
                                    className="text-xs uppercase tracking-wider text-black hover:underline underline-offset-4 font-medium"
                                >
                                    Forgot password?
                                </a>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pt-2 pb-6">
                            {/* Login Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-black hover:bg-gray-900 text-white font-semibold uppercase tracking-wider text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>

                            {/* Security Notice */}
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 uppercase tracking-wider">
                                <Lock className="w-3 h-3" strokeWidth={1.5} />
                                <span>HIPAA Compliant • Secure Connection</span>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8 space-y-2">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400 uppercase tracking-wider">
                        <a href="#" className="hover:text-black transition-colors">Privacy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-black transition-colors">Terms</a>
                        <span>•</span>
                        <a href="#" className="hover:text-black transition-colors">Support</a>
                    </div>
                    <p className="text-xs text-gray-400">© 2024 HealthPortal. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}
