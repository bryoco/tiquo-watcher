export type ContractType = "CALL" | "PUT" | "ALL"
export type IncludeQuote = "TRUE" | "FALSE"
export type Strategy = "SINGLE" | "ANALYTICAL" | "COVERED" | "VERTICAL" | "CALENDAR" | "STRANGLE" | "STRADDLE" | "BUTTERFLY" | "CONDOR" | "DIAGNOAL" | "COLLAR" | "ROLL"
// ITM: In-the-money
// NTM: Near-the-money
// OTM: Out-of-the-money
// SAK: Strikes Above Market
// SBK: Strikes Below Market
// SNK: Strikes Near Market
// ALL: All Strikes
export type Range = "ITM" | "NTM" | "OTM" | "SAK" | "SBK" | "SNK" | "ALL"
export type ExpMonth = "ALL" | "JAN" | "FEB" | "MAR" | "APR" | "MAY" | "JUN" | "JUL" | "AUG" | "SEP" | "NOV" | "DEC" 
// S: Standard contracts
// NS: Non-standard contracts
// ALL: All contracts
export type OptionType = "S" | "NS" | "ALL"
export type ExpirationType = "R" | "S"
export type PutCall = "PUT" | "CALL"

export interface ChainRequest {
    symbol: string,
    contractType?: ContractType,
    strikeCount?: string,
    includeQuote?: IncludeQuote,
    strategy?: Strategy,
    interval?: string,
    strike?: string,
    range?: Range,
    fromDate?: string,
    toDate?: string,
    volatility?: string,
    underlyingPrice?: string,
    interestRate?: string,
    dayToExpiration?: string,
    expMonth?: ExpMonth,
    optionType?: OptionType
}

export class ChainRequestObj implements ChainRequest {
    // required
    readonly symbol: string

    // optional
    readonly contractType: ContractType
    readonly strikeCount?: string
    readonly includeQuote: IncludeQuote
    readonly strategy: Strategy = "SINGLE"
    readonly interval?: string
    readonly strike?: string
    readonly range: Range = "NTM"
    // 'Only return expirations after this date. For strategies, expiration refers to the nearest term expiration in the strategy. 
    // Valid ISO-8601 formats are: yyyy-MM-dd and yyyy-MM-dd'T'HH:mm:ssz.'
    readonly fromDate?: string
    readonly toDate?: string
    // Volatility applies only to ANALYTICAL strategy chains
    readonly volatility?: string
    // Underlying price applies only to ANALYTICAL strategy chains
    readonly underlyingPrice?: string
    // Interest rate applies only to ANALYTICAL strategy chains
    readonly interestRate?: string
    readonly dayToExpiration?: string
    readonly expMonth: ExpMonth = "ALL"
    readonly optionType: OptionType = "S"
    constructor(req: ChainRequest) {
        this.symbol = req.symbol.trim().toUpperCase()

        this.contractType = req.contractType ? req.contractType : "ALL"
        this.strikeCount = req.strikeCount
        this.includeQuote = req.includeQuote ? req.includeQuote : "TRUE"
        this.strategy = req.strategy ? req.strategy : "SINGLE"
        this.interval = req.interval
        this.strike = req.strike
        this.range = req.range ? req.range : "NTM"
        this.fromDate = req.fromDate
        this.toDate = req.toDate
        this.volatility = req.volatility
        this.underlyingPrice = req.underlyingPrice
        this.interestRate = req.interestRate
        this.dayToExpiration = req.dayToExpiration
        this.expMonth = req.expMonth ? req.expMonth : "ALL"
        this.optionType = req.optionType ? req.optionType : "S"
    }

    getUrlQuery(): string {
        let final: string = "";
        Object.keys(this).forEach((key) => {
            // its hacky but works
            // @ts-ignore
            if (this[key]) {
                // @ts-ignore
                final += `&${key}=${this[key]}`;
            }
        })
        return final 
    }
}

export interface OptionChain {
    timeFetched:       Date;
    _id:               any;
    symbol:            string;
    status:            string;
    underlying:        null;
    strategy:          string;
    interval:          number;
    isDelayed:         boolean;
    isIndex:           boolean;
    interestRate:      number;
    underlyingPrice:   number;
    volatility:        number;
    daysToExpiration:  number;
    numberOfContracts: number;
    callExpDateMap:    { [key: string]: { [key: string]: ExpDateMap[] } };
    putExpDateMap:     { [key: string]: { [key: string]: ExpDateMap[] } };
}

export interface ExpDateMap {
    putCall:                PutCall;
    symbol:                 string;
    description:            string;
    exchangeName:           string;
    bid:                    number;
    ask:                    number;
    last:                   number;
    mark:                   number;
    bidSize:                number;
    askSize:                number;
    bidAskSize:             string;
    lastSize:               number;
    highPrice:              number;
    lowPrice:               number;
    openPrice:              number;
    closePrice:             number;
    totalVolume:            number;
    tradeDate:              any;
    tradeTimeInLong:        number;
    quoteTimeInLong:        number;
    netChange:              number;
    volatility:             number;
    delta:                  number;
    gamma:                  number;
    theta:                  number;
    vega:                   number;
    rho:                    number;
    openInterest:           number;
    timeValue:              number;
    theoreticalOptionValue: number;
    theoreticalVolatility:  number;
    optionDeliverablesList: null;
    strikePrice:            number;
    expirationDate:         number;
    daysToExpiration:       number;
    expirationType:         ExpirationType;
    lastTradingDay:         number;
    multiplier:             number;
    settlementType:         string;
    deliverableNote:        string;
    isIndexOption:          null;
    percentChange:          number;
    markChange:             number;
    markPercentChange:      number;
    inTheMoney:             boolean;
    mini:                   boolean;
    nonStandard:            boolean;
}