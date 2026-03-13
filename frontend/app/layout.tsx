import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Leaf, Map as MapIcon, LayoutDashboard, Home, TreePine } from "lucide-react";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Carbon Flow | Mangrove Forest",
  description: "Experience modern carbon sequestration analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${sarabun.className} text-slate-900`}>
        {/* Modern Floating Glass Nav */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-fit">
          <nav className="glass-card flex items-center px-2 py-2 rounded-full space-x-1">
            <NavLink href="/" icon={<Home className="w-4 h-4" />} label="Home" />
            <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
            <NavLink href="/map" icon={<MapIcon className="w-4 h-4" />} label="Explorer" />
          </nav>
        </div>

        <main className="pt-24 pb-12 min-h-screen px-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <footer className="mt-auto py-12 text-center text-slate-400 text-sm">
          <p className="flex items-center justify-center space-x-2">
            <TreePine className="w-4 h-4 text-emerald-500" />
            <span>Project by Bangpakong "Bowon Witthayayon" School</span>
          </p>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center space-x-2 px-4 py-2 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all font-medium text-sm"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
