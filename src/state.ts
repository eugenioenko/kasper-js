import { KasperApp } from "./kasper";

export class State {
  _value: any;
  entity: KasperApp;
  render: (entity: any) => void;

  constructor(initial: any, entity: KasperApp) {
    this._value = initial;
    this.entity = entity;
  }

  get value(): any {
    return this._value;
  }

  set(value: any) {
    this._value = value;
    this.entity.$changes += 1;
    this.entity.$doRender();
  }

  toString() {
    return this._value.toString();
  }
}
