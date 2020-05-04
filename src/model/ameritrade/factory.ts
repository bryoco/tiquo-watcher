import { AmeritradeClient } from "./client";
import { apiKey } from "./keys";
import { Logger } from "@overnightjs/logger";

export class AmeritradeClientFactory {
    
    private counter: number;

    constructor(counter: number = 0) {
        this.counter = counter;
    }

    public newAmeritradeClient(): AmeritradeClient {
        const key = apiKey[this.counter % apiKey.length];
        Logger.Info(`ameritrade client api: ${key}`)
        this.counter++;
        return new AmeritradeClient(key);
    }
}