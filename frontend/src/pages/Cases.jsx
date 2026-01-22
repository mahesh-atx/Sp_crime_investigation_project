import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  Phone,
  Microscope,
  Video
} from 'lucide-react';
import api from '../services/api';
import CaseForm from '../components/cases/CaseForm';

const StatusBadge = ({ status }) => {
  const styles = {
    'Critical': 'bg-red-50 text-red-600 border-red-100',
    'Default': 'bg-amber-50 text-amber-600 border-amber-100',
    'On Track': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Completed': 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['Default']}`}>
      {status}
    </span>
  );
};

const ProgressLifeCycle = ({ days, isCompleted }) => {
  const percentage = isCompleted ? 100 : Math.min(100, (days / 60) * 100);
  const color = isCompleted ? 'bg-emerald-500' : days > 60 ? 'bg-amber-500' : days > 30 ? 'bg-red-500' : 'bg-indigo-500';
  
  return (
    <div className="w-24 group relative">
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {isCompleted ? 'Completed' : `${days} days elapsed`}
      </div>
    </div>
  );
};

const Cases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      setCases(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
      // Fallback mock data
      setCases([
        { 
          _id: '1', 
          firNumber: '123/2025', 
          policeStation: 'City West', 
          ioName: 'Insp. Kumar', 
          ioPhone: '9876543210',
          status: 'Critical',
          quality: 'Pending',
          daysElapsed: 45,
          sections: '302, 34 IPC',
          eSakshiStatus: 'Pending',
          fslVisit: 'YES'
        },
        { 
          _id: '2', 
          firNumber: '124/2025', 
          policeStation: 'Khamgaon', 
          ioName: 'SI Sharma', 
          ioPhone: '9876543211',
          status: 'On Track',
          quality: 'Pending',
          daysElapsed: 12,
          sections: '379 IPC',
          eSakshiStatus: 'Completed',
          fslVisit: 'NO'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateSuccess = async (newData) => {
    try {
      await api.post('/cases', newData);
      fetchCases();
    } catch (err) {
      console.error('Error creating case:', err);
      // If API fails (e.g. real mongo not connected yet), just update local state for demo
      setCases(prev => [{ ...newData, _id: Date.now().toString(), daysElapsed: 0, status: 'On Track' }, ...prev]);
    }
  };

  const filteredCases = cases.filter(c => 
    c.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ioName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Investigation Tracker</h1>
          <p className="text-slate-500">Automated monitoring of FIR disposal and IO performance</p>
        </div>
        <button 
          onClick={() => { setEditingCase(null); setIsFormOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          <span>New FIR Entry</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by FIR No or Officer..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-100 transition-all">
              <Filter size={18} />
              <span className="font-medium">Filters</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">FIR Details</th>
                <th className="px-6 py-4">Investigating Officer</th>
                <th className="px-6 py-4">Investigation Life-cycle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">CC Status</th>
                <th className="px-6 py-4">Policing Metrics</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{item.firNumber}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.policeStation}</div>
                    <div className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-tighter bg-indigo-50 inline-block px-1.5 py-0.5 rounded">
                      {item.sections}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-700">{item.ioName}</div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                      <Phone size={10} /> {item.ioPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ProgressLifeCycle days={item.daysElapsed} isCompleted={item.isCompleted} />
                    <div className="text-[10px] text-slate-400 mt-2 font-medium">
                      {item.daysElapsed} Days Invested
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4">
                    {item.isCompleted ? (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-emerald-600">Disposed</span>
                        <span className="text-[10px] text-slate-400">{item.ccNumber}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-amber-500">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className={`p-1.5 rounded-lg ${item.fslVisit === 'YES' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-300'}`} title="FSL Visit">
                          <Microscope size={14} />
                       </div>
                       <div className={`p-1.5 rounded-lg ${item.eSakshiStatus === 'Completed' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-300'}`} title="e-Sakshi">
                          <Video size={14} />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                      <MoreVertical size={18} className="text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CaseForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleCreateSuccess}
        initialData={editingCase}
      />
    </div>
  );
};

export default Cases;
