// Simulates 5 independent microservice APIs using a random walk

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function walk(current: number, step: number, min: number, max: number): number {
  return clamp(current + (Math.random() - 0.5) * step * 2, min, max);
}

let _cpu      = 42;
let _memory   = 58;
let _requests = 1340;
let _errors   = 0.6;
let _latency  = 95;

export async function fetchCpuUsage(): Promise<number> {
  _cpu = walk(_cpu, 6, 5, 98);
  return Math.round(_cpu);
}

export async function fetchMemoryUsage(): Promise<number> {
  _memory = walk(_memory, 3, 15, 95);
  return Math.round(_memory);
}

export async function fetchRequestRate(): Promise<number> {
  _requests = walk(_requests, 150, 50, 4800);
  return Math.round(_requests);
}

export async function fetchErrorRate(): Promise<number> {
  _errors = walk(_errors, 0.4, 0, 12);
  return parseFloat(_errors.toFixed(1));
}

export async function fetchLatency(): Promise<number> {
  _latency = walk(_latency, 30, 10, 600);
  return Math.round(_latency);
}
