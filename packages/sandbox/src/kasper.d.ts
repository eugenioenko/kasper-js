declare module '*.kasper' {
  import type { Component } from 'kasper';
  type AnyComponent = new (...args: any[]) => Component;
  const exports: Record<string, AnyComponent>;
  export = exports;
}
