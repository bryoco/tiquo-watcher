import { CronJob } from 'cron'
import { AmeritradeClientFactory } from './model/ameritrade/factory';
import { DynamoClient } from './db/dynamoClient';
import { ChainRequestObj } from './model/ameritrade/type';
import { Logger } from '@overnightjs/logger';
import { ConfigurationOption } from './ConfigurationOption';
import { SymbolStore } from './db/symbolStore';
import { MongoTiquoClient } from './db/mongoTiquoClient';

async function main(config: ConfigurationOption) {

    const ameritradeClient = new AmeritradeClientFactory().newAmeritradeClient();
    
    let symbolStore: SymbolStore
    if (config.db === "dynamo") {
        symbolStore = new DynamoClient(config.env)
    } else if (config.db === "mongo") {
        symbolStore = new MongoTiquoClient(config.env)
    } else {
        throw new Error(`only dynamo or mongo is available, got ${config.db}`)
    }
    
    const symbols = await symbolStore.getAllSymbols()
    Logger.Info(`Tracking ${symbols}`)

    // on every tick
    // runs every monday thru friday, at 9:30, 12:30, 15:30, 18:30
    // 30 9,12,15,18 * * 1-5
    const cron = new CronJob('0 9-18 * * 1-5', async () => {
        
        // retrieve every symbol
        const symbols = await symbolStore.getAllSymbols()
        Logger.Info(`Fetching ${symbols}`)

        symbols.forEach(async (symbol: string) => {

            Logger.Info(`${symbol} fetched`)

            // download chains
            const chain = await ameritradeClient.getChain(
                new ChainRequestObj({
                    "symbol": symbol,
                    "range": "NTM",
                    "expMonth": "JUN"
                }))
            // save chains
            await symbolStore.saveChain(chain)
        })
    }, null, true, 'America/New_York')

    try {
        cron.start()
    } catch (e) {
        Logger.Err(e)
    }
}

main({env: process.env.ENV!, db: process.env.DB!})