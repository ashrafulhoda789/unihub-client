import Link from "next/link";
import { GraduationCap, Globe, Mail } from "lucide-react";
import { BsGithub } from "react-icons/bs";

export default function Footer() {
    return (
        <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Info */}
                    <div className="space-y-4 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
                            <div className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <span>Uni<span className="text-indigo-400">Hub</span></span>
                        </Link>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Unified academic collaboration, project management, and resource moderation system built for modern universities[cite: 5].
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">Platform Modules</h4>
                        <ul className="space-y-2 text-xs">
                            <li><Link href="/pitches" className="hover:text-indigo-400 transition-colors">Open Pitch Room</Link></li>
                            <li><Link href="/resources" className="hover:text-indigo-400 transition-colors">Curriculum Library</Link></li>
                            <li><Link href="/ide" className="hover:text-indigo-400 transition-colors">Sandboxed IDE</Link></li>
                            <li><Link href="/dashboard/student" className="hover:text-indigo-400 transition-colors">Agile Workspace</Link></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">Academic Domains</h4>
                        <ul className="space-y-2 text-xs">
                            <li><span className="text-slate-400">Computer Science & Engineering</span></li>
                            <li><span className="text-slate-400">Software Engineering</span></li>
                            <li><span className="text-slate-400">Artificial Intelligence & ML</span></li>
                            <li><span className="text-slate-400">Embedded Systems & IoT</span></li>
                        </ul>
                    </div>

                    {/* Contact & Legal */}
                    <div className="space-y-3">
                        <h4 className="text-white font-semibold text-sm mb-3">System Info</h4>
                        <div className="flex items-center gap-3 text-slate-400">
                            <BsGithub className="w-4 h-4 hover:text-white cursor-pointer" />
                            <Globe className="w-4 h-4 hover:text-white cursor-pointer" />
                            <Mail className="w-4 h-4 hover:text-white cursor-pointer" />
                        </div>
                        <p className="text-xs text-slate-500 pt-2">
                            Developed for Academic Capstone & Research Thesis Workflow[cite: 5].
                        </p>
                    </div>

                </div>

                <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>© 2026 UniHub System. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span className="hover:underline cursor-pointer">Privacy Policy</span>
                        <span className="hover:underline cursor-pointer">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}