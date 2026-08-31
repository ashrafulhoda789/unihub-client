"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn, authClient } from "@/lib/auth-client";
import { GraduationCap, Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";
import RoleSelectionModal from "@/components/modals/RoleSelectionModal";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    // Google Sign In Handler
    const handleGoogleSignIn = async () => {
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
        }
    };

    // Pre-submit Handler (Triggers Modal)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        // Validation pass -> Open Role Selection Modal
        setIsRoleModalOpen(true);
    };

    const handleRoleConfirmed = async (selectedRole) => {
        setLoading(true);
        setError("");

        await authClient.signUp.email(
            {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                requestedRole: selectedRole,
            },
            {
                onSuccess: () => {
                    setIsRoleModalOpen(false);
                    setLoading(false);
                    router.push('/');
                },
                onError: (ctx) => {
                    setIsRoleModalOpen(false);
                    setError(ctx.error.message || "Registration failed.");
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10 my-8">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-white mb-3">
                        <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <span>Uni<span className="text-indigo-400">Hub</span></span>
                    </Link>
                    <h2 className="text-2xl font-extrabold text-white">Create an Account</h2>
                    <p className="text-xs text-slate-400 mt-1">Join UniHub to collaborate and manage projects[cite: 7]</p>
                </div>

                {/* Card Form */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-8 rounded-2xl shadow-2xl">

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        type="button"
                        className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-slate-200 text-sm font-medium transition-all flex items-center justify-center gap-3 mb-6"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        Sign up with Google
                    </button>

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-slate-800 w-full" />
                        <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider absolute">OR</span>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Alex Johnson"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    placeholder="student@university.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    placeholder="At least 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-slate-800/50 border border-slate-700/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            Continue to Select Role
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-indigo-400 hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Role Selection Modal */}
            <RoleSelectionModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onConfirm={handleRoleConfirmed}
                loading={loading}
            />
        </div>
    );
}