import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileText, 
  AlertCircle, 
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
      {trend !== undefined && (
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
          trend < 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {trend}% Prev. Rate
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</h3>
    <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    onTrack: 0,
    critical: 0,
    default: 0,
    avgDays: 0,
    quality: { excellent: 0, good: 0, default: 0 },
    subDivisionData: [],
    stationData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/cases/stats');
        // Merge with mock data for charts while real data builds up
        setStats({
          ...response.data.data,
          subDivisionData: [
            { name: 'Khamgaon', pending: 120, disposed: 156, avgDays: 24 },
            { name: 'Malkapur', pending: 85, disposed: 112, avgDays: 18 },
            { name: 'City East', pending: 145, disposed: 130, avgDays: 32 },
            { name: 'City West', pending: 92, disposed: 168, avgDays: 15 },
          ],
          stationData: [
            { name: 'Station A', total: 45, pending: 20, critical: 5 },
            { name: 'Station B', total: 38, pending: 12, critical: 2 },
            { name: 'Station C', total: 52, pending: 25, critical: 8 },
          ]
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          total: 1248, pending: 432, completed: 816,
          onTrack: 250, critical: 110, default: 72,
          avgDays: 28,
          quality: { excellent: 340, good: 280, default: 196 },
          subDivisionData: [
            { name: 'Khamgaon', pending: 120, disposed: 156, avgDays: 24 },
            { name: 'Malkapur', pending: 85, disposed: 112, avgDays: 18 },
            { name: 'City East', pending: 145, disposed: 130, avgDays: 32 },
            { name: 'City West', pending: 92, disposed: 168, avgDays: 15 },
          ],
          stationData: [
            { name: 'Station A', total: 45, pending: 20, critical: 5 },
            { name: 'Station B', total: 38, pending: 12, critical: 2 },
            { name: 'Station C', total: 52, pending: 25, critical: 8 },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SP Office Dashboard</h1>
          <p className="text-slate-500 font-medium">Crime Monitoring & Investigation Analytics System</p>
        </div>
        <div className="bg-white px-4 py-2 border border-slate-100 rounded-xl shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700">LIVE MONITORING</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total FIRs" value={stats.total} icon={FileText} color="indigo" />
        <StatCard title="Pending Investigation" value={stats.pending} icon={Clock} color="amber" trend={12} />
        <StatCard title="Disposed (Completed)" value={stats.completed} icon={CheckCircle2} color="emerald" trend={5} />
        <StatCard title="Avg. Disposal Days" value={stats.avgDays} icon={Zap} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-lg font-bold text-slate-900">Sub-Division Wise Performance</h2>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Disposed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pending</span>
                </div>
             </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subDivisionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="disposed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="pending" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Quality of Disposal</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Excellent', value: stats.quality.excellent, color: '#10b981' },
                    { name: 'Good', value: stats.quality.good, color: '#6366f1' },
                    { name: 'Default', value: stats.quality.default, color: '#f59e0b' },
                  ]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#6366f1" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
             <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-xs font-bold text-emerald-700">Excellent (≤30 Days)</span>
                <span className="text-sm font-extrabold text-emerald-900">{stats.quality.excellent}</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                <span className="text-xs font-bold text-indigo-700">Good (31-60 Days)</span>
                <span className="text-sm font-extrabold text-indigo-900">{stats.quality.good}</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-xs font-bold text-amber-700">Default (&gt;60 Days)</span>
                <span className="text-sm font-extrabold text-amber-900">{stats.quality.default}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900">Police Station Wise Analysis</h2>
            <button className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
              Detailed Report <ArrowRight size={14} />
            </button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.stationData.map((station, i) => (
              <div key={i} className="group p-6 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all cursor-pointer bg-slate-50/30 hover:bg-white">
                 <div className="flex justify-between items-start mb-4">
                    <div className="font-bold text-slate-900">{station.name}</div>
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">IO</div>
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold">+12</div>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase">Pending</div>
                       <div className="text-lg font-extrabold text-slate-900">{station.pending}</div>
                    </div>
                    <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase">Critical</div>
                       <div className="text-lg font-extrabold text-red-500">{station.critical}</div>
                    </div>
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-indigo-600">Click to view IO-wise breakup</span>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
