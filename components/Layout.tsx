
import React from 'react';
import { 
  Home, PlusSquare, Bell, BarChart2, User as UserIcon, LogOut, Shield, Info 
} from 'lucide-react';
import { Language, User, Role } from '../types';
import { getTranslation } from '../utils';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  user: User;
  unreadNotifications: number;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, currentScreen, onNavigate, user, unreadNotifications 
}) => {
  const lang = user.preferredLanguage;

  const navItems = [
    { id: 'home', icon: Home, label: getTranslation(lang, 'home') },
    { id: 'report', icon: PlusSquare, label: getTranslation(lang, 'report') },
    { id: 'notifications', icon: Bell, label: getTranslation(lang, 'notifications'), badge: unreadNotifications },
    { id: 'leaderboard', icon: BarChart2, label: getTranslation(lang, 'leaderboard') },
    { id: 'profile', icon: UserIcon, label: getTranslation(lang, 'profile') },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-2 rounded-xl text-white">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
              {getTranslation(lang, 'appName')}
            </h1>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Maharashtra
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                currentScreen === item.id 
                  ? 'bg-orange-50 text-orange-600 font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="bg-blue-50/50 p-4 rounded-xl mb-4">
             <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Info size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">Evaluation Mode</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-tight">
                Some cities include an initial verified issue to demonstrate platform functionality.
             </p>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-20 md:pb-0">
        <header className="md:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Shield className="text-orange-500" size={24} />
            <h1 className="font-bold text-lg">{getTranslation(lang, 'appName')}</h1>
          </div>
          <div className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">
            {user.city}
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
          {children}
        </div>

        {/* Mobile Transparency Note */}
        <div className="md:hidden p-4 bg-slate-50 border-t border-slate-100 mb-20">
           <p className="text-[10px] text-center text-slate-400 font-medium">
              Note: Initial verified issues are included for demonstration purposes.
           </p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative ${
              currentScreen === item.id ? 'text-orange-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="absolute top-1 right-3 bg-orange-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
