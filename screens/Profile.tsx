
import React, { useState, useMemo } from 'react';
import { 
  Settings, LogOut, ChevronRight, MapPin, Globe, 
  Award, Shield, Edit3, Save, X, Activity, CheckCircle2
} from 'lucide-react';
import { User, Language, Role, Issue, IssueStatus } from '../types';
import { CITIES } from '../constants';
import SearchableCitySelect from '../components/SearchableCitySelect';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  issues: Issue[];
}

const ProfileScreen: React.FC<ProfileProps> = ({ user, onLogout, onUpdateUser, issues }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });

  const userStats = useMemo(() => {
    const userReports = issues.filter(i => i.reporterId === user.id);
    const resolvedByAdmin = issues.filter(i => i.status === IssueStatus.FIXED && i.reporterId === user.id);
    return {
      reportedCount: userReports.length,
      resolvedCount: resolvedByAdmin.length
    };
  }, [issues, user.id]);

  const handleSave = () => {
    onUpdateUser(editForm);
    setIsEditing(false);
  };

  const menuItems = [
    { label: 'Report History', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'App Settings', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'Security & Privacy', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* User Header */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-orange-400 to-orange-600 p-1">
            <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center text-4xl font-black text-orange-500">
              {user.fullName.charAt(0)}
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-3xl font-black text-slate-800">{user.fullName}</h2>
              {user.role === Role.ADMIN && (
                <span className="bg-blue-100 text-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded-full">Admin</span>
              )}
            </div>
            <p className="text-slate-400 font-medium">{user.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-slate-600">
                <MapPin size={14} className="text-orange-500" />
                {user.city}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-xs font-bold text-slate-600">
                <Globe size={14} className="text-orange-500" />
                {user.preferredLanguage === Language.ENGLISH ? 'English' : 'मराठी'}
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-orange-500 transition-colors shadow-sm border border-slate-100"
          >
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-orange-200 shadow-xl animate-in slide-in-from-bottom duration-300">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Edit3 className="text-orange-500" size={24} /> Edit Profile
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-orange-500 text-black"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
                <SearchableCitySelect 
                  value={editForm.city}
                  onChange={(city) => setEditForm(p => ({ ...p, city }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Language Preference</label>
              <div className="flex gap-2">
                {[Language.ENGLISH, Language.MARATHI].map(l => (
                  <button 
                    key={l}
                    onClick={() => setEditForm(p => ({ ...p, preferredLanguage: l }))}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${editForm.preferredLanguage === l ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-400'}`}
                  >
                    {l === Language.ENGLISH ? 'English' : 'मराठी'}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={handleSave}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-orange-100 transition-all"
            >
              <Save size={20} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-2">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Activity size={24} />
          </div>
          <p className="text-3xl font-black text-slate-800">{userStats.reportedCount}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reports Made</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-2">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-3xl font-black text-slate-800">{userStats.resolvedCount}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Problems Fixed</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 divide-y divide-slate-50">
        {menuItems.map((item, idx) => (
          <button key={idx} className="w-full flex items-center justify-between p-4 group">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" size={20} />
          </button>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-3 p-5 bg-red-50 text-red-600 font-bold rounded-[2rem] hover:bg-red-100 transition-colors border border-red-100"
      >
        <LogOut size={20} /> Logout Account
      </button>

      <div className="text-center pb-10">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">FixMyCity Maharashtra v1.0.5</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
