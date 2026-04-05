import { useEffect, useState } from 'react';
import {
  Plus, Search, Calendar, Clock,
  User, Stethoscope, Trash2, X,
  CalendarCheck, Filter, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppointmentStore } from '../store/appointment.store';
import { usePatientStore }     from '../store/patient.store';
import { useDoctorStore }      from '../store/doctor.store';
import { type Appointment }         from '../types';
import {
  Button, Input, Select, Modal,
  PageHeader, Card, StatusBadge,
} from '../components/ui';

// ── Time slots ─────────────────────────────────────────────
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

// ── Init form ──────────────────────────────────────────────
const INIT = {
  patientId: '', doctorId: '',
  appointmentDate: '', timeSlot: '', notes: '',
};

// ── Booking Form ───────────────────────────────────────────
const BookingForm = ({
  form, setForm, errors, onSubmit,
  loading, onClose, patients, doctors,
}: any) => {

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={onSubmit} className="space-y-4">

      {/* Patient */}
      <Select
        label="Patient"
        icon={User}
        value={form.patientId}
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
        error={errors.patientId}
        placeholder="Select patient"
        options={patients.map((p: any) => ({
          value: p.id,
          label: `${p.name} • ${p.age}y • ${p.gender}`,
        }))}
        required
      />

      {/* Doctor */}
      <Select
        label="Doctor"
        icon={Stethoscope}
        value={form.doctorId}
        onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
        error={errors.doctorId}
        placeholder="Select doctor"
        options={doctors
          .filter((d: any) => d.available)
          .map((d: any) => ({
            value: d.id,
            label: `${d.name} • ${d.specialization}`,
          }))}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Date */}
        <Input
          label="Appointment Date"
          icon={Calendar}
          type="date"
          min={today}
          value={form.appointmentDate}
          onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
          error={errors.appointmentDate}
          required
        />

        {/* Time Slot */}
        <Select
          label="Time Slot"
          icon={Clock}
          value={form.timeSlot}
          onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
          error={errors.timeSlot}
          placeholder="Select time"
          options={TIME_SLOTS.map((t) => ({ value: t, label: t }))}
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
          Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="Any additional notes or symptoms..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all resize-none"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading} icon={<CalendarCheck size={15} />}>
          Book Appointment
        </Button>
      </div>
    </form>
  );
};

// ── Update Status Modal ────────────────────────────────────
const StatusModal = ({ appointment, onClose, onUpdate, loading }: any) => {
  const [status, setStatus] = useState(appointment?.status || '');

  useEffect(() => {
    if (appointment) setStatus(appointment.status);
  }, [appointment]);

  const statuses = [
    { value: 'SCHEDULED', label: 'Scheduled', color: 'border-blue-400    bg-blue-50    text-blue-600'    },
    { value: 'COMPLETED', label: 'Completed', color: 'border-emerald-400 bg-emerald-50 text-emerald-600' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'border-red-300     bg-red-50     text-red-500'     },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Update status for <span className="font-semibold text-slate-700">
          {appointment?.patient?.name}
        </span>'s appointment
      </p>

      <div className="space-y-2">
        {statuses.map(({ value, label, color }) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer
              ${status === value
                ? color
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
          >
            {label}
            {status === value && (
              <div className="w-5 h-5 rounded-full bg-current opacity-20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-current" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          loading={loading}
          onClick={() => onUpdate(appointment?.id, status)}
          disabled={status === appointment?.status}
        >
          Update Status
        </Button>
      </div>
    </div>
  );
};

// ── Main Appointments Page ─────────────────────────────────
const Appointments = () => {
  const { appointments, loading, fetchAppointments, createAppointment, updateStatus } = useAppointmentStore();
  const { patients, fetchPatients } = usePatientStore();
  const { doctors,  fetchDoctors  } = useDoctorStore();

  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [dateFilter,    setDateFilter]    = useState('');
  const [doctorFilter,  setDoctorFilter]  = useState('');
  const [bookOpen,      setBookOpen]      = useState(false);
  const [statusModal,   setStatusModal]   = useState<Appointment | null>(null);
  const [deleteId,      setDeleteId]      = useState<number | null>(null);
  const [form,          setForm]          = useState({ ...INIT });
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  // ── Filter ───────────────────────────────────────────────
  const filtered = appointments.filter((a) => {
    const matchSearch = a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
                        a.doctor?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? a.status === statusFilter : true;
    const matchDate   = dateFilter   ? a.appointmentDate.startsWith(dateFilter) : true;
    const matchDoctor = doctorFilter ? String(a.doctorId) === doctorFilter : true;
    return matchSearch && matchStatus && matchDate && matchDoctor;
  });

  // ── Stats ────────────────────────────────────────────────
  const scheduled = appointments.filter((a) => a.status === 'SCHEDULED').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;
  const today     = appointments.filter((a) =>
    a.appointmentDate.startsWith(new Date().toISOString().split('T')[0])
  ).length;

  // ── Validate ─────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.patientId)        e.patientId        = 'Please select a patient';
    if (!form.doctorId)         e.doctorId         = 'Please select a doctor';
    if (!form.appointmentDate)  e.appointmentDate  = 'Please select a date';
    if (!form.timeSlot)         e.timeSlot         = 'Please select a time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Book appointment ─────────────────────────────────────
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await createAppointment({
        patientId:       Number(form.patientId),
        doctorId:        Number(form.doctorId),
        appointmentDate: form.appointmentDate,
        timeSlot:        form.timeSlot,
        notes:           form.notes,
      });
      toast.success('Appointment booked successfully!');
      setBookOpen(false);
      setForm({ ...INIT });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to book appointment';
      // Handle double booking
      if (err.response?.status === 409) {
        toast.error('⚠️ This time slot is already booked!');
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update status ────────────────────────────────────────
  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      setSubmitting(true);
      await updateStatus(id, status);
      toast.success('Status updated successfully!');
      setStatusModal(null);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  

  const clearFilters = () => {
    setSearch(''); setStatusFilter('');
    setDateFilter(''); setDoctorFilter('');
  };
  const hasFilters = search || statusFilter || dateFilter || doctorFilter;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Appointments"
        subtitle={`${appointments.length} total appointments`}
        actionLabel="Book Appointment"
        actionIcon={Plus}
        onAction={() => { setForm({ ...INIT }); setErrors({}); setBookOpen(true); }}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: "Today",      value: today,     color: 'text-[#0d9488]',  bg: 'bg-teal-50'    },
          { label: "Scheduled",  value: scheduled, color: 'text-blue-600',   bg: 'bg-blue-50'    },
          { label: "Completed",  value: completed, color: 'text-emerald-600',bg: 'bg-emerald-50' },
          { label: "Cancelled",  value: cancelled, color: 'text-red-500',    bg: 'bg-red-50'     },
        ].map((s) => (
          <Card key={s.label} padding="sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm" className="mb-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <Input
              icon={Search}
              placeholder="Search patient or doctor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All status"
            options={[
              { value: 'SCHEDULED', label: 'Scheduled' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
            className="w-40"
          />

          <Select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            placeholder="All doctors"
            options={doctors.map((d) => ({ value: String(d.id), label: d.name }))}
            className="w-48"
          />

          <Input
            icon={Calendar}
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-44"
          />

          {hasFilters && (
            <Button variant="ghost" icon={<X size={15} />} onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">

        {/* Skeleton */}
        {loading && (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
                <div className="h-7 w-24 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <CalendarCheck size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold">No appointments found</p>
            <p className="text-slate-400 text-sm mt-1">
              {hasFilters ? 'Try clearing the filters' : 'Book your first appointment to get started'}
            </p>
            {!hasFilters && (
              <Button className="mt-4" icon={<Plus size={15} />}
                onClick={() => { setForm({ ...INIT }); setBookOpen(true); }}
              >
                Book Appointment
              </Button>
            )}
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Patient', 'Doctor', 'Date & Time', 'Notes', 'Status', 'Actions'].map((h, i) => (
                    <th key={h}
                      className={`text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5
                        ${i === 5 ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                          {a.patient?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{a.patient?.name}</p>
                          <p className="text-xs text-slate-400 capitalize">
                            {a.patient?.age}y • {a.patient?.gender}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 text-xs font-bold flex-shrink-0">
                          {a.doctor?.name?.replace('Dr. ', '').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{a.doctor?.name}</p>
                          <p className="text-xs text-slate-400">{a.doctor?.specialization}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-sm text-slate-700">
                          {new Date(a.appointmentDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-400">{a.timeSlot}</span>
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="px-6 py-4 max-w-36">
                      <p className="text-sm text-slate-500 truncate" title={a.notes}>
                        {a.notes || <span className="text-slate-300">—</span>}
                      </p>
                    </td>

                    {/* Status — clickable */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setStatusModal(a)}
                        className="cursor-pointer border-none bg-transparent p-0 hover:opacity-80 transition-opacity"
                        title="Click to update status"
                      >
                        <StatusBadge status={a.status} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setStatusModal(a)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-[#0d9488] text-slate-500 flex items-center justify-center transition-colors cursor-pointer border-none"
                          title="Update status"
                        >
                          <ChevronDown size={14} />
                        </button>
                        
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{appointments.length}</span> appointments
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#0d9488] font-medium hover:underline cursor-pointer border-none bg-transparent"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Book Modal */}
      <Modal
        isOpen={bookOpen}
        onClose={() => setBookOpen(false)}
        title="Book Appointment"
        subtitle="Fill in the appointment details"
        size="md"
      >
        <BookingForm
          form={form} setForm={setForm} errors={errors}
          onSubmit={handleBook} loading={submitting}
          onClose={() => setBookOpen(false)}
          patients={patients} doctors={doctors}
        />
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Status"
        size="sm"
      >
        <StatusModal
          appointment={statusModal}
          onClose={() => setStatusModal(null)}
          onUpdate={handleStatusUpdate}
          loading={submitting}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Appointment"
        size="sm"
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <p className="text-slate-700 font-semibold text-base">Are you sure?</p>
          <p className="text-slate-400 text-sm mt-1 mb-6">
            This will permanently delete this appointment record.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
           
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Appointments;