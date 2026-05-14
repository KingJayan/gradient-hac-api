export interface ClassPeriod {
  id: string;
  name: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  credits: number;
  dayType: 'A' | 'B' | 'all'; // for A/B day schedules
}

export interface TranscriptEntry {
  course: string;
  year: string;
  semester: string;
  credits: number;
  grade: string;
  gradePoints: number;
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  reason?: string;
}

export function getScheduleForDay(
  schedule: ClassPeriod[],
  dayType: 'A' | 'B'
): ClassPeriod[] {
  return schedule.filter((period) => period.dayType === dayType || period.dayType === 'all');
}

export function getCurrentPeriod(
  schedule: ClassPeriod[],
  currentTime: Date
): ClassPeriod | null {
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    schedule.find(
      (period) =>
        timeStr >= period.startTime && timeStr <= period.endTime
    ) || null
  );
}

export function getNextPeriod(
  schedule: ClassPeriod[],
  currentTime: Date
): ClassPeriod | null {
  const timeStr = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    schedule.find((period) => period.startTime > timeStr) || null
  );
}

export function calculateAttendancePercentage(
  records: AttendanceRecord[]
): number {
  if (records.length === 0) return 100;
  const presents = records.filter(
    (r) => r.status === 'present' || r.status === 'excused'
  ).length;
  return Math.round((presents / records.length) * 100);
}
