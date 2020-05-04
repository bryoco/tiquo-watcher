import { SymbolStore } from "./symbolStore";
import * as mongodb from "mongodb";
import { Logger } from "@overnightjs/logger";
import { OptionChain } from "../model/ameritrade/type";
import { Utils } from "../util/utils";

export class MongoTiquoClient implements SymbolStore {
    readonly mongoClient: mongodb.MongoClient
    readonly env: string

    constructor(env: string) {
        this.env = env

        let url = ""
        if (this.env === "dev") {
            url = "mongodb://mongo:27017/tiquo"
        } else if (this.env === "prod") {
            throw new Error("not yet implemented")
        } else {
            Logger.Err(`environment not allowed: ${env}`)
            process.exit()
        }

        const options = {useUnifiedTopology: true, useNewUrlParser: true}
        this.mongoClient = new mongodb.MongoClient(url, options)
        try {
            this.connect()
        } catch (e) {
            Logger.Err(`mongo cannot connect: ${e}`)
        }
    }

    private async connect(): Promise<any> {
        return await this.mongoClient.connect();
    }

    async saveSymbol(symbol: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const result = await this.mongoClient.db().collection("symbols").insertOne({"symbol": symbol})
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }

    async getAllSymbols(): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                const result: string[] = []
                const cursor = this.mongoClient.db().collection("symbols").find()
                await cursor.forEach((doc) => {
                    if (doc["symbol"])
                        result.push(doc["symbol"])
                })
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }
        
    async saveChain(chain: OptionChain): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const doc = await Utils.compressChain(chain)
                const result = await this.mongoClient.db().collection("options").insertOne(doc);
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }

    async getAllOptions(): Promise<OptionChain[]> {
        return new Promise<OptionChain[]>(async (resolve, reject) => {
            try {
                const cursor = this.mongoClient.db().collection("options").find()
                const result: OptionChain[] = await this.getDocumentHelper(cursor)
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }

    async getOptions(symbol: string): Promise<OptionChain[]> {
        return new Promise<OptionChain[]>(async (resolve, reject) => {
            try {
                const cursor = this.mongoClient.db().collection("options").find({"symbol": symbol})
                const result: OptionChain[] = await this.getDocumentHelper(cursor)
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }

    private async getDocumentHelper(cursor: mongodb.Cursor): Promise<OptionChain[]> {
        return new Promise<OptionChain[]>(async (resolve, reject) => {
            try {
                const result: OptionChain[] = []
                await cursor.forEach((doc) => {
                    result.push(Utils.decompressChain(doc))
                })
                resolve(result)
            } catch (e) {
                reject(e)
            }
        })
    }
} 
