import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard':    { title: 'Dashboard',    subtitle: "Welcome back! Here's what's happening today." },
  '/patients':     { title: 'Patients',     subtitle: 'Manage and view all patient records'          },
  '/doctors':      { title: 'Doctors',      subtitle: 'Manage doctor profiles and availability'      },
  '/appointments': { title: 'Appointments', subtitle: 'Schedule and track all appointments'          },
};

const Header = () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const page = pageTitles[pathname] || { title: 'Hospital', subtitle: '' };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">

      {/* Page Title */}
      <div>
        <h1 className="text-[17px] font-bold text-slate-800 leading-none">{page.title}</h1>
        <p className="text-[12px] text-slate-400 mt-1">{page.subtitle}</p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Bell */}
        <button className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer">
          <Bell size={16} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0d9488] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-slate-800 leading-none">{user?.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;