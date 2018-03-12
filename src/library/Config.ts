import Store from "electron-store";

class Config {
  store: Store;

  constructor() {
    this.store = new Store();
  }
  addSymbol(data: any): void {
    this.store.set("symbols." + this.escape(data.symbol), data);
  }

  deleteSymbol(symbol: string): void {
    this.store.delete("symbols." + this.escape(symbol));
  }

  getSymbolData(symbol: string): any {
    return this.store.get("symbols." + this.escape(symbol));
  }

  getSymbols(): Array<any> {
    return this.store.get("symbols");
  }

  escape(key: string): string {
    return key.replace(/\./g, "\\.");
  }
}

export default Config;
