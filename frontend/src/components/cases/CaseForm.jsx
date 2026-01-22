import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

const CaseForm = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    firNumber: '',
    firDate: '',
    policeStation: '',
    subDivision: '',
    ioName: '',
    ioPhone: '',
    sections: '',
    crimeBrief: '',
    eSakshiId: '',
    eSakshiStatus: 'Pending',
    fslVisit: 'NO'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real app, you'd call the API here
      // const response = await api.post('/cases', formData);
      onSuccess(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Case' : 'New FIR Entry'}</h2>
            <p className="text-sm text-slate-500">Enter all investigation details accurately</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">FIR Information</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">FIR Number</label>
                <input 
                  type="text" name="firNumber" required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 123/2025"
                  value={formData.firNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">FIR Date</label>
                <input 
                  type="date" name="firDate" required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.firDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">IPC / BNNS Sections</label>
                <input 
                  type="text" name="sections" required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. 302, 34, 120B"
                  value={formData.sections}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Officer Details</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">IO Name</label>
                <input 
                  type="text" name="ioName" required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Officer Name"
                  value={formData.ioName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">IO Phone Number</label>
                <input 
                   type="tel" name="ioPhone" required
                   className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                   placeholder="For WhatsApp alerts"
                   value={formData.ioPhone}
                   onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Police Station</label>
                <select 
                  name="policeStation" required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.policeStation}
                  onChange={handleChange}
                >
                  <option value="">Select Station</option>
                  <option value="City West">City West</option>
                  <option value="City East">City East</option>
                  <option value="Khamgaon">Khamgaon</option>
                  <option value="Malkapur">Malkapur</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
               <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Modern Policing Indicators</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">e-Sakshi ID</label>
                    <input 
                      type="text" name="eSakshiId"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Enter ID if applicable"
                      value={formData.eSakshiId}
                      onChange={handleChange}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">e-Sakshi Status</label>
                    <select 
                      name="eSakshiStatus"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.eSakshiStatus}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="N/A">N/A</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">FSL Visit Conducted?</label>
                    <select 
                      name="fslVisit"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.fslVisit}
                      onChange={handleChange}
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </select>
                 </div>
               </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Crime Brief</label>
              <textarea 
                name="crimeBrief" required rows="3"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="Briefly describe the incident..."
                value={formData.crimeBrief}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button 
              type="button" onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" disabled={loading}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : <><Save size={20} /> Save Case</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
