"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const TreeMap = dynamic(() => import("@/components/TreeMap"), {
  ssr: false,
  loading: () => <div className="h-[600px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">กำลังโหลดแผนที่...</div>,
});

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <MapPin className="w-8 h-8 mr-3 text-emerald-600" />
          แผนที่ต้นไม้ (Tree Map)
        </h1>
        <p className="text-slate-500 mt-1">แสดงพิกัดตำแหน่งต้นไม้และการกักเก็บคาร์บอนในพื้นที่</p>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-xl shadow-emerald-100/20 border border-slate-100 overflow-hidden">
        <TreeMap />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-4 bg-emerald-50 rounded-xl">
          <div className="w-4 h-4 bg-emerald-600 rounded-full mr-3 shadow-sm shadow-emerald-200" />
          <span className="text-sm font-medium text-emerald-800">กักเก็บคาร์บอนสูง (&gt; 100 kg)</span>
        </div>
        <div className="flex items-center p-4 bg-amber-50 rounded-xl">
          <div className="w-4 h-4 bg-amber-500 rounded-full mr-3 shadow-sm shadow-amber-200" />
          <span className="text-sm font-medium text-amber-800">กักเก็บคาร์บอนปานกลาง (50 - 100 kg)</span>
        </div>
        <div className="flex items-center p-4 bg-rose-50 rounded-xl">
          <div className="w-4 h-4 bg-rose-500 rounded-full mr-3 shadow-sm shadow-rose-200" />
          <span className="text-sm font-medium text-rose-800">กักเก็บคาร์บอนต่ำ (&lt; 50 kg)</span>
        </div>
      </div>
    </div>
  );
}
