import * as request from "request-promise-native";
import { ExpDateMap, OptionChain, ChainRequest, ChainRequestObj } from "./type"
import { Logger } from "@overnightjs/logger";
import * as mongo from 'mongodb'

export class AmeritradeClient {
    apiKey: string;
    baseUrl: string = "https://api.tdameritrade.com/v1/marketdata/"

    constructor(apiKey: string) {
        this.apiKey = apiKey
    }

    /**
     *
     * @param symbol
     * @param contractType  CALL, PUT, or ALL. Default is ALL.
     * @param includeQuote  Can be TRUE or FALSE. Default is TRUE.
     * @param strategy      Passing a value returns a Strategy Chain.
     *                      Possible values are
     *                      SINGLE,
     *                      ANALYTICAL (allows use of the volatility, underlyingPrice, interestRate, and daysToExpiration params to calculate theoretical values),
     *                      COVERED,
     *                      VERTICAL,
     *                      CALENDAR,
     *                      STRANGLE,
     *                      STRADDLE,
     *                      BUTTERFLY,
     *                      CONDOR,
     *                      DIAGONAL,
     *                      COLLAR,
     *                      or ROLL.
     *                      Default is SINGLE.
     * @param interval      Strike interval for spread strategy chains (see strategy param). Default is 1.
     * @param range         ITM: In-the-money
     *                      NTM: Near-the-money
     *                      OTM: Out-of-the-money
     *                      SAK: Strikes Above Market
     *                      SBK: Strikes Below Market
     *                      SNK: Strikes Near Market
     *                      ALL: All Strikes
     *                      Default is ALL.
     * @param fromDate      "yyyy-mm-dd"
     * @param toDate        "yyyy-mm-dd"
     */
    async getChain(chainRequestObj: ChainRequestObj): Promise<OptionChain> {

        const apiUrl = `${this.baseUrl}chains?`;
        const queryApiKey = `apikey=${this.apiKey}`;
        const fullRequest = apiUrl + queryApiKey + chainRequestObj.getUrlQuery()

        const headers: { [key: string]: any } = {
            // server doesnt seem to care about any of this
            // but im just gonna leave this here

            // "Accept-Encoding" : "gzip",
            "Accept-Language" : "en-US",
            "Authorization": " ",
            "DNT" : 1,
            "Host" : "api.tdameritrade.com",
            // "Sec-Fetch-Dest" : "empty",
            // "Sec-Fetch-Mode" : "cors",
            // "Sec-Fetch-Site" : "same-site",
        };

        const options: request.OptionsWithUrl = {
            url: fullRequest,
            headers: headers,
            method: "GET"
        };

        let result: OptionChain
        try {
            result = JSON.parse(await request.get(options));
            result._id = new mongo.ObjectID()
            result.timeFetched = new Date();
        } catch (e) {
            Logger.Err(`cannot get chain: ${e}`)
        }

        return result!;
    }

    async findUnusualActivities(
        chainRequestObj: ChainRequestObj,
        targetOpenInterest: number = 200,
        targetDelta: number = 0.2): Promise<OptionChain> {

        let chains: OptionChain = await this.getChain(chainRequestObj);

        for (const expiry in chains.callExpDateMap) {
            const options: ExpDateMap[] = chains.callExpDateMap[expiry] as unknown as ExpDateMap[]

            for (const strike in options) {
                // apparently there is only one option inside each map
                // server wrapped it in an array
                const opt: ExpDateMap = (options[strike] as unknown as ExpDateMap[])[0];
                if (opt.openInterest < targetOpenInterest || Math.abs(opt.delta) < targetDelta) {
                    delete chains.callExpDateMap[expiry][strike]
                }
            }
        }
        console.log(JSON.stringify(chains));
        return chains;
    }
}