
import React, { useMemo, useState } from 'react';
import { Trophy, Medal, Zap, Star, TrendingUp, Search } from 'lucide-react';
import { Issue, IssueStatus, CityStats } from '../types';
import { CITIES, DEPARTMENTS } from '../constants';
import { calculateCivicHealth } from './Home';

interface LeaderboardProps {
  issues: Issue[];
}

const LeaderboardScreen: React.FC<LeaderboardProps> = ({ issues }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const cityLeaderboard: CityStats[] = useMemo(() => {
    return CITIES.map(city => {
      const cityIssues = issues.filter(i => i.location.city === city);
      const fixed = cityIssues.filter(i => i.status === IssueStatus.FIXED);
      
      const score = calculateCivicHealth(cityIssues);
      
      return {
        city,
        civicHealthScore: score,
        totalIssues: cityIssues.length,
        resolvedIssues: fixed.length,
        avgFixTimeHours: 24 // Base assumption for mock context
      };
    }).sort((a, b) => {
      // Sort by score first (desc), then alphabetically
      if (b.civicHealthScore !== a.civicHealthScore) return b.civicHealthScore - a.civicHealthScore;
      return a.city.localeCompare(b.city);
    });
  }, [issues]);

  const filteredLeaderboard = useMemo(() => {
    return cityLeaderboard.filter(city => 
      city.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cityLeaderboard, searchTerm]);

  return (
    <div className="space-y-8 pb-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Trophy className="text-orange-500" size={32} /> Performance Rankings
        </h2>
        <p className="text-slate-500 font-medium">Derived from real civic action and response times</p>
      </header>

      {/* Top 3 Cities (Overall) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end py-10">
        {/* Silver */}
        <div className="order-2 md:order-1 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full border-4 border-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">2</div>
            <div className="absolute -top-4 -right-2 bg-slate-300 p-1.5 rounded-full text-white shadow-lg">
              <Medal size={20} />
            </div>
          </div>
          <div className="bg-white w-full p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h4 className="font-bold text-slate-800">{cityLeaderboard[1]?.city || 'N/A'}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Health Score</p>
            <p className="text-2xl font-black text-slate-700 mt-2">{cityLeaderboard[1]?.civicHealthScore || 0}%</p>
          </div>
        </div>

        {/* Gold */}
        <div className="order-1 md:order-2 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-orange-50 rounded-full border-4 border-orange-200 flex items-center justify-center text-5xl font-bold text-orange-500">1</div>
            <div className="absolute -top-6 -right-4 bg-orange-500 p-2.5 rounded-full text-white shadow-xl ring-4 ring-white">
              <Trophy size={28} />
            </div>
          </div>
          <div className="bg-orange-500 w-full p-8 rounded-[2.5rem] shadow-2xl shadow-orange-200 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy size={80} />
            </div>
            <h4 className="font-black text-xl">{cityLeaderboard[0]?.city || 'N/A'}</h4>
            <p className="text-xs text-white/70 font-bold uppercase tracking-widest mt-1">Health Score</p>
            <p className="text-5xl font-black mt-4">{cityLeaderboard[0]?.civicHealthScore || 0}%</p>
            <div className="mt-6 pt-4 border-t border-white/20 flex justify-around text-xs font-bold">
               <div>
                 <p className="opacity-70">FIXED</p>
                 <p>{cityLeaderboard[0]?.resolvedIssues || 0}</p>
               </div>
               <div>
                 <p className="opacity-70">REPORTS</p>
                 <p>{cityLeaderboard[0]?.totalIssues || 0}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Bronze */}
        <div className="order-3 md:order-3 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-orange-50 rounded-full border-4 border-orange-100 flex items-center justify-center text-3xl font-bold text-orange-400">3</div>
            <div className="absolute -top-4 -right-2 bg-orange-300 p-1.5 rounded-full text-white shadow-lg">
              <Zap size={20} />
            </div>
          </div>
          <div className="bg-white w-full p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <h4 className="font-bold text-slate-800">{cityLeaderboard[2]?.city || 'N/A'}</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Health Score</p>
            <p className="text-2xl font-black text-slate-700 mt-2">{cityLeaderboard[2]?.civicHealthScore || 0}%</p>
          </div>
        </div>
      </section>

      {/* Detailed Table */}
      <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={18} /> Detailed Ranking
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Find a city..."
              className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-500 text-black placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Civic Health</th>
                <th className="px-6 py-4">Resolved</th>
                <th className="px-6 py-4 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">No cities found</td>
                </tr>
              ) : (
                filteredLeaderboard.map((city) => {
                  const actualRank = cityLeaderboard.findIndex(c => c.city === city.city) + 1;
                  return (
                    <tr key={city.city} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-black text-slate-400">#{actualRank.toString().padStart(2, '0')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{city.city}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full min-w-[60px] max-w-[100px] overflow-hidden">
                            <div className={`h-full ${city.civicHealthScore > 70 ? 'bg-green-500' : city.civicHealthScore > 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${city.civicHealthScore}%` }}></div>
                          </div>
                          <span className="font-black text-slate-800 text-sm">{city.civicHealthScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-600">{city.resolvedIssues}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-bold text-slate-400">{city.totalIssues} Reports</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardScreen;
