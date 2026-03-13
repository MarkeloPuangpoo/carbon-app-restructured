"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from "recharts";
import { 
  LayoutDashboard, TrendingUp, Coins, Leaf, 
  List, Activity, ArrowUpRight, Globe
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/trees")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalCarbon = data.reduce((acc, curr) => acc + curr.carbon_storage, 0);
  const totalValue = data.reduce((acc, curr) => acc + curr.carbon_value, 0);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-medium animate-pulse">Synchronizing Data...</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Title Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
            <Activity className="w-8 h-8 mr-3 text-emerald-500" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-500 font-medium">Real-time monitoring of mangrove ecosystem health.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live System Status</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[180px]">
        
        {/* Stat 1: Total Carbon */}
        <StatCard 
          span="md:col-span-4 md:row-span-1"
          icon={<Leaf className="w-5 h-5" />}
          label="Total Carbon Sequestration"
          value={totalCarbon.toLocaleString(undefined, { maximumFractionDigits: 1 })}
          unit="kg CO₂"
          color="emerald"
        />

        {/* Stat 2: Market Value */}
        <StatCard 
          span="md:col-span-4 md:row-span-1"
          icon={<Coins className="w-5 h-5" />}
          label="Estimated Market Value"
          value={`฿${totalValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}`}
          unit="THB"
          color="amber"
        />

        {/* Stat 3: Tree Count */}
        <StatCard 
          span="md:col-span-4 md:row-span-1"
          icon={<Globe className="w-5 h-5" />}
          label="Active Tree Inventory"
          value={data.length.toString()}
          unit="Individual Trees"
          color="blue"
        />

        {/* Main Chart - Large Bento Item */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-8 md:row-span-3 glass-card rounded-[2.5rem] p-10 flex flex-col"
        >
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Carbon Flow Trends</h3>
              <p className="text-sm text-slate-400">Individual tree contribution analysis</p>
            </div>
            <div className="flex space-x-2">
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Top 10 Performers</div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.slice(0, 10).reverse()}>
                <defs>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="tree_name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="carbon_storage" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorCarbon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Latest Activity - Bento Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-4 md:row-span-3 glass-card rounded-[2.5rem] p-8 flex flex-col overflow-hidden"
        >
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <List className="w-5 h-5 mr-2 text-emerald-500" />
            Recent Logs
          </h3>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {data.slice(0, 6).map((tree, i) => (
              <div key={tree.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    {data.length - i}
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-sm">{tree.tree_name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(tree.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600 text-sm">+{tree.carbon_storage.toFixed(1)}</p>
                  <p className="text-[10px] text-slate-400 font-bold">kg CO₂</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-auto w-full py-4 rounded-xl text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-widest border-t border-slate-50 pt-6">
            View Complete Archive
          </button>
        </motion.div>

      </div>
    </div>
  );
}

function StatCard({ span, icon, label, value, unit, color }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-500 text-emerald-500 border-emerald-100/50 bg-emerald-50/20",
    amber: "bg-amber-500 text-amber-500 border-amber-100/50 bg-amber-50/20",
    blue: "bg-blue-500 text-blue-500 border-blue-100/50 bg-blue-50/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${span} glass-card rounded-[2rem] p-6 flex items-center space-x-6 border-l-4 ${colorMap[color].split(' ').slice(2).join(' ')}`}
    >
      <div className={`p-4 rounded-2xl text-white ${colorMap[color].split(' ')[0]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-black text-slate-900">{value}</span>
          <span className="text-xs font-bold text-slate-400">{unit}</span>
        </div>
      </div>
    </motion.div>
  );
}
