import React, { useState } from 'react';
import { Appointment, Client, UserProfile } from '../types';

interface ScheduleViewProps {
  appointments: Appointment[];
  clients: Client[];
  currentUser: UserProfile;
  onSelectClient: (client: Client) => void;
  onOpenNewPatient: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  appointments,
  clients,
  currentUser,
  onSelectClient,
  onOpenNewPatient,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState('2026-10-10');

  const rooms = [
    'OR 1 - Sapphire Suite',
    'OR 2 - DHI Precision',
    'Consultation Clinic A',
    'Trichology Lab B',
  ];

  const filteredAppointments = appointments.filter((apt) => {
    if (selectedRoom !== 'all' && apt.room !== selectedRoom) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Surgical Suites & Clinical Timeline
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
              ISO-5 Cleanrooms Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time operating theater schedule, graft allocations, and consultation rooms
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-800 dark:text-slate-200"
          />
          <button
            onClick={onOpenNewPatient}
            className="px-3.5 py-1.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <i className="ri-calendar-check-line text-teal-400 dark:text-teal-200"></i>
            <span>Schedule Procedure</span>
          </button>
        </div>
      </div>

      {/* Room Occupancy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const aptInRoom = appointments.filter((a) => a.room === room);
          const isOccupied = aptInRoom.some((a) => a.status === 'In Surgery');
          return (
            <div
              key={room}
              className={`p-4 rounded-xl border transition-all ${
                isOccupied
                  ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isOccupied ? 'text-teal-400' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {room.split(' - ')[0]}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    isOccupied
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isOccupied ? 'In Surgery' : `${aptInRoom.length} Booked`}
                </span>
              </div>
              <h3 className="font-bold text-xs truncate text-slate-900 dark:text-white">{room.split(' - ')[1] || room}</h3>
              <p
                className={`text-[11px] mt-2 line-clamp-1 ${
                  isOccupied ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {isOccupied
                  ? 'Live Mega-Session: Karim Abdelrahman'
                  : aptInRoom.length > 0
                  ? `Next: ${aptInRoom[0].clientNameEn}`
                  : 'Sanitized & Available'}
              </p>
            </div>
          );
        })}
      </div>

      {/* Schedule Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Filter Suite:</span>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Operating & Clinical Suites</option>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {filteredAppointments.length} Active Slots Scheduled
          </span>
        </div>

        {/* Timeline rows */}
        <div className="space-y-3">
          {filteredAppointments.map((apt) => {
            const client = clients.find((c) => c.id === apt.clientId);
            return (
              <div
                key={apt.id}
                onClick={() => client && onSelectClient(client)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-sm transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Time slot */}
                  <div className="text-center w-28 shrink-0 font-mono bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">{apt.time}</span>
                    <span className="text-[10px] text-slate-400">{apt.duration}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {apt.clientNameEn}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-arabic font-medium">
                        ({apt.clientNameAr})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                        {apt.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                        <i className="ri-hospital-line text-teal-600 dark:text-teal-400"></i>
                        <span>{apt.room}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <i className="ri-user-star-line text-slate-400"></i>
                        <span>{apt.doctor}</span>
                      </span>
                      {apt.graftTarget && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-teal-700 dark:text-teal-300 font-semibold">
                            {apt.graftTarget.toLocaleString()} Grafts Plan
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      apt.status === 'In Surgery'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold'
                        : apt.status === 'Checked In'
                        ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-medium'
                        : apt.status === 'Completed'
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {apt.status}
                  </span>
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1">
                    <span>Clinical Chart</span>
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
