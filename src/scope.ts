export class Scope {
  public values: Record<string, any>;
  public parent: Scope;

  constructor(parent?: Scope, entity?: Record<string, any>) {
    this.parent = parent ? parent : null;
    this.values = entity ? entity : {};
  }

  public init(entity?: Record<string, any>): void {
    this.values = entity ? entity : {};
  }

  public set(name: string, value: any) {
    this.values[name] = value;
  }

  public get(key: string): any {
    if (typeof this.values[key] !== "undefined") {
      return this.values[key];
    }

    const $imports = (this.values?.constructor as any)?.$imports;
    if ($imports && typeof $imports[key] !== "undefined") {
      return $imports[key];
    }

    if (this.parent !== null) {
      return this.parent.get(key);
    }

    return window[key as keyof typeof window];
  }
}
