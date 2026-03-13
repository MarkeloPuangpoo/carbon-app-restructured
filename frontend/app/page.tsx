"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Tag, Ruler, MapPin, 
  CheckCircle2, Coins, Leaf, Wind, 
  ArrowRight, Trees, Sparkles, FileUp, 
  Download, FileSpreadsheet, XCircle
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    tree_name: "", circumference: "", height: "",
    latitude: "", longitude: "",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [locLoading, setLocLoading] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setLocLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. Please check your permissions.");
        setLocLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tree_name: formData.tree_name || "ต้นไม้ทั่วไป",
          circumference: parseFloat(formData.circumference),
          height: parseFloat(formData.height),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkLoading(true);
    setBulkMessage(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setBulkMessage(`Success: ${data.message}`);
      } else {
        setBulkMessage(`Error: ${data.detail}`);
      }
    } catch (err) {
      setBulkMessage("Error: Connection failed");
    } finally {
      setBulkLoading(false);
      e.target.value = ""; // Clear input
    }
  };

  const downloadTemplate = () => {
    window.open("http://localhost:8000/template", "_blank");
  };

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-emerald-100/50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-emerald-200/50">
          <Sparkles className="w-4 h-4" />
          <span>Intelligent Carbon Analytics</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          Carbon <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Flow.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Advanced mangrove forest carbon sequestration analysis. Individual or bulk processing.
        </p>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-[200px]">
        
        {/* Main Form Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-7 lg:row-span-3 glass-card rounded-[2.5rem] p-10 overflow-hidden relative">
          <div className="relative z-10 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-emerald-600" />
              Individual Assessment
            </h2>
            <form onSubmit={handleCalculate} className="space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup icon={<Tag />} label="Tree Identification" placeholder="e.g. Mangrove-Alpha" value={formData.tree_name} onChange={(v: string) => setFormData({...formData, tree_name: v})} />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup icon={<Ruler />} label="Circum (cm)" placeholder="30.5" value={formData.circumference} onChange={(v: string) => setFormData({...formData, circumference: v})} type="number" />
                  <InputGroup icon={<Ruler className="rotate-90" />} label="Height (m)" placeholder="8.2" value={formData.height} onChange={(v: string) => setFormData({...formData, height: v})} type="number" />
                </div>
                <InputGroup 
                  icon={<MapPin />} 
                  label="Latitude" 
                  placeholder="13.XXXX" 
                  value={formData.latitude} 
                  onChange={(v: string) => setFormData({...formData, latitude: v})} 
                  type="number" 
                  action={
                    <button 
                      type="button"
                      onClick={handleGetCurrentLocation}
                      disabled={locLoading}
                      className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors disabled:opacity-50"
                      title="Use My Current Location"
                    >
                      <MapPin className={`w-4 h-4 ${locLoading ? 'animate-bounce' : ''}`} />
                    </button>
                  }
                />
                <InputGroup 
                  icon={<MapPin />} 
                  label="Longitude" 
                  placeholder="101.XXXX" 
                  value={formData.longitude} 
                  onChange={(v: string) => setFormData({...formData, longitude: v})} 
                  type="number" 
                />
              </div>
              <div className="mt-auto">
                <button disabled={loading} className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center group">
                  {loading ? "Processing..." : "Execute Analysis"}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full -mr-20 -mt-20 blur-3xl" />
        </motion.div>

        {/* Dynamic Result Display */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:col-span-5 lg:row-span-2 glass-card rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center space-y-6">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center animate-float">
                <Wind className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Awaiting Input</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Enter dimensions to generate analytics.</p>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 lg:row-span-2 glass-card rounded-[2.5rem] p-8 flex flex-col justify-between border-emerald-100/50 bg-emerald-50/20">
                <div className="flex justify-between items-start">
                  <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200"><Leaf className="w-6 h-6" /></div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">Primary Metric</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Carbon Stored</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-6xl font-black text-slate-900">{result.carbon_storage.toFixed(2)}</span>
                    <span className="text-xl font-bold text-emerald-600">kg CO₂</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bulk Upload Section - New Bento Item */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-5 lg:row-span-1 glass-card rounded-[2.5rem] p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 flex items-center text-lg">
                <FileSpreadsheet className="w-5 h-5 mr-2 text-blue-500" />
                Bulk Processing
              </h3>
              <p className="text-xs text-slate-400 font-medium">Upload Excel or CSV files</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={downloadTemplate} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-600" title="Download Template">
                <Download className="w-5 h-5" />
              </button>
              <label className={`p-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${bulkLoading ? 'bg-slate-100 text-slate-300' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'}`}>
                {bulkLoading ? <Activity className="w-5 h-5 animate-spin" /> : <FileUp className="w-5 h-5" />}
                <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} disabled={bulkLoading} />
              </label>
            </div>
          </div>
          
          {bulkMessage && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-3 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center ${bulkMessage.startsWith('Success') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {bulkMessage.startsWith('Success') ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <XCircle className="w-3 h-3 mr-1.5" />}
              {bulkMessage}
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
}

function InputGroup({ icon, label, placeholder, value, onChange, type = "text", action }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center ml-1">
          <span className="mr-2 opacity-50">{icon}</span> {label}
        </label>
        {action}
      </div>
      <input type={type} step="any" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/50 border border-slate-200/60 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none text-slate-700 font-medium" />
    </div>
  );
}

function Activity({ className }: { className?: string }) {
  return <Wind className={className} />;
}
