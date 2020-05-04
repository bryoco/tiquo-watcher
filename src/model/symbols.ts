export class Symbols {
    private symbolMap: {[symbol: string]: any} = {};

    constructor(symbols: string[]) {
        symbols.forEach(sym => {
            this.symbolMap[sym] = true;
        })
    }
    
    public add(symbol: string) {
        this.symbolMap[symbol] = true
    }

    public remove(symbol: string) {
        delete this.symbolMap[symbol];
    }

    public get(symbol: string): boolean {
        return this.symbolMap[symbol];
    }

    public getAll(): string[] {
        return Object.keys(this.symbolMap);
    }
}