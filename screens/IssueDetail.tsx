
import React from 'react';
import { 
  ArrowLeft, MapPin, Calendar, User as UserIcon, Clock, 
  CheckCircle2, AlertTriangle, ShieldCheck, Map as MapIcon, Share2
} from 'lucide-react';
import { Issue, User, IssueStatus, Role } from '../types';
import { getTranslation, formatTimeAgo, getTimeToFix } from '../utils';

interface IssueDetailProps {
  issue: Issue;
  user: User;
  onUpdateStatus: (id: string, status: IssueStatus) => void;
  onBack: () => void;
}

const IssueDetailScreen: React.FC<IssueDetailProps> = ({ issue, user, onUpdateStatus, onBack }) => {
  const lang = user.preferredLanguage;
  const isAdmin = user.role === Role.ADMIN;

  const statusColors = {
    [IssueStatus.REPORTED]: 'bg-slate-100 text-slate-600',
    [IssueStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-600',
    [IssueStatus.FIXED]: 'bg-green-50 text-green-600',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} /> Back to Feed
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <Share2 size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-64 sm:h-80 w-full relative">
          <img src={issue.image} className="w-full h-full object-cover" alt="Issue" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${statusColors[issue.status]} backdrop-blur-md bg-white/90`}>
              {getTranslation(lang, `status.${issue.status}`)}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg bg-white/90 backdrop-blur-md ${
              issue.severity === 'critical' ? 'text-red-600' : 'text-slate-600'
            }`}>
              {getTranslation(lang, `severity.${issue.severity}`)}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">{getTranslation(lang, `issueTypes.${issue.type}`)}</h1>
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <MapPin size={16} className="text-orange-500" />
                {issue.location.address}, {issue.location.ward}, {issue.location.city}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confirmed by</p>
                <p className="text-lg font-bold text-slate-700">{issue.confirmations} Citizens</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
            <p className="text-slate-700 font-medium leading-relaxed">{issue.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Calendar className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Reported On</p>
                <p className="text-xs font-bold text-slate-700">{new Date(issue.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Clock className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Time Elapsed</p>
                <p className="text-xs font-bold text-slate-700">{getTimeToFix(issue.createdAt, issue.fixedAt)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-400 uppercase">Assigned To</p>
              <p className="text-sm font-bold text-orange-800">{issue.assignedDepartment}</p>
            </div>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={18} /> Admin Management
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => onUpdateStatus(issue.id, IssueStatus.IN_PROGRESS)}
                  disabled={issue.status === IssueStatus.IN_PROGRESS}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Set In Progress
                </button>
                <button 
                  onClick={() => onUpdateStatus(issue.id, IssueStatus.FIXED)}
                  disabled={issue.status === IssueStatus.FIXED}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Fixed
                </button>
              </div>
            </div>
          )}

          {/* Map Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapIcon className="text-orange-500" size={18} /> Precise Location
            </h3>
            <div className="h-48 bg-slate-100 rounded-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=18.5204,73.8567&zoom=15&size=600x400&markers=color:orange|18.5204,73.8567&key=MOCK_KEY')] bg-cover bg-center"></div>
               <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-lg shadow-md flex items-center gap-2">
                 <CheckCircle2 size={14} className="text-green-500" />
                 <span className="text-[10px] font-bold text-slate-600 uppercase">GPS Verified</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailScreen;
