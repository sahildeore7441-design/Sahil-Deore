
import React, { useState, useMemo } from 'react';
import { List, Map as MapIcon, Filter, Search, Clock, CheckCircle2, AlertTriangle, ArrowRight, Info, Plus } from 'lucide-react';
import { Issue, User, IssueStatus, IssueType, Severity, Language } from '../types';
import { getTranslation, formatTimeAgo, getTimeToFix } from '../utils';
import { CITIES, WARDS, MAHARASHTRA_CITIES } from '../constants';

interface HomeProps {
  issues: Issue[];
  user: User;
  onViewIssue: (id: string) => void;
}

export const calculateCivicHealth = (cityIssues: Issue[]) => {
  let score = 100;
  
  const unresolvedIssues = cityIssues.filter(i => i.status !== IssueStatus.FIXED);
  
  if (unresolvedIssues.length > 0) {
    // -10 points for the first unresolved issue, additional for more
    score = 100 - (unresolvedIssues.length * 10);
  }

  // Cap score between 0 and 100
  return Math.max(0, Math.min(100, score));
};

const HomeScreen: React.FC<HomeProps> = ({ issues, user, onViewIssue }) => {
  const [viewType, setViewType] = useState<'list' | 'map'>('list');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    severity: 'all',
    city: user.city,
    ward: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const lang = user.preferredLanguage;

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const statusMatch = filters.status === 'all' || issue.status === filters.status;
      const typeMatch = filters.type === 'all' || issue.type === filters.type;
      const severityMatch = filters.severity === 'all' || issue.severity === filters.severity;
      const cityMatch = filters.city === 'all' || issue.location.city === filters.city;
      const wardMatch = filters.ward === 'all' || issue.location.ward === filters.ward;
      return statusMatch && typeMatch && severityMatch && cityMatch && wardMatch;
    });
  }, [issues, filters]);

  const civicScore = useMemo(() => {
    const cityIssues = issues.filter(i => i.location.city === user.city);
    return calculateCivicHealth(cityIssues);
  }, [issues, user.city]);

  const selectedCityData = useMemo(() => {
    return MAHARASHTRA_CITIES.find(c => c.name === (filters.city === 'all' ? user.city : filters.city)) 
      || MAHARASHTRA_CITIES.find(c => c.name === 'Mumbai')!;
  }, [filters.city, user.city]);

  const isMumbai = selectedCityData.name === 'Mumbai';
  const zoomLevel = isMumbai ? 12 : 14;

  return (
    <div className="space-y-6">
      {/* City Stats Summary */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">{user.city} Civic Health</h2>
            <p className="opacity-80 text-sm font-medium">Real-time municipal performance score</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <p className="text-xs uppercase font-bold opacity-70">Health Score</p>
              <p className="text-4xl font-extrabold">{civicScore}%</p>
            </div>
          </div>
        </div>
        <div className="mt-6 h-3 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-1000" 
            style={{ width: `${civicScore}%` }}
          />
        </div>
        <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-wider opacity-80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
            {issues.filter(i => i.location.city === user.city && i.status !== IssueStatus.FIXED).length} Active Reports
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            {issues.filter(i => i.location.city === user.city && i.status === IssueStatus.FIXED).length} Resolved
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewType('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <List size={18} /> List
          </button>
          <button 
            onClick={() => setViewType('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewType === 'map' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}
          >
            <MapIcon size={18} /> Map
          </button>
        </div>

        <div className="flex items-center gap-2 px-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${showFilters ? 'bg-orange-50 border-orange-200 text-orange-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Filter size={18} /> Filter
          </button>
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-orange-500 text-black"
            />
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-4 animate-in slide-in-from-top duration-300">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</label>
            <select 
              className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none text-black"
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              <option value="all">All</option>
              {Object.values(IssueStatus).map(s => <option key={s} value={s}>{getTranslation(lang, `status.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Type</label>
            <select 
              className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none text-black"
              value={filters.type}
              onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
            >
              <option value="all">All</option>
              {Object.values(IssueType).map(t => <option key={t} value={t}>{getTranslation(lang, `issueTypes.${t}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Severity</label>
            <select 
              className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none text-black"
              value={filters.severity}
              onChange={(e) => setFilters(f => ({ ...f, severity: e.target.value }))}
            >
              <option value="all">All</option>
              {Object.values(Severity).map(s => <option key={s} value={s}>{getTranslation(lang, `severity.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">City</label>
            <select 
              className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none text-black"
              value={filters.city}
              onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
            >
              <option value="all">All Cities</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ward</label>
            <select 
              className="w-full p-2 bg-slate-50 rounded-lg text-sm border-none text-black"
              value={filters.ward}
              onChange={(e) => setFilters(f => ({ ...f, ward: e.target.value }))}
            >
              <option value="all">All Wards</option>
              {WARDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Feed Content */}
      {viewType === 'list' ? (
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Info size={32} />
              </div>
              <h3 className="text-slate-900 font-bold">No issues found</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">Be the first to report a civic problem in {selectedCityData.name} and improve your city's health score.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div 
                key={issue.id} 
                onClick={() => onViewIssue(issue.id)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group flex flex-col sm:flex-row gap-4"
              >
                <div className="w-full sm:w-32 h-32 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={issue.image} 
                    alt={issue.type} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {issue.source && (
                    <div className="absolute bottom-1 right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow">
                      Verified
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        {getTranslation(lang, `issueTypes.${issue.type}`)}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                        issue.status === IssueStatus.FIXED ? 'bg-green-50 text-green-600' : 
                        issue.status === IssueStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {issue.status === IssueStatus.FIXED ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {getTranslation(lang, `status.${issue.status}`)}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        issue.severity === Severity.CRITICAL ? 'bg-red-50 text-red-600' :
                        issue.severity === Severity.MEDIUM ? 'bg-yellow-50 text-yellow-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {getTranslation(lang, `severity.${issue.severity}`)}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{formatTimeAgo(issue.createdAt, lang)}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {issue.location.address}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-1 mb-2">
                    {issue.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase">
                        <MapIcon size={12} />
                        {issue.location.city}, {issue.location.ward}
                      </div>
                      {issue.status !== IssueStatus.FIXED && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-orange-400 uppercase">
                          <Clock size={12} />
                          {getTimeToFix(issue.createdAt)} elapsed
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {issue.isVerified && (
                        <div className="bg-blue-50 text-blue-600 p-1 rounded-full" title="Verified Issue">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="h-[60vh] bg-slate-200 rounded-3xl overflow-hidden relative border-4 border-white shadow-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ 
              backgroundImage: `url('https://maps.googleapis.com/maps/api/staticmap?center=${selectedCityData.lat},${selectedCityData.lng}&zoom=${zoomLevel}&size=1000x1000&key=MOCK_KEY')` 
            }}
          >
            {filteredIssues.map((issue) => {
              const top = 50 + (issue.location.lat - selectedCityData.lat) * (isMumbai ? 200 : 500);
              const left = 50 + (issue.location.lng - selectedCityData.lng) * (isMumbai ? 200 : 500);

              return (
                <div 
                  key={issue.id}
                  onClick={() => onViewIssue(issue.id)}
                  className={`absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-lg animate-bounce hover:scale-125 transition-transform z-10 ${
                    issue.status === IssueStatus.FIXED ? 'bg-green-500' : 
                    issue.severity === Severity.CRITICAL ? 'bg-red-500' : 'bg-orange-500'
                  }`}
                  style={{
                    top: `${Math.max(10, Math.min(90, top))}%`,
                    left: `${Math.max(10, Math.min(90, left))}%`
                  }}
                >
                  <div className="text-white text-xs">
                    {issue.type === IssueType.POTHOLE && '🕳️'}
                    {issue.type === IssueType.GARBAGE && '🗑️'}
                    {issue.type === IssueType.STREETLIGHT && '💡'}
                    {issue.type === IssueType.WATER_LEAKAGE && '💧'}
                    {issue.type === IssueType.DRAINAGE && '🚽'}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl flex items-center justify-between shadow-2xl">
            <div>
               <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{selectedCityData.name} Area Map</p>
               <p className="text-[10px] font-bold text-slate-500 uppercase">{filteredIssues.length} active reports</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div><span className="text-[10px] font-bold">CRITICAL</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-[10px] font-bold">FIXED</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
