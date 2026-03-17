import { signal, computed, batch } from 'kasper-js';
import { fetchCpuUsage, fetchMemoryUsage, fetchRequestRate, fetchErrorRate, fetchLatency } from './metrics-api';

export interface LogEvent {
  id: number;
  time: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export const cpu       = signal(0);
export const memory    = signal(0);
export const requests  = signal(0);
export const errorRate = signal(0);
export const latency   = signal(0);
export const uptime    = signal(0);
export const events    = signal<LogEvent[]>([]);

export const status = computed(() => {
  if (cpu.value > 80 || errorRate.value > 5) return 'critical';
  if (cpu.value > 60 || errorRate.value > 2) return 'warning';
  return 'healthy';
});

const ROUTINE_EVENTS = [
  'Health check passed',
  'Cache hit rate 94%',
  'DB connection pool healthy',
  'Autoscaler: 3 instances running',
  'TLS cert valid for 87 days',
];

let _eventId = 0;

function makeEvent(cpuVal: number, memVal: number, errVal: number, latVal: number): LogEvent {
  let level: LogEvent['level'] = 'info';
  let message: string;

  if (errVal > 5) {
    level = 'error';
    message = `Error rate critical: ${errVal}%`;
  } else if (cpuVal > 80) {
    level = 'warn';
    message = `CPU high: ${cpuVal}%`;
  } else if (memVal > 85) {
    level = 'warn';
    message = `Memory pressure: ${memVal}%`;
  } else if (latVal > 400) {
    level = 'warn';
    message = `Latency spike: ${latVal}ms`;
  } else {
    message = ROUTINE_EVENTS[Math.floor(Math.random() * ROUTINE_EVENTS.length)];
  }

  return { id: ++_eventId, time: new Date().toLocaleTimeString(), level, message };
}

let _interval: ReturnType<typeof setInterval> | null = null;

async function tick() {
  const [cpuVal, memVal, reqVal, errVal, latVal] = await Promise.all([
    fetchCpuUsage(),
    fetchMemoryUsage(),
    fetchRequestRate(),
    fetchErrorRate(),
    fetchLatency(),
  ]);

  batch(() => {
    cpu.value       = cpuVal;
    memory.value    = memVal;
    requests.value  = reqVal;
    errorRate.value = errVal;
    latency.value   = latVal;
    uptime.value   += 2;
    events.value    = [makeEvent(cpuVal, memVal, errVal, latVal), ...events.value].slice(0, 12);
  });
}

export function startPolling(): void {
  stopPolling();
  uptime.value  = 0;
  events.value  = [];
  tick();
  _interval = setInterval(tick, 2000);
}

export function stopPolling(): void {
  if (_interval !== null) {
    clearInterval(_interval);
    _interval = null;
  }
}
