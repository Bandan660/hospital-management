type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

const statusMap: Record<AppointmentStatus, { label: string; cls: string; dot: string }> = {
  SCHEDULED: {
    label: 'Scheduled',
    cls:   'bg-blue-50 text-blue-600 border border-blue-200',
    dot:   'bg-blue-500',
  },
  COMPLETED: {
    label: 'Completed',
    cls:   'bg-emerald-50 text-emerald-600 border border-emerald-200',
    dot:   'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    cls:   'bg-red-50 text-red-500 border border-red-200',
    dot:   'bg-red-400',
  },
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const s = statusMap[status] || statusMap['SCHEDULED'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

export default StatusBadge;