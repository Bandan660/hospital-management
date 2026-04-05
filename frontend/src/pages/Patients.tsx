import { useEffect, useState } from 'react';
import {
  Plus, Search, User, Phone, Mail,
  Calendar, Pencil,  Users, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePatientStore } from '../store/patient.store';
import { type Patient } from '../types';
import {
  Button, Input, Select, Modal,
  PageHeader, Card
} from '../components/ui';

// ── Gender badge ───────────────────────────────────────────
const GenderBadge = ({ gender }: { gender: string }) => {
  const map: Record<string, string> = {
    male:   'bg-blue-50  text-blue-600  border border-blue-200',
    female: 'bg-pink-50  text-pink-600  border border-pink-200',
    other:  'bg-slate-50 text-slate-600 border border-slate-200',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${map[gender] || map['other']}`}>
      {gender}
    </span>
  );
};

// ── Initial form state ─────────────────────────────────────
const INIT = {
  name: '', age: '', gender: '',
  phone: '', email: '', address: '',
};

// ── Patient Form (used in Add + Edit modal) ────────────────
const PatientForm = ({
  form, setForm, errors, onSubmit, loading, onClose, isEdit
}: any) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label="Full Name"
          icon={User}
          placeholder="e.g. Rahul Sharma"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
      </div>

      <Input
        label="Age"
        type="number"
        placeholder="e.g. 28"
        value={form.age}
        onChange={(e) => setForm({ ...form, age: e.target.value })}
        error={errors.age}
        required
      />

      <Select
        label="Gender"
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
        error={errors.gender}
        placeholder="Select gender"
        options={[
          { value: 'male',   label: 'Male'   },
          { value: 'female', label: 'Female' },
          { value: 'other',  label: 'Other'  },
        ]}
        required
      />

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

      <div className="col-span-2">
        <Input
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="e.g. rahul@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          hint="Optional"
        />
      </div>

      <div className="col-span-2">
        <label className="text-sm font-semibold text-slate-700 block mb-1.5">
          Address <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="e.g. 12 MG Road, Bhubaneswar"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full px-4 py-2.5 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-xl outline-none placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0d9488]/20 focus:border-[#0d9488] transition-all resize-none"
        />
      </div>
    </div>

    {/* Footer buttons */}
    <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
      <Button variant="secondary" type="button" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit" loading={loading}>
        {isEdit ? 'Update Patient' : 'Add Patient'}
      </Button>
    </div>
  </form>
);

// ── Main Patients Page ─────────────────────────────────────
const Patients = () => {
  const { patients, loading, fetchPatients, createPatient, updatePatient } = usePatientStore();

  const [search,     setSearch]     = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [addOpen,    setAddOpen]    = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [form,       setForm]       = useState({ ...INIT });
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchPatients(); }, []);

  // ── Filtered list ────────────────────────────────────────
  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.phone.includes(search);
    const matchGender = genderFilter ? p.gender === genderFilter : true;
    return matchSearch && matchGender;
  });

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())          e.name   = 'Name is required';
    if (!form.age || +form.age < 0) e.age    = 'Valid age is required';
    if (!form.gender)               e.gender = 'Gender is required';
    if (!form.phone.trim())         e.phone  = 'Phone is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Open Edit ────────────────────────────────────────────
  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setForm({
      name: p.name, age: String(p.age),
      gender: p.gender, phone: p.phone,
      email: p.email || '', address: p.address || '',
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
      await createPatient({ ...form, age: Number(form.age) } as any);
      toast.success('Patient registered successfully!');
      setAddOpen(false);
    } catch {
      toast.error('Failed to add patient');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submit Edit ──────────────────────────────────────────
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !editPatient) return;
    try {
      setSubmitting(true);
      await updatePatient(editPatient.id, { ...form, age: Number(form.age) } as any);
      toast.success('Patient updated successfully!');
      setEditPatient(null);
    } catch {
      toast.error('Failed to update patient');
    } finally {
      setSubmitting(false);
    }
  };

  
  

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Patients"
        subtitle={`${patients.length} total patients registered`}
        actionLabel="Add Patient"
        actionIcon={Plus}
        onAction={openAdd}
      />

      {/* Filters */}
      <Card padding="sm" className="mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            placeholder="All genders"
            options={[
              { value: 'male',   label: 'Male'   },
              { value: 'female', label: 'Female' },
              { value: 'other',  label: 'Other'  },
            ]}
            className="sm:w-44"
          />
          {(search || genderFilter) && (
            <Button
              variant="ghost"
              icon={<X size={15} />}
              onClick={() => { setSearch(''); setGenderFilter(''); }}
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
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-semibold text-base">No patients found</p>
            <p className="text-slate-400 text-sm mt-1">
              {search ? 'Try a different search term' : 'Register your first patient to get started'}
            </p>
            {!search && (
              <Button className="mt-4" icon={<Plus size={15} />} onClick={openAdd}>
                Add First Patient
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
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Patient</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Age / Gender</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Phone</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Registered</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* Patient name + avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#0d9488]/10 rounded-full flex items-center justify-center text-[#0d9488] text-sm font-bold flex-shrink-0">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">#{p.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-700 font-medium">{p.age} yrs</span>
                        <GenderBadge gender={p.gender} />
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400" />
                        <span className="text-sm text-slate-700">{p.phone}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{p.email || '—'}</span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {new Date(p.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
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

            {/* Table footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{' '}
                <span className="font-semibold text-slate-600">{patients.length}</span> patients
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Register New Patient"
        subtitle="Fill in the patient details below"
      >
        <PatientForm
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleAdd}
          loading={submitting}
          onClose={() => setAddOpen(false)}
          isEdit={false}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editPatient}
        onClose={() => setEditPatient(null)}
        title="Edit Patient"
        subtitle="Update the patient information"
      >
        <PatientForm
          form={form}
          setForm={setForm}
          errors={errors}
          onSubmit={handleEdit}
          loading={submitting}
          onClose={() => setEditPatient(null)}
          isEdit={true}
        />
      </Modal>

     
    </div>
  );
};

export default Patients;