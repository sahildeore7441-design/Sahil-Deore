
import React, { useState } from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { User, Language, Role } from '../types';
import { CITIES } from '../constants';
import SearchableCitySelect from '../components/SearchableCitySelect';

interface AuthProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    city: '',
    email: '',
    password: '',
    preferredLanguage: Language.ENGLISH,
    role: Role.CITIZEN
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin && !formData.city) {
      alert("Please select a city.");
      return;
    }
    // Simulate auth
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName || 'Test User',
      age: parseInt(formData.age) || 25,
      city: formData.city || 'Mumbai',
      email: formData.email,
      preferredLanguage: formData.preferredLanguage,
      role: formData.role,
      issuesReportedCount: 0,
      issuesHandledCount: 0
    };
    onLogin(user);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Shared input style for Auth screen
  const inputClassName = "w-full px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-orange-500 transition-all text-black placeholder:text-[#666666]";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-orange-500 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-orange-200">
            <Shield size={36} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">FixMyCity</h1>
          <p className="text-slate-500 font-medium text-sm mt-1 uppercase tracking-widest">Maharashtra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                <input
                  required
                  className={inputClassName}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                  <input
                    required
                    type="number"
                    className={inputClassName}
                    placeholder="24"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">City</label>
                  <SearchableCitySelect 
                    value={formData.city}
                    onChange={(city) => updateField('city', city)}
                    placeholder="Search city..."
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input
              required
              type="email"
              className={inputClassName}
              placeholder="name@email.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <input
              required
              type="password"
              className={inputClassName}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferred Language</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => updateField('preferredLanguage', Language.ENGLISH)}
                    className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.preferredLanguage === Language.ENGLISH ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-500'}`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('preferredLanguage', Language.MARATHI)}
                    className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.preferredLanguage === Language.MARATHI ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-500'}`}
                  >
                    मराठी
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => updateField('role', Role.CITIZEN)}
                    className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.role === Role.CITIZEN ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-500'}`}
                  >
                    Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('role', Role.ADMIN)}
                    className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.role === Role.ADMIN ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-100 text-slate-500'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {isLogin ? 'Login' : 'Create Account'}
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-bold text-slate-600 hover:text-orange-500 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
