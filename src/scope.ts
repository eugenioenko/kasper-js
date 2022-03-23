export class Scope {
  public values: Map<string, any>;

  constructor(entries?: { [key: string]: any }) {
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
    return this.values.get(key);
  }
}
