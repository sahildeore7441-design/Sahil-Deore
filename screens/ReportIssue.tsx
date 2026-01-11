
import React, { useState } from 'react';
import { Camera, MapPin, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { IssueType, Severity, User, Language } from '../types';
import { getTranslation, blobToBase64 } from '../utils';
import { CITIES, WARDS } from '../constants';
import SearchableCitySelect from '../components/SearchableCitySelect';

interface ReportIssueProps {
  user: User;
  onSubmit: (issue: any) => void;
  onCancel: () => void;
}

const ReportIssueScreen: React.FC<ReportIssueProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: IssueType.POTHOLE,
    description: '',
    severity: Severity.MEDIUM,
    isAnonymous: false,
    city: user.city,
    ward: WARDS[0],
    address: '',
    image: null as string | null,
    confirmed: false
  });

  const lang = user.preferredLanguage;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.confirmed) return;

    onSubmit({
      reporterId: user.id,
      reporterName: user.fullName,
      type: formData.type,
      description: formData.description,
      image: formData.image,
      location: {
        lat: 18.5204 + Math.random() * 0.1, // Mock coords
        lng: 73.8567 + Math.random() * 0.1,
        address: formData.address,
        city: formData.city,
        ward: formData.ward
      },
      severity: formData.severity,
      isAnonymous: formData.isAnonymous
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Report New Issue</h2>
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Image Capture */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1: Capture Evidence</label>
          <div 
            className={`relative h-64 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
              formData.image ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            {formData.image ? (
              <>
                <img src={formData.image} className="w-full h-full object-cover rounded-xl" alt="Issue Evidence" />
                <button 
                  type="button" 
                  onClick={() => setFormData(p => ({ ...p, image: null }))}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg text-red-500"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-full shadow-md text-orange-500 mb-4">
                  <Camera size={32} />
                </div>
                <p className="text-slate-500 font-semibold">Click to upload or take photo</p>
                <p className="text-slate-400 text-xs">Clear images help authorities fix issues faster</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
             <AlertCircle className="text-orange-500 flex-shrink-0" size={20} />
             <div>
               <p className="text-xs font-bold text-orange-800 uppercase tracking-tight mb-1">Photo Tip:</p>
               <p className="text-xs text-orange-700">Include surrounding landmarks if possible for easier identification.</p>
             </div>
          </div>
        </div>

        {/* Step 2: Issue Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2: Issue Details</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Issue Type</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                value={formData.type}
                onChange={(e) => setFormData(p => ({ ...p, type: e.target.value as IssueType }))}
              >
                {Object.values(IssueType).map(t => <option key={t} value={t}>{getTranslation(lang, `issueTypes.${t}`)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Severity</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                value={formData.severity}
                onChange={(e) => setFormData(p => ({ ...p, severity: e.target.value as Severity }))}
              >
                {Object.values(Severity).map(s => <option key={s} value={s}>{getTranslation(lang, `severity.${s}`)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
            <textarea 
              rows={3}
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm"
              placeholder="Tell us more about the problem..."
              value={formData.description}
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="anon"
              className="w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData(p => ({ ...p, isAnonymous: e.target.checked }))}
            />
            <label htmlFor="anon" className="text-sm font-bold text-slate-600">Report Anonymously</label>
          </div>
        </div>

        {/* Step 3: Location Details */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Step 3: Location</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
              <SearchableCitySelect 
                value={formData.city}
                onChange={(city) => setFormData(p => ({ ...p, city }))}
                placeholder="Search city..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Ward</label>
              <select 
                className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold"
                value={formData.ward}
                onChange={(e) => setFormData(p => ({ ...p, ward: e.target.value }))}
              >
                {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Landmark/Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" size={18} />
              <input 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="e.g. Near Big Bazaar"
                value={formData.address}
                onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Validation & Submit */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
            <input 
              type="checkbox" 
              className="mt-1 w-5 h-5 rounded text-orange-500 focus:ring-orange-500"
              checked={formData.confirmed}
              onChange={(e) => setFormData(p => ({ ...p, confirmed: e.target.checked }))}
            />
            <label className="text-sm font-bold text-slate-600 leading-tight">
              I confirm this image correctly represents the selected problem and the location is accurate.
            </label>
          </div>

          <button 
            type="submit"
            disabled={!formData.image || !formData.confirmed}
            className={`w-full py-4 rounded-2xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
              !formData.image || !formData.confirmed 
                ? 'bg-slate-300 shadow-none cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'
            }`}
          >
            Submit Report
            <CheckCircle2 size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssueScreen;
