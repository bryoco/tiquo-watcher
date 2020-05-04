import { OptionChain } from "../model/ameritrade/type";

export interface SymbolStore {
    saveSymbol(symbol: string): Promise<any>;
    getAllSymbols(): Promise<string[]>;
    saveChain(optionChain: OptionChain): Promise<any>;
    getAllOptions(): Promise<OptionChain[]>;
    getOptions(symbol: string): Promise<OptionChain[]>;
}
