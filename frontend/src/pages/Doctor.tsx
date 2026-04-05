import { useEffect, useState } from 'react';
import {
  Plus, Search, UserRound, Phone,
  Mail, Stethoscope, Pencil, Trash2,
  CheckCircle2, XCircle, X, ToggleLeft, ToggleRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDoctorStore } from '../store/doctor.store';
import { type Doctor } from '../types';
import { Button, Input, Select, Modal, PageHeader, Card } from '../components/ui';

// ── Specializations list ───────────────────────────────────
const SPECIALIZATIONS = [
  'Cardiologist', 
  'Pediatrician', 'Dermatologist', 'Gynecologist',
  
];

// ── Availability badge ─────────────────────────────────────
const AvailBadge = ({ available }: { available: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
    ${available
      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
      : 'bg-slate-100  text-slate-500  border border-slate-200'
    }`}
  >
    {available
      ? <><CheckCircle2 size={12} /> Available</>
      : <><XCircle      size={12} /> Unavailable</>
    }
  </span>
);

// ── Specialization color map ───────────────────────────────
const specColor = (spec: string) => {
  const colors = [
    'bg-blue-50   text-blue-600',
    'bg-violet-50 text-violet-600',
    'bg-orange-50 text-orange-500',
    'bg-pink-50   text-pink-600',
    'bg-teal-50   text-teal-600',
    'bg-amber-50  text-amber-600',
  ];
  const idx = spec.charCodeAt(0) % colors.length;
  return colors[idx];
};

// ── Init form ──────────────────────────────────────────────
const INIT = {
  name: '', specialization: '', phone: '',
  email: '', available: 'true',
};

// ── Doctor Form ────────────────────────────────────────────
const DoctorForm = ({ form, setForm, errors, onSubmit, loading, onClose, isEdit }: any) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">

      {/* Name */}
      <div className="col-span-2">
        <Input
          label="Full Name"
          icon={UserRound}
          placeholder="e.g. Dr. Anjali Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
      </div>

      {/* Specialization */}
      <div className="col-span-2">
        <Select
          label="Specialization"
          icon={Stethoscope}
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          error={errors.specialization}
          placeholder="Select specialization"
          options={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
          required
        />
      </div>

      {/* Phone */}
      <div className="col-span-2">
        <Input
          label="Phone Number"
          icon={Phone}
          placeholder="e.g. 9876543210"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          error={errors.phone}
          required
        />
      </div>

      {/* Email */}
      <div className="col-span-2">
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="e.g. doctor@hospital.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          hint="Optional"
        />
      </div>

      {/* Availability toggle */}
      <div className="col-span-2">
        <label className="text-sm font-semibold text-slate-700 block mb-2">
          Availability
        </label>
        <div className="flex gap-3">
          {[
            { value: 'true',  label: 'Available',   icon: CheckCircle2, cls: form.available === 'true'  ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500' },
            { value: 'false', label: 'Unavailable',  icon: XCircle,      cls: form.available === 'false' ? 'border-red-300 bg-red-50 text-red-600'             : 'border-slate-200 text-slate-500' },
          ].map(({ value, label, icon: Icon, cls }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm({ ...form, available: value })}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer bg-transparent ${cls}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
      <Button variant="secondary" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" loading={loading}>
        {isEdit ? 'Update Doctor' : 'Add Doctor'}
      </Button>
    </div>
  </form>
);

// ── Main Doctors Page ──────────────────────────────────────
const Doctors = () => {
  const { doctors, loading, fetchDoctors, createDoctor, updateDoctor, deleteDoctor } = useDoctorStore();

  const [search,      setSearch]      = useState('');
  const [availFilter, setAvailFilter] = useState('');
  const [specFilter,  setSpecFilter]  = useState('');
  const [addOpen,     setAddOpen]     = useState(false);
  const [editDoctor,  setEditDoctor]  = useState<Doctor | null>(null);
  const [deleteId,    setDeleteId]    = useState<number | null>(null);
  const [form,        setForm]        = useState({ ...INIT });
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [submitting,  setSubmitting]  = useState(false);

  useEffect(() => { fetchDoctors(); }, []);

  // ── Filter ───────────────────────────────────────────────
  const filtered = doctors.filter((d:any) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
                        d.specialization.toLowerCase().includes(search.toLowerCase());
    const matchAvail  = availFilter === ''       ? true
                      : availFilter === 'true'   ? d.available
                      : !d.available;
    const matchSpec   = specFilter  ? d.specialization === specFilter : true;
    return matchSearch && matchAvail && matchSpec;
  });

  // ── Validate ─────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())           e.name           = 'Name is required';
    if (!form.specialization)        e.specialization = 'Specialization is required';
    if (!form.phone.trim())          e.phone          = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Open Edit ────────────────────────────────────────────
  const openEdit = (d: Doctor) => {
    setEditDoctor(d);
    setForm({
      name:           d.name,
      specialization: d.specialization,
      phone:          d.phone,
      email:          d.email || '',
      available:      String(d.available),
    });
    setErrors({});
  };

  // ── Open Add ─────────────────────────────────────────────
  const openAdd = () => {
    setForm({ ...INIT });
    setErrors({});
    setAddOpen(true);
  };

  // ── Submit Add ───────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await createDoctor({ ...form, available: form.available === 'true' } as any);
      toast.success('Doctor added successfully!');
      setAddOpen(false);
    } catch {
      toast.error('Failed to add doctor');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit Edit ──────────────────────────────────────────
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !editDoctor) return;
    try {
      setSubmitting(true);
      await updateDoctor(editDoctor.id, { ...form, available: form.available === 'true' } as any);
      toast.success('Doctor updated successfully!');
      setEditDoctor(null);
    } catch {
      toast.error('Failed to update doctor');
    } finally {
      setSubmitting(false);
    }
  };

 

  // ── Quick toggle availability ────────────────────────────
  const toggleAvailability = async (d: Doctor) => {
    try {
      await updateDoctor(d.id, { available: !d.available });
      toast.success(`Dr. ${d.name} marked as ${!d.available ? 'available' : 'unavailable'}`);
    } catch {
      toast.error('Failed to update availability');
    }
  };

  // ── Stats ────────────────────────────────────────────────
  const available   = doctors.filter((d:any) => d.available).length;
  const unavailable = doctors.length - available;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Doctors"
        subtitle={`${doctors.length} doctors registered`}
        actionLabel="Add Doctor"
        actionIcon={Plus}
        onAction={openAdd}
      />

      {/* Mini Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Doctors',  value: doctors.length, color: 'text-slate-800',   bg: 'bg-slate-100'   },
          { label: 'Available',      value: available,      color: 'text-emerald-600', bg: 'bg-emerald-50'  },
          { label: 'Unavailable',    value: unavailable,    color: 'text-slate-400',   bg: 'bg-slate-50'    },
        ].map((s) => (
          <Card key={s.label} padding="sm">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card padding="sm" className="mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            placeholder="All specializations"
            options={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
            className="sm:w-52"
          />
          <Select
            value={availFilter}
            onChange={(e) => setAvailFilter(e.target.value)}
            placeholder="All status"
            options={[
              { value: 'true',  label: 'Available'   },
              { value: 'false', label: 'Unavailable' },
            ]}
            className="sm:w-40"
          />
          {(search || availFilter || specFilter) && (
            <Button
              variant="ghost"
              icon={<X size={15} />}
              onClick={() => { setSearch(''); setAvailFilter(''); setSpecFilter(''); }}
            >
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
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <UserRound size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold">No doctors found</p>
            <p className="text-slate-400 text-sm mt-1">
              {search ? 'Try a different search term' : 'Add your first doctor to get started'}
            </p>
            {!search && (
              <Button className="mt-4" icon={<Plus size={15} />} onClick={openAdd}>
                Add First Doctor
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
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Doctor</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Specialization</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Phone</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((d:any) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* Doctor */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold flex-shrink-0">
                          {d.name.replace('Dr. ', '').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{d.name}</p>
                          <p className="text-xs text-slate-400">#{d.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${specColor(d.specialization)}`}>
                        {d.specialization}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{d.phone}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{d.email || '—'}</span>
                    </td>

                    {/* Availability toggle */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(d)}
                        className="flex items-center gap-1.5 cursor-pointer border-none bg-transparent p-0 group/toggle"
                        title="Click to toggle availability"
                      >
                        {d.available
                          ? <ToggleRight size={22} className="text-emerald-500 group-hover/toggle:text-emerald-600 transition-colors" />
                          : <ToggleLeft  size={22} className="text-slate-300   group-hover/toggle:text-slate-400   transition-colors" />
                        }
                        <AvailBadge available={d.available} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(d)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 flex items-center justify-center transition-colors cursor-pointer border-none"
                        >
                          <Pencil size={14} />
                        </button>
                       
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{doctors.length}</span> doctors
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Doctor"
        subtitle="Fill in the doctor details below"
      >
        <DoctorForm
          form={form} setForm={setForm} errors={errors}
          onSubmit={handleAdd} loading={submitting}
          onClose={() => setAddOpen(false)} isEdit={false}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editDoctor}
        onClose={() => setEditDoctor(null)}
        title="Edit Doctor"
        subtitle="Update the doctor information"
      >
        <DoctorForm
          form={form} setForm={setForm} errors={errors}
          onSubmit={handleEdit} loading={submitting}
          onClose={() => setEditDoctor(null)} isEdit={true}
        />
      </Modal>

      {/* Delete Confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Doctor"
        size="sm"
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 size={24} className="text-red-400" />
          </div>
          <p className="text-slate-700 font-semibold text-base">Are you sure?</p>
          <p className="text-slate-400 text-sm mt-1 mb-6">
            This will permanently remove the doctor from the system.
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

export default Doctors;