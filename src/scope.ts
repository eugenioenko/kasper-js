export class Scope {
  public values: Record<string, any>;
  public parent: Scope;

  constructor(parent?: Scope, entries?: Record<string, any>) {
    this.parent = parent ? parent : null;
    this.values = entries ? entries : {};
  }

  public init(entries?: Record<string, any>): void {
    this.values = entries ? entries : {};
  }

  public set(name: string, value: any) {
    this.values[name] = value;
  }

  public get(key: string): any {
    if (typeof this.values[key] !== "undefined") {
      return this.values[key];
    }
    if (this.parent !== null) {
      return this.parent.get(key);
    }

    return window[key as keyof typeof window];
  }
}
