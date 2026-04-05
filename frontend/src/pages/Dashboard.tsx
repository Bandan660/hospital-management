import { useEffect, useState } from 'react';
import {
  Users, UserRound, CalendarCheck, Calendar,
  TrendingUp, Clock, CheckCircle2, XCircle, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { type DashboardStats, type Appointment } from '../types';

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({
  label, value, icon: Icon, color, bg, trend
}: {
  label: string;
  value: number;
  icon: any;
  color: string;
  bg: string;
  trend?: string;
}) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 mt-2 leading-none">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp size={13} className="text-emerald-500" />
            <span className="text-emerald-500 text-xs font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className={color} />
      </div>
    </div>
  </div>
);

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    SCHEDULED:  { label: 'Scheduled',  cls: 'bg-blue-50 text-blue-600 border border-blue-200'    },
    COMPLETED:  { label: 'Completed',  cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    CANCELLED:  { label: 'Cancelled',  cls: 'bg-red-50 text-red-500 border border-red-200'       },
  };
  const s = map[status] || map['SCHEDULED'];
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ── Main Dashboard ─────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats]     = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // ── Skeleton ─────────────────────────────────────────────
  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-28 border border-slate-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl h-96 border border-slate-100" />
        <div className="bg-white rounded-2xl h-96 border border-slate-100" />
      </div>
    </div>
  );

  const o  = stats?.overview;
  const as = stats?.appointmentStats;
  const recent = stats?.recentAppointments || [];

  const statCards = [
    {
      label: 'Total Patients',
      value: o?.totalPatients      ?? 0,
      icon:  Users,
      color: 'text-blue-600',
      bg:    'bg-blue-50',
      trend: '+12% this month',
    },
    {
      label: 'Total Doctors',
      value: o?.totalDoctors        ?? 0,
      icon:  UserRound,
      color: 'text-violet-600',
      bg:    'bg-violet-50',
    },
    {
      label: 'Total Appointments',
      value: o?.totalAppointments   ?? 0,
      icon:  CalendarCheck,
      color: 'text-[#0d9488]',
      bg:    'bg-teal-50',
      trend: '+8% this month',
    },
    {
      label: "Today's Appointments",
      value: o?.todayAppointments   ?? 0,
      icon:  Calendar,
      color: 'text-orange-500',
      bg:    'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">

      {/* ── Stat Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      {/* ── Middle Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Recent Appointments Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">Recent Appointments</h2>
              <p className="text-xs text-slate-400 mt-0.5">Latest 5 appointments</p>
            </div>
            <button
              onClick={() => navigate('/appointments')}
              className="flex items-center gap-1.5 text-[#0d9488] text-sm font-medium hover:gap-2.5 transition-all"
            >
              View all <ArrowRight size={15} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CalendarCheck size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm font-medium">No appointments yet</p>
              <p className="text-slate-300 text-xs mt-1">Book an appointment to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">Patient</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">Doctor</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">Date & Time</th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recent.map((apt: Appointment) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                            {apt.patient?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">{apt.patient?.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{apt.patient?.gender}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm font-medium text-slate-700">{apt.doctor?.name}</p>
                        <p className="text-xs text-slate-400">{apt.doctor?.specialization}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Clock size={13} className="text-slate-400" />
                          <div>
                            <p className="text-sm text-slate-700">
                              {new Date(apt.appointmentDate).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'short', year: 'numeric'
                              })}
                            </p>
                            <p className="text-xs text-slate-400">{apt.timeSlot}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Appointment Stats Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800">Appointment Status</h2>
            <p className="text-xs text-slate-400 mt-0.5">Overall breakdown</p>
          </div>

          <div className="p-6 space-y-5">
            {/* Scheduled */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium text-slate-600">Scheduled</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{as?.scheduled ?? 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${o?.totalAppointments ? ((as?.scheduled ?? 0) / o.totalAppointments) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Completed</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{as?.completed ?? 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${o?.totalAppointments ? ((as?.completed ?? 0) / o.totalAppointments) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cancelled */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="text-sm font-medium text-slate-600">Cancelled</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{as?.cancelled ?? 0}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-red-400 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${o?.totalAppointments ? ((as?.cancelled ?? 0) / o.totalAppointments) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-sm text-emerald-700 font-medium">Completed</span>
                </div>
                <span className="text-sm font-bold text-emerald-700">{as?.completed ?? 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-sm text-red-500 font-medium">Cancelled</span>
                </div>
                <span className="text-sm font-bold text-red-500">{as?.cancelled ?? 0}</span>
              </div>
            </div>

            {/* Today highlight */}
            <div className="bg-[#0d9488]/8 border border-[#0d9488]/20 rounded-xl p-4">
              <p className="text-xs text-slate-500 font-medium">Today's Appointments</p>
              <p className="text-3xl font-bold text-[#0d9488] mt-1">{o?.todayAppointments ?? 0}</p>
              <p className="text-xs text-slate-400 mt-0.5">Scheduled for today</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;