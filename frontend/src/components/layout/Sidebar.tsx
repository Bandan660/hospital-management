import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserRound, CalendarCheck, LogOut, Hospital } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/patients',     label: 'Patients',     icon: Users           },
  { to: '/doctors',      label: 'Doctors',      icon: UserRound       },
  { to: '/appointments', label: 'Appointments', icon: CalendarCheck   },
];

const Sidebar = () => {
  const { clearAuth, user } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-[#0f172a] flex flex-col z-50">

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-[#0d9488] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Hospital size={19} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">MediCare</p>
          <p className="text-slate-500 text-[11px] mt-0.5">Hospital Management</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left cursor-pointer border-none
                ${isActive
                  ? 'bg-[#0d9488] text-white shadow-lg shadow-teal-900/30'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Icon size={17} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3 border-t border-white/10 flex flex-col gap-1">
        {/* User */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 bg-[#0d9488] rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate leading-none">{user?.name}</p>
            <p className="text-slate-500 text-[11px] mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 border-none cursor-pointer"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;