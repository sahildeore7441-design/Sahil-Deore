
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  User, Language, Role, Issue, IssueStatus, IssueType, Severity, Notification, CityStats 
} from './types';
import { CITIES, DEPARTMENTS, WARDS, MAHARASHTRA_CITIES } from './constants';
import Layout from './components/Layout';
import AuthScreen from './screens/Auth';
import HomeScreen from './screens/Home';
import ReportIssueScreen from './screens/ReportIssue';
import NotificationsScreen from './screens/Notifications';
import LeaderboardScreen from './screens/Leaderboard';
import ProfileScreen from './screens/Profile';
import IssueDetailScreen from './screens/IssueDetail';

// Seeding Logic for Buildathon Evaluation
const seedInitialIssues = (): Issue[] => {
  return MAHARASHTRA_CITIES.map((city, index) => {
    const types = Object.values(IssueType);
    const type = types[index % types.length];
    const severity = [Severity.CRITICAL, Severity.MEDIUM, Severity.LOW][index % 3];
    
    // Realistic descriptions based on type
    const descriptions: Record<IssueType, string> = {
      [IssueType.POTHOLE]: "Major pothole detected near central junction causing slow traffic.",
      [IssueType.GARBAGE]: "Illegal garbage dumping spot identified behind commercial complex.",
      [IssueType.STREETLIGHT]: "Streetlights not functioning in the primary residential lane.",
      [IssueType.WATER_LEAKAGE]: "Significant water leakage from the main municipal pipeline.",
      [IssueType.DRAINAGE]: "Blocked drainage system causing overflow onto the main road."
    };

    // Mumbai specific coordinates fix
    let lat = city.lat;
    let lng = city.lng;
    if (city.name === 'Mumbai') {
      lat = 18.89 + (Math.random() * (19.27 - 18.89));
      lng = 72.77 + (Math.random() * (72.99 - 72.77));
    } else {
      // Small jitter for others to avoid exact center overlap
      lat += (Math.random() - 0.5) * 0.01;
      lng += (Math.random() - 0.5) * 0.01;
    }

    return {
      id: `seed-${city.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      reporterId: 'system-verified',
      reporterName: 'Civic Inspector',
      type,
      description: descriptions[type],
      image: `https://picsum.photos/seed/fixcity-${index}/800/600`,
      location: {
        lat,
        lng,
        address: `Verified Spot, ${city.name}`,
        city: city.name,
        ward: WARDS[index % WARDS.length]
      },
      severity,
      isAnonymous: false,
      status: IssueStatus.REPORTED,
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      confirmations: 12 + Math.floor(Math.random() * 20),
      isVerified: true,
      needsReview: false,
      assignedDepartment: DEPARTMENTS[type],
      isDemo: true,
      source: "Initial Verified Report"
    };
  });
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  
  // Initialize with seeded issues for demonstration
  const [issues, setIssues] = useState<Issue[]>(seedInitialIssues());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);

  // Sync language with user profile
  useEffect(() => {
    if (user) {
      setLanguage(user.preferredLanguage);
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const addIssue = (newIssue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'confirmations' | 'isVerified' | 'needsReview' | 'assignedDepartment' | 'status'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: IssueStatus.REPORTED,
      confirmations: 0,
      isVerified: false,
      needsReview: false,
      assignedDepartment: DEPARTMENTS[newIssue.type],
    };
    setIssues([issue, ...issues]);
    
    if (user) {
      setUser({ ...user, issuesReportedCount: (user.issuesReportedCount || 0) + 1 });
    }

    const notif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || 'guest',
      title: 'Issue Reported',
      message: `Your ${issue.type} report has been successfully submitted.`,
      type: 'success',
      createdAt: new Date().toISOString(),
      read: false,
      issueId: issue.id
    };
    setNotifications([notif, ...notifications]);
    setCurrentScreen('home');
  };

  const updateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues(prevIssues => prevIssues.map(issue => {
      if (issue.id === issueId) {
        const isFixed = newStatus === IssueStatus.FIXED;
        return {
          ...issue,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          fixedAt: isFixed ? new Date().toISOString() : undefined
        };
      }
      return issue;
    }));

    const targetIssue = issues.find(i => i.id === issueId);
    if (targetIssue) {
       const notif: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: targetIssue.reporterId,
        title: 'Issue Status Updated',
        message: `The status of your ${targetIssue.type} report has changed to ${newStatus}.`,
        type: 'info',
        createdAt: new Date().toISOString(),
        read: false,
        issueId
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const navigateToIssue = (id: string) => {
    setSelectedIssueId(id);
    setCurrentScreen('issue_detail');
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
          issues={issues} 
          user={user} 
          onViewIssue={navigateToIssue} 
        />;
      case 'report':
        return <ReportIssueScreen 
          user={user} 
          onSubmit={addIssue} 
          onCancel={() => setCurrentScreen('home')} 
        />;
      case 'notifications':
        return <NotificationsScreen 
          notifications={notifications} 
          onViewIssue={navigateToIssue} 
        />;
      case 'leaderboard':
        return <LeaderboardScreen issues={issues} />;
      case 'profile':
        return <ProfileScreen 
          user={user} 
          onLogout={handleLogout} 
          onUpdateUser={(u) => setUser(u)}
          issues={issues}
        />;
      case 'issue_detail':
        const issue = issues.find(i => i.id === selectedIssueId);
        if (!issue) return <HomeScreen issues={issues} user={user} onViewIssue={navigateToIssue} />;
        return <IssueDetailScreen 
          issue={issue} 
          user={user} 
          onUpdateStatus={updateIssueStatus}
          onBack={() => setCurrentScreen('home')}
        />;
      default:
        return <HomeScreen issues={issues} user={user} onViewIssue={navigateToIssue} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      <Layout 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
        user={user}
        unreadNotifications={notifications.filter(n => !n.read).length}
      >
        {renderScreen()}
      </Layout>
    </div>
  );
};

export default App;
