import { DynamoLocalConfig, DynamoRemoteConfig } from "./dynamoConfig";
import { Logger } from "@overnightjs/logger";
import { OptionChain } from "../model/ameritrade/type"
import { SymbolStore } from "./symbolStore"
import { Utils } from "../util/utils";
import AWS from "aws-sdk";

export class DynamoClient implements SymbolStore {
    readonly dynamoClient: AWS.DynamoDB.DocumentClient;
    readonly env: string

    constructor(env: string) {
        this.env = env;

        if (this.env === "dev") {
            AWS.config.update(DynamoLocalConfig);
        } else if (this.env === "prod") {
            AWS.config.update(DynamoRemoteConfig);
        } else {
            Logger.Err(`environment not allowed: ${env}`)
            process.exit();
        }
        this.dynamoClient = new AWS.DynamoDB.DocumentClient()
    }
    
    async saveSymbol(symbol: string): Promise<any> {
        const params = {
            TableName: "symbols",
            Item: {
                "symbol": symbol,
            }
        }
        
        return this.dynamoClient.put(params).promise()
    }

    async getAllSymbols(): Promise<string[]> {
        const params = {
            TableName: "symbols"
        }

        return new Promise<string[]>(async (resolve, reject) => {
            // instead of getting a whole promise,
            // just need a list of symbol strings
            this.dynamoClient.scan(params, (err, data) => {
                // reject on any error
                if (err) {
                    reject(err)
                }

                // process data.Items,
                // dont need the whole ScanOutput
                const symbols: string[] = []
                data.Items?.forEach((e) => {
                    if (e["symbol"]) {
                        symbols.push(e["symbol"])
                    }
                })
                resolve(symbols)
            })
        })
    }

    async getAllOptions(): Promise<OptionChain[]> {
        const params = {
            TableName: "options"
        }

        return this.getOptionsHelper(params)
    }

    async getOptions(symbol: string): Promise<OptionChain[]> {
        const params = {
            TableName: "options",
            Item: {
                "symbol": symbol,
            }
        }

        return this.getOptionsHelper(params)
    }

    private async getOptionsHelper(params: any): Promise<OptionChain[]> {
        return new Promise<OptionChain[]>(async (resolve, reject) => {
            // instead of getting a whole promise,
            // just need a list of symbol strings
            this.dynamoClient.scan(params, (err, data) => {
                // reject immediately on any error
                if (err) {
                    reject(err)
                }

                // process data.Items,
                // dont need the whole ScanOutput
                const options: OptionChain[] = []
                data.Items?.forEach((doc) => {
                    options.push(Utils.decompressChain(doc))
                })
                resolve(options)
            })
        })
    }

    async saveChain(chain: OptionChain): Promise<any> {
        const params = {
            TableName: "options",
            Item: Utils.compressChain(chain)
        }

        return this.dynamoClient.put(params).promise()
    }
    
}