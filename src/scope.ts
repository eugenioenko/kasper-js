export class Scope {
  public values: Record<string, any>;
  public parent: Scope | null;

  constructor(parent?: Scope | null, entity?: Record<string, any>) {
    this.parent = parent ?? null;
    this.values = entity ?? {};
  }

  public init(entity?: Record<string, any>): void {
    this.values = entity ? entity : {};
  }

  public set(name: string, value: any) {
    this.values[name] = value;
  }

  public get(key: string): any {
    if (Object.prototype.hasOwnProperty.call(this.values, key)) {
      return this.values[key];
    }
    if (this.parent !== null) {
      return this.parent.get(key);
    }
    if (typeof window !== "undefined") {
      return window[key as keyof typeof window];
    }
    return undefined;
  }
}
