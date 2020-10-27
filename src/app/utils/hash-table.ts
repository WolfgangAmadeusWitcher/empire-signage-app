export class HashTable<T, L> {
  private table: any;

  constructor() {
    this.table = {};
  }

  put(key: T, value: L): HashTable<T, L> {
    this.table['v_' + key] = value;
    return this;
  }

  get(key: T): L {
    return this.table['v_' + key];
  }

  getAll(): L[] {
    const vector = Array.from(Object.keys(this.table), (k) => this.table[k]);
    return vector;
  }

  getKeys(): string[] {
    const keys = Array.from(Object.keys(this.table), (k) => k.substring(2));
    return keys;
  }

  has(key: T): boolean {
    if (typeof this.table['v_' + key] !== 'undefined') {
      return true;
    }
    return false;
  }

  remove(key: T): HashTable<T, L> {
    delete this.table['v_' + key];
    return this;
  }

  putArray(key: T, value: L): HashTable<T, L> {
    if (typeof this.table['a_' + key] === 'undefined') {
      this.table['a_' + key] = [];
    }
    this.table['a_' + key].push(value);
    return this;
  }

  getArray(key: T): L {
    if (typeof this.table['a_' + key] === 'undefined') {
      this.table['a_' + key] = [];
    }
    return this.table['a_' + key];
  }

  removeArray(key: T, value: L): HashTable<T, L> {
    if (typeof this.table['a_' + key] !== 'undefined') {
      this.table['a_' + key].splice(this.table['a_' + key].indexOf(value), 1);
    }
    return this;
  }

  hasArray(key: T): boolean {
    if (typeof this.table['a_' + key] !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  hasinArray(key: T, value: L): boolean {
    if (typeof this.table['a_' + key] !== 'undefined') {
      if (this.table['a_' + key].indexOf(value) !== -1) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  size(): number {
    return Object.keys(this.table).length;
  }
}
