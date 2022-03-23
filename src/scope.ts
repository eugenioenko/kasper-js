export class Scope {
  public values: Map<string, any>;
  public parent: Scope;

  constructor(parent?: Scope, entries?: { [key: string]: any }) {
    this.parent = parent ? parent : null;
    this.init(entries);
  }

  public init(entries?: { [key: string]: any }): void {
    if (entries) {
      this.values = new Map(Object.entries(entries));
    } else {
      this.values = new Map();
    }
  }

  public set(name: string, value: any) {
    this.values.set(name, value);
  }

  public get(key: string): any {
    if (this.values.has(key)) {
      return this.values.get(key);
    }
    if (this.parent !== null) {
      return this.parent.get(key);
    }

    return undefined;
  }
}
