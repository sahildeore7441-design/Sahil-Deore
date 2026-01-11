
import React from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';
import { Notification, Language } from '../types';
// Import formatTimeAgo from utils, but Language should come from types
import { formatTimeAgo } from '../utils';

interface NotificationsProps {
  notifications: Notification[];
  onViewIssue: (id: string) => void;
}

const NotificationsScreen: React.FC<NotificationsProps> = ({ notifications, onViewIssue }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'warning': return <Clock className="text-yellow-500" size={20} />;
      case 'error': return <AlertCircle className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
        <button className="text-sm font-bold text-orange-500 hover:text-orange-600">Mark all read</button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-400 font-medium">All caught up! No new notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => notif.issueId && onViewIssue(notif.issueId)}
              className={`bg-white p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex gap-4 ${notif.read ? 'border-slate-100 opacity-70' : 'border-orange-100 shadow-sm bg-orange-50/20'}`}
            >
              <div className="bg-white p-3 rounded-xl shadow-sm h-fit">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800 truncate">{notif.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">
                    {formatTimeAgo(notif.createdAt, Language.ENGLISH)}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{notif.message}</p>
                {notif.issueId && (
                  <button className="mt-2 text-xs font-bold text-orange-500 hover:underline">View Details</button>
                )}
              </div>
              {!notif.read && (
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Logic-based System Alerts */}
      <div className="mt-10 pt-6 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Insights</h3>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-4">
          <Info className="text-blue-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-blue-900 mb-1">Escalation Policy</p>
            <p className="text-xs text-blue-800 leading-relaxed">
              Issues unresolved for over 48 hours receive a "Delay Badge". 
              After 5 days, they are automatically escalated to senior department heads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsScreen;
